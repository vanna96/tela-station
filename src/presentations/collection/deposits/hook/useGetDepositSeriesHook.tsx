import request from "@/utilies/request"
import { useQuery } from "react-query"

const getSeries = async () => {
    const response: any = await request('POST', '/SeriesService_GetDocumentSeries', {
        "DocumentTypeParams": {
            "Document": "25"
        }
    });


    if (!response?.data) return []

    return response?.data?.value?.filter((e: any) => e.Locked === 'tNO');
}

const getDefaultSerie = async () => {
    const response: any = await request('POST', '/SeriesService_GetDefaultSeries', {
        "DocumentTypeParams": {
            "Document": "25"
        }
    });

    if (response?.code === "ERR_BAD_REQUEST") return undefined

    return { Series: response?.data?.Series, NextNumber: response?.data?.NextNumber };
}

export const useGetDepositSeriesHook = () => {

    const series = useQuery({ queryKey: ['deposit_serie'], queryFn: () => getSeries() });
    const defaultSerie = useQuery({ queryKey: ['def_serie'], queryFn: () => getDefaultSerie(), retry: 1 });

    return { series, defaultSerie }
}