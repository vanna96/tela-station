import React from "react"

export const useDocumentTotalHook = (data: any) => {

  const totalUsd = React.useMemo(() => {
    return  parseFloat(data?.GLBankAmount || 0) + 
            parseFloat(data?.GLCashAmount || 0)+
            (data?.paymentMeanCheckData?.reduce((prev: number, p: any) => {
       return prev + parseFloat(p?.amount)
    }, 0) || 0)
  }, [
    parseFloat(data?.GLBankAmount || 0),
    parseFloat(data?.GLCashAmount || 0),
    data?.paymentMeanCheckData
  ])

  const totalFC = totalUsd * (data?.ExchangeRate || 1)

  return [totalUsd, totalFC]
}
