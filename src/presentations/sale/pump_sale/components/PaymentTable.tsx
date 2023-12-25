import React, { useMemo } from "react";
import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table";
import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import MUITextField from "@/components/input/MUITextField";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BankSelect from "@/components/selectbox/bank";
import FormattedInputs from "@/components/input/NumberFormatField";
import FormCard from "@/components/card/FormCard";
import { Button } from "@mui/material";

export default function PaymentTable(props: any) {
  const { data, onChange }: any = props;
  const [rowSelection, setRowSelection] = React.useState<any>({});

  const handlerAddCheck = () => {
    onChange("pumpData", [
      ...(data?.pumpData || []),
      {
        pumpCode: "",
        itemCode: "",
        itemName: "",
        uom: "",
        newMeter: "",
        oldMeter: "",
        consumption: "",
      },
    ]);
  };

  const handlerRemoveCheck = () => {
    const rows = Object.keys(rowSelection);
    if (rows.length <= 0) return;
    const newData = data?.pumpData?.filter(
      (item: any, index: number) => !rows.includes(index.toString())
    );
    onChange("pumpData", newData);
    setRowSelection({});
  };

  const handlerChangeItem = (key: number, obj: any) => {
    const newData = data?.pumpData?.map((item: any, index: number) => {
      if (index.toString() !== key.toString()) return item;
      item[Object.keys(obj).toString()] = Object.values(obj).toString();
      return item;
    });
    if (newData.length <= 0) return;
    onChange("pumpData", newData);
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
      accessorKey: "newMeter",
      header: "New Meter",
      Cell: ({ cell }: any) => (
        <FormattedInputs
          key={"newMeter" + cell.getValue() + cell?.row?.id}
          disabled={data?.edit}
          defaultValue={cell.row.original?.newMeter || 0}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              newMeter: e.target.value,
            });
          }}
          name={"newMeter"}
          value={cell.row.original?.newMeter || ""}
        />
      ),
    },
    {
      accessorKey: "oldMeter",
      header: "Old Meter",
      Cell: ({ cell }: any) => (
        <FormattedInputs
          key={"oldMeter" + cell.getValue() + cell?.row?.id}
          disabled={data?.edit}
          defaultValue={cell.row.original?.oldMeter || 0}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              oldMeter: e.target.value,
            });
          }}
          name={"oldMeter"}
          value={cell.row.original?.oldMeter || ""}
        />
      ),
    },
    {
      accessorKey: "consumption",
      header: "Consumption",
      Cell: ({ cell }: any) => (
        <FormattedInputs
          key={"consumption" + cell.getValue() + cell?.row?.id}
          disabled={data?.edit}
          defaultValue={cell.row.original?.consumption || 0}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              consumption: e.target.value,
            });
          }}
          name={"consumption"}
          value={cell.row.original?.consumption || ""}
        />
      ),
    },
  ];

  // return (
  //   <>
  //     <div className="flex space-x-4 text-[25px] justify-end mb-2">
  //       {!data?.edit && (
  //         <>
  //           <AiOutlinePlus
  //             className="text-blue-700 cursor-pointer"
  //             onClick={handlerAddCheck}
  //           />
  //           <MdDeleteOutline
  //             className="text-red-500 cursor-pointer"
  //             onClick={handlerRemoveCheck}
  //           />
  //         </>
  //       )}
  //       <AiOutlineSetting className="cursor-pointer" />
  //     </div>

  //     <MaterialReactTable
  //       columns={columns}
  //       data={data?.pumpData || []}
  //       enableStickyHeader={true}
  //       enableHiding={true}
  //       enablePinning={true}
  //       enableSelectAll={true}
  //       enableMultiRowSelection={true}
  //       enableColumnActions={false}
  //       enableColumnFilters={false}
  //       enablePagination={false}
  //       enableSorting={false}
  //       enableBottomToolbar={false}
  //       enableTopToolbar={false}
  //       enableColumnResizing={true}
  //       enableTableFooter={false}
  //       enableRowSelection
  //       onRowSelectionChange={setRowSelection}
  //       initialState={{
  //         density: "compact",
  //         rowSelection,
  //       }}
  //       state={{
  //         rowSelection,
  //       }}
  //       muiTableProps={{
  //         sx: { cursor: "pointer", height: "60px" },
  //       }}
  //     />
  //   </>
  // );

  console.log(data.pumpData)
  return (
    <FormCard
      title="Content"
      action={
        <div className="flex ">
          <Button size="small" disabled={props?.data?.isStatusClose || false}>
            <span className="capitalize text-sm" onClick={handlerRemoveCheck}>
              Remove
            </span>
          </Button>
          <Button size="small" disabled={props?.data?.isStatusClose || false}>
            <span className="capitalize text-sm" onClick={handlerAddCheck}>
              Add
            </span>
          </Button>
          {/* <IconButton onClick={() => columnRef.current?.onOpen()}>
            <TbSettings className="text-2lg" />
          </IconButton> */}
        </div>
      }
    >
      <>
        <div className="col-span-2 data-table">
          <MaterialReactTable
            columns={columns}
            data={data?.pumpData || []}
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
        </div>
      </>
    </FormCard>
  );
}
