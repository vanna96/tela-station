import { useMemo, useState } from "react";
import MaterialReactTable, {
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_SortingState,
} from "material-react-table";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import {
  DetailButton,
  EditButton,
} from "../incoming_payment/components/Button";
import IncomingPaymentRepository from "@/services/actions/IncomingPaymentRepository";

export const DataTable = () => {
  const route = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([
    { id: "DocEntry", desc: false },
  ]);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: totalOrder } = useQuery({
    queryKey: ["total_order", globalFilter],
    queryFn: async () => {
      let params = {};
      if (globalFilter) {
        params = {
          $filter: `contains(CardName , '${globalFilter}') or contains(CardCode, '${globalFilter}')`,
        };
      }
      return new IncomingPaymentRepository().getCount({ params });
    },
  });

  const { data, isError, isFetching, isLoading, refetch }: any = useQuery({
    queryKey: [
      "sales_order",
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: async () => {
      let params: any = {
        $top: pagination.pageSize,
        $skip: pagination.pageIndex * pagination.pageSize,
      };

      if (globalFilter) {
        params = {
          ...params,
          $filter: `contains(CardName , '${globalFilter}') or contains(CardCode, '${globalFilter}')`,
        };
      }

      if (sorting.length) {
        params = {
          ...params,
          $orderby: `${sorting[0].id} ${sorting[0].desc ? "desc" : "asc"}`,
        };
      }
      return new IncomingPaymentRepository().get({ params });
    },
    keepPreviousData: true,
  });

  const columns = useMemo<MRT_ColumnDef[]>(
    () => [
      {
        accessorKey: "DocEntry",
        header: "Doc.Entry",
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        enableColumnActions: false,
      },
      {
        accessorKey: "DocNum",
        header: "DocNo.",
        enableColumnActions: false,
      },
      {
        accessorKey: "CardCode",
        header: "Customer Code",
        enableColumnActions: false,
      },
      {
        accessorKey: "CardName",
        header: "Customer Name",
        enableColumnActions: false,
      },
      {
        accessorKey: "DocDate",
        header: "Document Date",
        enableColumnActions: false,
      },
      // {
      //   accessorKey: "DocDueDate",
      //   header: "Document Due Date",
      //   enableColumnActions: false,
      // },
      // {
      //   accessorKey: "DocTotal",
      //   header: "Total",
      //   enableColumnActions: false,
      // },
      {
        accessorKey: "id",
        enableFilterMatchHighlighting: false,
        enableColumnFilterModes: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableColumnOrdering: false,
        header: "Action",
        size: 100,
        Cell: (cell: any) => {
          let id = cell.row.original.key;
          return (
            <div className="flex space-x-2 justify-center items-center">
              <DetailButton
                handleShowDetail={() =>
                  route(`/banking/incoming-payments/${id}`)
                }
              />
              <EditButton
                handleShowDetail={() =>
                  route(`/banking/incoming-payments/${id}/edit`)
                }
              />
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={data || []} //data is undefined on first render
      initialState={{ showColumnFilters: true }}
      enableColumnFilters={false}
      enableFullScreenToggle={false}
      manualFiltering
      manualPagination
      manualSorting
      muiToolbarAlertBannerProps={
        isError
          ? {
              color: "error",
              children: "Error loading data",
            }
          : undefined
      }
      enableDensityToggle={false}
      enableColumnResizing
      onGlobalFilterChange={setGlobalFilter}
      onPaginationChange={setPagination}
      onSortingChange={setSorting}
      renderTopToolbarCustomActions={() => (
        <>
          <div className="flex gap-2 mb-6 pt-2 justify-center items-center">
            <h3 className="font-bold text-base xl:text-sm">
              Incoming Payments
            </h3>
            <Tooltip arrow title="Refresh Data">
              <IconButton onClick={() => refetch()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </div>
        </>
      )}
      rowCount={totalOrder || 0}
      state={{
        globalFilter,
        isLoading,
        pagination,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        sorting,
      }}
    />
  );
};
