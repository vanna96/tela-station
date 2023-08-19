import React from "react";
import MaterialReactTable from "material-react-table";
import { Button, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment/moment";
//Date Picker Imports
import { useNavigate } from "react-router-dom";
import { useQueryHook } from '../../../utilies/useQueryHook';
import { UseQueryResult, useQuery } from "react-query";
import PurchaseDownPaymentRepository from "@/services/actions/DownPaymentRequestRepository";
import DataTable from "@/components/data_table/DataTable";



export default function PurchaseDownPaymentList() {
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
        header: "Vendor Name",
        // size: 200, //increase the width of this column
        visible: true,
        type: 'string',
      },
      {
        accessorKey: "DocumentStatus",
        header: "Status", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: false,
        type: 'string',
        Cell: ({ cell }: any) => (
          <>
            {cell.getValue()?.replace('bost_', '')}
          </>
        ),
      },
      {
        accessorKey: "DocType",
        header: "Document Type", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: false,
        type: 'string',
        Cell: ({ cell }: any) => (
          <>
            {cell.getValue()?.replace('dDocument_', '')}
          </>
        ),
      },
      {
        accessorKey: "DocDate",
        header: "Posting Date",
        Cell: ({ cell }: any) => (
          <>
            {moment(cell.getValue()).format('DD-MM-YYYY')}
          </>
        ),
        visible: true,
        type: 'string',
      },
      {
        accessorKey: "DocDueDate",
        header: "Delivery Date",
        Cell: ({ cell }: any) => (
          <>
            {moment(cell.getValue()).format('DD-MM-YYYY')}
          </>
        ),
        visible: true,
        type: 'string',

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
              route('/procument/purchase-down-payment/' + cell.row.original.DocEntry, { state: cell.row.original, replace: true })
            }}>
              <VisibilityIcon fontSize="small" className="text-gray-600 " />
            </button>
            <button title="back"
              onClick={() => route('/procument/purchase-down-payment/' + cell.row.original.DocEntry + '/edit', { state: cell.row.original, replace: true })}
            >
              <EditIcon fontSize="small" className="text-blue-400" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filter, setFilter] = React.useState('');
  const [sortBy, setSortBy] = React.useState('');

  const purchaseCount = useQuery({
    queryKey: ['pq-count'], queryFn: () => new PurchaseDownPaymentRepository().documentTotal(`?$select=DocNum${filter}`),
    staleTime: Infinity,
  });
  const { data, isLoading, error, isError, refetch, isFetching }: any = useQuery({
    queryKey: ['pq', `${(pagination.pageIndex) * 10}_${filter !== '' ? 'f' : ''}`], queryFn: () => {
      return new PurchaseDownPaymentRepository().get(`?$top=${pagination.pageSize}&$skip=${(pagination.pageIndex) * pagination.pageSize}${filter}${sortBy !== '' ? '&$orderby=' + sortBy : ''}`);
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
      <div className="w-full h-full p-4 2xl:py-6 flex flex-col gap-3 relative bg-gray-100">
        <div className="flex px-8 shadow-sm rounded-lg justify-between items-center sticky z-10 top-0 w-full bg-white py-3">
          <h3 className="text-lg 2xl:text-base xl:text-sm">Procument / Purchase DownPayment</h3>
          <Button variant="outlined" disableElevation size="small"
            onClick={() => route('/procument/purchase-down-payment/create')}
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
            count={purchaseCount.data ?? 0}
            loading={isLoading || isFetching}
            pagination={pagination}
            paginationChange={setPagination}
          />
        </div>
      </div>
    </>
  );
}