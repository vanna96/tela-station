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
}

export default function AllocationTable({
  data,
  onChange,
}: AllocationTableProps) {
  const [key, setKey] = React.useState(shortid.generate());
  const onClose = React.useCallback(() => setCollapseError(false), []);
  const [collapseError, setCollapseError] = React.useState(false);

  React.useEffect(() => {
    setCollapseError("Items" in data?.error);
  }, [data?.error]);
  console.log(data.nozzleData);

  const AllocationData = data.nozzleData?.filter((e: any) => e.new_meter > 0);

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
        accessorKey: "cashSales",
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
                  cashSales: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "partnership",
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
                  partnership: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "stockTransfer",
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
                  stockTransfer: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "ownUsage",
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
                  ownUsage: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "telaCard",
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
                  telaCard: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "pumpTest",
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
                  pumpTest: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "total",
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
                  total: e.target.value,
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
