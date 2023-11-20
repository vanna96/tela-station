import React from "react";
import MUITextField from "../../../../components/input/MUITextField";
import ContentComponent from "./ContentComponents";
import { ItemModal } from "./ItemModal";
import { Alert, Collapse, IconButton } from "@mui/material";
import { MdOutlineClose } from "react-icons/md";
import { numberWithCommas } from "@/helper/helper";
import { useDocumentTotalHook } from "../hook/useDocumentTotalHook";
import shortid from "shortid";
import MUISelect from "@/components/selectbox/MUISelect";
import { APIContext } from "../../context/APIContext";
import { ClockNumberClassKey } from "@mui/x-date-pickers";
import { NumericFormat } from "react-number-format";
import UserCodeAutoComplete from "@/components/input/UserCodeAutoCeomplete";
import BranchAutoComplete from "@/components/input/BranchAutoComplete";
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
  // handlerChangeItem,
  // handlerAddItem,
  handlerRemoveItem,
  onChange,
  // onChangeItemByCode,
  ContentLoading,
}: ContentFormProps) {
  const [key, setKey] = React.useState(shortid.generate());
  const { tl_PumpTest }: any = React.useContext(APIContext);
  const [collapseError, setCollapseError] = React.useState(false);

  React.useEffect(() => {
    setCollapseError("Items" in data?.error);
  }, [data?.error]);

  const handlerUpdateRow = (i: number, e: any) => {
    const items: any = data?.Items?.map((item: any, indexItem: number) => {
      if (i.toString() === indexItem.toString()) item[e[0]] = e[1];
      return item;
    });
    console.log(items);
    onChange("Items", items);
  };

  console.log(tl_PumpTest);

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "U_tl_pumpcode",
        header: "Pump ID",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            // <MUISelect
            //   value={cell.getValue()}
            //   items={
            //     tl_PumpTest?.map((e: any) => {
            //       return {
            //         ...e,
            //         label: `${e.Code} - ${e.Name}`,
            //       };
            //     }) || []
            //   }
            //   aliaslabel="label"
            //   aliasvalue="Code"
            //   onChange={(e: any) =>
            //     handlerUpdateRow(cell.row.id, ["ExpenseCode", e.target.value])
            //   }
            // />
            <MUITextField
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerUpdateRow(cell.row.id, ["U_tl_pumpcode", e.target.value])
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_itemnum",
        header: "Item Code",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerUpdateRow(cell.row.id, [
                  "U_tl_itemnum",
                  e.target.value,
                ])
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_itemdesc",
        header: "Item Name",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerUpdateRow(cell.row.id, ["U_tl_itemdesc", e.target.value])
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_old_meter",
        header: "Old Meter",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(event) => {
                const newValue = parseFloat(
                  event.target.value.replace(/,/g, "")
                );
                handlerUpdateRow(cell.row.id, ["U_tl_old_meter", newValue]);
              }}
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
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(event) => {
                const newValue = parseFloat(
                  event.target.value.replace(/,/g, "")
                );
                handlerUpdateRow(cell.row.id, ["U_tl_new_meter", newValue]);
              }}
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
              value={cell.getValue}
              onChange={(e: any) =>
                handlerUpdateRow(cell.row.id, ["U_tl_testby", e])
              }
            />
          );
        },
      },
    ],
    [data?.Items]
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
        isNotAccount={isNotAccount}
        data={data}
        onChange={onChange}
        onRemoveChange={handlerRemoveItem}
        loading={ContentLoading}
        handlerAddSequence={() => {
          // handlerAddSequence()
          // setKey(shortid.generate())
        }}
      />
    </>
  );
}
