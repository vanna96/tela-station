import {
  commaFormatNum,
  formatNumberWithoutRounding,
} from "@/utilies/formatNumber";
import formular from "@/utilies/formular";
import React from "react";

export const useDocumentTotalHook = (
  items: any[],
  discount: number,
  ExchangeRate: any
) => {
  const docTotal: number = React.useMemo(() => {
    const total = items.reduce((prevTotal, item) => {
      const lineTotal = formular.findLineTotal(
        item.Quantity === "" ? 0 : item.Quantity,
        item.UnitPrice,
        item.DiscountPercent === "" ? 0 : item.DiscountPercent
      );
   
      return prevTotal + lineTotal;
    }, 0);
    return formatNumberWithoutRounding(total, 4);
  }, [items, ExchangeRate]);

  const docDiscountAmount =
    ((discount === undefined || "" ? 0 : discount) / 100) * docTotal;

  const docTaxTotal = React.useMemo(() => {
    return items.reduce((prevTax, item) => {
      const discountPercent = item.DiscountPercent === "" ? 0 : parseFloat(item.DiscountPercent);
      const lineTotalAfterDiscount = item.LineTotal - (item.LineTotal * discountPercent / 100);
      const taxRate = item.VatGroup === "VO00" ? 0 : 10;
      const lineTax = (lineTotalAfterDiscount * taxRate) / 100;
      return (prevTax + lineTax)/1.1;
    }, 0);
  }, [items]); // Assuming 'items' array is the dependency
  

  const grossTotal: number = React.useMemo(() => {
    const total = items.reduce((prevTotal, item) => {
      const lineTotal = formular.findLineTotal(
        "1",
        item.LineTotal,
        "0"
      );

      return formatNumberWithoutRounding(prevTotal + lineTotal, 4);
    }, 0);

    return total;
  }, [items]);

  return [docTotal, docTaxTotal, grossTotal];
};
