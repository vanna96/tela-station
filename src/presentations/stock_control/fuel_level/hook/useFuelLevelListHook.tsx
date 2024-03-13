import { exportDefaulExcelTemplate } from "@/lib/excel/export_excel";
import { Sheet } from "@/lib/excel/type";
import { QueryOptionAPI } from "@/lib/filter_type";
import { delay, queryOptionParser } from "@/lib/utils";
import request from "@/utilies/request";
import React, { useCallback, useMemo } from "react";
import { useQuery } from "react-query";

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

const keyData = 'fuel-lists';
const keyCount = 'fuel_count';


export const useFuelLevelListHook = (pagination: any) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    const filters = useMemo(() => {
        return { ...state, skip: Number(pagination?.pageIndex) * Number(pagination?.pageSize), top: pagination?.pageSize ?? 10 } as QueryOptionAPI;
    }, [pagination, state])


    const dataQuery = useQuery({ queryKey: [keyData + filters.skip, filters], queryFn: () => request('GET', `/TL_FUEL_LEVEL?${queryOptionParser(filters)}`), refetchOnWindowFocus: false });
    const countQuery = useQuery({
        queryKey: [keyCount + filters.skip, filters], queryFn: () => request('GET', `/TL_FUEL_LEVEL/$count?${queryOptionParser(filters)}`),
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
        const reponse: any = await request('GET', `/TL_FUEL_LEVEL?${queryOptionParser(query)}`);

        const lists: string[][] = [];
        const reponseData: any[] = reponse?.data?.value ?? [] as any[]

        for (const fuelLevel of reponseData) {
            lists.push([fuelLevel.DocNum, fuelLevel.U_tl_doc_date?.split('T')[0], fuelLevel.U_tl_bplid, fuelLevel.Status === 'O' ? "OPEN" : "CLOSED"]);
        }
        // 
        const headers = ['Document No', 'Document Date', 'Branch', 'Status'];
        const sheet: Sheet = {
            filename: 'fuel_level',
            sheetName: 'Fuel Level',
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