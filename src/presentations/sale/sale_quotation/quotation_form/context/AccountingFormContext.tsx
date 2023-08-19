import request from "@/utilies/request";
import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { GeneralContact } from "./GeneralFormContext";

type GeneralProps = { children: any; Edit?: any };

export const AccountingContext = createContext({});
export const AccountingProvider = ({ children, Edit }: GeneralProps) => {
  const { formGeneral }: any = useContext(GeneralContact);
  const [formAccounting, setFormAccounting]: any = useState();

  const { data: Projects } = useQuery({
    queryKey: "projects",
    queryFn: async () => {
      const res = request("GET", "/Projects")
        .then((res: any) => res?.data?.value)
        .catch((error) => console.log(error));
      return res;
    },
  });

  const { data: PaymentTermsTypes } = useQuery({
    queryKey: "payment_terms_types",
    queryFn: async () => {
      const res = request("GET", "/PaymentTermsTypes")
        .then((res: any) => res?.data?.value)
        .catch((error) => console.log(error));
      return res;
    },
  });

  const { data: Indicators } = useQuery({
    queryKey: "indicators",
    queryFn: async () => {
      const res = request("GET", "/FactoringIndicators")
        .then((res: any) => res?.data?.value)
        .catch((error) => console.log(error));
      return res;
    },
  });

  const groupNumber = PaymentTermsTypes?.find(
    (num: any) => num.GroupNumber === formGeneral?.PayTermsGrpCode
  );

  useEffect(() => {
    setFormAccounting({
      ...formAccounting,
      journalRemark:
        Edit?.JournalMemo ||
        `Sales Quotations - ${formGeneral?.CardCode || ""}`,
      paymentMethods: Edit
        ? Edit?.PaymentMethod
        : formGeneral?.PeymentMethodCode,
      federalTaxID: Edit ? Edit?.FederalTaxID : formGeneral?.FederalTaxID,
      indicator: Edit ? Edit?.Indicator : formGeneral?.Indicator,
      useShippedGoodAccount: Edit?.UseShpdGoodsAct === "tYES" || false,
      paymentTerms: Edit
        ? Edit?.PaymentGroupCode
        : formGeneral?.PayTermsGrpCode,
      months: Edit ? Edit?.ExtraMonth : groupNumber?.NumberOfAdditionalMonths,
      days: Edit ? Edit?.ExtraDays : groupNumber?.NumberOfAdditionalDays,
      dueDate: Edit ? Edit?.StartFrom : groupNumber?.StartFrom,
      cashDiscount: Edit?.CashDiscountDateOffset,
      createQRCodeFrom: Edit?.CreateQRCodeFrom,
      orderNumber: Edit?.ImportFileNum,
      bussinessPartnerProject: Edit?.Project,
      totalDiscount: Edit?.GeneralDiscount || groupNumber?.GeneralDiscount || 0,
    });
  }, [formGeneral]);

  return (
    <AccountingContext.Provider
      value={{
        formAccounting,
        setFormAccounting,
        Projects,
        PaymentTermsTypes,
        Indicators,
      }}
    >
      {children}
    </AccountingContext.Provider>
  );
};
