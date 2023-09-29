import { formatDate, sysInfo } from "@/helper/helper"
import request from "@/utilies/request"
import React from "react"
import { useMemo } from "react"
import { useQuery } from "react-query"
import { APIContext } from "../../clearence/context/APIContext"

export const useExchangeRate = (Currency: any, handleChange: any) => {
  const date = useMemo(() => formatDate(new Date(), ""), [new Date()])
  const { sysInfo }: any = React.useContext(APIContext)

  const { data } = useQuery({
    queryKey: [`date_${date}`, Currency],
    queryFn: async () => {
      const res: any = await request("POST", "/SBOBobService_GetCurrencyRate", {
        Currency: Currency,
        Date: `${date}`,
      })
        .then((res: any) => {
          handleChange("ExchangeRate", res?.data)
          return res?.data
        })
        .catch((err: any) => {
          if (Currency === sysInfo?.SystemCurrency) return handleChange("ExchangeRate", 1)
          return handleChange("ExchangeRate", 0)
        })

      return res || 0
    },
    retry: 1
  })
  return data
}
