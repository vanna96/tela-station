import React from "react"

export const useDocumentTotalHook = (data: any) => {
  const paymentMeans = React.useMemo(() => {
    return (
      parseFloat(data?.GLBankAmount || 0) +
      parseFloat(data?.GLCashAmount || 0) +
      (data?.paymentMeanCheckData?.reduce((prev: number, p: any) => {
        return prev + parseFloat(p?.amount)
      }, 0) || 0)
    )
  }, [
    parseFloat(data?.GLBankAmount || 0),
    parseFloat(data?.GLCashAmount || 0),
    data?.paymentMeanCheckData,
  ])

  const netTotal =
    data?.Items?.reduce((prev: number, e: any) => {
      return prev + parseFloat(e?.LineTotal || 0)
    }, 0) || 0

  const rate =
    data?.Items?.reduce((prev: number, e: any) => {
      return prev + parseFloat(e?.LineTotal || 0) * (parseFloat(e?.VatRate || 0) / 100)
    }, 0) || 0

  return [paymentMeans, netTotal, rate]
}
