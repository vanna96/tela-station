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
        item.VatGroup === "VO00" ? item.GrossPrice : item.UnitPrice,
        item.DiscountPercent === "" ? 0 : item.DiscountPercent
      );
      return prevTotal + lineTotal;
    }, 0);

    return formatNumberWithoutRounding(total, 6);
  }, [items, ExchangeRate]);

  const docDiscountAmount =
    ((discount === undefined || "" ? 0 : discount) / 100) * docTotal;

  const docTaxTotal: number = React.useMemo(() => {
    const totalTax = items.reduce((prevTax, item) => {
      const lineTotal = formular.findLineTotal(
        item.Quantity === "" ? 0 : item.Quantity,
        item.VatGroup === "VO00" ? item.GrossPrice : item.UnitPrice,
        item.DiscountPercent === "" ? 0 : item.DiscountPercent
      );
      const TaxRate = item.VatGroup === "VO00" ? 0 : 10;
      const lineTax = (lineTotal * TaxRate) / 100;
      return prevTax + lineTax;
    }, 0);

    return formatNumberWithoutRounding(totalTax, 6);
  }, [items]);

  const grossTotal: number = React.useMemo(() => {
    const total = items.reduce((prevTotal, item) => {
      const lineTotal = formular.findLineTotal(
        item.Quantity === "" ? 0 : item.Quantity,
        item.VatGroup === "VO00" ? item.GrossPrice : item.UnitPrice,
        item.DiscountPercent === "" ? 0 : item.DiscountPercent
      );

      return prevTotal + lineTotal;
    }, 0);

    return docTotal - docDiscountAmount + docTaxTotal;
  }, [items, discount, docTotal, docDiscountAmount, docTaxTotal]);

  return [docTotal, docTaxTotal, grossTotal];
};
//since we can't change tax code ? Gross Price is always the same
