import React, { useEffect, useState } from "react";
import MUIRightTextField from "../../../../components/input/MUIRightTextField";
import request from "@/utilies/request";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import { useQuery } from "react-query";
import { NumericFormat } from "react-number-format";
import MaterialReactTable from "material-react-table";
import { commaFormatNum } from "@/utilies/formatNumber";
import MUITextField from "@/components/input/MUITextField";
import { Button } from "@mui/material";

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
  // let allocationData = data.allocationData;

  if (!edit) {
    data.allocationData = data?.nozzleData?.filter(
      (item: any) => parseFloat(item.U_tl_nmeter) > 0
    );
  }

  const handlerChangeItem = (key: number, obj: any) => {
    const newData = data.allocationData?.map((item: any, index: number) => {
      if (index.toString() === key.toString()) {
        const objKey = Object.keys(obj)[0];
        item[objKey] = Object.values(obj)[0];
      }
      return item;
    });
    onChange("allocationData", newData);
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
              customInput={MUIRightTextField}
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
              customInput={MUIRightTextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_partallow: parseFloat(e.target.value.replace(/,/g, "")),
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
              customInput={MUIRightTextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_stockallow: parseFloat(e.target.value.replace(/,/g, "")),
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
              customInput={MUIRightTextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_ownallow: parseFloat(e.target.value.replace(/,/g, "")),
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
              customInput={MUIRightTextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_cardallow: parseFloat(e.target.value.replace(/,/g, "")),
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
              customInput={MUIRightTextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_pumpallow: parseFloat(e.target.value.replace(/,/g, "")),
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

          const isValid = cell.row.original.U_tl_totalallow === total;
          return (
            <NumericFormat
              thousandSeparator
              // disabled
              className="bg-gray-100 cursor-pointer"
              readOnly
              placeholder="0.000"
              decimalScale={2}
              fixedDecimalScale
              redColor={!isValid}
              customInput={MUIRightTextField}
              // value={cell.getValue()}
              value={total}
            />
          );
        },
      },
    ],
    [data.allocationData]
  );
  console.log(data.allocationData);
  return (
    <>
      <div className="flex items-center mb-4 gap-16 ">
        <Button
          // onClick={generateAllocation}
          variant="outlined"
          size="medium"
          sx={{
            textTransform: "none",
            width: "20%",
            borderColor: "black",
            color: "black",
          }}
          disableElevation
        >
          <span className="px-3 text-base font-medium ">
            Generate Allocation{" "}
          </span>
        </Button>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-1 gap-x-10 gap-y-10  
       overflow-hidden transition-height duration-300 `}
      >
        <div className="data-table">
          <MaterialReactTable
            columns={itemColumns}
            data={data.allocationData}
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
            muiTableBodyRowProps={() => ({
              sx: { cursor: "pointer" },
            })}
            initialState={{
              density: "compact",
            }}
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
      </div>
    </>
  );
}
