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
  // const datattest = data?.TL_RETAILSALE_CONHCollection?.map((item: any) => ({
  //   U_tl_pumpcode: item.U_tl_nozzlecode,
  //   U_tl_itemnum: item.U_tl_itemcode,
  //   U_tl_itemdesc: item.U_tl_itemname,
  //   U_tl_uom: item.U_tl_uom,
  //   new_meter: item.U_tl_nmeter,
  //   U_tl_upd_meter: item.U_tl_ometer,
  //   U_tl_cmeter: item.U_tl_cmeter,

  //   U_tl_cardallow: item.U_tl_cardallow,
  //   U_tl_cashallow: item.U_tl_cashallow,
  //   U_tl_ownallow: item.U_tl_ownallow,
  //   U_tl_partallow: item.U_tl_partallow,
  //   U_tl_pumpallow: item.U_tl_pumpallow,
  //   U_tl_stockallow: item.U_tl_stockallow,
  //   U_tl_totalallow: item.U_tl_totalallow,
  // }));

  // const tl_Dispenser = edit
  //   ? datattest
  //   : [
  //       ...data.DispenserData?.TL_DISPENSER_LINESCollection?.filter(
  //         (e: any) =>
  //           e.U_tl_status === "Initialized" || e.U_tl_status === "Active"
  //       ),
  //     ];

  const AllocationData = data.nozzleData?.filter((e: any) => e.new_meter > 0);
  if (AllocationData.length > 0) {
    data.allocationData = AllocationData;
  }
  const handlerChangeItem = (key: number, obj: any) => {
    const newData = AllocationData?.map((item: any, index: number) => {
      if (index.toString() !== key.toString()) return item;
      item[Object.keys(obj).toString()] = Object.values(obj).toString();
      return item;
    });
    if (newData.length <= 0) return;
    onChange("allocationData", newData);
  };
  console.log(AllocationData);
  const fetchItemName = async (itemCode: any) => {
    const res = await request("GET", `/Items('${itemCode}')?$select=ItemName`);
    console.log(res);
    return res;
  };

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "U_tl_itemdesc",
        header: "Item Code",
        visible: true,
        Cell: ({ cell }: any) => {
          const itemCode = cell.row.original.U_tl_itemnum;

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
    [data.nozzleData]
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
            data={AllocationData}
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
