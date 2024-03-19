import request from "@/utilies/request"
import { useEffect } from "react";
import { useQuery } from "react-query"

const getSeries = async () => {
    const response: any = await request('POST', '/SeriesService_GetDocumentSeries', {
        "DocumentTypeParams": {
            "Document": "67"
        }
    });


    if (!response?.data) return []

    return response?.data?.value?.filter((e: any) => e.Locked === 'tNO');
}

const getDefaultSerie = async () => {
    const response: any = await request('POST', '/SeriesService_GetDefaultSeries', {
        "DocumentTypeParams": {
            "Document": "67"
        }
    });

    if (response?.code === "ERR_BAD_REQUEST") return undefined

    return { Series: response?.data?.Series, NextNumber: response?.data?.NextNumber };
}

export const useGetStockTransferSeriesHook = () => {

    const series = useQuery({ queryKey: ['itr_series'], queryFn: () => getSeries() });
    const defaultSerie = useQuery({ queryKey: ['itr_default_series'], queryFn: () => getDefaultSerie(), retry: 1 });


    return { series, defaultSerie }
}