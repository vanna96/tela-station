import React, { useEffect } from "react";
import MUIRightTextField from "../../../../components/input/MUIRightTextField";
import request from "@/utilies/request";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import { useQuery } from "react-query";
import { NumericFormat } from "react-number-format";
import MaterialReactTable from "material-react-table";
import { commaFormatNum } from "@/utilies/formatNumber";
import MUITextField from "@/components/input/MUITextField";

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
  if (!edit) {
    data.allocationData = data.nozzleData?.filter(
      (e: any) => parseFloat(e.U_tl_nmeter) > 0
    );
  }

  const handlerChangeItem = (key: number, obj: any) => {
    const newData = data.allocationData.map((item: any, index: number) => {
      if (index.toString() === key.toString()) {
        const objKey = Object.keys(obj)[0];
        item[objKey] = Object.values(obj)[0];

        if (
          [
            "U_tl_cardallow",
            "U_tl_cashallow",
            "U_tl_ownallow",
            "U_tl_partallow",
            "U_tl_pumpallow",
            "U_tl_stockallow",
          ].includes(objKey)
        ) {
          const total =
            parseFloat(item.U_tl_cardallow || 0) +
            parseFloat(item.U_tl_cashallow || 0) +
            parseFloat(item.U_tl_ownallow || 0) +
            parseFloat(item.U_tl_partallow || 0) +
            parseFloat(item.U_tl_pumpallow || 0) +
            parseFloat(item.U_tl_stockallow || 0);

          item.U_tl_totalallow = total;
        }
      }
      return item;
    });
    onChange("allocationData", newData);
  };
  const synchronizeAllocationData = () => {
    const updatedAllocationData = data.allocationData.map((stockItem: any) => {
      const allocationItem = data.stockAllocationData.find(
        (allocationItem: any) =>
          allocationItem.U_tl_itemcode === stockItem.U_tl_itemcode
      );
      if (allocationItem) {
        return { ...stockItem, U_tl_bincode: allocationItem.U_tl_bincode };
      }
      return stockItem;
    });

    onChange("allocationData", updatedAllocationData);
  };
  useEffect(() => {
    synchronizeAllocationData();
  }, [data.stockAllocationData]);

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
          const originalValue = parseFloat(
            cell.row.original?.U_tl_nmeter?.replace(/,/g, "")
          );
          const meterValue = cell.row.original.U_tl_ometer;
          const regMeterValue = cell.row.original.U_tl_reg_meter;

          let value = 0;

          if (meterValue !== undefined) {
            value = originalValue - meterValue;
          } else if (regMeterValue > 0) {
            value =
              commaFormatNum(cell.row.original?.U_tl_nmeter || 0) -
              regMeterValue;
          }
          const isValid = cell.row.original.U_tl_totalallow === value;
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
              value={cell.getValue()}
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
