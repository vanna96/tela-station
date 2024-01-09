import { useContext, useEffect, useMemo, useState } from "react";
import MaterialReactTable, {
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
} from "material-react-table";
import { numberWithCommas } from "@/helper/helper";
import { GeneralContact } from "../context/GeneralFormContext";

type CustomerDataTableProps = {
  data: any;
  setChoose: any;
};

export const CustomerDataTable = ({
  data,
  setChoose,
}: CustomerDataTableProps) => {
  const { customer }: any = useContext(GeneralContact);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const columns = useMemo<MRT_ColumnDef[]>(
    () => [
      {
        accessorKey: "CardCode",
        header: "BP Code",
      },
      {
        accessorKey: "CardName",
        header: "BP Name",
      },
      {
        accessorKey: "Currency",
        header: "Balance",
        Cell: (cell: any) => {
          return (
            <>{` ${cell.row.original.Currency} ${numberWithCommas(
              cell.row.original.CurrentAccountBalance
            )}`}</>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (customer) {
      data?.map((item: any, index: number) => {
        if (item.CardCode === customer) {
          setRowSelection({
            [index]: true,
          });
        }
        return item;
      });
    }
  }, []);

  return (
    <MaterialReactTable
      columns={columns}
      data={data || []}
      enableColumnActions={false}
      enableTopToolbar={false}
      muiTableBodyRowProps={({ row }: any) => ({
        hover: true,
        onClick: () => {
          setRowSelection((prev) => ({
            [row.id]: !prev[row.id],
          }));
          setChoose(row);
        },
        selected: rowSelection[row.id],
        sx: { cursor: "pointer" },
      })}
      state={{ rowSelection }}
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
