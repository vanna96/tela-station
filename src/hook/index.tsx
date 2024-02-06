import formular from "@/utilies/formular";
import Formular from "@/utilies/formular";
import React from "react";

export const useDocumentTotalHook = (
  items: any[],
  discount = 0,
  ExchangeRate: any
) => {
  const docTotal: number = React.useMemo(() => {
    const total = items.reduce((prevTotal, item) => {
      const lineTotal = formular.findLineTotal(
        item.Quantity,
        item.UnitPrice,
        item.Discount
      );
      console.log(lineTotal);
      return prevTotal + lineTotal;
    }, 0);
    return total * ExchangeRate;
  }, [items, ExchangeRate]);

  const grossTotal: number = React.useMemo(() => {
    const total = items.reduce((prevTotal, item) => {
      const lineTotal = formular.findLineTotal(
        item.Quantity,
        item.GrossPrice,
        item.Discount
      );
      console.log(lineTotal);
      return prevTotal + lineTotal;
    }, 0);
    return total * ExchangeRate;
  }, [items, ExchangeRate]);

  let docTaxTotal: number = grossTotal - docTotal;
  return [docTotal, docTaxTotal, grossTotal];
};
