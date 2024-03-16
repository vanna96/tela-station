import request from "@/utilies/request";
import { useQuery } from "react-query";

const getSeries = async () => {
  const response: any = await request(
    "POST",
    "/SeriesService_GetDocumentSeries",
    {
      DocumentTypeParams: {
        Document: "59",
      },
    }
  );

  if (!response?.data) return [];

  return response?.data?.value?.filter((e: any) => e.Locked === "tNO");
};

const getDefaultSerie = async () => {
  const response: any = await request(
    "POST",
    "/SeriesService_GetDefaultSeries",
    {
      DocumentTypeParams: {
        Document: "59",
      },
    }
  );

  if (response?.code === "ERR_BAD_REQUEST") return undefined;

  return response?.data
};

export const useGetReceiptSeriesHook = () => {
  const series = useQuery({
    queryKey: ["goods_receipt_series"],
    queryFn: () => getSeries(),
  });
  const defaultSerie = useQuery({
    queryKey: ["goods_receipt_default_series"],
    queryFn: () => getDefaultSerie(),
    retry: 1,
    cacheTime:0
  });

  return { series, defaultSerie };
};
