import React from "react";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { AiOutlineSetting } from "react-icons/ai";
import FormattedInputs from "@/components/input/NumberFormatField";
import { Button, Checkbox, IconButton } from "@mui/material";
import { GridAddIcon, GridDeleteIcon } from "@mui/x-data-grid";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BankAutoComplete from "@/components/input/BankAutoComplete";
import CashACAutoComplete from "@/components/input/CashAccountAutoComplete";
import CurrencySelect from "@/components/selectbox/Currency";
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

  const onCheckRow = (event: any, index: number) => {
    const rowSelects: any = { ...rowSelection };
    rowSelects[index] = true;

    if (!event.target.checked) {
      delete rowSelects[index];
    }

    setRowSelection(rowSelects);
  };
  const handlerChangeItem = (key: number, obj: any) => {
    const newData = data?.checkNumberData?.map((item: any, index: number) => {
      if (index.toString() !== key.toString()) return item;
      item[Object.keys(obj).toString()] = Object.values(obj).toString();
      return item;
    });
    if (newData.length <= 0) return;
    onChange("checkNumberData", newData);
  };

  const handlerAdd = () => {
    let firstData = [
      ...data.checkNumberData,
      {
        U_tl_acccheck: "1101011",
        U_tl_checkdate: new Date(),
        U_tl_checkbank: "",
        U_tl_amtcheck: 0,
        U_tl_paycur: "USD",
      },
    ];
    onChange("checkNumberData", firstData);
  };

  const columns = [
    {
      accessorKey: "index1",
      size: 0,
      minSize: 0,
      maxSize: 0,
      header: "",
      Cell: ({ cell }: any) => {
        if (cell.row.original?.U_tl_acccheck)
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
      accessorKey: "U_tl_acccheck",
      size: 220,
      header: "Check Number",
      Cell: ({ cell }: any) => {
        if (!cell.row.original?.U_tl_acccheck)
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
          <CashACAutoComplete
            key={"U_tl_acccheck" + cell.getValue() + cell?.row?.id}
            // type="number"
            disabled={data?.edit}
            value={cell.row.original?.U_tl_acccheck || ""}
            onChange={(e: any) => {
              handlerChangeItem(cell?.row?.id || 0, {
                U_tl_acccheck: e,
              });
            }}
          />
        );
      },
    },
    {
      accessorKey: "U_tl_checkdate",
      size: 220,
      header: "Check Date",
      Cell: ({ cell }: any) => {
        if (!cell.row.original.U_tl_acccheck) return null;
        return (
          <MUIDatePicker
            key={"U_tl_checkdate" + cell.getValue() + cell?.row?.id}
            value={cell.row.original?.U_tl_checkdate || new Date()}
            disabled={data?.edit}
            onChange={(e: any) =>
              handlerChangeItem(cell?.row?.id || 0, {
                U_tl_checkdate: e,
              })
            }
          />
        );
      },
    },
    {
      accessorKey: "U_tl_paycur",
      size: 220,
      header: "Currency",
      Cell: ({ cell }: any) => {
        if (!cell.row.original.U_tl_acccheck) return null;
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
    {
      accessorKey: "U_tl_amtcheck",
      size: 220,
      header: "Check Amount",
      Cell: ({ cell }: any) => {
        if (!cell.row.original.U_tl_acccheck) return null;
        return (
          <NumericFormat
            key={"U_tl_amtcheck" + cell.getValue() + cell?.row?.id}
            placeholder="0.000"
            disabled={data?.edit}
            defaultValue={cell.row.original?.U_tl_amtcheck || 0}
            onBlur={(e: any) => {
              handlerChangeItem(cell?.row?.id || 0, {
                U_tl_amtcheck: parseFloat(e.target.value.replace(/,/g, "")),
              });
            }}
            customInput={MUIRightTextField}
            name={"U_tl_amtcheck"}
            value={cell.row.original?.U_tl_amtcheck || ""}
          />
        );
      },
    },
    {
      accessorKey: "U_tl_checkbank",
      size: 220,
      header: "Bank",

      Cell: ({ cell }: any) => {
        if (!cell.row.original.U_tl_acccheck) return null;
        return (
          <BankAutoComplete
            key={"U_tl_checkbank" + cell.getValue() + cell?.row?.id}
            value={cell.row.original?.U_tl_checkbank || ""}
            disabled={data?.edit}
            onChange={(e: any) => {
              handlerChangeItem(cell?.row?.id || 0, {
                U_tl_checkbank: e,
              });
            }}
          />
        );
      },
    },
    {
      size: 10,
      minSize: 10,
      maxSize: 10,
      accessorKey: "deleteButton",
      align: "center",
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
        columns={[...columns]}
        data={[...data?.checkNumberData, { U_tl_acccheck: "" }]}
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
        defaultColumn={{
          maxSize: 400,
          minSize: 80,
          size: 160,
        }}
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
