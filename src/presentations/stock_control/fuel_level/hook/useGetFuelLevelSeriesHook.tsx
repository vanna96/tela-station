import request from "@/utilies/request"
import { useQuery } from "react-query"

const getSeries = async () => {
    const response: any = await request('POST', '/SeriesService_GetDocumentSeries', {
        "DocumentTypeParams": {
            "Document": "TL_FUEL_LEVEL"
        }
    });


    if (!response?.data) return []

    return response?.data?.value?.filter((e: any) => e.Locked === 'tNO');
}

const getDefaultSerie = async () => {
    const response: any = await request('POST', '/SeriesService_GetDefaultSeries', {
        "DocumentTypeParams": {
            "Document": "TL_FUEL_LEVEL"
        }
    });

    if (response?.code === "ERR_BAD_REQUEST") return undefined

    return { Series: response?.data?.Series, NextNum: response?.data?.NextNumber };
}

export const useGetFuelLevelSeriesHook = () => {

    const series = useQuery({ queryKey: ['fuel_level_series'], queryFn: () => getSeries() });
    const defaultSerie = useQuery({ queryKey: ['fuel_level_default_series'], queryFn: () => getDefaultSerie(), retry: 1 });

    return { series, defaultSerie }
}