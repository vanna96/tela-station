import { exportDefaulExcelTemplate } from "@/lib/excel/export_excel";
import { Sheet } from "@/lib/excel/type";
import { QueryOptionAPI } from "@/lib/filter_type";
import { queryOptionParser } from "@/lib/utils";
import request from "@/utilies/request";
import React, { useCallback, useMemo } from "react";
import { useQuery } from "react-query";


export type TransferType = 'internal' | 'external';

const defaultQuery: QueryOptionAPI = { skip: 0, top: 10, orderby: 'DocEntry desc' } as const;

const initialState = { ...defaultQuery };

type ActionQueryParam = {
    type: keyof QueryOptionAPI | 'all',
    value?: string | number | QueryOptionAPI,
};

function reducer(state: QueryOptionAPI, action: ActionQueryParam) {
    switch (action.type) {
        case 'skip':
            return { ...state, skip: action.value } as QueryOptionAPI;
        case 'orderby':
            return { ...state, orderby: action.value } as QueryOptionAPI;
        case 'filter':
            return { ...state, filter: action.value } as QueryOptionAPI;
        case 'top':
            return { ...state, top: action.value } as QueryOptionAPI;
        case 'all':
            return { ...action.value as QueryOptionAPI } as QueryOptionAPI;
        default:
            return state;
    }
}

const keyData = 'inventory-transfer-lists';
const keyCount = 'inventory-transfer-count';


export const useInventoryTransferListHook = (pagination: any) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    const filters = useMemo(() => {
        return { ...state, skip: Number(pagination?.pageIndex) * Number(pagination?.pageSize), top: pagination?.pageSize ?? 10 } as QueryOptionAPI;
    }, [pagination, state])


    const dataQuery = useQuery({ queryKey: [keyData + filters.skip, filters], queryFn: () => request('GET', `/StockTransfers?${queryOptionParser(filters)}`), refetchOnWindowFocus: false });
    const countQuery = useQuery({
        queryKey: [keyCount + filters.skip, filters], queryFn: () => request('GET', `/StockTransfers/$count?${queryOptionParser(filters)}`),
        refetchOnWindowFocus: false
    });

    const data: any[] = React.useMemo(() => (dataQuery?.data as any)?.data?.value ?? [], [dataQuery])
    const totalRecords: number = React.useMemo(() => (countQuery?.data as any)?.data ?? 0, [countQuery]);

    const refetchData = async () => {
        dispatch({ type: 'all', value: defaultQuery })
        dataQuery.refetch();
        countQuery.refetch();
    }

    const setFilter = (value: string) => {
        console.log(value)
        dispatch({ type: 'filter', value })
    }

    const setSort = (value: string) => {
        dispatch({ type: 'orderby', value })
    }

    const loading: boolean = React.useMemo(() => {
        return dataQuery.isFetching || countQuery.isFetching;
    }, [dataQuery.isFetching, countQuery.isFetching])

    const exportExcelTemplate = useCallback(async () => {
        const query = { ...state } as QueryOptionAPI;

        delete query.top;
        delete query.skip;
        // 
        const reponse: any = await request('GET', `/StockTransfers?${queryOptionParser(query)}`);

        const lists: string[][] = [];
        const reponseData: any[] = reponse?.data?.value ?? [] as any[]

        for (const inventoryTransferRequest of reponseData) {
            lists.push([
                inventoryTransferRequest.DocNum,
                inventoryTransferRequest.DocDate?.split('T')[0],
                inventoryTransferRequest.BPLName,
                inventoryTransferRequest.FromWarehouse,
                inventoryTransferRequest.ToWarehouse,
                inventoryTransferRequest.DocumentStatus === 'bost_Open' ? "OPEN" : "CLOSED"
            ]);
        }
        // 
        const headers = ['Document No', 'Document Date', 'Branch', 'From Warehouses', 'To Warehouses', 'Status'];
        const sheet: Sheet = {
            filename: 'Inventory Transfers',
            sheetName: 'Inventory Transfers',
            header: {
                value: headers.map((e) => ({ value: e })),
                startCol: 1,
                startRow: 7,
            },
            body: {
                value: lists
            }
        };
        await exportDefaulExcelTemplate(sheet);
        // setLoadingDialog(false);
    }, [state])


    return {
        data,
        totalRecords,
        loading,
        state,
        setFilter,
        setSort,
        exportExcelTemplate,
        refetchData
    }
}