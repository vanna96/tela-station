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
    onChange("paymentMeanCheckData", [
      ...(data?.paymentMeanCheckData || []),
      {
        due_date: new Date(),
        amount: 0,
        bank: "",
        check_no: "",
      },
    ]);
  };

  const handlerRemoveCheck = () => {
    const rows = Object.keys(rowSelection);
    if (rows.length <= 0) return;
    const newData = data?.paymentMeanCheckData?.filter(
      (item: any, index: number) => !rows.includes(index.toString())
    );
    onChange("paymentMeanCheckData", newData);
    setRowSelection({});
  };

  const handlerChangeItem = (key: number, obj: any) => {
    const newData = data?.paymentMeanCheckData?.map(
      (item: any, index: number) => {
        if (index.toString() !== key.toString()) return item;
        item[Object.keys(obj).toString()] = Object.values(obj).toString();
        return item;
      }
    );
    if (newData.length <= 0) return;
    onChange("paymentMeanCheckData", newData);
  };

  const columns = [
    {
      accessorKey: "due_date",
      header: "Due Date",
      Cell: ({ cell }: any) => (
        <MUIDatePicker
          key={"due_date" + cell.getValue() + cell?.row?.id}
          value={cell.row.original?.due_date || new Date()}
          disabled={data?.edit}
          onChange={(e: any) =>
            handlerChangeItem(cell?.row?.id || 0, {
              due_date: e,
            })
          }
        />
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      Cell: ({ cell }: any) => (
        // <MUITextField
        //   key={"amount" + cell.getValue() + cell?.row?.id}
        //   type="number"
        //   disabled={data?.edit}
        //   defaultValue={cell.row.original?.amount || 0}
        //   onBlur={(e: any) => {
        //     handlerChangeItem(cell?.row?.id || 0, {
        //       amount: e.target.value,
        //     });
        //   }}
        // />
        <FormattedInputs
          key={"amount" + cell.getValue() + cell?.row?.id}
          disabled={data?.edit}
          defaultValue={cell.row.original?.amount || 0}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              amount: e.target.value,
            });
          }}
          name={"amount"}
          value={cell.row.original?.amount || ""}
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
        data={data?.paymentMeanCheckData || []}
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
