import Formular from "@/utilies/formular"
import React from "react"

export const useDocumentTotalHook = (
  items: any[],
  discount = 0,
  ExchangeRate: any
) => {
  const docTotal: number = React.useMemo(() => {
    let total = items.reduce((prev: number, cur: any) => {
      return prev + cur?.LineTotal
      // Formular.findLineTotal(cur?.Quantity, cur?.UnitPrice, cur?.LineDiscount)
    }, 0)
    return total * ExchangeRate
  }, [items, ExchangeRate])

  let docTaxTotal: number = React.useMemo(() => {
    let total = items.reduce((prev: number, cur: any) => {
      return (
        prev +
        (parseFloat(cur?.VatRate ?? 0) * parseFloat(cur?.LineTotal ?? 1)) / 100
      )
    }, 0)

    return total * ExchangeRate
  }, [items, discount, ExchangeRate])

  docTaxTotal = docTaxTotal - (docTaxTotal * discount) / 100
  return [docTotal, docTaxTotal]
}
