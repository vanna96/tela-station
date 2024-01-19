import React, { useMemo } from "react";
import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table";
import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import MUITextField from "@/components/input/MUITextField";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BankSelect from "@/components/selectbox/bank";
import FormattedInputs from "@/components/input/NumberFormatField";
import MUISelect from "@/components/selectbox/MUISelect";

export default function CashBankTable(props: any) {
  const { data, onChange }: any = props;
  const [rowSelection, setRowSelection] = React.useState<any>({});

  const handlerAddCheck = () => {
    onChange("cashBankData", [
      ...(data?.cashBankData || []),
      {
        type: "cash" || "bank",
        currency: "USD",
        amount: 0,
      },
    ]);
  };

  const handlerRemoveCheck = () => {
    const rows = Object.keys(rowSelection);
    if (rows.length <= 0) return;
    const newData = data?.cashBankData?.filter(
      (item: any, index: number) => !rows.includes(index.toString())
    );
    onChange("cashBankData", newData);
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

  const columns = [
    {
      accessorKey: "type",
      header: "Type",
      Cell: ({ cell }: any) => (
        <MUISelect
          key={"type" + cell.getValue() + cell?.row?.id}
          value={cell.row.original?.type || ""}
          disabled={data?.edit}
          onChange={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              bank: e.target.value,
            });
          }}
          items={[
            { value: "cash", label: "Cash" },
            { value: "bank", label: "Bank" },
          ]}
        />
      ),
    },
    {
      accessorKey: "currency",
      header: "Currency",
      Cell: ({ cell }: any) => (
        <MUITextField
          key={"currency" + cell.getValue() + cell?.row?.id}
          disabled={data?.edit}
          defaultValue={cell.row.original?.currency || 0}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              currency: e.target.value,
            });
          }}
        />
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      Cell: ({ cell }: any) => (
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
        data={data?.cashBankData || []}
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
