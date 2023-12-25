import React from "react";
import MUITextField from "../../../../components/input/MUITextField";
import ContentComponent from "./ContentComponents";
import { ItemModal } from "./ItemModal";
import {
  Alert,
  Autocomplete,
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  TextField,
} from "@mui/material";
import { MdOutlineClose } from "react-icons/md";
import { numberWithCommas } from "@/helper/helper";
import { useDocumentTotalHook } from "../hook/useDocumentTotalHook";
import shortid from "shortid";
import MUISelect from "@/components/selectbox/MUISelect";
import { ClockNumberClassKey } from "@mui/x-date-pickers";
import { NumericFormat } from "react-number-format";
import UserCodeAutoComplete from "@/components/input/UserCodeAutoCeomplete";
import BranchAutoComplete from "@/components/input/BranchAutoComplete";
import request from "@/utilies/request";
interface ContentFormProps {
  handlerAddItem: () => void;
  handlerChangeItem: (record: any) => void;
  handlerRemoveItem: (record: any[]) => void;
  data: any;
  onChange: (key: any, value: any) => void;
  onChangeItemByCode: (record: any) => void;
  ContentLoading: any;
}

export default function ContentForm({
  data,
  handlerRemoveItem,
  onChange,
  ContentLoading,
}: ContentFormProps) {
  const [key, setKey] = React.useState(shortid.generate());

  const [collapseError, setCollapseError] = React.useState(false);

  React.useEffect(() => {
    setCollapseError("Items" in data?.error);
  }, [data?.error]);

  const handlerUpdateRow = (i: number, e: any) => {
    const items = [...data?.Items];
    items[i] = { ...items[i], [e[0]]: e[1] };
    onChange("Items", items);
  };

  const handlerUpdateMultipleRow = (i: number, updates: [string, any][]) => {
    const items = [...data.Items];

    updates.forEach(([property, value]) => {
      items[i] = {
        ...items[i],
        [property]: value,
      };
    });
    onChange("Items", items);
  };



  const tl_Dispenser = data.tl_Dispenser?.value;
  // console.log(data.tl_Dispenser)
  const TL_DISPENSER_LINESCollection = tl_Dispenser?.map(
    (item: any) => item.TL_DISPENSER_LINESCollection
  );

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "U_tl_pumpcode",
        header: "Pump ID",
        visible: true,
        Cell: ({ cell }: any) => {
          const handlePumpCodeChange = async (newPumpCode: string) => {
            handlerUpdateRow(cell.row.id, ["U_tl_pumpcode", newPumpCode]);

            const selectedPump = TL_DISPENSER_LINESCollection?.find(
              (dispenser: any) =>
                dispenser.some(
                  (item: any) => item.U_tl_pumpcode === newPumpCode
                )
            );

            if (selectedPump) {
              const selectedItem = selectedPump[0];

              const itemDetailsResponse = await request(
                "GET",
                `/Items('${selectedItem?.U_tl_itemnum}')`
              );
              const itemDetails = itemDetailsResponse.data;

              handlerUpdateMultipleRow(cell.row.id, [
                ["U_tl_pumpcode", newPumpCode],
                ["U_tl_itemnum", selectedItem?.U_tl_itemnum],
                ["U_tl_old_meter", selectedItem?.U_tl_reg_meter],
                ["U_tl_new_meter", selectedItem?.U_tl_upd_meter],
                ["U_tl_itemdesc", itemDetails.ItemName],
              ]);
            }
          };

          return (
            <MUISelect
              value={cell.getValue()}
              items={
                TL_DISPENSER_LINESCollection?.flatMap((dispenser: any) =>
                  dispenser.map((item: any) => ({
                    label: `${item.U_tl_pumpcode}`,
                    value: item.U_tl_pumpcode,
                    TL_DISPENSER_LINESCollection:
                      item.TL_DISPENSER_LINESCollection,
                  }))
                ) || []
              }
              loading={!tl_Dispenser}
              aliaslabel="label"
              aliasvalue="Code"
              onChange={(e: any) => handlePumpCodeChange(e.target.value)}
            />
          );
        },
      },
      {
        accessorKey: "U_tl_itemnum",
        header: "Item Code",
        visible: true,
        Cell: ({ cell }: any) => {
          return <MUITextField value={cell.getValue()} />;
        },
      },

      {
        accessorKey: "U_tl_itemdesc",
        header: "Item Name",
        visible: true,
        Cell: ({ cell }: any) => {
          return <MUITextField disabled value={cell.getValue()} />;
        },
      },
      {
        accessorKey: "U_tl_old_meter",
        header: "Old Meter",
        visible: true,

        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onChange={(e: any) =>
                handlerUpdateRow(cell.row.id, [
                  "U_tl_old_meter",
                  e.target.value,
                ])
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_new_meter",
        header: "New Meter",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onChange={(e: any) =>
                handlerUpdateRow(cell.row.id, [
                  "U_tl_new_meter",
                  e.target.value,
                ])
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_testby",
        header: "Test By",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <UserCodeAutoComplete
              value={cell.getValue()}
              onChange={(e: any) =>
                handlerUpdateRow(cell.row.id, ["U_tl_testby", e])
              }
            />
          );
        },
      },
    ],
    [TL_DISPENSER_LINESCollection]
  );

  const onClose = React.useCallback(() => setCollapseError(false), []);
  const isNotAccount = data?.DocType !== "rAccount";

  return (
    <>
      <Collapse in={collapseError}>
        <Alert
          className="mb-3"
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onClose}
            >
              <MdOutlineClose fontSize="inherit" />
            </IconButton>
          }
        >
          {data?.error["Items"]}
        </Alert>
      </Collapse>
      <ContentComponent
        key={key}
        columns={itemColumns}
        items={[...data?.Items]}
        data={data}
        onChange={onChange}
        onRemoveChange={handlerRemoveItem}
        loading={ContentLoading}
        handlerAddSequence={() => {}}
      />
    </>
  );
}
