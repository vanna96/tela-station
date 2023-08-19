import { formatDate, getLocalCacheData } from "@/helper/helper";
import request from "@/utilies/request"
import { createContext, useEffect, useState } from "react"
import { useQuery } from "react-query"

type GeneralProps = { children: any; Edit?: any }

export const GeneralContact = createContext({})
export const GeneralProvider = ({ children, Edit }: GeneralProps) => {
  const DOC_SALES_QUOTATION = 23
  const [formGeneral, setFormGeneral]: any = useState()
  const { data: documentNumber }: any = useQuery(
    ["document_number", DOC_SALES_QUOTATION],
    async () => {
      const res = await request("POST", `/SeriesService_GetDocumentSeries`, {
        DocumentTypeParams: {
          Document: DOC_SALES_QUOTATION,
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
      const select = `$select=CardCode,CardName,CurrentAccountBalance,DefaultCurrency,Currency,PriceListNum,DiscountGroups,ContactEmployees,BPAddresses,PeymentMethodCode,ShippingType,BPPaymentMethods,FederalTaxID,PayTermsGrpCode`
      const filter = `$filter=CardType ne 'cSupplier'`
      const res = await request("GET", `BusinessPartners/?${filter}&${select}`)
        .then((res: any) => res?.data)
        .catch((err: any) => console.log(err))
      return res
    },
    enabled: documentNumber ? true : false,
  })

  const CardCode = formGeneral?.CardCode || null
  const { data: bussinessPartner }: any = useQuery(
    ["business_partner", CardCode],
    async () => {
      const res = await request("GET", `/BusinessPartners('${CardCode}')`)
        .then((res: any) => res?.data)
        .catch((e) => {
          throw new Error(e)
        })

      return res
    },
    { enabled: CardCode ? true : false }
  )

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

  const { data: shippingType }: any = useQuery(
    ["shipping_type"],
    async () => {
      const res =
        getLocalCacheData({ key: "shipping_types" }) ||
        await request("GET", `/ShippingTypes?$orderby=Name`)
          .then((res: any) => res?.data)
          .catch((e) => {
            throw new Error(e)
          })

      return res
    },
    { enabled: CardCode ? true : false }
  )

  useEffect(() => {
    if (documentNumber?.length > 0) {
      const Hardware = documentNumber?.find((e: any) => e.Name === "Hardware")
      setFormGeneral({
        ...formGeneral,
        series_type: "Hardware",
        series_value: Hardware?.NextNumber,
      })
    }
  }, [documentNumber])

  useEffect(() => {
    // edit
    let data
    if (Edit) {
      data = {
        customerRefNo: Edit.NumAtCard,
        localCurrency: "B",
        status: Edit.DocumentStatus.replace("bost_", ""),
        series_value: Edit.DocNum,
        posDate: Edit.DocDate.split("T")[0],
        validUntil: Edit.DocDueDate.split("T")[0],
        documentDate: Edit.TaxDate.split("T")[0],
        Currency: Edit.DocCurrency,
        InternalCode: Edit.ContactPersonCode,
        CardCode: Edit.CardCode,
        CardName: Edit.CardName,
        series_type: "Hardware",
      }
    } else {
      const Hardware = documentNumber?.find((e: any) => e.Name === "Hardware")
      data = {
        status: "Open",
        posDate: formatDate(new Date()),
        documentDate: formatDate(new Date()),
        series_type: "Hardware",
        series_value: Hardware?.NextNumber,
      }
    }
    setFormGeneral(data)
  }, [])

  return (
    <GeneralContact.Provider
      value={{
        formGeneral,
        setFormGeneral,
        customers,
        documentNumber,
        bussinessPartner,
        salesPerson,
        employeesInfo,
        shippingType,
        Edit,
      }}
    >
      {children}
    </GeneralContact.Provider>
  )
}
