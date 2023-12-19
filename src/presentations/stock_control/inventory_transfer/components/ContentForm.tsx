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
import request from "@/utilies/request";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import UnitOfMeasurementGroupRepository from "@/services/actions/unitOfMeasurementGroupRepository";
import BinLocationTo from "@/components/input/BinLocationTo";
import BinLocationAutoComplete from "@/components/input/BinLocationAutoComplete";
import BinLocationToAsEntry from "@/components/input/BinLocationToAsEntry";
interface ContentFormProps {
  handlerAddItem: () => void;
  handlerChangeItem: (record: any) => void;
  handlerRemoveItem: (record: any[]) => void;
  data: any;
  onChange: (key: any, value: any) => void;
  onChangeItemByCode: (record: any) => void;
  ContentLoading: any;
  edit: boolean;
}

export default function ContentForm({
  data,
  // handlerChangeItem,
  // handlerAddItem,
  handlerRemoveItem,
  onChange,
  // onChangeItemByCode,
  edit,
  ContentLoading,
}: ContentFormProps) {
  const [key, setKey] = React.useState(shortid.generate());
  const { tlExpDic }: any = React.useContext(APIContext);
  const [collapseError, setCollapseError] = React.useState(false);

  React.useEffect(() => {
    setCollapseError("Items" in data?.error);
  }, [data?.error]);

  const handlerUpdateRow = async (i: number, e: any, selectedField: string) => {
    if (selectedField === "ItemCode") {
      const selectedCode = e[1];
      const response = await request("GET", `/Items('${selectedCode}')`);
      const itemDetails = response.data;

      const items: any = data?.Items?.map((item: any, indexItem: number) => {
        if (i.toString() === indexItem.toString()) {
          item.ItemCode = itemDetails.ItemCode;
          item.ItemDescription = itemDetails.ItemName;
          item.UnitPrice = itemDetails.AvgStdPrice;
          item.Quantity = itemDetails.Quantity ?? 1;
          item.UomAbsEntry = itemDetails.InventoryUoMEntry;
          item.FromWarehouseCode = data.FromBinItems?.find(
            (e: any) => e.ItemCode === item.ItemCode
          )?.WhsCode;
          item.WarehouseCode = data.ToWarehouse;
          item.FromBin = data.FromBinItems?.find(
            (e: any) => e.ItemCode === item.ItemCode
          )?.BinAbsEntry;
          item.BinQty = data.FromBinItems?.find(
            (e: any) => e.ItemCode === item.ItemCode
          )?.OnHandQty;
          item.ToBin = data.ToBinItems?.find(
            (e: any) => e.WhsCode === item.WarehouseCode
          )?.BinAbsEntry;
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

  // console.log(data);

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "ItemCode",
        header: "Item Code",
        visible: true,
        Cell: ({ cell }: any) => {
          return edit ? (
            <MUITextField value={cell.getValue()} disabled />
          ) : (
            <MUISelect
              value={cell.getValue()}
              items={data.FromBinItems?.map((e: any) => ({
                label: e.ItemCode,
                value: e.ItemCode,
              }))}
              aliaslabel="label"
              aliasvalue="Code"
              onChange={(e: any) =>
                handlerUpdateRow(
                  cell.row.id,
                  ["ItemCode", e.target.value],
                  "ItemCode"
                )
              }
            />
          );
        },
      },

      {
        accessorKey: "ItemDescription",
        header: "Item Name",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              // onBlur={(e: any) =>
              //   handlerUpdateRow(cell.row.id, ["ItemName", e.target.value])
              // }
            />
          );
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
        accessorKey: "UnitPrice",
        header: "Unit Price",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"Price_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(event) => {
                const newValue = parseFloat(
                  event.target.value.replace(/,/g, "")
                );
                handlerUpdateRow(
                  cell.row.id,
                  ["UnitPrice", newValue],
                  "UnitPrice"
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
            <MUITextField
              value={
                new UnitOfMeasurementRepository().find(
                  cell.row.original.UomAbsEntry
                )?.Name
              }
              disabled
            />
          );
        },
      },
      {
        accessorKey: "FromWarehouseCode",
        header: "From Warehouse",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.row.original.FromWarehouseCode}
              disabled
            />
          );
        },
      },
      {
        accessorKey: "WarehouseCode",
        header: "To Warehouse",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField value={cell.row.original.WarehouseCode} disabled />
          );
        },
      },

      {
        accessorKey: "BinQty",
        header: "From Bin Qty",
        visible: true,
        Cell: ({ cell }: any) => {
          return <MUITextField value={cell.row.original.BinQty} disabled />;
        },
      },

      // {
      //   accessorKey: "FromBin_",
      //   header: "From Bin Code",
      //   visible: true,
      //   Cell: ({ cell }: any) => {
      //     return <MUITextField value={cell.row.original.FromBin} disabled />;
      //   },
      // },
      // {
      //   accessorKey: "ToBin_",
      //   header: "To Bin Code",
      //   visible: true,
      //   Cell: ({ cell }: any) => {
      //     return <MUITextField value={cell.row.original.ToBin} disabled />;
      //   },
      // },
      {
        accessorKey: "FromBin",
        header: "From Bin Location",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <BinLocationToAsEntry
              value={cell.row.original.FromBin}
              Warehouse={data?.FromWarehouse ?? "WH01"}
              onChange={(e: any) =>
                handlerUpdateRow(cell.row.id, ["FromBin", e], "FromBin")
              }
            />
          );
        },
      },
      {
        accessorKey: "ToBin",
        header: "To Bin Location",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <BinLocationToAsEntry
              value={cell.row.original.ToBin}
              Warehouse={data?.ToWarehouse ?? "WH01"}
              onChange={(e: any) =>
                handlerUpdateRow(cell.row.id, ["ToBin", e], "ToBin")
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
