import React from "react";
import MaterialReactTable from "material-react-table";
import { Button, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment/moment";
//Date Picker Imports
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import PurchaseOrderRepository from "./repository";
import DataTable from "@/components/data_table/DataTable";


export default function PurchaseOrderLists() {
    const route = useNavigate();

    const columns = React.useMemo(
        () => [
            {
                accessorKey: "DocNum",
                header: "Doc Num",
                enableClickToCopy: true,
                enableFilterMatchHighlighting: true,
                size: 88,
                type: 'number',
                visible: true,
            },
            {
                accessorKey: "CardCode",
                header: "Vendor Code",
                type: 'string',
                visible: true,
            },
            {
                accessorKey: "CardName",
                header: "Vendor Name",
                type: 'string',
                visible: true,

            },
            {
                accessorKey: "DocumentStatus",
                header: "Status",
                type: 'string',
                visible: true,
                Cell: ({ cell }: any) => (
                    <>
                        {cell.getValue()?.replace('bost_', '')}
                    </>
                ),
            },
            {
                accessorKey: "DocType",
                header: "Document Type",
                type: 'string',
                visible: false,
                Cell: ({ cell }: any) => (
                    <>
                        {cell.getValue()?.replace('bost_', '')}
                    </>
                ),
            },
            {
                accessorKey: "DocDate",
                header: "Posting Date",
                type: 'date',
                visible: true,
                Cell: ({ cell }: any) => (
                    <>
                        {moment(cell.getValue()).format('DD-MM-YYYY')}
                    </>
                ),
            },
            {
                accessorKey: "DocDueDate",
                header: "Delivery  Date",
                type: 'date',
                visible: true,
                Cell: ({ cell }: any) => (
                    <>
                        {moment(cell.getValue()).format('DD-MM-YYYY')}
                    </>
                ),
            },
            {
                accessorKey: "Action",
                enableFilterMatchHighlighting: false,
                enableColumnFilterModes: false,
                enableColumnActions: false,
                enableColumnFilters: false,
                enableColumnOrdering: false,
                header: "Action", //uses the default .DocEntryth from defaultColumn prop
                Cell: (cell: any) => (
                    <div className="flex gap-4">
                        <button onClick={() => {
                            route('/procument/purchase-order/' + cell.row.original.DocEntry, { state: cell.row.original })
                        }}>
                            <VisibilityIcon fontSize="small" className="text-gray-600 " />
                        </button>
                        <button title="back" onClick={() => {
                            route('/procument/purchase-order/' + cell.row.original.DocEntry + '/edit', { state: cell.row.original })
                        }}>
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
        queryKey: ['pa-count'], queryFn: () => new PurchaseOrderRepository().documentTotal(`?$select=DocNum${filter}`),
        staleTime: Infinity,
    });

    const { data, isLoading, error, isError, refetch, isFetching }: any = useQuery({
        queryKey: ['pa', `${(pagination.pageIndex) * 10}_${filter !== '' ? 'f' : ''}`], queryFn: () => {
            return new PurchaseOrderRepository().get(`?$top=${pagination.pageSize}&$skip=${(pagination.pageIndex) * pagination.pageSize}${filter}${sortBy !== '' ? '&$orderby=' + sortBy : ''}`);
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
                    <h3 className="text-lg 2xl:text-base xl:text-sm">Procument / Purchase Order</h3>
                    <Button variant="outlined" disableElevation size="small"
                        onClick={() => route('/procument/purchase-order/create')}
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
            </div>
        </>
    );
}
