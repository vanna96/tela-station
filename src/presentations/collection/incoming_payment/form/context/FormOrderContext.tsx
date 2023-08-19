import { diffDays, formatDate, getLocalCacheData } from "@/helper/helper"
import request from "@/utilies/request"
import { createContext, useEffect, useState } from "react"
import { useQuery } from "react-query"

type GeneralProps = { children: any; Edit?: any }

export const FormOrderContext = createContext({})
export const FormOrderProvider = ({ children, Edit }: GeneralProps) => {
  const { data: ContentService } = useQuery({
    queryKey: ["content_service"],
    queryFn: async () => {
      const res =
        getLocalCacheData({ key: "ChartOfAccounts" }) ||
        request(
          "GET",
          `/ChartOfAccounts?$select=Code,Name,Balance,AccountType&$filter=ActiveAccount eq 'tYES'`
        )
          .then((res: any) => res?.data?.value)
          .catch((error) => console.log(error))
      return res
    },
  })

  const useType = Edit?.DocType?.replace("r", "") || "Customer"
  const [form, setForm]: any = useState({
    useType: Edit ? useType : "Customer",
    posDate: Edit ? Edit?.DocDate?.split("T")[0] : formatDate(new Date()),
    validUntil: Edit ? Edit?.DocDate?.split("T")[0] : null,
    documentDate: Edit ? Edit?.TaxDate?.split("T")[0] : formatDate(new Date()),
    cardCode: Edit ? (useType !== "Account" ? Edit?.CardCode : "") : "",
    cardName: Edit ? (useType !== "Account" ? Edit?.CardName : "") : "",
    series_value: Edit?.DocNum,
    currency: Edit?.DocCurrency || null,
    internalCode: Edit?.ContactPersonCode,
    cashDiscount: Edit?.CashDiscountDateOffset || null,
    useShippedGoodAccount: Edit?.UseShpdGoodsAct === "tYES",
    createQRCodeFrom: Edit?.CreateQRCodeFrom,
    bussinessPartnerProject: Edit?.Project,
    orderNumber: Edit?.ImportFileNum,
    shippingType: Edit?.TransportationCode || 1,
    SalesEmployee: Edit?.SalesPersonCode,
    OwnerId: Edit?.DocumentsOwner,
    remark: Edit?.Remarks,
    paymentMeansTotalAUD: 0,
    totalExchange: 0,
    documentLines: [],
    series_type: Edit?.Series || 12,
    reference: Edit?.CounterReference || null,
    journalRemark: Edit?.JournalRemarks || null,
    paymenyMeansExchangeRate: Edit?.DocRate || 0,
    items: Edit
      ? useType === "Account"
        ? Edit?.PaymentAccounts?.map((i: any) => {
            const exchangeRate = Edit?.DocCurrency === "AUD" ? 1 : Edit?.DocRate
            return {
              rate: i.VatAmount * exchangeRate,
              Code: i.AccountCode,
              taxCode: i.VatGroup || null,
              Name: i.AccountName || null,
              total: i?.SumPaidFC || i.SumPaid || 0,
            }
          })
        : []
      : null,
    paymentMeans: Edit
      ? [
          {
            type: "Check",
            account: `${Edit?.CheckAccount || ""} ${Edit ? "-" : ""} ${
              ContentService?.find(({ Code }: any) => Code === Edit?.CheckAccount)
                ?.Name || ""
            }`,
            amount:
              Edit?.PaymentChecks?.reduce(
                (accumulator: any, object: any) =>
                  accumulator + parseFloat(object.CheckSum || 0),
                0
              ) || 0,
          },
          {
            type: "Bank Transfer",
            account: `${Edit?.TransferAccount || ""} ${
              Edit?.CashAccount ? "-" : ""
            } ${
              ContentService?.find(({ Code }: any) => Code === Edit?.TransferAccount)
                ?.Name || ""
            }`,
            amount:
              Edit?.TransferSum * (Edit?.DocCurrency === "AUD" ? 1 : Edit?.DocRate),
          },
          {
            type: "Credit Card",
            account: "",
            amount: "0",
          },
          {
            type: "Cash",
            account: `${Edit?.CashAccount || ""} ${Edit?.CashAccount ? "-" : ""} ${
              ContentService?.find(({ Code }: any) => Code === Edit?.CashAccount)
                ?.Name || ""
            }`,
            amount: Edit?.CashSumFC || Edit?.CashSum || 0,
          },
        ]
      : null,
  })

  const { data: documentNumber }: any = useQuery(
    ["document_number", 24],
    async () => {
      const res = await request("POST", `/SeriesService_GetDocumentSeries`, {
        DocumentTypeParams: {
          Document: 24,
        },
      })
        .then((res: any) =>
          res?.data?.value?.filter((e: any) => e.PeriodIndicator === "Default")
        )
        .catch((e) => {
          throw new Error(e)
        })

      return res
    }
  )

  const date = new Date()
  const { data: currency }: any = useQuery(
    ["currency", formatDate(date)],
    async () => {
      const res = await request(
        "GET",
        `/view.svc/Biz_ExchangeRateB1SLQuery?$filter=RateDate eq '${formatDate(
          date
        )}'`
      )
        .then((res: any) => res?.data?.value)
        .catch((e) => {
          throw new Error(e)
        })

      return res
    }
  )

  const { data: AllInfo } = useQuery({
    queryKey: "AllInfo",
    queryFn: async () => {
      const select = `$select=BPPaymentMethods, CardName, CardType, DefaultCurrency, BPCurrenciesCollection, PriceListNum, DiscountGroups, PayTermsGrpCode, MailAddress, BilltoDefault, Address, PeymentMethodCode, FederalTaxID, Indicator, PayTermsGrpCode, ShipToDefault, CardCode`
      const res = await request("GET", `BusinessPartners?${select}`)
        .then((res: any) => res?.data?.value)
        .catch((err: any) => console.log(err))
      return res
    },
    enabled: documentNumber ? true : false,
  })

  const customers: any = AllInfo?.filter(
    ({ CardType }: any) => CardType !== "cSupplier"
  )
  const Vendor: any = AllInfo?.filter(
    ({ CardType }: any) => CardType === "cSupplier"
  )
  const bussinessPartner: any = AllInfo?.find(
    ({ CardCode }: any) => CardCode === form?.cardCode
  )
  console.log(bussinessPartner)

  // const { data: customers } = useQuery({
  //   queryKey: "quotation_customer",
  //   queryFn: async () => {
  //     const filter = `$filter=CardType ne 'cSupplier' &$select=CardCode,CardName,Currency,CardCode,BPPaymentMethods`;
  //     const res = await request("GET", `BusinessPartners/?${filter}`)
  //       .then((res: any) => res?.data)
  //       .catch((err: any) => console.log(err));
  //     return res;
  //   },
  //   enabled: documentNumber ? true : false,
  // });

  // const { data: Vendor } = useQuery({
  //   queryKey: "quotation_vendor",
  //   queryFn: async () => {
  //     const filter = `$filter=CardType eq 'cSupplier' &$select=CardCode,CardName,Currency,CardCode,BPPaymentMethods`;
  //     const res = await request("GET", `BusinessPartners/?${filter}`)
  //       .then((res: any) => res?.data)
  //       .catch((err: any) => console.log(err));
  //     return res;
  //   },
  //   enabled: documentNumber ? true : false,
  // });

  // const { data: bussinessPartner }: any = useQuery(
  //   ["business_partner", form?.cardCode],
  //   async () => {
  //     const filter = `$select=DefaultCurrency, BPCurrenciesCollection, PriceListNum, DiscountGroups, PayTermsGrpCode, MailAddress, BilltoDefault, Address, PeymentMethodCode, FederalTaxID, Indicator, PayTermsGrpCode, ShipToDefault, CardCode`;
  //     const res = await request("GET", `/BusinessPartners('${form?.cardCode}')?${filter}`)
  //       .then((res: any) => res?.data)
  //       .catch((e) => {
  //         throw new Error(e);
  //       });

  //     return res;
  //   },
  //   { enabled: form?.cardCode ? true : false }
  // );

  const {
    data: customerInvoice,
    isLoading: loading,
    isFetching,
  } = useQuery({
    queryKey: ["customer_invoice", form?.cardCode],
    queryFn: async () => {
      const userType =
        form?.useType === "Supplier"
          ? `Biz_InComingPayTest_A_P_B1SLQuery`
          : `Biz_InComingPayTest_A_R_B1SLQuery`
      const invoices = await request(
        "GET",
        `view.svc/${userType}?$filter=BPCode eq '${form?.cardCode}' or CardParent eq '${form?.cardCode}'`
      )
        .then((res: any) => res?.data?.value)
        .catch((err: any) => console.log(err))
      return invoices
    },
    enabled: bussinessPartner ? true : false,
    cacheTime: 0,
    staleTime: 0,
  })

  const { data: Projects } = useQuery({
    queryKey: "projects",
    queryFn: async () => {
      const res =
        getLocalCacheData({ key: "projects" }) ||
        request("GET", "/Projects")
          .then((res: any) => res?.data?.value)
          .catch((error) => console.log(error))
      return res
    },
  })

  const { data: PaymentTermsTypes } = useQuery({
    queryKey: "payment_terms_types",
    queryFn: async () => {
      const res =
        getLocalCacheData({ key: "paymentTermTypes" }) ||
        request("GET", "/PaymentTermsTypes")
          .then((res: any) => res?.data?.value)
          .catch((error) => console.log(error))
      return res
    },
  })

  const { data: TaxCode } = useQuery({
    queryKey: ["tax_code"],
    queryFn: async () => {
      const res =
        getLocalCacheData({ key: "vatGroup" }) ||
        request(
          "GET",
          `/VatGroups?$select=Category,Inactive , Name, Code, EU, VatGroups_Lines &$filter=Category eq 'bovcOutputTax' and Inactive eq 'tNO' &$orderby=Name asc`
        )
          .then((res: any) => res?.data?.value)
          .catch((error) => console.log(error))
      return res
    },
  })

  useEffect(() => {
    if (customerInvoice) {
      const Hardware = documentNumber?.find((e: any) => e.Name === "Primary")
      const groupNumber = PaymentTermsTypes?.find(
        (num: any) => num.GroupNumber === bussinessPartner?.PayTermsGrpCode
      )

      setForm({
        ...form,
        shipTo: Edit?.ShipToCode || bussinessPartner?.ShipToDefault,
        shipToValue: Edit?.Address2 || bussinessPartner?.MailAddress,
        payTo: Edit?.PayToCode || bussinessPartner?.BilltoDefault,
        payToValue: Edit?.Address || bussinessPartner?.Address,
        remark: Edit?.Remarks,
        journalRemark:
          Edit?.JournalRemarks ||
          `Incoming Payments - ${bussinessPartner?.CardCode || ""}`,
        paymentMethods: Edit?.PaymentMethod || bussinessPartner?.PeymentMethodCode,
        federalTaxID: Edit?.FederalTaxID || bussinessPartner?.FederalTaxID,
        indicator: Edit?.Indicator || bussinessPartner?.Indicator,
        paymentTerms: Edit?.PaymentGroupCode || bussinessPartner?.PayTermsGrpCode,
        months: Edit?.ExtraMonth || groupNumber?.NumberOfAdditionalMonths,
        days: Edit?.ExtraDays || groupNumber?.NumberOfAdditionalDays,
        dueDate: Edit?.StartFrom || groupNumber?.StartFrom,
        series_value: Edit?.DocNum || Hardware?.NextNumber,
        totalDiscount: Edit?.GeneralDiscount || groupNumber?.GeneralDiscount || 0,
        items: Edit
          ? useType === "Account"
            ? null
            : Edit?.PaymentInvoices?.map((i: any) => {
                const find = customerInvoice?.find(
                  ({ DocEntry, DocumentNo }: any) =>
                    DocumentNo === i.DocEntry || DocEntry === i.DocEntry
                )
                return {
                  checked: true,
                  ...i,
                  DocDate: find?.DueDate || i?.DocDate,
                  DocCurrency: find?.FCCurrency || i?.DocCurrency || "AUD",
                  DocTotal: find?.DocTotalFC || find?.DocTotal,
                  // TotalPayment:
                  //   find?.DocTotal < 0
                  //     ? -(i?.AppliedFC || i?.AppliedSys)
                  //     : i?.AppliedFC || i?.AppliedSys,
                  TotalPayment: i?.AppliedFC || i?.AppliedSys,
                  BalanceDue: find?.DocBalanceFC || find?.DocBalance,
                  DocNum: find?.DocumentNo || i?.DocNum,
                  documentType: find?.TransTypeName || i?.documentType,
                  OverDueDays: diffDays(find?.DueDate || Edit?.DocDate),
                }
              })
          : customerInvoice
              ?.filter(({ DocStatus }: any) => DocStatus === "O")
              ?.map((i: any) => {
                let discount = 0
                if (i?.PaymentTerm) {
                  const paymentTerm = i.PaymentTerm.split(",")
                  var d = new Date(i?.TaxDate)
                  d.setDate(d.getDate() + parseInt(paymentTerm[0].toString()))
                  if (new Date() <= new Date(d)) discount = paymentTerm[1]
                }

                return {
                  ...i,
                  DocCurrency: i?.FCCurrency || "AUD",
                  DocRate: (i?.FCCurrency || "AUD") === "AUD" ? 1 : i?.DocRate,
                  DocNum: i?.DocumentNo,
                  documentType: i?.TransTypeName,
                  DocDate: i?.TaxDate,
                  DiscountPercent: discount,
                  DocTotal: (i?.DocTotalFC || i?.DocTotal).toFixed(2),
                  BalanceDue: (i?.DocBalanceFC || i?.DocBalance).toFixed(2),
                }
              })
              ?.sort(
                (a: any, b: any) => parseInt(b.OverDueDays) - parseInt(a.OverDueDays)
              ),
      })
    }
  }, [customerInvoice])

  return (
    <>
      <FormOrderContext.Provider
        value={{
          form,
          setForm,
          documentNumber,
          customers,
          bussinessPartner,
          Projects,
          TaxCode,
          ContentService,
          Edit,
          customerInvoice,
          Vendor,
          loading,
          isFetching,
          currency,
        }}
      >
        {children}
      </FormOrderContext.Provider>
    </>
  )
}
