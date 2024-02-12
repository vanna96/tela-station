import React from "react";
import MUITextField from "../../../../components/input/MUITextField";
import request from "@/utilies/request";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import { useQuery } from "react-query";
import { NumericFormat } from "react-number-format";
import MaterialReactTable from "material-react-table";
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

  const fetchItemName = async (itemCode: any) => {
    const res = await request(
      "GET",
      `/Items('${itemCode}')?$select=ItemName,ItemPrices`
    );
    return res;
  };
  console.log(data);
  //   U_tl_nozzlecode: item.U_tl_pumpcode,
  // U_tl_itemcode: item.U_tl_itemcode,
  // U_tl_itemname: item.U_tl_desc,
  // U_tl_uom: item.U_tl_uom,
  // U_tl_nmeter: item.U_tl_nmeter,
  // // U_tl_upd_meter: item.U_tl_ometer,
  // U_tl_ometer: item.U_tl_upd_meter,
  // U_tl_cmeter: item.U_tl_cmeter,
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
      // {
      //   accessorKey: "ItemPrice",
      //   header: "Item Price",
      //   visible: false,
      //   Cell: ({ cell }: any) => {
      //     const itemCode = cell.row.original.U_tl_itemcode;

      //     const {
      //       data: itemName,
      //       isLoading,
      //       isError,
      //     } = useQuery(["itemName", itemCode], () => fetchItemName(itemCode), {
      //       enabled: !!itemCode,
      //     });

      //     if (isLoading) {
      //       return <MUITextField disabled />;
      //     }

      //     if (isError) {
      //       return <span>Error fetching itemName</span>;
      //     }

      //     return (
      //       <MUITextField
      //         disabled
      //         value={
      //           itemName?.data?.ItemPrices?.find(
      //             (e: any) => e.PriceList === data.PriceList
      //           )?.Price
      //         }
      //         onBlur={(e: any) =>
      //           handlerChangeItem(cell?.row?.id || 0, {
      //             ItemPrice: e.target.value,
      //           })
      //         }
      //       />
      //     );
      //   },
      // },

      {
        accessorKey: "U_tl_itemname",
        header: "Item Name",
        visible: true,
        Cell: ({ cell }: any) => {
          const itemCode = cell.row.original.U_tl_itemcode;

          const {
            data: itemName,
            isLoading,
            isError,
          } = useQuery(["itemName", itemCode], () => fetchItemName(itemCode), {
            enabled: !!itemCode,
          });

          if (isLoading) {
            return <MUITextField disabled />;
          }

          if (isError) {
            return <span>Error fetching itemName</span>;
          }

          return (
            <MUITextField
              disabled
              value={
                edit
                  ? cell.row.original.U_tl_itemname
                  : itemName?.data?.ItemName
              }
            />
          );
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
              customInput={MUITextField}
              defaultValue={cell.getValue() === 0 ? "" : cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_nmeter: e.target.value,
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
              customInput={MUITextField}
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
          return (
            <NumericFormat
              disabled
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
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
  );
}
