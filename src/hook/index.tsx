import formular from "@/utilies/formular";
import Formular from "@/utilies/formular";
import React from "react";

export const useDocumentTotalHook = (
  items: any[],
  discount: number,
  ExchangeRate: any
) => {
  const docTotal: number = React.useMemo(() => {
    const total = items.reduce((prevTotal, item) => {
      const lineTotal = formular.findLineTotal(
        item.Quantity,
        item.UnitPrice,
        item.Discount
      );
      return prevTotal + lineTotal;
    }, 0);
    return total * ExchangeRate;
  }, [items, ExchangeRate]);

  // Calculate discount amount
  const docDiscountAmount = (discount / 100) * docTotal;

  // Include docDiscountAmount in the dependency array
  const docTaxTotal: number = React.useMemo(() => {
    return (docTotal - docDiscountAmount) / 10;
  }, [docTotal, docDiscountAmount]);

  const grossTotal: number = React.useMemo(() => {
    const total = items.reduce((prevTotal, item) => {
      const lineTotal = formular.findLineTotal(
        item.Quantity,
        item.GrossPrice,
        item.Discount
      );
      return prevTotal + lineTotal;
    }, 0);

    return docTotal - docDiscountAmount + docTaxTotal * ExchangeRate;
  }, [items, ExchangeRate, discount, docTotal, docDiscountAmount, docTaxTotal]);

  return [docTotal, docTaxTotal, grossTotal];
};
