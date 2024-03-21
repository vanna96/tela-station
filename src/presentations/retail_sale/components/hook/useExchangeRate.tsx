import { formatDate } from "@/helper/helper";
import request from "@/utilies/request";
import { useMemo } from "react";
import { useQuery } from "react-query";

export const useExchangeRate = (handleChange: any) => {
  const date = useMemo(() => formatDate(new Date(), ""), [new Date()]);
  const { data } = useQuery({
    queryKey: [`date_${date}`],
    queryFn: async () => {
      const res: any = await request("POST", "/SBOBobService_GetCurrencyRate", {
        Currency: "KHR",
        Date: `${date}`,
      })
        .then((res: any) => {
          handleChange("ExchangeRate", res?.data);
          return res?.data;
        })
        .catch((err: any) => {
          return handleChange("ExchangeRate", 0);
        });

      return res || 0;
    },
    retry: 1,
    cacheTime: 720 * (60 * 1000),
    staleTime: 720 * (60 * 1000), // 720 mins
  });
  return data;
};
