import React from "react";
import { Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import PurchaseAgreementRepository from '../../../services/actions/purchaseAgreementRepository';
import { dateFormat } from "@/utilies";
import ErrorDialogMessage from "@/components/dialog/ErrorDialogMessage";
import DataTable from "@/components/data_table/DataTable";


export default function PurchaseAgreementLists() {
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
                accessorKey: "StartDate",
                header: "Start Date",
                type: 'date',
                visible: true,
                enableClickToCopy: true,
                Cell: ({ cell }: any) => {
                    return (
                        <>
                            {dateFormat(cell.getValue())}
                        </>
                    );
                },
            },
            {
                accessorKey: "EndDate",
                header: "End Date",
                type: 'date',
                visible: true,
                Cell: ({ cell }: any) => (
                    <>
                        {dateFormat(cell.getValue())}
                    </>
                ),

            },

            {
                accessorKey: "SigningDate",
                header: "Signing Date",
                type: 'date',
                visible: false,
                Cell: ({ cell }: any) => (
                    <>
                        {dateFormat(cell.getValue())}
                    </>
                ),

            },

            {
                accessorKey: "TerminationDate",
                header: "Termination Date",
                type: 'date',
                visible: false,
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
                            route('/procument/purchase-agreement/' + cell.row.original.DocEntry, { state: cell.row.original, replace: true })
                        }}>
                            <VisibilityIcon fontSize="small" className="text-gray-600 " />
                        </button>
                        <button title="back"
                            onClick={() => route('/procument/purchase-agreement/' + cell.row.original.DocEntry + '/edit', { state: cell.row.original, replace: true })}
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
        queryKey: ['pa-count' + filter !== '' ? '-f' : ''], queryFn: () => new PurchaseAgreementRepository().documentTotal(`?$select=DocNum${filter}`),
        staleTime: Infinity,
    });

    const { data, isLoading, error, isError, refetch, isFetching }: any = useQuery({
        queryKey: ['pa', `${(pagination.pageIndex) * 10}_${filter !== '' ? 'f' : ''}`], queryFn: () => {
            return new PurchaseAgreementRepository().get(`?$top=${pagination.pageSize}&$skip=${(pagination.pageIndex) * pagination.pageSize}${filter}${sortBy !== '' ? '&$orderby=' + sortBy : ''}`);
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
            {/* <ErrorDialogMessage key={error?.message} open={isError} title="Opp Something wrong!" message={error?.message ?? ''} /> */}
            <div className="w-full h-full px-6 py-2 flex flex-col gap-1 relative ">
                <div className="flex px-2  rounded-lg justify-between items-center sticky z-10 top-0 w-full  py-2">
                    <h3 className="text-base 2xl:text-base xl:text-base ">Procument / Blanked Purchase Agreement</h3>
                    <Button variant="contained" disableElevation size="small"
                        onClick={() => route('/procument/purchase-agreement/create')}
                    >
                        <span className="text-sm capitalize text-white px-3">Create</span>
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



