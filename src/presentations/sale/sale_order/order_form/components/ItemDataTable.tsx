import { useContext, useEffect, useMemo } from "react";
import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table";
import { numberWithCommas } from "@/helper/helper";
import { FormOrderContext } from "../context/FormOrderContext";

type ItemDataTableProps = {
  data: any;
  rowSelection: any;
  setRowSelection: any;
  editData: any;
};

export const ItemDataTable = ({
  data,
  rowSelection,
  setRowSelection,
  editData,
}: ItemDataTableProps) => {
  const { form }: any = useContext(FormOrderContext);
  const columns = useMemo<MRT_ColumnDef[]>(
    () => [
      {
        accessorKey: "ItemCode",
        header: "Item Code",
      },
      {
        accessorKey: "ItemName",
        header: "Item Name",
      },
      {
        accessorKey: "QuantityOnStock",
        header: "In Stock",
        Cell: (cell: any) => {
          return (
            <>{`${numberWithCommas(
              cell.row.original.QuantityOnStock.toFixed(2)
            )}`}</>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (editData) {
      data?.map((item: any, index: number) => {
        if (item.ItemCode === editData.ItemCode) {
          setRowSelection({
            [index]: true,
          });
        }
        return item;
      });
    } else {
      setRowSelection({
        0.1: true,
      });
    }
  }, []);

  const selectionRow = (row: any) => {
    if (
      form?.items?.some(
        (element: any) => element.ItemCode === row.original.ItemCode
      )
    )
      return;
    if (editData) {
      setRowSelection((prev: any) => ({ [row.id]: !prev[row.id] }));
    } else {
      setRowSelection((prev: any) => ({
        ...prev,
        [row.id]: !prev[row.id],
      }));
    }
  };

  return (
    <MaterialReactTable
      columns={columns}
      data={data || []}
      enableColumnActions={false}
      enableTopToolbar={false}
      enableSelectAll={false}
      muiTableBodyRowProps={({ row }: any) => ({
        hover: true,
        onClick: () => selectionRow(row),
        selected: rowSelection[row.id],
        sx: { cursor: "pointer" },
      })}
      muiSelectCheckboxProps={{ color: "success" }}
      state={{ rowSelection }}
      enableRowSelection={(row: any) =>
        form?.items?.some(
          (element: any) => element.ItemCode === row.original.ItemCode
        )
      }
      muiTablePaperProps={{
        elevation: 0,
        sx: {
          borderRadius: "0",
          border: "1px dashed #e0e0e0",
        },
      }}
    />
  );
};
