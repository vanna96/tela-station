import React from "react";
import MUITextField from "../../../../components/input/MUITextField";
import request from "@/utilies/request";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import { useQuery } from "react-query";
import { NumericFormat } from "react-number-format";
import MaterialReactTable from "material-react-table";
import { commaFormatNum } from "@/utilies/formatNumber";

interface AllocationTableProps {
  data: any;
  onChange: (key: any, value: any) => void;
  edit?: boolean;
  handlerChangeObject: (obj: any) => void;
}

export default function AllocationTable({
  data,
  onChange,
  edit,
  handlerChangeObject,
}: AllocationTableProps) {
  // data.allocationData = data.nozzleData?.filter(
  //   (e: any) => parseFloat(e.U_tl_nmeter) > 0
  // );

  const handlerChangeItem = (key: number, obj: any) => {
    const newData = data.allocationData?.map((item: any, index: number) => {
      if (index.toString() !== key.toString()) return item;
      item[Object.keys(obj).toString()] = Object.values(obj).toString();
      return item;
    });
    if (newData.length <= 0) return;
    onChange("allocationData", newData);
  };
  const fetchItemName = async (itemCode: any) => {
    const res = await request(
      "GET",
      `/Items('${itemCode}')?$select=ItemName,ItemPrices`
    );
    return res;
  };

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "U_tl_itemname",
        header: "Item Code",
        visible: true,
        Cell: ({ cell }: any) => {
          return <MUITextField disabled value={cell.getValue()} />;
        },
      },

      {
        accessorKey: "U_tl_cashallow",
        header: "Cash Sales (Litre)",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              placeholder="0.000"
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_cashallow: parseFloat(e.target.value.replace(/,/g, "")),
                })
              }
            />
          );
        },
      },

      {
        accessorKey: "U_tl_partallow",
        header: "Partnership (Litre)",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              placeholder="0.000"
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_partallow: parseFloat(e.target.value.replace(/,/g, '')),
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_stockallow",
        header: "Stock Transfer (Liter)",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              placeholder="0.000"
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_stockallow: parseFloat(e.target.value.replace(/,/g, '')),

                })
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_ownallow",
        header: "Own Usage (Litre)",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              placeholder="0.000"
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_stockallow: parseFloat(e.target.value.replace(/,/g, '')),

                })
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_cardallow",
        header: "Tela Card (Litre)",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              placeholder="0.000"
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_cardallow: parseFloat(e.target.value.replace(/,/g, '')),

                })
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_pumpallow",
        header: "Pump Test (Litre)",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              placeholder="0.000"
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_pumpallow: parseFloat(e.target.value.replace(/,/g, '')),

                })
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_totalallow",
        header: "Total (Litre)",
        Cell: ({ cell }: any) => {
          const total =
            commaFormatNum(cell.row.original?.U_tl_cardallow || 0) +
            commaFormatNum(cell.row.original?.U_tl_cashallow || 0) +
            commaFormatNum(cell.row.original?.U_tl_ownallow || 0) +
            commaFormatNum(cell.row.original?.U_tl_partallow || 0) +
            commaFormatNum(cell.row.original?.U_tl_pumpallow || 0) +
            commaFormatNum(cell.row.original?.U_tl_stockallow || 0);

          const isValid =
            total === commaFormatNum(cell.row.original?.U_tl_nmeter);
          console.log(total);
          console.log(commaFormatNum(cell.row.original?.U_tl_nmeter));
          return (
            <NumericFormat
              thousandSeparator
              placeholder="0.000"
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              value={total}
              inputProps={{
                style: {
                  color: isValid ? "inherit" : "red",
                },
              }}
            />
          );
        },
      },
    ],
    [data.allocationData]
  );

  return (
    <>
      <div
        className={`grid grid-cols-1 md:grid-cols-1 gap-x-10 gap-y-10  
       overflow-hidden transition-height duration-300 `}
      >
        <div className=" data-table">
          <MaterialReactTable
            columns={[...itemColumns]}
            data={data.allocationData}
            enableStickyHeader={true}
            enableColumnActions={false}
            enableColumnFilters={false}
            enablePagination={false}
            enableSorting={false}
            enableTopToolbar={false}
            enableColumnResizing={true}
            enableColumnFilterModes={false}
            enableDensityToggle={false}
            enableFilters={false}
            enableFullScreenToggle={false}
            enableGlobalFilter={false}
            enableHiding={true}
            enablePinning={true}
            enableStickyFooter={false}
            enableMultiRowSelection={true}
            muiTableBodyRowProps={() => ({
              sx: { cursor: "pointer" },
            })}
            initialState={{
              density: "compact",
            }}
            enableTableFooter={false}
          />
        </div>
      </div>
    </>
  );
}
