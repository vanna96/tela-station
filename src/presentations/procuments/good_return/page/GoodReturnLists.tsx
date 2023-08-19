import React from "react";
import { Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import GoodReturnRepository from "@/services/actions/goodReturnRepository";
import { dateFormat } from "@/utilies";
import ErrorDialogMessage from "@/components/dialog/ErrorDialogMessage";
import DataTable from "@/components/data_table/DataTable";


export default function GoodReturnLists() {
  const route = useNavigate();
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "DocNum",
        header: "Doc Num", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: 'number',
      },
      {
        accessorKey: "CardCode",
        header: "Vendor Code",
        enableClickToCopy: true,
        visible: true,
        type: 'string',
      },

      {
        accessorKey: "CardName",
        header: "Vender Name",
        visible: true,
        type: 'string',
      },
      {
        accessorKey: "DocumentStatus",
        header: "Status",
        visible: true,
        type: 'string',
        Cell: ({ cell }: any) => (
          <>
            {(cell.getValue())?.replace("bost_","")}
          </>
        ),
      },
      // {
      //   accessorKey: "DocumentType",
      //   header: "Doc. Type",
      //   visible: false,
      //   type: 'string',
      // },
      {
        accessorKey: "DocDate",
        header: "Posting Date ",
        enableClickToCopy: true,
        visible: true,
        type: 'date',
        Cell: ({ cell }: any) => (
          <>
            {dateFormat(cell.getValue())}
          </>
        ),
      },
      {
        accessorKey: "DocDueDate",
        header: "Return Date ",
        enableClickToCopy: true,
        visible: true,
        type: 'date',
        Cell: ({ cell }: any) => (
          <>
            {dateFormat(cell.getValue())}
          </>
        ),
      },

      

      {
        accessorKey: "DocEntry",
        enableFilterMatchHighlighting: false,
        enableColumnFilterModes: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableColumnOrdering: false,
        enableSorting: false,
        minSize: 100, //min size enforced during resizing
        maxSize: 100, //max size enforced during resizing
        header: "Action", //uses the default width from defaultColumn prop
        Cell: (cell: any) => (
          <div className="flex gap-4">
            <button onClick={() => {
              route('/procument/good-return-request/' + cell.row.original.DocEntry, { state: cell.row.original, replace: true })
            }}>
              <VisibilityIcon fontSize="small" className="text-gray-600 " />
            </button>
            <button title="back"
              onClick={() => route('/procument/good-return-request/' + cell.row.original.DocEntry + '/edit', { state: cell.row.original, replace: true })}
            >
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
    queryKey: ['gr-count'], queryFn: () => new GoodReturnRepository().documentTotal(`?$select=DocNum${filter}`),
    staleTime: Infinity,
  });

  const { data, isLoading, error, isError, refetch, isFetching }: any = useQuery({
    queryKey: ['gr', `${(pagination.pageIndex) * 10}_${filter !== '' ? 'f' : ''}`], queryFn: () => {
      return new GoodReturnRepository().get(`?$top=${pagination.pageSize}&$skip=${(pagination.pageIndex) * pagination.pageSize}${filter}${sortBy !== '' ? '&$orderby=' + sortBy : ''}`);
    },
    staleTime: Infinity,
    retry: 1,
  });

  const queryFn = () => {
    return new GoodReturnRepository().get(`?$top=${pagination.pageSize}&$skip=${(pagination.pageIndex) * pagination.pageSize}${filter}${sortBy !== '' ? '&$orderby=' + sortBy : ''}`);
  };
  
  console.log(queryFn); // Log the queryFn


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
    const qurey = value.replace('CardCode', 'BPCode').replace('CardName', 'BPName');
    setFilter(qurey);
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
      <ErrorDialogMessage key={error?.message} open={isError} title="Opp Something wrong!" message={error?.message ?? ''} />
      <div className="w-full h-full p-4 2xl:py-6 flex flex-col gap-3 relative bg-gray-100">
        <div className="flex px-8 shadow-sm rounded-lg justify-between items-center sticky z-10 top-0 w-full bg-white py-3">
          <h3 className="text-lg 2xl:text-base xl:text-sm">Procument / Good Return</h3>
          <Button variant="outlined" disableElevation size="small"
            onClick={() => route('/procument/good-return-request/create')}
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
      </div >
    </>
  );
}



