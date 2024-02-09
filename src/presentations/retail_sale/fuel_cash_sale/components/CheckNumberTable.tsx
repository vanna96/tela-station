import React, { useMemo } from "react";
import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table";
import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import MUITextField from "@/components/input/MUITextField";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BankSelect from "@/components/selectbox/bank";
import FormattedInputs from "@/components/input/NumberFormatField";
import { GridAddIcon, GridDeleteIcon } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import MUISelect from "@/components/selectbox/MUISelect";

export default function CheckNumberTable(props: any) {
  const { data, onChange }: any = props;
  const [rowSelection, setRowSelection] = React.useState<any>({});

  const handlerAddCheck = () => {
    onChange("checkNumberData", [
      ...(data?.checkNumberData || []),
      {
        check_no: 1,
        check_date: new Date(),
        bank: "",
        check_amount: 0,
      },
    ]);
  };

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

  const columns = [
    {
      size: 25,
      minSize: 25,
      maxSize: 25,
      accessorKey: "deleteButton",
      header: "",
      Cell: ({ cell }: any) => {
        if (!cell.row.orignal.check_no) return null;
        return (
          <GridDeleteIcon
            className="text-red-500 cursor-pointer"
            onClick={() => handlerRemoveCheck(cell?.row?.index)}
          />
        );
      },
    },
    {
      accessorKey: "check_no",
      header: "Check No.",

      Cell: ({ cell }: any) => {
        if (!cell.row.original?.check_no)
          return (
            <Button
              onClick={() => handlerAddCheck()}
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
          <MUITextField
            key={"check_no" + cell.getValue() + cell?.row?.id}
            type="number"
            disabled={data?.edit}
            defaultValue={cell.row.original?.check_no || ""}
            onBlur={(e: any) => {
              handlerChangeItem(cell?.row?.id || 0, {
                check_no: e.target.value,
              });
            }}
          />
        );
      },
    },
    {
      accessorKey: "check_date",
      header: "Check Date",

      Cell: ({ cell }: any) => {
        if (!cell.row.orignal.check_no) return null;
        return (
          <MUIDatePicker
            key={"check_date" + cell.getValue() + cell?.row?.id}
            value={cell.row.original?.check_date || new Date()}
            disabled={data?.edit}
            onChange={(e: any) =>
              handlerChangeItem(cell?.row?.id || 0, {
                check_date: e,
              })
            }
          />
        );
      },
    },
    {
      accessorKey: "check_amount",
      header: "Check Amount",
      Cell: ({ cell }: any) => {
        if (!cell.row.orignal.check_no) return null;
        return (
          <FormattedInputs
            key={"check_amount" + cell.getValue() + cell?.row?.id}
            disabled={data?.edit}
            defaultValue={cell.row.original?.check_amount || 0}
            onBlur={(e: any) => {
              handlerChangeItem(cell?.row?.id || 0, {
                check_amount: e.target.value,
              });
            }}
            name={"check_amount"}
            value={cell.row.original?.check_amount || ""}
          />
        );
      },
    },
    {
      accessorKey: "bank",
      header: "Bank",

      Cell: ({ cell }: any) => {
        if (!cell.row.orignal.check_no) return null;
        return (
          <BankSelect
            key={"bank" + cell.getValue() + cell?.row?.id}
            value={cell.row.original?.bank || ""}
            disabled={data?.edit}
            onChange={(e: any) => {
              handlerChangeItem(cell?.row?.id || 0, {
                bank: e.target.value,
              });
            }}
          />
        );
      },
    },
  ];

  return (
    <>
      <MaterialReactTable
        columns={[...columns]}
        // data={[...data?.checkNumberData, { check_no: "" }]}
        data={data.checkNumberData}
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
          rowSelection,
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
        enableTableFooter={true}
        // muiTableFooter= {<AddIcon />}
      />
    </>
  );
}
