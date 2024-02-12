import React from "react";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
import MUITextField from "@/components/input/MUITextField";
import FormattedInputs from "@/components/input/NumberFormatField";
import MUISelect from "@/components/selectbox/MUISelect";
import ClearIcon from "@mui/icons-material/Clear";

import { Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { GridAddIcon, GridDeleteIcon } from "@mui/x-data-grid";
import CurrencySelect from "@/components/selectbox/Currency";
export default function CashBankTable(props: any) {
  const { data, onChange }: any = props;
  const [rowSelection, setRowSelection] = React.useState<any>({});

  const handlerAddCheck = () => {
    onChange("cashBankData", [
      ...(data?.cashBankData || []),
      {
        U_tl_paytype: "cash" || "bank",
        U_tl_paycur: "USD",
        U_tl_amtcash: "",
        U_tl_amtbank: "",
      },
    ]);
  };

  console.log(data);

  const handlerRemoveCheck = (key: number) => {
    const newData = (data?.cashBankData || []).filter(
      (item: any, index: number) => index !== key
    );
    if (newData.length < 1) return;
    onChange("cashBankData", newData);
  };

  const handlerChangeItem = (key: number, obj: any) => {
    const newData = data?.cashBankData?.map((item: any, index: number) => {
      if (index.toString() !== key.toString()) return item;
      item[Object.keys(obj).toString()] = Object.values(obj).toString();
      return item;
    });
    if (newData.length <= 0) return;
    onChange("cashBankData", newData);
  };

  const handlerAdd = () => {
    let firstData = [
      ...data.cashBankData,
      {
        U_tl_paytype: "cash",
        U_tl_paycur: "USD",
        U_tl_amtcash: "",
        U_tl_amtbank: "",
        // U_tl_paytype: "Cash",
      },
    ];
    onChange("cashBankData", firstData);
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
        if (!cell.row.original?.U_tl_paytype) return null;
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
      accessorKey: "U_tl_paytype",
      header: "Type",
      Cell: ({ cell }: any) => {
        if (!cell.row.original?.U_tl_paytype)
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
          <MUISelect
            key={"U_tl_paytype" + cell.getValue() + cell?.row?.id}
            value={cell.row.original?.U_tl_paytype || ""}
            disabled={data?.edit}
            onChange={(e: any) => {
              handlerChangeItem(cell?.row?.id || 0, {
                U_tl_paytype: e.target.value,
              });
            }}
            items={[
              { value: "cash", label: "Cash" },
              { value: "bank", label: "Bank" },
            ]}
          />
        );
      },
    },
    {
      accessorKey: "U_tl_paycur",
      header: "Currency",
      Cell: ({ cell }: any) => {
        if (!cell.row.original?.U_tl_paytype) return null;
        return (
          <CurrencySelect
            key={"U_tl_paycur" + cell.getValue() + cell?.row?.id}
            value={cell.row.original?.U_tl_paycur || 0}
            onChange={(e: any) => {
              handlerChangeItem(cell?.row?.id || 0, {
                U_tl_paycur: e.target.value,
              });
            }}
          />
        );
      },
    },
    data?.cashBankData?.some((item: any) => item?.U_tl_paytype === "cash")
      ? {
          accessorKey: "U_tl_amtcash",
          header: "Amount",
          Cell: ({ cell }: any) => {
            if (!cell.row.original?.U_tl_paytype) return null;
            return (
              <FormattedInputs
              placeholder="0.000"
                key={"U_tl_amtcash" + cell.getValue() + cell?.row?.id}
                disabled={data?.edit}
                defaultValue={cell.row.original?.U_tl_amtcash || 0}
                onBlur={(e: any) => {
                  handlerChangeItem(cell?.row?.id || 0, {
                    U_tl_amtcash: e.target.value,
                  });
                }}
                name={"U_tl_amtcash"}
                value={cell.row.original?.U_tl_amtcash || ""}
                startAdornment={cell.row.original?.U_tl_paycur}
              />
            );
          },
        }
      : {
          accessorKey: "U_tl_amtbank",
          header: "Amount",
          Cell: ({ cell }: any) => {
            if (!cell.row.original?.U_tl_paytype) return null;
            return (
              <FormattedInputs
                placeholder="0.000"
                key={"U_tl_amtbank" + cell.getValue() + cell?.row?.id}
                disabled={data?.edit}
                defaultValue={cell.row.original?.U_tl_amtbank || 0}
                onBlur={(e: any) => {
                  handlerChangeItem(cell?.row?.id || 0, {
                    U_tl_amtbank: e.target.value,
                  });
                }}
                name={"U_tl_amtbank"}
                value={cell.row.original?.U_tl_amtbank || ""}
                startAdornment={cell.row.original?.U_tl_paycur}
              />
            );
          },
        },
  ];

  return (
    <div className="data-table">
      <MaterialReactTable
        columns={[...columns]}
        data={[...data?.cashBankData, { U_tl_paytype: "" }]}
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
