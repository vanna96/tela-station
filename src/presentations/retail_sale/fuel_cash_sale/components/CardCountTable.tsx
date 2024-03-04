import React from "react";
import MUITextField from "../../../../components/input/MUITextField";
import request from "@/utilies/request";
import { NumericFormat } from "react-number-format";
import MaterialReactTable from "material-react-table";
import FormCard from "@/components/card/FormCard";
import MUIRightTextField from "@/components/input/MUIRightTextField";
import { commaFormatNum } from "@/utilies/formatNumber";

interface CardCountProps {
  data: any;
  onChange: (key: any, value: any) => void;
  edit?: boolean;
  handlerChangeObject: (obj: any) => void;
}

export default function CardCount({
  data,
  onChange,
  edit,
  handlerChangeObject,
}: CardCountProps) {
  if (!edit) {
    data.cardCountData = data.nozzleData?.filter(
      (e: any) => parseFloat(e.U_tl_nmeter) > 0
    );
  }
  const handlerChangeItem = (key: number, obj: any) => {
    const newData = data.cardCountData?.map((item: any, index: number) => {
      if (index.toString() !== key.toString()) return item;
      item[Object.keys(obj).toString()] = Object.values(obj).toString();
      return item;
    });
    if (newData.length <= 0) return;
    onChange("cardCountData", newData);
  };

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "U_tl_itemcode",
        header: "Item Code",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField disabled value={cell.row.original?.U_tl_itemcode} />
          );
        },
      },

      {
        accessorKey: "U_tl_1l",
        header: "1L",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={3}
              customInput={MUIRightTextField}
              placeholder="0.000"
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_1l: parseFloat(e.target.value.replace(/,/g, "")),
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_2l",
        header: "2L",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={3}
              customInput={MUIRightTextField}
              placeholder="0.000"
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_2l: parseFloat(e.target.value.replace(/,/g, "")),
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_5l",
        header: "5L",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={3}
              customInput={MUIRightTextField}
              placeholder="0.000"
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_5l: parseFloat(e.target.value.replace(/,/g, "")),
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_10l",
        header: "10L",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={3}
              customInput={MUIRightTextField}
              placeholder="0.000"
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_10l: parseFloat(e.target.value.replace(/,/g, "")),
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_20l",
        header: "20L",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={3}
              customInput={MUIRightTextField}
              placeholder="0.000"
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_20l: parseFloat(e.target.value.replace(/,/g, "")),
                })
              }
            />
          );
        },
      },

      {
        accessorKey: "U_tl_50l",
        header: "50L",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={3}
              customInput={MUIRightTextField}
              placeholder="0.000"
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_50l: parseFloat(e.target.value.replace(/,/g, "")),
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "total",
        header: "Total (Litre)",
        Cell: ({ cell }: any) => {
          const total =
            commaFormatNum(cell.row.original?.U_tl_1l || 0) +
            commaFormatNum(cell.row.original?.U_tl_2l || 0) +
            commaFormatNum(cell.row.original?.U_tl_5l || 0) +
            commaFormatNum(cell.row.original?.U_tl_10l || 0) +
            commaFormatNum(cell.row.original?.U_tl_20l || 0) +
            commaFormatNum(cell.row.original?.U_tl_50l || 0);

          const isValid =
            total === commaFormatNum(cell.row.original.U_tl_nmeter);
          return (
            <NumericFormat
              thousandSeparator
              decimalScale={3}
              // readOnly
              customInput={MUIRightTextField}
              placeholder="0.000"
              value={total=== 0 ? "" : total}
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
    [data.cardCountData]
  );

  return (
    <>
      <FormCard title="Card Count ">
        <>
          <div className="col-span-2 data-table">
            <MaterialReactTable
              columns={[...itemColumns]}
              data={[...data.cardCountData]}
              enableStickyHeader={true}
              enableColumnActions={false}
              enableColumnFilters={false}
              enablePagination={false}
              enableSorting={false}
              enableTopToolbar={false}
              enableColumnResizing={false}
              enableColumnFilterModes={false}
              enableDensityToggle={false}
              enableFilters={false}
              enableFullScreenToggle={false}
              enableGlobalFilter={false}
              enableHiding={true}
              enablePinning={true}
              enableStickyFooter={false}
              enableMultiRowSelection={true}
              initialState={{
                density: "compact",
              }}
              state={{}}
              muiTableBodyRowProps={() => ({
                sx: { cursor: "pointer" },
              })}
              muiTableProps={() => ({
                sx: {
                  "& .MuiTableHead-root .MuiTableCell-root": {
                    backgroundColor: "#e4e4e7",
                    fontWeight: "500",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                  },
                  border: "1px solid #d1d5db",
                },
              })}
              enableTableFooter={false}
            />
          </div>
        </>
      </FormCard>
    </>
  );
}
