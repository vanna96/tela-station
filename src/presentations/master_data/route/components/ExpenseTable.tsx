import React, { useMemo } from "react";
import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table";
import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import MUITextField from "@/components/input/MUITextField";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BankSelect from "@/components/selectbox/bank";
import ExpDicSelect from "@/components/selectbox/ExpDic";
import ExpDicAutoComplete from "@/components/input/ExpDicAutoComplete";
import ExpdicRepository from "@/services/actions/ExpDicRepository";

export default function ExpenseTable(
  props: any,
  edit?: boolean,
  detail?: boolean
) {
  const { data, onChange }: any = props;
  const [rowSelection, setRowSelection] = React.useState<any>({});

  const handlerAddCheck = () => {
    onChange("TL_RM_EXPENSCollection", [
      ...(data?.TL_RM_EXPENSCollection || []),
      {
        U_Code: "",
        U_Description: "",
        U_Amount: "",
      },
    ]);
  };

  const handlerRemoveCheck = () => {
    const rows = Object.keys(rowSelection);
    if (rows.length <= 0) return;
    const newData = data?.TL_RM_EXPENSCollection?.filter(
      (item: any, index: number) => !rows.includes(index.toString())
    );
    onChange("TL_RM_EXPENSCollection", newData);
    setRowSelection({});
  };

  const handlerChangeItem = (key: number, obj: any) => {
    const newData = data?.TL_RM_EXPENSCollection?.map(
      (item: any, index: number) => {
        if (index.toString() !== key.toString()) return item;
        item[Object.keys(obj).toString()] = Object.values(obj).toString();
        return item;
      }
    );
    if (newData.length <= 0) return;
    onChange("TL_RM_EXPENSCollection", newData);
  };

  const columns = [
    {
      accessorKey: "U_Code",
      header: (
        <>
          Expense Code<span style={{ color: "red" }}>*</span>
        </>
      ),
      Cell: ({ cell }: any) => (
        <>
          <ExpDicAutoComplete
            key={"U_Code" + cell.getValue() + cell?.row?.id}
            value={cell.row.original?.U_Code || 0}
            disabled={data?.edit}
            onChange={(e: any) => {
              handlerChangeItem(cell?.row?.id || 0, {
                U_Code: e,
              });
              handlerChangeItem(cell?.row?.id || 0, {
                U_Description: new ExpdicRepository().find(e)?.Name,
              });
            }}
          />
        </>
      ),
    },
    {
      accessorKey: "U_Description",
      header: "Description",
      Cell: ({ cell }: any) => (
        <MUITextField
          key={"U_Description" + cell.getValue() + cell?.row?.id}
          disabled={data?.edit}
          defaultValue={cell.row.original?.U_Description || ""}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              U_Description: e.target.value,
            });
          }}
        />
      ),
    },
    {
      accessorKey: "U_Amount",
      header: (
        <>
          Amount<span style={{ color: "red" }}>*</span>
        </>
      ),
      Cell: ({ cell }: any) => (
        <MUITextField
          startAdornment={"USD"}
          key={"U_Amount" + cell.getValue() + cell?.row?.id}
          disabled={data?.edit}
          type="number"
          defaultValue={cell.row.original?.U_Amount || ""}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              U_Amount: e.target.value,
            });
          }}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex text-[25px] justify-end mb-2">
        {!data?.edit && (
          <>
            <span
              onClick={handlerRemoveCheck}
              className="p-1 text-sm hover:shadow-md transition-all duration-300 rounded-md bg-white w-[90px] mt-5 text-center inline-block cursor-pointer border-[1px] shadow-sm"
            >
              Remove
            </span>
          </>
        )}
      </div>
      <MaterialReactTable
        columns={columns}
        data={data?.TL_RM_EXPENSCollection || []}
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
      <span
        onClick={handlerAddCheck}
        className="p-1 text-sm hover:shadow-md transition-all duration-300 rounded-md bg-white w-[90px] mt-5 text-center inline-block cursor-pointer border-[1px] shadow-sm"
      >
         Add
      </span>
    </>
  );
}
