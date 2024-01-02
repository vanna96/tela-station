import React from "react";
import MUITextField from "../../../../components/input/MUITextField";
import StockComponent from "./StockComponent";
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
import WarehouseAutoComplete from "@/components/input/WarehouseAutoComplete";
import BinLocationToAsEntry from "@/components/input/BinLocationToAsEntry";
import BinLocationItemCode from "@/components/input/BinLocationItemCode";
import UnitOfMeasurementGroupRepository from "@/services/actions/unitOfMeasurementGroupRepository";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
interface StockFormProps {
  handlerAddItem: () => void;
  handlerChangeItem: (record: any) => void;
  handlerRemoveItem: (record: any[]) => void;
  data: any;
  onChange: (key: any, value: any) => void;
  onChangeItemByCode: (record: any) => void;
  ContentLoading: any;
}

export default function StockForm({
  data,
  handlerRemoveItem,
  onChange,
  ContentLoading,
}: StockFormProps) {
  const [key, setKey] = React.useState(shortid.generate());

  const [collapseError, setCollapseError] = React.useState(false);

  React.useEffect(() => {
    setCollapseError("Items" in data?.error);
  }, [data?.error]);

  // const handlerUpdateRow = (i: number, e: any) => {
  //   const items = [...data?.Items];
  //   items[i] = { ...items[i], [e[0]]: e[1] };
  //   onChange("Items", items);
  // };

  // console.log(data)

  const handlerUpdateRow = async (i: number, e: any, selectedField: string) => {
    if (selectedField === "ItemCode") {
      const selectedCode = e[1];

      const uomGroups: any = await new UnitOfMeasurementGroupRepository().get();
      const uoms = await new UnitOfMeasurementRepository().get();
      const uomGroup: any = uomGroups.find(
        (row: any) => row.AbsEntry === e?.UoMGroupEntry
      );
      let uomLists: any[] = [];
      uomGroup?.UoMGroupDefinitionCollection?.forEach((row: any) => {
        const itemUOM = uoms.find(
          (record: any) => record?.AbsEntry === row?.AlternateUoM
        );
        if (itemUOM) {
          uomLists.push(itemUOM);
        }
      });

      const response = await request("GET", `/Items('${selectedCode}')`);
      const itemDetails = response.data;

      const items: any = data?.Items?.map((item: any, indexItem: number) => {
        if (i.toString() === indexItem.toString()) {
          item.ItemName = itemDetails.ItemName;
          item.Quantity = itemDetails.Quantity ?? 1;
          item.UomAbsEntry = itemDetails.InventoryUoMEntry;
          item.UoMList = uomLists;
        }
        return item;
      });


      onChange("Items", items);
    } else {
      const items: any = data?.Items?.map((item: any, indexItem: number) => {
        if (i.toString() === indexItem.toString()) {
          item[selectedField] = e[1];
        }
        return item;
      });

      onChange("Items", items);
    }
  };

console.log(data.Items) 

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "Branch",
        header: "Branch",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <BranchAutoComplete
              value={cell.row.original.Branch || 1}
              onChange={(e: any) =>
                handlerUpdateRow(cell.row.id, ["Branch", e], "Branch")
              }
            />
          );
        },
      },

      {
        accessorKey: "Warehouse",
        header: "Warehouse",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <WarehouseAutoComplete
              Branch={cell.row.original.Branch}
              value={cell.getValue()}
              onChange={(e: any) =>
                handlerUpdateRow(cell.row.id, ["Warehouse", e], "Warehouse")
              }
            />
          );
        },
      },
      {
        accessorKey: "BinCode",
        header: "BinCode",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <BinLocationToAsEntry
              Warehouse={cell.row.original.Warehouse}
              value={cell.getValue()}
              onChange={(e: any) =>
                handlerUpdateRow(cell.row.id, ["BinCode", e], "BinCode")
              }
            />
          );
        },
      },
      {
        accessorKey: "ItemCode",
        header: "ItemCode",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <BinLocationItemCode
              Warehouse={cell.row.original.Warehouse}
              BinAbsEntry={cell.row.original.BinCode}
              value={cell.getValue()}
              onChange={(e: any) =>
                handlerUpdateRow(cell.row.id, ["ItemCode", e], "ItemCode")
              }
            />
          );
        },
      },

      {
        accessorKey: "ItemName",
        header: "Item Name",
        visible: true,
        Cell: ({ cell }: any) => {
          return <MUITextField value={cell.getValue()} />;
        },
      },
      {
        accessorKey: "Quantity",
        header: "Quantity",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"Quantity_" + cell.getValue()}
              thousandSeparator
              decimalScale={1}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(event) => {
                const newValue = parseFloat(
                  event.target.value.replace(/,/g, "")
                );
                handlerUpdateRow(
                  cell.row.id,
                  ["Quantity", newValue],
                  "Quantity"
                );
              }}
            />
          );
        },
      },
      {
        accessorKey: "UomAbsEntry",
        header: "UoM",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUISelect
              value={cell.getValue()}
              items={cell.row.original.UoMList?.map((e: any) => ({
                label: e.Name,
                value: e.AbsEntry,
              }))}
              aliaslabel="label"
              aliasvalue="value"
              onChange={(e: any) =>
                handlerUpdateRow(
                  cell.row.id,
                  ["UomAbsEntry", e.target.value],
                  "UoMAbsEntry"
                )
              }
            />
          );
        },
      },
    ],
    []
  );

  const onClose = React.useCallback(() => setCollapseError(false), []);
  const isNotAccount = data?.DocType !== "rAccount";
console.log(data)
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
      <StockComponent
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
