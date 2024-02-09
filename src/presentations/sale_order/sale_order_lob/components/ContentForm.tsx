import React from "react";
import MUITextField from "../../../../components/input/MUITextField";
import ContentComponent from "./ContentComponents";
import { ItemModal } from "./ItemModal";
import { Alert, Collapse, IconButton, TextField } from "@mui/material";
import { MdOutlineClose } from "react-icons/md";
import shortid from "shortid";
import MUISelect from "@/components/selectbox/MUISelect";
import { NumericFormat } from "react-number-format";
import request from "@/utilies/request";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import UnitOfMeasurementGroupRepository from "@/services/actions/unitOfMeasurementGroupRepository";
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
  const [collapseError, setCollapseError] = React.useState(false);

  React.useEffect(() => {
    setCollapseError("Items" in data?.error);
  }, [data?.error]);
  const vendorPriceList = data.U_tl_sopricelist;
  const wh = data.U_tl_whsdesc;
  const lineofbusiness = data.U_tl_arbusi;
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
      const items: any = data?.Items?.map(
        (item: any, indexItem: number, vendorPriceList: any) => {
          if (i.toString() === indexItem.toString()) {
            item.ItemCode = itemDetails.ItemCode;
            item.ItemName = itemDetails.ItemName;
            // item.UnitPrice = itemDetails.MovingAveragePrice;
            item.GrossPrice = item.UnitPrice;
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
            item.ItemPrices = itemDetails.ItemPrices;
          }
          return item;
        }
      );

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
      {
        accessorKey: "ItemCode",
        Header: (header: any) => (
          <label>
            Item No <span className="text-red-500">*</span>
          </label>
        ),
        header: "Item No",
        visible: true,
        size: 140,
        Cell: ({ cell }: any) => (
          <MUITextField
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
              value={cell.row.original.ItemCode ? cell.getValue() : ""}
              disabled
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
              disabled={cell.row.original.ItemCode === ""}
              thousandSeparator
              decimalScale={data.Currency === "USD" ? 4 : 0}
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

                const gross = cell.row.original.GrossPrice;
                const totalGross = newValue * gross;
                handlerUpdateRow(
                  cell.row.id,
                  ["LineTotal", totalGross],
                  "LineTotal"
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
              disabled={cell.row.original.ItemCode === ""}
              value={cell.getValue()}
              items={cell.row.original.UomLists?.map((e: any) => ({
                label: e.Name,
                value: e.AbsEntry,
              }))}
              aliaslabel="label"
              aliasvalue="value"
              onChange={(event: any) => {
                handlerUpdateRow(
                  cell.row.id,
                  ["UomAbsEntry", event.target.value],
                  "UomAbsEntry"
                );
                let defaultPrice = cell.row.original.ItemPrices?.find(
                  (e: any) => e.PriceList === parseInt(data.U_tl_sopricelist)
                )?.Price;
                let itemPrices = cell.row.original.ItemPrices?.find(
                  (e: any) => e.PriceList === parseInt(data.U_tl_sopricelist)
                )?.UoMPrices;

                let uomPrice = itemPrices?.find(
                  (e: any) => e.PriceList === parseInt(data.U_tl_sopricelist)
                );

                if (uomPrice && event.target.value === uomPrice.UoMEntry) {
                  const grossPrice = uomPrice.Price;
                  const quantity = cell.row.original.Quantity;
                  const totalGross =
                    grossPrice * quantity -
                    grossPrice *
                      quantity *
                      (cell.row.original.DiscountPercent / 100);

                  handlerUpdateRow(
                    cell.row.id,
                    ["GrossPrice", grossPrice],
                    "GrossPrice"
                  );
                  handlerUpdateRow(
                    cell.row.id,
                    ["LineTotal", totalGross],
                    "LineTotal"
                  );
                } else {
                  const grossPrice = defaultPrice;
                  const quantity = cell.row.original.Quantity;
                  const totalGross =
                    grossPrice * quantity -
                    grossPrice *
                      quantity *
                      (cell.row.original.DiscountPercent / 100);

                  handlerUpdateRow(
                    cell.row.id,
                    ["GrossPrice", grossPrice],
                    "GrossPrice"
                  );
                  handlerUpdateRow(
                    cell.row.id,
                    ["LineTotal", totalGross],
                    "LineTotal"
                  );
                }
              }}
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
              disabled
              key={"Price_" + cell.getValue()}
              thousandSeparator
              decimalScale={data.Currency === "USD" ? 4 : 0}
              fixedDecimalScale
              inputProps={{ style: { textAlign: "right" } }}
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
                  ["LineTotal", totalGross],
                  "LineTotal"
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
            <NumericFormat
              disabled={cell.row.original.ItemCode === ""}
              className="bg-white w-full"
              value={cell.getValue()}
              thousandSeparator
              startAdornment={"%"}
              decimalScale={data.Currency === "USD" ? 3 : 0}
              fixedDecimalScale
              placeholder={data.Currency === "USD" ? "0.000" : "0"}
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
                  ["LineTotal", totalGross],
                  "LineTotal"
                );
              }}
              customInput={MUITextField}
            />
          );
        },
      },

      {
        accessorKey: "LineTotal",
        header: "Amount",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              disabled
              key={"Amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={data.Currency === "USD" ? 3 : 0}
              fixedDecimalScale
              customInput={MUITextField}
              value={cell.getValue()}
              onChange={(event) => {
                const newValue = parseFloat(
                  event.target.value.replace(/,/g, "")
                );
                handlerUpdateRow(
                  cell.row.id,
                  ["LineTotal", newValue],
                  "LineTotal"
                );
              }}
            />
          );
        },
      },
    ],
    [updateRef, data.Items.length]
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
        columns={[...itemColumns]}
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
        wh={wh}
        priceList={vendorPriceList}
        ref={updateRef}
        onSave={onUpdateByItem}
        lineofbusiness={lineofbusiness}
        columns={itemColumns}
        bin={data.U_tl_sobincode}
      />
    </>
  );
}
