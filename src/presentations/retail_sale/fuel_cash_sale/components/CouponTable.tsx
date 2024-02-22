import React from "react";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { AiOutlineSetting } from "react-icons/ai";
import FormattedInputs from "@/components/input/NumberFormatField";
import { Button, IconButton } from "@mui/material";
import { GridAddIcon, GridDeleteIcon } from "@mui/x-data-grid";
import CurrencySelect from "@/components/selectbox/Currency";
import CashACAutoComplete from "@/components/input/CashAccountAutoComplete";
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
        U_tl_amtcoupon: "",
        U_tl_paycur: "USD",
        U_tl_paytype: "Coupon",
        // U_tl_totalusd: 0,
        // U_tl_totalkhr: 0,
        // U_tl_over: 0,
      },
    ];
    onChange("couponData", firstData);
  };

  const columns = [
    {
      size: 20,
      minSize: 20,
      maxSize: 20,
      accessorKey: "deleteButton",
      align: "center",
      header: "",
      Cell: ({ cell }: any) => {
        if (!cell.row.original?.U_tl_acccoupon) return null;
        return null;
      },
    },
    {
      accessorKey: "U_tl_acccoupon",
      header: "Coupon Account Name",
      Cell: ({ cell }: any) => {
        if (!cell.row.original?.U_tl_acccoupon) return null;
        return (
          <CashACAutoComplete
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
      accessorKey: "U_tl_paycur",
      header: "Currency",
      Cell: ({ cell }: any) => {
        if (!cell.row.original.U_tl_acccoupon) return null;
        return (
          <CurrencySelect
            key={"U_tl_paycur" + cell.getValue() + cell?.row?.id}
            value={cell.row.original?.U_tl_paycur || 0}
            name={"U_tl_paycur"}
            disabled
          />
        );
      },
    },
    {
      accessorKey: "U_tl_amtcoupon",
      header: " Amount",
      Cell: ({ cell }: any) => {
        if (!cell.row.original.U_tl_acccoupon) return null;
        return (
          <FormattedInputs
            key={"U_tl_amtcoupon" + cell.getValue() + cell?.row?.id}
            disabled={data?.edit}
            defaultValue={cell.row.original?.U_tl_amtcoupon || 0}
            placeholder="0.000"
            onBlur={(e: any) => {
              handlerChangeItem(cell?.row?.id || 0, {
                U_tl_amtcoupon: parseFloat(e.target.value.replace(/,/g, "")),
              });
            }}
            name={"U_tl_amtcoupon"}
            value={cell.row.original?.U_tl_amtcoupon || ""}
          />
        );
      },
    },
    {
      size: 15,
      minSize: 15,
      maxSize: 15,
      accessorKey: "deleteButton",
      align: "center",
      header: "",
      Cell: ({ cell }: any) => {
        if (!cell.row.original?.U_tl_acccoupon) return null;
        return null;
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
            "& .MuiTableHead-root .MuiTableCell-root": {
              fontWeight: "600",
              paddingTop: "8px",
              paddingBottom: "8px",
              color: "#6b7280",
            },
            border: "1px solid rgba(81, 81, 81, .5)",
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
