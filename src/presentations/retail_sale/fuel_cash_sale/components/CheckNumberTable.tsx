import React from "react";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { AiOutlineSetting } from "react-icons/ai";
import FormattedInputs from "@/components/input/NumberFormatField";
import { Button, IconButton } from "@mui/material";
import { GridAddIcon, GridDeleteIcon } from "@mui/x-data-grid";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BankAutoComplete from "@/components/input/BankAutoComplete";
import CashACAutoComplete from "@/components/input/CashAccountAutoComplete";
import CurrencySelect from "@/components/selectbox/Currency";
export default function CashBankTable(props: any) {
  const { data, onChange }: any = props;
  const [rowSelection, setRowSelection] = React.useState<any>({});

  const handlerRemoveCheck = (key: number) => {
    const newData = (data?.checkNumberData || []).filter(
      (item: any, index: number) => index !== key
    );
    if (newData.length < 1) return;
    onChange("checkNumberData", newData);
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
      size: 10,
      minSize: 10,
      maxSize: 10,
      accessorKey: "deleteButton",
      align: "center",
      header: "",
      Cell: ({ cell }: any) => {
        if (!cell.row.original?.U_tl_acccheck) return null;
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
      accessorKey: "U_tl_acccheck",
      header: "Check Number",
      Cell: ({ cell }: any) => {
        if (!cell.row.original?.U_tl_acccheck)
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
      header: "Check Amount",
      Cell: ({ cell }: any) => {
        if (!cell.row.original.U_tl_acccheck) return null;
        return (
          <FormattedInputs
            key={"U_tl_amtcheck" + cell.getValue() + cell?.row?.id}
            placeholder="0.000"
            disabled={data?.edit}
            defaultValue={cell.row.original?.U_tl_amtcheck || 0}
            onBlur={(e: any) => {
              handlerChangeItem(cell?.row?.id || 0, {
                U_tl_amtcheck: e.target.value,
              });
            }}
            name={"U_tl_amtcheck"}
            value={cell.row.original?.U_tl_amtcheck || ""}
          />
        );
      },
    },
    {
      accessorKey: "U_tl_checkbank",
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
  ];

  return (
    <div className="data-table">
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
