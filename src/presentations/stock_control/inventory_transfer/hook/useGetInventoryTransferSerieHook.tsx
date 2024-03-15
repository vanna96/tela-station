import request from "@/utilies/request"
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

    return response?.data?.Series;
}

export const useGetInventoryTransferSeriesHook = () => {

    const series = useQuery({ queryKey: ['it_series'], queryFn: () => getSeries() });
    const defaultSerie = useQuery({ queryKey: ['it_default_series'], queryFn: () => getDefaultSerie(), retry: 1 });

    return { series, defaultSerie }
}