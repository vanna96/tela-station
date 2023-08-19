import React from "react";
import MaterialReactTable from "material-react-table";
import { Button, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment/moment";
//Date Picker Imports
import { useNavigate } from "react-router-dom";
import { UseQueryResult, useQuery } from "react-query";
import WarehouseRepository from "@/services/actions/WarehouseRepository";
import BinlocationRepository from "@/services/actions/BinlocationRepository";
import DataTable from "@/components/data_table/DataTable";

export default function BinlocationLists() {
  const route = useNavigate();

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "absEntry",
        header: "Binlocation Number", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: 'number',
      },
      {
        accessorKey: "warehouse",
        header: "Warehouse",
        enableClickToCopy: true,
        visible: true,
        type: 'string',
      },
      {
        accessorKey: "binCode",
        header: "Bin Code",
        // size: 200, //increase the width of this column
        visible: true,
        type: 'string',
      },
      {
        accessorKey: "inactive",
        header: "Status",
        visible: true,
        type: 'string',

      },
      {
        accessorKey: "id",
        enableFilterMatchHighlighting: false,
        enableColumnFilterModes: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableColumnOrdering: false,
        header: "Action", //uses the default width from defaultColumn prop
        Cell: (cell: any) => (
          <div className="flex gap-4">
            <button onClick={() => {
              route('/master-data/binlocation/' + cell.row.original.id, { state: cell.row.original })
            }}>
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
  const masterCount = useQuery({
    queryKey: ['bl-count'], queryFn: () => new BinlocationRepository().documentTotal(`?$select=AbsEntry${filter}`),
    staleTime: Infinity
  })

  const { data, isLoading, error, isError, refetch, isFetching }: any = useQuery({
    queryKey: ['bl', `${(pagination.pageIndex) * 10}_${filter !== '' ? 'f' : ''}`], queryFn: () => {
      return new BinlocationRepository().get(`?$top=${pagination.pageSize}&$skip=${(pagination.pageIndex) * pagination.pageSize}${filter}${sortBy !== '' ? '&$orderby=' + sortBy : ''}`);
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
      masterCount.refetch();
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
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });

    setTimeout(() => {
      masterCount.refetch();
      refetch();
    }, 500)
  }


  return (
    <>
      <div className="w-full h-full p-4 2xl:py-6 flex flex-col gap-3 relative bg-gray-100">
        <div className="flex px-8 shadow-sm rounded-lg justify-between items-center sticky z-10 top-0 w-full bg-white py-3">
          <h3 className="text-lg 2xl:text-base xl:text-sm">
            Master Data / Binlocation
          </h3>
          <Button
            variant="outlined"
            disableElevation
            size="small"
            onClick={() => route("/master-data/binlocation/create")}
          >
            <span className="text-xs">Create</span>
          </Button>
        </div>

        <div className="grow data-table">
          <DataTable
            columns={columns}
            data={data}
            handlerRefresh={handlerRefresh}
            handlerSearch={handlerSearch}
            handlerSortby={handlerSortby}
            count={masterCount.data ?? 0}
            loading={isLoading || isFetching}
            pagination={pagination}
            paginationChange={setPagination}
          />
        </div>
      </div>
    </>
  );
}
