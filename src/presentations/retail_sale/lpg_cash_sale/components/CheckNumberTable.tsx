import React, { useMemo } from "react";
import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table";
import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import MUITextField from "@/components/input/MUITextField";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BankSelect from "@/components/selectbox/bank";
import FormattedInputs from "@/components/input/NumberFormatField";

export default function CheckNumberTable(props: any) {
  const { data, onChange }: any = props;
  const [rowSelection, setRowSelection] = React.useState<any>({});

  const handlerAddCheck = () => {
    onChange("checkNumberData", [
      ...(data?.checkNumberData || []),
      {
        check_no: "",
        check_date: new Date(),
        bank: "",
        check_amount: 0,
      },
    ]);
  };

  const handlerRemoveCheck = () => {
    const rows = Object.keys(rowSelection);
    if (rows.length <= 0) return;
    const newData = data?.checkNumberData?.filter(
      (item: any, index: number) => !rows.includes(index.toString())
    );
    onChange("checkNumberData", newData);
    setRowSelection({});
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
      accessorKey: "check_no",
      header: "Check No.",
      Cell: ({ cell }: any) => (
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
        // <FormattedInputs
        //   key={"check_no" + cell.getValue() + cell?.row?.id}
        //   disabled={data?.edit}
        //   defaultValue={cell.row.original?.check_no || ""}
        //   onBlur={(e: any) => {
        //     handlerChangeItem(cell?.row?.id || 0, {
        //       check_no: e.target.value,
        //     });
        //   }}
        //   name={"check_no"}
        //   value={cell.row.original?.check_no || ""}
        // />
      ),
    },
    {
      accessorKey: "check_date",
      header: "Check Date",
      Cell: ({ cell }: any) => (
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
      ),
    },
    {
      accessorKey: "check_amount",
      header: "Check Amount",
      Cell: ({ cell }: any) => (
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
      ),
    },
    {
      accessorKey: "bank",
      header: "Bank",
      Cell: ({ cell }: any) => (
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
      ),
    },
  ];

  return (
    <>
      <div className="flex space-x-4 text-[25px] justify-end mb-2">
        {!data?.edit && (
          <>
            <AiOutlinePlus
              className="text-blue-700 cursor-pointer"
              onClick={handlerAddCheck}
            />
            <MdDeleteOutline
              className="text-red-500 cursor-pointer"
              onClick={handlerRemoveCheck}
            />
          </>
        )}
        <AiOutlineSetting className="cursor-pointer" />
      </div>
      <MaterialReactTable
        columns={columns}
        data={data?.checkNumberData || []}
        enableStickyHeader={true}
        enableHiding={true}
        enablePinning={true}
        enableSelectAll={true}
        enableMultiRowSelection={true}
        enableColumnActions={false}
        enableColumnFilters={false}
        enablePagination={false}
        enableSorting={false}
        enableBottomToolbar={false}
        enableTopToolbar={false}
        enableColumnResizing={true}
        enableTableFooter={false}
        enableRowSelection
        onRowSelectionChange={setRowSelection}
        initialState={{
          density: "compact",
          rowSelection,
        }}
        state={{
          rowSelection,
        }}
        muiTableProps={{
          sx: { cursor: "pointer", height: "60px" },
        }}
      />
    </>
  );
}
