import React from "react";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { AiOutlineSetting } from "react-icons/ai";
import FormattedInputs from "@/components/input/NumberFormatField";
import { Button, IconButton } from "@mui/material";
import { GridAddIcon, GridDeleteIcon } from "@mui/x-data-grid";
import GLAccountAutoComplete from "@/components/input/GLAccountAutoComplete";
export default function CouponTable(props: any) {
  const { data, onChange }: any = props;
  const [rowSelection, setRowSelection] = React.useState<any>({});

  const handlerRemoveCheck = (key: number) => {
    const newData = (data?.couponData || []).filter(
      (item: any, index: number) => index !== key
    );
    if (newData.length < 1) return;
    onChange("couponData", newData);
  };

  const handlerChangeItem = (key: number, obj: any) => {
    const newData = data?.couponData?.map((item: any, index: number) => {
      if (index.toString() !== key.toString()) return item;
      item[Object.keys(obj).toString()] = Object.values(obj).toString();
      return item;
    });
    if (newData.length <= 0) return;
    onChange("couponData", newData);
  };

  const handlerAdd = () => {
    let firstData = [
      ...data.couponData,
      {
        U_tl_acccoupon: "11233",
        U_tl_amtcoupon: 0,
        U_tl_totalusd: 0,
        U_tl_totalkhr: 0,
        U_tl_over: 0,
      },
    ];
    onChange("couponData", firstData);
  };

  const columns = [
    {
      size: 10,
      minSize: 10,
      maxSize: 10,
      accessorKey: "deleteButton",
      align: "center",
      header: "",
      Cell: ({ cell }: any) => {
        if (!cell.row.original?.U_tl_acccoupon) return null;
        return (
          <div className="flex justify-center items-center">
            <GridDeleteIcon
              className="text-red-500 cursor-pointer"
              onClick={() => handlerRemoveCheck(cell?.row?.index)}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "U_tl_acccoupon",
      header: "Coupon Account Name",
      Cell: ({ cell }: any) => {
        if (!cell.row.original?.U_tl_acccoupon)
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
          <GLAccountAutoComplete
            key={"U_tl_acccoupon" + cell.getValue() + cell?.row?.id}
            // type="number"
            disabled={data?.edit}
            value={cell.row.original?.U_tl_acccoupon || ""}
            onChange={(e: any) => {
              handlerChangeItem(cell?.row?.id || 0, {
                U_tl_acccoupon: e,
              });
            }}
          />
        );
      },
    },

    {
      accessorKey: "U_tl_amtcoupon",
      header: "Check Amount",
      Cell: ({ cell }: any) => {
        if (!cell.row.original.U_tl_acccoupon) return null;
        return (
          <FormattedInputs
            key={"U_tl_amtcoupon" + cell.getValue() + cell?.row?.id}
            disabled={data?.edit} 
            defaultValue={cell.row.original?.U_tl_amtcoupon || 0}
            onBlur={(e: any) => {
              handlerChangeItem(cell?.row?.id || 0, {
                U_tl_amtcoupon: e.target.value,
              });
            }}
            name={"U_tl_amtcoupon"}
            value={cell.row.original?.U_tl_amtcoupon || ""}
          />
        );
      },
    },
    {
      accessorKey: "U_tl_totalusd",
      header: "Total /USD",
      Cell: ({ cell }: any) => {
        if (!cell.row.original.U_tl_acccoupon) return null;
        return (
          <FormattedInputs
            key={"U_tl_totalusd" + cell.getValue() + cell?.row?.id}
            disabled={data?.edit}
            defaultValue={cell.row.original?.U_tl_totalusd || 0}
            onBlur={(e: any) => {
              handlerChangeItem(cell?.row?.id || 0, {
                U_tl_totalusd: e.target.value,
              });
            }}
            name={"U_tl_totalusd"}
            value={cell.row.original?.U_tl_totalusd || ""}
          />
        );
      },
    },
    {
      accessorKey: "U_tl_totalkhr",
      header: "Total /KHR",
      Cell: ({ cell }: any) => {
        if (!cell.row.original.U_tl_acccoupon) return null;
        return (
          <FormattedInputs
            key={"U_tl_totalkhr" + cell.getValue() + cell?.row?.id}
            disabled={data?.edit}
            defaultValue={cell.row.original?.U_tl_totalkhr || 0}
            onBlur={(e: any) => {
              handlerChangeItem(cell?.row?.id || 0, {
                U_tl_totalkhr: e.target.value,
              });
            }}
            name={"U_tl_totalkhr"}
            value={cell.row.original?.U_tl_totalkhr || ""}
          />
        );
      },
    },
    {
      accessorKey: "U_tl_over",
      header: "Over/Shortage",
      Cell: ({ cell }: any) => {
        if (!cell.row.original.U_tl_acccoupon) return null;
        return (
          <FormattedInputs
            key={"U_tl_over" + cell.getValue() + cell?.row?.id}
            disabled={data?.edit}
            defaultValue={cell.row.original?.U_tl_over || 0}
            onBlur={(e: any) => {
              handlerChangeItem(cell?.row?.id || 0, {
                U_tl_over: e.target.value,
              });
            }}
            name={"U_tl_over"}
            value={cell.row.original?.U_tl_over || ""}
          />
        );
      },
    },
  ];

  return (
    <div className="data-table">
      <MaterialReactTable
        columns={[...columns]}
        data={[...data?.couponData, { U_tl_acccoupon: "" }]}
        enableStickyHeader={false}
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
        enableMultiRowSelection={false}
        initialState={{
          density: "compact",
          rowSelection,
        }}
        muiTableProps={() => ({
          sx: {
            "& .MuiTableCell-root": {
              padding: "8px",
            },
            border: "1px solid rgba(81, 81, 81, .5)",
            borderRadius: "5px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#ffffff",
          },
        })}
        state={{
          rowSelection,
          isLoading: props.loading,
          showProgressBars: props.loading,
          showSkeletons: props.loading,
        }}
        muiTableBodyRowProps={() => ({
          sx: { cursor: "pointer" },
        })}
        icons={{
          ViewColumnIcon: (props: any) => <AiOutlineSetting {...props} />,
        }}
        enableTableFooter={false}
        // muiTableFooter= {<AddIcon />}
      />
    </div>
  );
}
