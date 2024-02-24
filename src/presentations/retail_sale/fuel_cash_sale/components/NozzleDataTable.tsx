import React from "react";
import MUITextField from "../../../../components/input/MUITextField";
import request from "@/utilies/request";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import { useQuery } from "react-query";
import { NumericFormat } from "react-number-format";
import MaterialReactTable from "material-react-table";
import MUIRightTextField from "@/components/input/MUIRightTextField";
import { commaFormatNum } from "@/utilies/formatNumber";
interface NozzleDataProps {
  data: any;
  onChange: (key: any, value: any) => void;
  edit?: boolean;
}

export default function NozzleData({ data, onChange, edit }: NozzleDataProps) {
  const handlerChangeItem = (key: number, obj: any) => {
    const newData = data.nozzleData?.map((item: any, index: number) => {
      if (index.toString() !== key.toString()) return item;
      item[Object.keys(obj).toString()] = Object.values(obj).toString();
      return item;
    });
    if (newData.length <= 0) return;
    onChange("nozzleData", newData);
  };

  console.log(data);

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "U_tl_nozzlecode",
        header: "Nozzle Code",
        visible: true,
        Cell: ({ cell }: any) => {
          return <MUITextField value={cell.getValue()} disabled />;
        },
      },
      {
        accessorKey: "U_tl_itemcode",
        header: "Item Code",
        visible: true,
        Cell: ({ cell }: any) => {
          return <MUITextField value={cell.getValue()} disabled />;
        },
      },

      {
        accessorKey: "U_tl_itemname",
        header: "Item Name",
        visible: true,
        Cell: ({ cell }: any) => {
          return <MUITextField value={cell.getValue()} disabled />;
        },
      },
      {
        accessorKey: "U_tl_uom",
        header: "UoM",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={
                new UnitOfMeasurementRepository().find(
                  cell.row.original.U_tl_uom
                )?.Name
              }
              disabled
            />
          );
        },
      },

      {
        Header: (header: any) => (
          <label>
            New Meter <span className="text-red-500">*</span>
          </label>
        ),
        accessorKey: "U_tl_nmeter",
        header: "New Meter",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              //   disabled
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale
              placeholder="0.000"
              customInput={MUIRightTextField}
              defaultValue={cell.getValue() === 0 ? "" : cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_nmeter: parseFloat(e.target.value.replace(/,/g, "")),
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_ometer",
        header: "Old Meter",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              disabled
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale
              customInput={MUIRightTextField}
              defaultValue={
                cell.row.original.U_tl_ometer
                  ? cell.getValue()
                  : cell.row.original.U_tl_reg_meter
              }
            />
          );
        },
      },

      {
        accessorKey: "U_tl_cmeter",
        header: "Consumption",
        visible: true,
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

          return (
            <NumericFormat
              disabled
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale
              customInput={MUIRightTextField}
              value={value}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_cmeter: e.target.value,
                })
              }
            />
          );
        },
      },
    ],
    []
  );

  console.log(data.nozzleData);

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-1 gap-x-10 gap-y-10  
       overflow-hidden transition-height duration-300 `}
    >
      <div className=" data-table">
        <MaterialReactTable
          columns={[...itemColumns]}
          data={data.nozzleData}
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
  );
}
