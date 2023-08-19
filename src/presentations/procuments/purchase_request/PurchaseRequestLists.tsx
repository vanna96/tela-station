import React from "react";
import MaterialReactTable from "material-react-table";
import { Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment/moment";
//Date Picker Imports
import { useNavigate } from "react-router-dom";
import { UseQueryResult, useQuery } from "react-query";
import PurchaseRequestRepository from "@/services/actions/purchaseRequestRepository";
import DataTable from "@/components/data_table/DataTable";

export default function PurchaseRequestLists() {
  const route = useNavigate();
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "DocNum",
        header: "Document Number", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        type: 'number',
        visible: true,
      },
      {
        accessorKey: "CardCode",
        header: "Requester",
        enableClickToCopy: true,
        type: 'string',
        visible: true,
      },
      {
        accessorKey: "CardName",
        header: "Requester Name",
        type: 'string',
        visible: true,
        // size: 200, //increase the width of this column
      },
      {
        accessorKey: "RequesterEmail",
        header: "Email",
        type: 'string',
        visible: true,
        // size: 200, //increase the width of this column
      },
      {
        accessorKey: "DocumentStatus",
        header: "Status",
        type: 'string',
        visible: true,
        // size: 200, //increase the width of this column
      },
      {
        accessorKey: "TaxDate",
        header: "Document Date",
        type: 'date',
        visible: true,
        Cell: ({ cell }: any) => (
          <>{moment(cell.getValue()).format("DD-MM-YYYY")}</>
        ),
      },
      {
        accessorKey: "DocDueDate",
        header: "Valid Date",
        type: 'date',
        visible: true,
        Cell: ({ cell }: any) => <>{moment(cell.getValue()).format("DD-MM-YYYY")}</>,
      },
      {
        accessorKey: "DocTotalSys",
        header: "Total",
        type: 'date',
        visible: true,
        Cell: ({ cell }) => <>{'$ ' + moment(cell.getValue())}</>,
      },
      {
        accessorKey: "Action",
        enableFilterMatchHighlighting: false,
        enableColumnFilterModes: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableColumnOrdering: false,
        header: "Action", //uses the default width from defaultColumn prop
        Cell: (cell: any) => (
          <div className="flex gap-4">
            <button
              onClick={() => {
                route("/procument/purchase-request/" + cell.row.original.DocEntry, {
                  state: cell.row.original,
                });
              }}
            >
              <VisibilityIcon fontSize="small" className="text-gray-600 " />
            </button>
            <button>
              <EditIcon fontSize="small" className="text-blue-400" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const [filter, setFilter] = React.useState('');
  const [sortBy, setSortBy] = React.useState('');
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const purchaseCount = useQuery({
    queryKey: ['pr-count'], queryFn: () => new PurchaseRequestRepository().documentTotal(`?$select=DocNum${filter}`),
    staleTime: Infinity,
  });

  const { data, isLoading, error, isError, refetch, isFetching }: any = useQuery({
    queryKey: ['pr', `${(pagination.pageIndex) * 10}_${filter !== '' ? 'f' : ''}`], queryFn: () => {
      return new PurchaseRequestRepository().get(`?$top=${pagination.pageSize}&$skip=${(pagination.pageIndex) * pagination.pageSize}${filter}${sortBy !== '' ? '&$orderby=' + sortBy : ''}`);
    },
    staleTime: Infinity,
    retry: 1,
  });


  const handlerRefresh = React.useCallback(() => {
    setFilter('');
    setSortBy('');
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
    setTimeout(() => {
      purchaseCount.refetch();
      refetch();
    }, 500);
  }, []);

  const handlerSortby = (value: any) => {
    setSortBy(value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });

    setTimeout(() => {
      refetch();
    }, 500)
  }


  const handlerSearch = (value: string) => {
    setFilter(value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });

    setTimeout(() => {
      purchaseCount.refetch();
      refetch();
    }, 500)
  }


  return (
    <>
      <div className="w-full h-full p-4 2xl:py-6 flex flex-col gap-3 relative bg-gray-100">
        <div className="flex px-8 shadow-sm rounded-lg justify-between items-center sticky z-10 top-0 w-full bg-white py-3">
          <h3 className="text-lg 2xl:text-base xl:text-sm">
            Procument / Purchase Request
          </h3>
          <Button
            variant="outlined"
            disableElevation
            size="small"
            onClick={() => route("/procument/purchase-request/create")}
          >
            <span className="text-xs">Create</span>
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={data}
          handlerRefresh={handlerRefresh}
          handlerSearch={handlerSearch}
          handlerSortby={handlerSortby}
          count={purchaseCount.data ?? 0}
          loading={isLoading || isFetching}
          pagination={pagination}
          paginationChange={setPagination}
        />

        {/* <div className="grow data-table">
          <MaterialReactTable
            columns={columns}
            data={data ?? []}
            enableHiding={true}
            initialState={{ density: "compact" }}
            enableDensityToggle={false}
            enableColumnResizing
            enableStickyHeader={true}
            enableStickyFooter={true}
            enablePagination={true}
            muiTablePaginationProps={{
              rowsPerPageOptions: [5, 10, 15],
            }}
            getRowId={(row: any) => row.DocEntry}
            onPaginationChange={setPagination}
            state={{
              isLoading,
              pagination,
            }}
            renderTopToolbarCustomActions={({ table }) => {
              return (
                <div className="flex gap-2 mb-6 pt-2 justify-center items-center">
                  <h3 className="font-bold text-base xl:text-sm">
                    Purchase Agreement
                  </h3>
                </div>
              );
            }}
          />
        </div> */}
      </div>
    </>
  );
}
