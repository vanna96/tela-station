import React from "react";
import MUITextField from "../../../../components/input/MUITextField";
import ContentComponent from "./ContentComponents";
import { ItemModal } from "./ItemModal";
import { Alert, Collapse, IconButton, TextField } from "@mui/material";
import { MdOutlineClose } from "react-icons/md";
import { numberWithCommas } from "@/helper/helper";
import { useDocumentTotalHook } from "../hook/useDocumentTotalHook";
import shortid from "shortid";
import MUISelect from "@/components/selectbox/MUISelect";
// import { APIContext } from "../../context/APIContext";
import { ClockNumberClassKey } from "@mui/x-date-pickers";
import { NumericFormat } from "react-number-format";
import request from "@/utilies/request";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import UnitOfMeasurementGroupRepository from "@/services/actions/unitOfMeasurementGroupRepository";
import BinLocationTo from "@/components/input/BinLocationTo";
import BinLocationAutoComplete from "@/components/input/BinLocationAutoComplete";
import BinLocationToAsEntry from "@/components/input/BinLocationToAsEntry";
import { TbEdit } from "react-icons/tb";
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
  handlerChangeItem,
  handlerAddItem,
  handlerRemoveItem,
  onChange,
  onChangeItemByCode,
  edit,
  ContentLoading,
}: ContentFormProps) {
  const [key, setKey] = React.useState(shortid.generate());
  // const { tlExpDic }: any = React.useContext(APIContext);
  const [collapseError, setCollapseError] = React.useState(false);

  React.useEffect(() => {
    setCollapseError("Items" in data?.error);
  }, [data?.error]);

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
          item.ItemCode = itemDetails.ItemCode;
          item.ItemName = itemDetails.ItemName;
          item.UnitPrice = itemDetails.MovingAveragePrice;
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

  // console.log(data);
  const onUpdateByItem = (item: any) => onChangeItemByCode(item);
  const handlerChangeInput = (event: any, row: any, field: any) => {
    if (data?.isApproved) return;

    let value = event?.target?.value ?? event;
    handlerChangeItem({ value: value, record: row, field });
  };

  const updateRef = React.createRef<ItemModal>();

  const itemColumns = React.useMemo(
    () => [
      // {
      //   accessorKey: "ItemCode",
      //   header: "Item Code",
      //   visible: true,
      //   Cell: ({ cell }: any) => {
      //     return edit ? (
      //       <MUITextField value={cell.getValue()} disabled />
      //     ) : (
      //       <MUISelect
      //         value={cell.getValue()}
      //         items={data.FromBinItems?.map((e: any) => ({
      //           label: e.ItemCode,
      //           value: e.ItemCode,
      //         }))}
      //         aliaslabel="label"
      //         aliasvalue="Code"
      //         onChange={(e: any) =>
      //           handlerUpdateRow(
      //             cell.row.id,
      //             ["ItemCode", e.target.value],
      //             "ItemCode"
      //           )
      //         }
      //       />
      //     );
      //   },
      // },

      {
        accessorKey: "ItemCode",
        Header: (header: any) => (
          <label>
            Item No <span className="text-red-500">*</span>
          </label>
        ),
        header: "Item No", //uses the default width from defaultColumn prop
        visible: true,
        size: 120,
        Cell: ({ cell }: any) => (
          /* if (!cell.row.original?.ItemCode)*/ /*     return <div role="button" className="px-4 py-2 text-inherit rounded hover:bg-gray-200 border shadow-inner" onClick={handlerAddItem}>Add Row</div>*/ <MUITextField
            value={cell.getValue()}
            disabled={data?.isStatusClose || false}
            onBlur={(event) =>
              handlerChangeInput(event, cell?.row?.original, "ItemCode")
            }
            endAdornment={!(data?.isStatusClose || false)}
            onClick={() => {
              if (cell.getValue() === "") {
                handlerAddItem();
              } else {
                updateRef.current?.onOpen(cell.row.original);
              }
            }}
            endIcon={
              cell.getValue() === "" ? null : <TbEdit className="text-lg" />
            }
            readOnly={true}
          />
        ),
      },

      {
        Header: (header: any) => (
          <label>
            Item Name <span className="text-red-500">*</span>
          </label>
        ),
        accessorKey: "ItemName",
        header: "Item Name ",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              disabled
              // onBlur={(e: any) =>
              //   handlerUpdateRow(cell.row.id, ["ItemName", e.target.value])
              // }
            />
          );
        },
      },
      {
        Header: (header: any) => (
          <label>
            Quantity <span className="text-red-500">*</span>
          </label>
        ),
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
              // onBlur={(event) => {
              //   const newValue = parseFloat(
              //     event.target.value.replace(/,/g, "")
              //   );
              //   handlerUpdateRow(
              //     cell.row.id,
              //     ["Quantity", newValue],
              //     "Quantity"
              //   );
              // }}
              onBlur={(event) => {
                const newValue = parseFloat(
                  event.target.value.replace(/,/g, "")
                );
                handlerUpdateRow(
                  cell.row.id,
                  ["Quantity", newValue],
                  "Quantity"
                );

                const gross = cell.row.original.GrossPrice;
                const totalGross = newValue * gross;
                handlerUpdateRow(
                  cell.row.id,
                  ["TotalGross", totalGross],
                  "TotalGross"
                );
              }}
            />
          );
        },
      },
      {
        Header: (header: any) => (
          <label>
            UoM <span className="text-red-500">*</span>
          </label>
        ),
        accessorKey: "UomAbsEntry",
        header: "UoM",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUISelect
              value={cell.getValue()}
              items={// edit
              //   ? []
              //   :
              cell.row.original.UomLists?.map((e: any) => ({
                label: e.Name,
                value: e.AbsEntry,
              }))}
              aliaslabel="label"
              aliasvalue="value"
              onChange={(e: any) =>
                handlerUpdateRow(
                  cell.row.id,
                  ["UomAbsEntry", e.target.value],
                  "UomAbsEntry"
                )
              }
            />
          );
        },
      },
      {
        Header: (header: any) => (
          <label>
            Unit Price <span className="text-red-500">*</span>
          </label>
        ),
        accessorKey: "GrossPrice",
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
              value={cell.getValue()}
              onBlur={(event) => {
                const newValue = parseFloat(
                  event.target.value.replace(/,/g, "")
                );
                handlerUpdateRow(
                  cell.row.id,
                  ["GrossPrice", newValue],
                  "GrossPrice"
                );

                // Update TotalGross based on the new GrossPrice
                const quantity = cell.row.original.Quantity;
                const totalGross = newValue * quantity;
                handlerUpdateRow(
                  cell.row.id,
                  ["TotalGross", totalGross],
                  "TotalGross"
                );
              }}
            />
          );
        },
      },

      {
        accessorKey: "DiscountPercent",
        header: "Unit Discount",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              // placeholder="0.00"
              type="number"
              startAdornment={"%"}
              defaultValue={cell.getValue() ?? 0}
              onChange={(event: any) => {
                if (!(event.target.value <= 100 && event.target.value >= 0)) {
                  event.target.value = 0;
                }
                handlerUpdateRow(
                  cell.row.id,
                  ["DiscountPercent", event.target.value],
                  "DiscountPercent"
                );
                const quantity = cell.row.original.Quantity;
                const totalGross =
                  cell.row.original.GrossPrice * quantity -
                  cell.row.original.GrossPrice *
                    quantity *
                    (cell.row.original.DiscountPercent / 100);
                handlerUpdateRow(
                  cell.row.id,
                  ["TotalGross", totalGross],
                  "TotalGross"
                );
              }}
            />
          );
        },
      },

      {
        accessorKey: "TotalGross",
        header: "Amount",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"Amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              value={cell.getValue()}
              onChange={(event) => {
                const newValue = parseFloat(
                  event.target.value.replace(/,/g, "")
                );
                handlerUpdateRow(
                  cell.row.id,
                  ["TotalGross", newValue],
                  "TotalGross"
                );
              }}
            />
          );
        },
      },
    ],
    [updateRef]
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
      <ItemModal
        ref={updateRef}
        onSave={onUpdateByItem}
        columns={itemColumns}
      />
    </>
  );
}
