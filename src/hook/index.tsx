import {
  commaFormatNum,
  formatNumberWithoutRounding,
} from "@/utilies/formatNumber";
import formular from "@/utilies/formular";
import React from "react";

export const useDocumentTotalHook = (
  items: any[],
  discount: any,
  ExchangeRate: any
) => {
  //At  total discount 0 %
  const docTotal: number = React.useMemo(() => {
    const total = items.reduce((prevTotal, item) => {
      const lineTotal = formular.findLineTotal("1", item.LineTotal, "0");

      return prevTotal + lineTotal;
    }, 0);
    return total;
  }, [items]);

  const docTaxTotal: number = React.useMemo(() => {
    const total = items.reduce((prevTotal, item) => {
      let lineTotal = formular.findLineTotal(item.LineTotal, "1", "0");
      lineTotal = lineTotal / 1.1 / 10;
      return prevTotal + lineTotal;
    }, 0);
    return total;
  }, [items, ExchangeRate]);

  const totalBefore: number = React.useMemo(() => {
    const total = items.reduce((prevTotal, item) => {
      let lineTotal = formular.findLineTotal(item.LineTotal, "1", "0");
      lineTotal = lineTotal / 1.1;
      return prevTotal + lineTotal;
    }, 0);
    return total;
  }, [items, ExchangeRate]);

  const totalNet: number = React.useMemo(() => {
    const total = items.reduce((prevTotal, item) => {
      let lineTotal = formular.findLineTotal(
        item.UnitPrice,
        (item.Quantity * (discount ? 100 - discount : 1))?.toString(),
        item.DiscountPercent
      );
      lineTotal = lineTotal / 1.1;
      return prevTotal + lineTotal;
    }, 0);
    return total;
  }, [items, ExchangeRate]);

  const vatSum: number = React.useMemo(() => {
    const total = items.reduce((prevTotal, item) => {
      let lineTotal = formular.findLineTotal(
        item.UnitPrice,
        (item.Quantity * (discount ? 100 - discount : 1))?.toString(),
        item.DiscountPercent
      );
      lineTotal = lineTotal / 1.1 / 10;
      return prevTotal + lineTotal;
    }, 0);
    return total;
  }, [items, ExchangeRate]);

  const discountSum: number = React.useMemo(() => {
    const total = items.reduce((prevTotal, item) => {
      let lineTotal = formular.findLineTotal(
        item.UnitPrice,
        (item.Quantity * (discount ? 100 - discount : 1))?.toString(),
        item.DiscountPercent
      );
      lineTotal = lineTotal / 1.1 / 10;
      return prevTotal + lineTotal;
    }, 0);
    return total;
  }, [items, ExchangeRate]);

  return [docTotal, docTaxTotal, totalBefore];
};
