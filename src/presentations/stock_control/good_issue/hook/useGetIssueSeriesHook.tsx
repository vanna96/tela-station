import request from "@/utilies/request";
import { useQuery } from "react-query";

const getSeries = async () => {
  const response: any = await request(
    "POST",
    "/SeriesService_GetDocumentSeries",
    {
      DocumentTypeParams: {
        Document: "60",
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
        Document: "60",
      },
    }
  );

  if (response?.code === "ERR_BAD_REQUEST") return undefined;

  return response?.data?.Series;
};

export const useGetIssueSeriesHook = () => {
  const series = useQuery({
    queryKey: ["goods_issue_series"],
    queryFn: () => getSeries(),
  });
  const defaultSerie = useQuery({
    queryKey: ["goods_issue_default_series"],
    queryFn: () => getDefaultSerie(),
    retry: 1,
  });

  return { series, defaultSerie };
};
