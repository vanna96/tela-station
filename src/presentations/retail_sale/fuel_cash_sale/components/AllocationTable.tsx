import React from "react";
import MUITextField from "../../../../components/input/MUITextField";
import ContentComponent from "./ContentComponents";
import { Alert, Collapse, IconButton, TextField } from "@mui/material";
import { MdOutlineClose } from "react-icons/md";
import shortid from "shortid";
import MUISelect from "@/components/selectbox/MUISelect";
import UserCodeAutoComplete from "@/components/input/UserCodeAutoCeomplete";
import request from "@/utilies/request";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import { useQuery } from "react-query";
import { NumericFormat } from "react-number-format";
import MaterialReactTable from "material-react-table";
interface AllocationTableProps {
  data: any;
  onChange: (key: any, value: any) => void;
  edit?: boolean;
}

export default function AllocationTable({
  data,
  onChange,
  edit,
}: AllocationTableProps) {
  data.allocationData = data.nozzleData?.filter((e: any) => e.U_tl_nmeter > 0);

  const handlerChangeItem = (key: number, obj: any) => {
    const newData = data.allocationData?.map((item: any, index: number) => {
      if (index.toString() !== key.toString()) return item;
      item[Object.keys(obj).toString()] = Object.values(obj).toString();
      return item;
    });
    if (newData.length <= 0) return;
    onChange("allocationData", newData);
  };
  console.log(data.allocationData);
  const fetchItemName = async (itemCode: any) => {
    const res = await request("GET", `/Items('${itemCode}')?$select=ItemName`);
    console.log(res);
    return res;
  };

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "U_tl_itemcode",
        header: "Item Code",
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

          return <MUITextField disabled value={itemName?.data?.ItemName} />;
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
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_cashallow: e.target.value,
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
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_partallow: e.target.value,
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
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_stockallow: e.target.value,
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
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_ownallow: e.target.value,
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
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_cardallow: e.target.value,
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
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_pumpallow: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_totalallow",
        header: "Total (Litre)",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              // className=""
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_totalallow: e.target.value,
                })
              }
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
