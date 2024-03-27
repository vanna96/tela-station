import request from "@/utilies/request"
import { useQuery } from "react-query"

const getSeries = async () => {
    const response: any = await request('POST', '/SeriesService_GetDocumentSeries', {
        "DocumentTypeParams": {
            "Document": "TL_TO"
        }
    });


    if (!response?.data) return []

    return response?.data?.value?.filter((e: any) => e.Locked === 'tNO' && e?.PeriodIndicator == new Date().getFullYear().toString());
}

const getDefaultSerie = async () => {
    const response: any = await request('POST', '/SeriesService_GetDefaultSeries', {
        "DocumentTypeParams": {
            "Document": "TL_TO"
        }
    });

    if (response?.code === "ERR_BAD_REQUEST") return undefined

    return { Series: response?.data?.Series, NextNum: response?.data?.NextNumber };
}

export const useGetTOSeriesHook = (getDefault = true) => {
    const series = useQuery({ queryKey: ['to_series'], queryFn: () => getSeries() });
    const defaultSerie = !getDefault ? { data: undefined, isLoading: false } : useQuery({ queryKey: ['to_default_series'], queryFn: () => getDefaultSerie(), retry: 1 });

    return { series, defaultSerie }
}