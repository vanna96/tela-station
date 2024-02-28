import React from "react";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
import MUITextField from "@/components/input/MUITextField";
import FormattedInputs from "@/components/input/NumberFormatField";
import MUISelect from "@/components/selectbox/MUISelect";
import ClearIcon from "@mui/icons-material/Clear";

import { Button, Checkbox, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { GridAddIcon, GridDeleteIcon } from "@mui/x-data-grid";
import CurrencySelect from "@/components/selectbox/Currency";
import { useExchangeRate } from "../../components/hook/useExchangeRate";
import { NumericFormat } from "react-number-format";
import MUIRightTextField from "@/components/input/MUIRightTextField";
export default function CashBankTable(props: any) {
  const { data, onChange }: any = props;
  const [rowSelection, setRowSelection] = React.useState<any>({});

  const handlerRemove = () => {
    let filteredData = data.cashBankData.filter((item: any, index: number) => {
      return !(index.toString() in rowSelection);
    });
    onChange("cashBankData", filteredData);
    setRowSelection({});
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
        U_tl_paytype: "Cash",
        U_tl_paycur: "USD",
        U_tl_amtcash: "",
        U_tl_amtbank: "",
      },
    ];
    onChange("cashBankData", firstData);
  };

  useExchangeRate(data?.Currency, onChange);
  const onCheckRow = (event: any, index: number) => {
    const rowSelects: any = { ...rowSelection };
    rowSelects[index] = true;

    if (!event.target.checked) {
      delete rowSelects[index];
    }

    setRowSelection(rowSelects);
  };
  const columns = [
    {
      accessorKey: "index",
      size: 2,
      minSize: 2,
      maxSize: 2,
      header: "",
      Cell: ({ cell }: any) => {
        if (cell.row.original?.U_tl_paytype)
          return (
            <Checkbox
              checked={cell.row.index in rowSelection}
              size="small"
              onChange={(event) => onCheckRow(event, cell.row.index)}
            />
          );
      },
    },
    {
      accessorKey: "U_tl_paytype",
      header: "Type",
      size: 300,
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
              { value: "Cash", label: "Cash" },
              { value: "Bank", label: "Bank" },
            ]}
          />
        );
      },
    },
    {
      accessorKey: "U_tl_paycur",
      header: "Currency",
      size: 300,
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
    data?.cashBankData?.some((item: any) => item?.U_tl_paytype === "Cash")
      ? {
          accessorKey: "U_tl_amtcash",
          header: "Amount",
          size: 300,
          Cell: ({ cell }: any) => {
            if (!cell.row.original?.U_tl_paytype) return null;
            return (
              <NumericFormat
                placeholder="0.000"
                key={"U_tl_amtcash" + cell.getValue() + cell?.row?.id}
                disabled={data?.edit}
                defaultValue={cell.row.original?.U_tl_amtcash || 0}
                onBlur={(e: any) => {
                  handlerChangeItem(cell?.row?.id || 0, {
                    U_tl_amtcash: parseFloat(e.target.value.replace(/,/g, "")),
                  });
                }}
                customInput={MUIRightTextField}
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
          size: 300,
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
      accessorKey: "index",
      size: 0,
      minSize: 0,
      maxSize: 0,
      header: "",
    },
  ];

  return (
    <div className="data-table">
      <div className="flex justify-end mb-1">
        <Button
          disableElevation
          size="small"
          variant="outlined"
          style={{ borderColor: "#d1d5db", color: "#dc2626" }}
          disabled={props?.data?.isStatusClose || false}
        >
          <span className="capitalize text-xs " onClick={handlerRemove}>
            Remove
          </span>
        </Button>
      </div>
      <MaterialReactTable
        columns={columns}
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
            "& .MuiTableHead-root .MuiTableCell-root": {
              backgroundColor: "#e4e4e7",
              fontWeight: "500",
              paddingTop: "8px",
              paddingBottom: "8px",
            },
            border: "1px solid #d1d5db",
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
