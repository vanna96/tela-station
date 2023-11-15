import React, { useMemo } from "react";
import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table";
import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import MUITextField from "@/components/input/MUITextField";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BankSelect from "@/components/selectbox/bank";
import FormattedInputs from "@/components/input/NumberFormatField";

export default function PaymentTable(props: any) {
  const { data, onChange }: any = props;
  const [rowSelection, setRowSelection] = React.useState<any>({});

  const handlerAddCheck = () => {
    onChange("paymentMeanCheckData", [
      ...(data?.paymentMeanCheckData || []),
      {
        pumpCode: "",
        itemMaster: "",
        itemName: "",
        uom: "",
        registerMeeting: "",
        updateMetering: "",
        status: "",
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
      accessorKey: "pumpCode",
      header: "Pump Code",
      Cell: ({ cell }: any) => (
        <MUITextField
          key={"pumpCode" + cell.getValue() + cell?.row?.id}
          type="text"
          disabled={data?.edit}
          defaultValue={cell.row.original?.pumpCode || ""}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              pumpCode: e.target.value,
            });
          }}
        />
      ),
    },
    {
      accessorKey: "itemMaster",
      header: "Item Master",
      Cell: ({ cell }: any) => (
        <MUITextField
          key={"itemMaster" + cell.getValue() + cell?.row?.id}
          type="text"
          disabled={data?.edit}
          defaultValue={cell.row.original?.itemMaster || ""}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              itemMaster: e.target.value,
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
      accessorKey: "registerMeeting",
      header: "Register Meeting",
      Cell: ({ cell }: any) => (
        <FormattedInputs
          key={"registerMeeting" + cell.getValue() + cell?.row?.id}
          disabled={data?.edit}
          defaultValue={cell.row.original?.registerMeeting || 0}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              registerMeeting: e.target.value,
            });
          }}
          name={"registerMeeting"}
          value={cell.row.original?.registerMeeting || ""}
        />
      ),
    },
    {
      accessorKey: "updateMetering",
      header: "Update Metering",
      Cell: ({ cell }: any) => (
        <FormattedInputs
          key={"updateMetering" + cell.getValue() + cell?.row?.id}
          disabled={data?.edit}
          defaultValue={cell.row.original?.updateMetering || 0}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              updateMetering: e.target.value,
            });
          }}
          name={"updateMetering"}
          value={cell.row.original?.updateMetering || ""}
        />
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ cell }: any) => (
        <FormattedInputs
          key={"status" + cell.getValue() + cell?.row?.id}
          disabled={data?.edit}
          defaultValue={cell.row.original?.status || 0}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              status: e.target.value,
            });
          }}
          name={"status"}
          value={cell.row.original?.status || ""}
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
