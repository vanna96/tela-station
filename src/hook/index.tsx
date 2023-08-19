import Formular from "@/utilies/formular";
import React from "react";

export const useDocumentTotalHook = (items: any[], discount = 0) => {
    const docTotal: number = React.useMemo(() => {
        let total = items.reduce((prev: number, cur: any) => prev + Formular.findLineTotal(cur?.Quantity, cur?.UnitPrice, cur?.LineDiscount), 0);
        return total;
    }, [items]);

    const docTaxTotal: number = React.useMemo(() => {
        let total = items.reduce((prev: number, cur: any) => {
            return prev + ((parseFloat(cur?.VatRate ?? 0) * parseFloat(cur?.LineTotal ?? 1)) / 100);
        }, 0);

        return total;
    }, [items, discount]);


    return [docTotal, docTaxTotal];
}