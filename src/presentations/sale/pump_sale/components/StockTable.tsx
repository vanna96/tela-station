import React, { useMemo } from "react";
import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table";
import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import MUITextField from "@/components/input/MUITextField";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BankSelect from "@/components/selectbox/bank";
import FormattedInputs from "@/components/input/NumberFormatField";
import Branch from "../../../../models/BranchBPL";

export default function StockTable(props: any) {
  const { data, onChange }: any = props;
  const [rowSelection, setRowSelection] = React.useState<any>({});

  const handlerAddCheck = () => {
    onChange("paymentMeanCheckData", [
      ...(data?.paymentMeanCheckData || []),
      {
        branch: "",
        warehouse: "",
        binCode: "",
        itemCode: "",
        itemName: "",
        uom: "",
        quantity: "",
        remark: "",
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
      accessorKey: "branch",
      header: "Branch",
      Cell: ({ cell }: any) => (
        <MUITextField
          key={"branch" + cell.getValue() + cell?.row?.id}
          type="text"
          disabled={data?.edit}
          defaultValue={cell.row.original?.branch || ""}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              branch: e.target.value,
            });
          }}
        />
      ),
    },
    {
      accessorKey: "warehouse",
      header: "Warehouse",
      Cell: ({ cell }: any) => (
        <MUITextField
          key={"warehouse" + cell.getValue() + cell?.row?.id}
          type="text"
          disabled={data?.edit}
          defaultValue={cell.row.original?.warehouse || ""}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              warehouse: e.target.value,
            });
          }}
        />
      ),
    },
    {
      accessorKey: "binCode",
      header: "Bin Code",
      Cell: ({ cell }: any) => (
        <MUITextField
          key={"binCode" + cell.getValue() + cell?.row?.id}
          type="text"
          disabled={data?.edit}
          defaultValue={cell.row.original?.binCode || ""}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              binCode: e.target.value,
            });
          }}
        />
      ),
    },

    {
      accessorKey: "itemCode",
      header: "Item Code",
      Cell: ({ cell }: any) => (
        <MUITextField
          key={"itemCode" + cell.getValue() + cell?.row?.id}
          type="text"
          disabled={data?.edit}
          defaultValue={cell.row.original?.itemCode || ""}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              itemCode: e.target.value,
            });
          }}
        />
      ),
    },
    {
      accessorKey: "itemName",
      header: "Item Name",
      Cell: ({ cell }: any) => (
        <MUITextField
          key={"itemName" + cell.getValue() + cell?.row?.id}
          type="text"
          disabled={data?.edit}
          defaultValue={cell.row.original?.itemName || ""}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              itemName: e.target.value,
            });
          }}
        />
      ),
    },
    {
      accessorKey: "uom",
      header: "UOM",
      Cell: ({ cell }: any) => (
        <MUITextField
          key={"uom" + cell.getValue() + cell?.row?.id}
          type="text"
          disabled={data?.edit}
          defaultValue={cell.row.original?.uom || ""}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              uom: e.target.value,
            });
          }}
        />
      ),
    },

    {
      accessorKey: "quantity",
      header: "Quantity",
      Cell: ({ cell }: any) => (
        <FormattedInputs
          key={"quantity" + cell.getValue() + cell?.row?.id}
          disabled={data?.edit}
          defaultValue={cell.row.original?.quantity || 0}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              quantity: e.target.value,
            });
          }}
          name={"quantity"}
          value={cell.row.original?.quantity || ""}
        />
      ),
    },
    {
      accessorKey: "remark",
      header: "Remark",
      Cell: ({ cell }: any) => (
        <MUITextField
          key={"remark" + cell.getValue() + cell?.row?.id}
          type="text"
          disabled={data?.edit}
          defaultValue={cell.row.original?.remark || ""}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              remark: e.target.value,
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
