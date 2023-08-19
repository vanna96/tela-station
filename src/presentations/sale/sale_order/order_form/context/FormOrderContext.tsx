import { formatDate, getLocalCacheData } from "@/helper/helper"
import request from "@/utilies/request"
import { createContext, useEffect, useState } from "react"
import { useQuery } from "react-query"

type GeneralProps = { children: any; Edit?: any }

export const FormOrderContext = createContext({})
export const FormOrderProvider = ({ children, Edit }: GeneralProps) => {
  const [form, setForm]: any = useState({
    status: (Edit?.DocumentStatus || "bost_Open").replace("bost_", ""),
    itemServiceType: Edit
      ? Edit?.DocType === "dDocument_Items"
        ? "Item"
        : "Service"
      : "Item",
    posDate: Edit ? Edit?.DocDate.split("T")[0] : formatDate(new Date()),
    validUntil: Edit ? Edit?.DocDueDate.split("T")[0] : null,
    documentDate: Edit ? Edit?.TaxDate.split("T")[0] : formatDate(new Date()),
    cardCode: Edit?.CardCode || "",
    cardName: Edit?.CardName || "",
    localCurrency: Edit ? "B" : "",
    customerRefNo: Edit?.NumAtCard,
    series_value: Edit?.DocNum,
    currency: Edit?.DocCurrency || null,
    internalCode: Edit?.ContactPersonCode,
    cashDiscount: Edit?.CashDiscountDateOffset || null,
    useShippedGoodAccount: Edit?.UseShpdGoodsAct === "tYES",
    createQRCodeFrom: Edit?.CreateQRCodeFrom,
    bussinessPartnerProject: Edit?.Project,
    cancellationDate: Edit?.CancelDate.split("T")[0],
    requiredDate: Edit?.RequriedDate.split("T")[0],
    orderNumber: Edit?.ImportFileNum,
    shippingType: Edit?.TransportationCode || 1,
    SalesEmployee: Edit?.SalesPersonCode,
    OwnerId: Edit?.DocumentsOwner,
    remark: Edit?.Comments,
    approved: Edit?.Confirmed === "tYES",
    allowPartialDelivery: Edit?.PartialSupply === "tYES",
    printPickingSheet: Edit?.Pick === "tYES",
    isRounding: Edit?.Rounding === "tYES",
    roundingValue: Edit?.RoundingDiffAmount || Edit?.RoundingDiffAmountSC,
    items: Edit?.DocumentLines?.map((e: any) => {
      return {
        ItemCode: e.ItemCode,
        ItemName: e.ItemDescription,
        unitPrice: e.UnitPrice,
        qty: e.Quantity,
        total: e.LineTotal,
        discount: e.DiscountPercent,
        taxCode: e.VatGroup,
        uomCode: e.UoMCode,
        uoMEntry: e.UoMEntry,
        UoMGroupEntry: Item?.find(({ ItemCode }: any) => ItemCode === e.ItemCode)
          ?.UoMGroupEntry,
        rate: e.PriceAfterVAT,
        Code: e.AccountCode,
        description: e.ItemDescription,
        Name: e.ItemDescription,
      }
    }),
    documentLines: [],
    series_type: Edit?.Series || 5,
  })

  const { data: UnitOfMeasurementGroups } = useQuery({
    queryKey: ["unit_measurement_groups"],
    queryFn: async () => {
      const res =
        getLocalCacheData({ key: "UnitOfMeasurementGroups" }) ||
        request(
          "GET",
          `/UnitOfMeasurementGroups?$select=Name,AbsEntry,Code,UoMGroupDefinitionCollection`
        )
          .then((res: any) => res?.data?.value)
          .catch((error) => console.log(error))
      return res
    },
  })

  const { data: UnitOfMeasurements } = useQuery({
    queryKey: ["unit_of_measurement"],
    queryFn: async () => {
      const res =
        getLocalCacheData({ key: "UnitOfMeasurements" }) ||
        request("GET", `/UnitOfMeasurements`)
          .then((res: any) => res?.data?.value)
          .catch((error) => console.log(error))
      return res
    },
  })

  const { data: documentNumber }: any = useQuery(
    ["document_number", 17],
    async () => {
      const res = await request("POST", `/SeriesService_GetDocumentSeries`, {
        DocumentTypeParams: {
          Document: 17,
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

  const { data: customers } = useQuery({
    queryKey: "quotation_customer",
    queryFn: async () => {
      const filter = `$filter=CardType ne 'cSupplier'`
      const res = await request("GET", `BusinessPartners/?${filter}`)
        .then((res: any) => res?.data)
        .catch((err: any) => console.log(err))
      return res
    },
    enabled: documentNumber ? true : false,
  })

  const { data: bussinessPartner }: any = useQuery(
    ["business_partner", form?.cardCode],
    async () => {
      const res = await request("GET", `/BusinessPartners('${form?.cardCode}')`)
        .then((res: any) => res?.data)
        .catch((e) => {
          throw new Error(e)
        })

      return res
    },
    { enabled: form?.cardCode ? true : false }
  )

  const { data: shippingType }: any = useQuery(
    ["shipping_type"],
    async () => {
      const res =
        getLocalCacheData({ key: "shipping_types" }) ||
        (await request("GET", `/ShippingTypes?$orderby=Name`)
          .then((res: any) => res?.data)
          .catch((e) => {
            throw new Error(e)
          }))

      return res
    },
    { enabled: form?.cardCode ? true : false }
  )

  const { data: Projects } = useQuery({
    queryKey: "projects",
    queryFn: async () => {
      const res = request("GET", "/Projects")
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

  const { data: Indicators } = useQuery({
    queryKey: "indicators",
    queryFn: async () => {
      const res = request("GET", "/FactoringIndicators")
        .then((res: any) => res?.data?.value)
        .catch((error) => console.log(error))
      return res
    },
  })

  const { data: salesPerson }: any = useQuery(["sales_person"], async () => {
    const select = `$select=SalesEmployeeCode, SalesEmployeeName`
    const res = await request("GET", `/SalesPersons?${select}`)
      .then((res: any) => res?.data)
      .catch((e) => {
        throw new Error(e)
      })

    return res
  })

  const { data: employeesInfo }: any = useQuery(["employees_info"], async () => {
    const select = `$select=EmployeeID,FirstName,LastName`
    const res = await request("GET", `/EmployeesInfo?${select}`)
      .then((res: any) => res?.data)
      .catch((e) => {
        throw new Error(e)
      })

    return res
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
    enabled: form?.cardCode ? true : false,
  })

  useEffect(() => {
    if (bussinessPartner) {
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
        pickAndPackRemark: Edit?.PickRemark,
        journalRemark:
          Edit?.JournalMemo ||
          `Sales Quotations - ${bussinessPartner?.CardCode || ""}`,
        paymentMethods: Edit?.PaymentMethod || bussinessPartner?.PeymentMethodCode,
        federalTaxID: Edit?.FederalTaxID || bussinessPartner?.FederalTaxID,
        indicator: Edit?.Indicator || bussinessPartner?.Indicator,
        paymentTerms: Edit?.PaymentGroupCode || bussinessPartner?.PayTermsGrpCode,
        months: Edit?.ExtraMonth || groupNumber?.NumberOfAdditionalMonths,
        days: Edit?.ExtraDays || groupNumber?.NumberOfAdditionalDays,
        dueDate: Edit?.StartFrom || groupNumber?.StartFrom,
        series_value: Edit?.DocNum || Hardware?.NextNumber,
        totalDiscount: Edit?.GeneralDiscount || groupNumber?.GeneralDiscount || 0,
      })
    }
  }, [bussinessPartner])

  const { data: Item } = useQuery({
    queryKey: ["content_item"],
    queryFn: async () => {
      const select = `$select=ItemCode,ItemName,QuantityOnStock,UoMGroupEntry,ItemPrices,ItemsGroupCode,SalesVATGroup`
      const filter = `$filter=SalesItem eq 'tYES'`
      const res = request("GET", `/Items?${select}&${filter}`)
        .then((res: any) => res?.data?.value)
        .catch((error) => console.log(error))
      return res
    },
    enabled: form?.cardCode ? true : false,
  })

  const { data: ContentService } = useQuery({
    queryKey: ["content_service"],
    queryFn: async () => {
      const res = request(
        "GET",
        `/ChartOfAccounts?$select=Code,Name,Balance,AccountType&$filter=ActiveAccount eq 'tYES'`
      )
        .then((res: any) => res?.data?.value)
        .catch((error) => console.log(error))
      return res
    },
    enabled: form?.cardCode ? true : false,
  })

  return (
    <>
      <FormOrderContext.Provider
        value={{
          form,
          setForm,
          documentNumber,
          customers,
          bussinessPartner,
          shippingType,
          Projects,
          PaymentTermsTypes,
          Indicators,
          salesPerson,
          employeesInfo,
          TaxCode,
          Item,
          ContentService,
          Edit,
          UnitOfMeasurementGroups,
          UnitOfMeasurements,
        }}
      >
        {children}
      </FormOrderContext.Provider>
    </>
  )
}
