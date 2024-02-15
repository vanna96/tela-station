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
import BinLocationToAsEntry from "@/components/input/BinLocationToAsEntry";
import WarehouseByBranch from "@/components/selectbox/WarehouseByBranch";
import WarehouseAutoComplete from "@/components/input/WarehouseAutoComplete";
interface StockAllocationTableProps {
  data: any;
  onChange: (key: any, value: any) => void;
  edit?: boolean;
  handlerChangeObject: (obj: any) => void;
}

export default function StockAllocationTable({
  data,
  onChange,
  edit,
  handlerChangeObject,
}: StockAllocationTableProps) {
  const [cookies] = useCookies(["user"]);
  const userData = cookies.user;

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

  const onChangeItemObj = (key: number, obj: any) => {
    const newData = data.stockAllocationData?.map(
      (item: any, index: number) => {
        if (index.toString() === key.toString()) {
          return { ...item, ...obj };
        } else {
          return item;
        }
      }
    );

    handlerChangeObject({ stockAllocationData: newData });
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
        U_tl_whs: "",
        U_tl_bincode: "",
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
        header: "Branch",
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
        accessorKey: "U_tl_whs",
        header: "Warehouse",
        visible: true,
        type: "number",
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.U_tl_bplid) return null;
          return (
            <WarehouseAutoComplete
              Branch={parseInt(cell.row.original.U_tl_bplid || 1)}
              onChange={(e: any) => {
                onChangeItem(cell?.row?.id || 0, {
                  U_tl_whs: e,
                });
              }}
              value={cell.getValue()}
            />
          );
        },
      },
      {
        accessorKey: "U_tl_bincode",
        header: "Bin Location",
        visible: true,
        type: "number",
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.U_tl_bplid) return null;
          return (
            <BinLocationToAsEntry
              Warehouse={cell.row.original.U_tl_whs}
              onChange={(e: any) => {
                onChangeItem(cell?.row?.id || 0, {
                  U_tl_bincode: e,
                });
              }}
              value={cell.getValue()}
            />
          );
        },
      },
      {
        accessorKey: "U_tl_itemcode",
        header: "Item Code",
        visible: true,
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.U_tl_bplid) return null;

          return (
            <MUISelect
              items={data.nozzleData?.map((e: any) => ({
                value: e.U_tl_itemcode,
                label: e.U_tl_itemcode,
              }))}
              value={cell.getValue()}
              onChange={(e: any) => {
                const selectedNozzle = data.nozzleData.find(
                  (item: any) => item.U_tl_itemcode === e.target.value
                );
                onChangeItemObj(cell.row.id, {
                  U_tl_itemcode: e.target.value,
                  U_tl_itemname: selectedNozzle.U_tl_itemname,
                  U_tl_uom: selectedNozzle.U_tl_uom,
                });
              }}
            />
          );
        },
      },
      {
        accessorKey: "U_tl_itemname",
        header: "Item Name",
        visible: true,
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.U_tl_bplid) return null;

          return (
            <MUITextField disabled value={cell.row.original.U_tl_itemname} />
          );
        },
      },

      {
        accessorKey: "U_tl_qtycon",
        header: "Cons. Qty",
        visible: true,
        Cell: ({ cell, row }: any) => {
          if (!row.original?.U_tl_bplid) return null;

          const rowsWithSameItemCode = data?.stockAllocationData?.filter(
            (r: any) => r?.U_tl_itemcode === cell.row.original.U_tl_itemcode
          );
          console.log(rowsWithSameItemCode);
          const totalQuantity = rowsWithSameItemCode.reduce(
            (sum: number, r: any) => {
              console.log(r);
              return sum + parseFloat(r.U_tl_qtycon);
            },
            0
          );

          const nozzle = data.nozzleData?.find(
            (nozzle: any) =>
              nozzle.U_tl_itemcode === cell.row.original.U_tl_itemcode
          );

          const isValid = nozzle
            ? totalQuantity === parseFloat(nozzle?.U_tl_cardallow)
            : false;

          return (
            <NumericFormat
              key={"U_tl_qtycon" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              placeholder="0.000"
              fixedDecimalScale
              customInput={MUITextField}
              inputProps={{
                style: {
                  color: isValid ? "inherit" : "red",
                },
              }}
              value={cell.getValue()}
              onBlur={(e: any) =>
                onChangeItem(cell?.row?.id || 0, {
                  U_tl_qtycon: parseFloat(e.target.value.replace(/,/g, "")),
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
                  U_tl_qtyaloc: parseFloat(e.target.value.replace(/,/g, "")),
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
