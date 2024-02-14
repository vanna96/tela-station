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
        (item.GrossPrice / 1.1)?.toString(),
        item.DiscountPercent === "" ? 0 : item.DiscountPercent
      );

      return prevTotal + lineTotal;
    }, 0);
    return formatNumberWithoutRounding(total, 4);
  }, [items, ExchangeRate]);

  const docDiscountAmount =
    ((discount === undefined || "" ? 0 : discount) / 100) * docTotal;

  const docTaxTotal: number = React.useMemo(() => {
    const totalTax = items.reduce((prevTax, item) => {
      const lineTotal = formular.findLineTotal(
        item.Quantity === "" ? 0 : item.Quantity,
        (item.GrossPrice / 1.1)?.toString(),
        item.DiscountPercent === "" ? 0 : item.DiscountPercent
      );
      const TaxRate = item.VatGroup === "VO00" ? 0 : 10;
      const lineTax = (lineTotal * TaxRate) / 100;
      return prevTax + lineTax;
    }, 0);

    return formatNumberWithoutRounding(totalTax, 4);
  }, [items]);

  const grossTotal: number = React.useMemo(() => {
    const total = items.reduce((prevTotal, item) => {
      const lineTotal = formular.findLineTotal(
        item.Quantity === "" ? 0 : item.Quantity,
        (item.GrossPrice / 1.1)?.toString(),
        item.DiscountPercent === "" ? 0 : item.DiscountPercent
      );

      return formatNumberWithoutRounding(prevTotal + lineTotal, 4);
    }, 0);

    return docTotal - docDiscountAmount + docTaxTotal;
  }, [items, discount, docTotal, docDiscountAmount, docTaxTotal]);

  return [docTotal, docTaxTotal, grossTotal];
};
