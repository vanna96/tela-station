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
import { useExchangeRate } from "../../components/hook/useExchangeRate";
export default function CashBankTable(props: any) {
  const { data, onChange }: any = props;
  const [rowSelection, setRowSelection] = React.useState<any>({});

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
      },
    ];
    onChange("cashBankData", firstData);
  };

  useExchangeRate(data?.Currency, onChange);

  const columns = [
    {
      size: 5,
      minSize: 5,
      maxSize: 5,
      accessorKey: "deleteButton",
      align: "center",
      header: "",
      Cell: ({ cell }: any) => {
        if (!cell.row.original?.U_tl_paytype) return null;
      },
    },
    {
      accessorKey: "U_tl_paytype",
      header: "Type",
      size: 40,

      Cell: ({ cell }: any) => {
        if (!cell.row.original?.U_tl_paytype)
          return (
            <Button
              onClick={() => handlerAdd()}
              variant="outlined"
              size="small"
              sx={{
                height: "30px",
                textTransform: "none",
                width: "100%",
                borderColor: "black",
                color: "black",
              }}
              disableElevation
            >
              <span className="px-3 text-[13px] py-1">Add </span>
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
      size: 40,

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
          size: 40,

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
                    U_tl_amtcash: parseFloat(e.target.value.replace(/,/g, "")),
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
          size: 40,
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
                    U_tl_amtbank: parseFloat(e.target.value.replace(/,/g, "")),
                  });
                }}
                name={"U_tl_amtbank"}
                value={cell.row.original?.U_tl_amtbank || ""}
                startAdornment={cell.row.original?.U_tl_paycur}
              />
            );
          },
        },
    {
      size: 5,
      minSize: 5,
      maxSize: 5,
      accessorKey: "deleteButton",
      align: "center",
      header: "",
      Cell: ({ cell }: any) => {
        if (!cell.row.original?.U_tl_paytype) return null;
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
        defaultColumn={{
          maxSize: 400,
          minSize: 80,
          size: 160,
        }}
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
              // backgroundColor: "#e4e4e7",
              fontWeight: "600",
              paddingTop: "8px",
              paddingBottom: "8px",
              color: "#6b7280",
            },
            border: "1px solid rgba(81, 81, 81, .5)",
            // backgroundColor: "#ffffff",
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
