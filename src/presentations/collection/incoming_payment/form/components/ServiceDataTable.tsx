import { useContext, useEffect, useMemo } from "react";
import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table";
import { FormOrderContext } from "../context/FormOrderContext";

type ServiceDataTableProps = {
  data: any;
  rowSelection: any;
  setRowSelection: any;
  editData: any;
};

export const ServiceDataTable = ({
  data,
  rowSelection,
  setRowSelection,
  editData,
}: ServiceDataTableProps) => {
  const { formContent }: any = useContext(FormOrderContext);
  const columns = useMemo<MRT_ColumnDef[]>(
    () => [
      {
        accessorKey: "Code",
        header: "Account Number",
      },
      {
        accessorKey: "Name",
        header: "Account Name",
      },
      {
        accessorKey: "Balance",
        header: "Account Balance",
      },
      {
        accessorKey: "AccountType",
        header: "Account Category",
        Cell: (cell: any) => {
          switch (cell.row.original.AccountType) {
            case "at_Other":
              return "Other";
            case "at_Revenues":
              return "Sales";
            default:
              return "Expenditure";
          }
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (editData) {
      data?.map((item: any, index: number) => {
        if (item.Code === editData.Code) {
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
      formContent?.items?.some(
        (element: any) => element.Code === row.original.Code
      )
    )
      return;
    setRowSelection((prev: any) => ({ [row.id]: !prev[row.id] }));
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
      state={{ rowSelection }}
      enableRowSelection={(row: any) =>
        formContent?.items?.some(
          (element: any) => element.Code === row.original.Code
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
