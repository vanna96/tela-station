import React, { useEffect } from "react";
import MUITextField from "../../../../components/input/MUITextField";
import { Button } from "@mui/material";
import request from "@/utilies/request";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import { useQuery } from "react-query";
import { NumericFormat } from "react-number-format";
import BranchAutoComplete from "@/components/input/BranchAutoComplete";
import FormCard from "@/components/card/FormCard";
import MaterialReactTable from "material-react-table";
import { useCookies } from "react-cookie";
import { AiOutlineSetting } from "react-icons/ai";
import { GridAddIcon } from "@mui/x-data-grid";
import MUISelect from "@/components/selectbox/MUISelect";
import shortid from "shortid";
interface StockAllocationTableProps {
  data: any;
  onChange: (key: any, value: any) => void;
  edit?: boolean;
}

export default function StockAllocationTable({
  data,
  onChange,
  edit,
}: StockAllocationTableProps) {
  const [cookies] = useCookies(["user"]);
  const userData = cookies.user;
  // data.stockAllocationData = [...data.nozzleData]
  const onChangeItem = (key: number, obj: any) => {
    const newData = data.stockAllocationData?.map(
      (item: any, index: number) => {
        if (index.toString() !== key.toString()) return item;
        item[Object.keys(obj).toString()] = Object.values(obj).toString();
        return item;
      }
    );
    if (newData.length <= 0) return;
    onChange("stockAllocationData", newData);
  };

  const branchChange = (key: number, obj: any) => {
    const newData = data.stockAllocationData?.map(
      (item: any, index: number) => {
        if (index.toString() !== key.toString()) return item;

        const newValues: Record<string, number> = {};
        for (const [prop, value] of Object.entries(obj)) {
          newValues[prop] = parseInt(value, 10) || 0; // Convert to number or use 0 if not a valid number
        }

        return { ...item, ...newValues };
      }
    );

    if (!newData || newData.length <= 0) return {};

    return { stockAllocationData: newData };
  };

  const handlerAdd = () => {
    let firstData = [
      ...data.stockAllocationData,
      {
        U_tl_bplid: 1,
        U_tl_itemnum: "",
        U_tl_itemdesc: "",
        U_tl_qtyaloc: "",
        U_tl_qtycon: "",
        U_tl_qtyopen: "",
        U_tl_remark: "",
        U_tl_uom: "",
      },
    ];
    console.log(firstData);
    onChange("stockAllocationData", firstData);
  };

  useEffect(() => {
    console.log("Updated Data:", data);
  }, [data]);

  const fetchItemName = async (itemCode: any) => {
    const res = await request("GET", `/Items('${itemCode}')?$select=ItemName`);
    return res;
  };
  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "U_tl_bplid",
        header: "Branch", //uses the default width from defaultColumn prop
        visible: true,
        type: "number",
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.U_tl_bplid)
            return (
              <Button
                onClick={() => handlerAdd()}
                variant="outlined"
                size="small"
                sx={{ height: "30px", textTransform: "none", width: "100%" }}
                disableElevation
              >
                <span className="px-3 text-[13px] py-1 text-green-500 font-no">
                  <GridAddIcon />
                  Add Row
                </span>
              </Button>
            );

          return (
            <BranchAutoComplete
              BPdata={userData?.UserBranchAssignment}
              onChange={(e: any) => {
                console.log(e);
                onChangeItem(cell?.row?.id || 0, {
                  U_tl_bplid: e,
                });
              }}
              value={parseInt(cell.getValue())}
            />
          );
        },
      },
      {
        accessorKey: "U_tl_itemnum",
        header: "Item Code",
        visible: true,
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.U_tl_bplid) return null;

          const nozzleDataLength = data.nozzleData.length;
          const stockAllocationDataLength = data.stockAllocationData.length;

          // Check if the stockAllocationData has less objects than nozzleData
          const disableField =
            stockAllocationDataLength < nozzleDataLength &&
            cell.row.index >= stockAllocationDataLength;

          return (
            <MUISelect
              items={data.nozzleData?.map((e: any) => ({
                value: e.U_tl_itemnum,
                label: e.U_tl_itemnum,
              }))}
              value={cell.getValue()}
              onChange={(e: any) =>
                onChangeItem(cell?.row?.id || 0, {
                  U_tl_itemnum: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_itemdesc",
        header: "Item Name",
        visible: true,
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.U_tl_bplid) return null;

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

          return (
            <MUITextField
              disabled
              value={
                edit
                  ? cell.row.original.U_tl_itemdesc
                  : itemName?.data?.ItemName
              }
            />
          );
        },
      },

      {
        accessorKey: "U_tl_qtycon",
        header: "Cons. Qty ",
        visible: true,
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.U_tl_bplid) return null;

          return (
            <NumericFormat
              key={"U_tl_qtycon" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              value={cell.getValue()}
              onBlur={(e: any) =>
                onChangeItem(cell?.row?.id || 0, {
                  U_tl_qtycon: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        Header: (header: any) => (
          <label>
            Aloc. Qty <span className="text-red-500">*</span>
          </label>
        ),
        accessorKey: "U_tl_qtyaloc",
        header: "Aloc. Qty",
        visible: true,
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.U_tl_bplid) return null;

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
                onChangeItem(cell?.row?.id || 0, {
                  U_tl_qtyaloc: e.target.value,
                })
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
          if (!cell.row.original?.U_tl_bplid) return null;

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
        accessorKey: "U_tl_qtyopen",
        header: "Open. Qty",
        visible: true,
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.U_tl_bplid) return null;

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
                onChangeItem(cell?.row?.id || 0, {
                  U_tl_qtyopen: e.target.value,
                })
              }
            />
          );
        },
      },

      {
        accessorKey: "U_tl_remark",
        header: "Remark",
        visible: true,
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.U_tl_bplid) return null;

          return (
            <MUITextField
              key={"U_tl_remark" + cell.getValue()}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                onChangeItem(cell?.row?.id || 0, {
                  U_tl_remark: e.target.value,
                })
              }
            />
          );
        },
      },
    ],
    [data.stockAllocationData]
  );

  return (
    <>
      <FormCard title="Stock Allocation ">
        <>
          <div className="col-span-2 data-table">
            <MaterialReactTable
              columns={[...itemColumns]}
              data={[...data.stockAllocationData, { U_tl_bplid: "" }]}
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
              initialState={{
                density: "compact",
              }}
              state={{}}
              muiTableBodyRowProps={() => ({
                sx: { cursor: "pointer" },
              })}
              icons={{
                ViewColumnIcon: (props: any) => <AiOutlineSetting {...props} />,
              }}
              enableTableFooter={false}
            />
          </div>
        </>
      </FormCard>
    </>
  );
}
