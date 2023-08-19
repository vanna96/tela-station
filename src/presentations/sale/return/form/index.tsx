import CoreFormDocument from "@/components/core/CoreFormDocument"
import { withRouter } from "@/routes/withRouter"
import { LoadingButton } from "@mui/lab"
import DocumentSerieRepository from "@/services/actions/documentSerie"
import MenuButton from "@/components/button/MenuButton"
import { FormValidateException } from "@/utilies/error"
import LoadingProgress from "@/components/LoadingProgress"

import GeneralForm from "./../components/GeneralForm"
import LogisticForm from "./../components/LogisticForm"
import ContentForm from "./../components/ContentForm"
import AttachmentForm from "../components/AttachmentForm"
import AccountingForm from "../components/AccountingForm"
import React from "react"
import { ServiceModalComponent } from "../components/ServiceModalComponent"
import { fetchSAPFile, formatDate, getAttachment } from "@/helper/helper"
import request from "@/utilies/request"
import BusinessPartner from "@/models/BusinessParter"
import { arrayBufferToBlob } from "@/utilies"
import shortid from "shortid"

class Form extends CoreFormDocument {
  serviceRef = React.createRef<ServiceModalComponent>()

  constructor(props: any) {
    super(props)
    this.state = {
      ...this.state,
      AgreementType: "G",
      Status: "D",
      Renewal: false,
      TerminateDate: null,
      SigningDate: null,
      loading: true,
      DocumentDate: new Date(),
      PostingDate: new Date(),
      DueDate: new Date(),
      error: {},
      BPCurrenciesCollection: [],
      CurrencyType: "L",
      Currency: "AUD",
      DocType: "dDocument_Items",
      ExchangeRate: 1,
      JournalRemark: "",
      BPAddresses: [],
      Rounding: false,
      DocDiscount: 0,
      RoundingValue: 0,
      AttachmentList: [],
      VatGroup: "S1",
    } as any

    this.onInit = this.onInit.bind(this)
    this.handlerRemoveItem = this.handlerRemoveItem.bind(this)
    this.handlerSubmit = this.handlerSubmit.bind(this)
    this.handlerChangeMenu = this.handlerChangeMenu.bind(this)
    this.hanndAddNewItem = this.hanndAddNewItem.bind(this)
  }

  componentDidMount(): void {
    this.setState({ loading: true })
    this.onInit()
  }

  async onInit() {
    let state: any = { ...this.state }
    let seriesList: any = this.props?.query?.find("return-series")
    let defaultSeries: any = this.props?.query?.find("return-default-series")

    if (!seriesList) {
      seriesList = await DocumentSerieRepository.getDocumentSeries({
        Document: "16",
      })
      this.props?.query?.set("return-series", seriesList)
    }

    if (!defaultSeries) {
      defaultSeries = await DocumentSerieRepository.getDefaultDocumentSerie({
        Document: "16",
      })
      this.props?.query?.set("return-default-series", defaultSeries)
    }

    if (this.props.edit) {
      const { id }: any = this.props?.match?.params || 0
      await request("GET", `Returns(${id})`)
        .then(async (res: any) => {
          const data: any = res?.data
          // vendor
          const vendor: any = await request(
            "GET",
            `/BusinessPartners('${data?.CardCode}')`
          )
            .then((res: any) => new BusinessPartner(res?.data, 0))
            .catch((err: any) => console.log(err))

          // attachment
          let AttachmentList: any = []
          let disabledFields: any = {
            CurrencyType: true,
          }

          if (data?.AttachmentEntry > 0) {
            AttachmentList = await request(
              "GET",
              `/Attachments2(${data?.AttachmentEntry})`
            )
              .then(async (res: any) => {
                const attachments: any = res?.data?.Attachments2_Lines
                if (attachments.length <= 0) return

                const files: any = attachments.map(async (e: any) => {
                  const req: any = await fetchSAPFile(
                    `/Attachments2(${data?.AttachmentEntry})/$value?filename='${e?.FileName}.${e?.FileExtension}'`
                  )
                  const blob: any = await arrayBufferToBlob(
                    req.data,
                    req.headers["content-type"],
                    `${e?.FileName}.${e?.FileExtension}`
                  )

                  return {
                    id: shortid.generate(),
                    key: Date.now(),
                    file: blob,
                    Path: "C:/Attachments2",
                    Filename: `${e?.FileName}.${e?.FileExtension}`,
                    Extension: `.${e?.FileExtension}`,
                    FreeText: "",
                    AttachmentDate: e?.AttachmentDate?.split("T")[0],
                  }
                })
                return await Promise.all(files)
              })
              .catch((error) => console.log(error))
          }

          state = {
            ...data,
            Description: data?.Comments,
            Owner: data?.DocumentsOwner,
            Currency: data?.DocCurrency,
            Items: data?.DocumentLines?.map((item: any) => {
              if (data?.type !== "dDocument_Items") {
                let plannedAmount = parseFloat(item.UnitPrice || 0)
                if (item.DiscountPercent > 0)
                  plannedAmount =
                    (parseFloat(item.DiscountPercent || 0) *
                      parseFloat(item.UnitPrice || 0)) /
                      (100 - parseFloat(item.DiscountPercent || 0)) +
                    item.UnitPrice

                return {
                  ItemCode: item.AccountCode,
                  VatGroup: item.VatGroup || null,
                  Discount: parseFloat(item.DiscountPercent),
                  LineTotal: item.UnitPrice,
                  UnitPrice: plannedAmount,
                  VatRate: item.TaxPercentagePerRow,
                }
              }

              return {
                ItemCode: item.ItemCode || null,
                ItemName: item.ItemDescription || item.Name || null,
                Quantity: item.Quantity || null,
                UnitPrice: item.UnitPrice || item.total,
                Discount: item.DiscountPercent || 0,
                VatGroup: item.VatGroup || "",
                UomGroupCode: item.UoMCode || null,
                UomEntry: item.UoMEntry || null,
                Currency: "AUD",
                LineTotal: item.LineTotal,
                VatRate: item.TaxPercentagePerRow,
              }
            }),
            ExchangeRate: data?.DocRate || 1,
            ShippingTo: data?.ShipToCode || null,
            BillingTo: data?.PayToCode || null,
            JournalRemark: data?.JournalMemo,
            PaymentTermType: data?.PaymentGroupCode,
            ShippingType: data?.TransportationCode,
            FederalTax: data?.FederalTaxID || null,
            CurrencyType: "B",
            vendor,
            DocDiscount: data?.DiscountPercent,
            BPAddresses: vendor?.bpAddress?.map(
              ({ addressName, addressType }: any) => {
                return { addressName: addressName, addressType: addressType }
              }
            ),
            AttachmentList,
            disabledFields,
            isStatusClose: data?.DocumentStatus === "bost_Close",
            RoundingValue: data?.RoundingDiffAmountFC || data?.RoundingDiffAmount,
            Rounding: (data?.Rounding == "tYES").toString(),
            Edit: true,
            PostingDate: data?.DocDate,
            DueDate: data?.DocDueDate,
            DocumentDate: data?.TaxDate,
          }
        })
        .catch((err: any) => console.log(err))
        .finally(() => {
          state["SerieLists"] = seriesList
          state["Series"] = defaultSeries.Series
          state["loading"] = false
          state["isLoadingSerie"] = false
          this.setState(state)
        })
    } else {
      state["SerieLists"] = seriesList
      state["Series"] = defaultSeries.Series
      state["DocNum"] = defaultSeries.NextNumber
      state["loading"] = false
      state["isLoadingSerie"] = false
      this.setState(state)
    }
  }

  handlerRemoveItem(code: string) {
    let items = [...(this.state.Items ?? [])]
    const index = items.findIndex((e: any) => e?.ItemCode === code)
    items.splice(index, 1)
    this.setState({ ...this.state, Items: items })
  }

  async handlerSubmit(event: any) {
    event.preventDefault()
    const data: any = { ...this.state }

    try {
      this.setState({ ...this.state, isSubmitting: false })
      await new Promise((resolve) => setTimeout(() => resolve(""), 800))
      const { id } = this.props?.match?.params || 0

      if (!data.CardCode) {
        data["error"] = { CardCode: "Vendor is Required!" }
        throw new FormValidateException("Vendor is Required!", 0)
      }

      if (!data?.DueDate) {
        data["error"] = { DueDate: "End date is Required!" }
        throw new FormValidateException("End date is Required!", 0)
      }

      if (!data?.Items || data?.Items?.length === 0) {
        data["error"] = { Items: "Items is missing and must at least one record!" }
        throw new FormValidateException("Items is missing", 2)
      }

      // attachment
      let AttachmentEntry = null
      const files = data?.AttachmentList?.map((item: any) => item)
      if (files?.length > 0) AttachmentEntry = await getAttachment(files)

      // items
      const DocumentLines = getItem(data?.Items || [], data?.DocType)
      const isAUD = (data?.Currency || "AUD") === "AUD"
      const roundingValue = data?.RoundingValue || 0

      const payloads = {
        // general
        DocDate: `${formatDate(data?.PostingDate)}"T00:00:00Z"`,
        DocDueDate: `${formatDate(data?.DueDate || new Date())}"T00:00:00Z"`,
        TaxDate: `${formatDate(data?.DocumentDate)}"T00:00:00Z"`,
        CardCode: data?.CardCode,
        CardName: data?.CardName,
        NumAtCard: data?.NumAtCard || null,
        DocCurrency: data?.CurrencyType === "B" ? data?.Currency : "",
        DocRate: data?.ExchangeRate || 0,
        ContactPersonCode: data?.ContactPersonCode || null,
        DocumentStatus: data?.DocumentStatus,

        // content
        DocType: data?.DocType,
        Comments: data?.Description || null,
        RoundingDiffAmount: isAUD ? roundingValue : 0,
        RoundingDiffAmountFC: isAUD ? 0 : roundingValue,
        // RoundingDiffAmountSC: isAUD ? roundingValue : 0,
        Rounding: data?.Rounding == "true" ? "tYES" : "tNO",
        DocumentsOwner: data?.Owner || null,
        DiscountPercent: data?.DocDiscount,
        DocumentLines,

        // logistic
        ShipToCode: data?.ShippingTo || null,
        PayToCode: data?.BillingTo || null,
        TransportationCode: data?.ShippingType,

        // accounting
        FederalTaxID: data?.FederalTax || null,
        PaymentMethod: data?.PaymentMethod || null,
        CashDiscountDateOffset: data?.CashDiscount || 0,
        CreateQRCodeFrom: data?.QRCode || null,
        PaymentGroupCode: data?.PaymentTermType || null,
        JournalMemo: data?.JournalRemark,
        Project: data?.BPProject || null,
        // attachment
        AttachmentEntry,
      }

      if (id) {
        return await request("PATCH", `/Returns(${id})`, payloads)
          .then((res: any) =>
            this.dialog.current?.success("Update Successfully.", id)
          )
          .catch((err: any) => this.dialog.current?.error(err.message))
          .finally(() => this.setState({ ...this.state, isSubmitting: false }))
      }

      await request("POST", "/Returns", payloads)
        .then((res: any) =>
          this.dialog.current?.success("Create Successfully.", res?.data?.DocEntry)
        )
        .catch((err: any) => this.dialog.current?.error(err.message))
        .finally(() => this.setState({ ...this.state, isSubmitting: false }))
    } catch (error: any) {
      if (error instanceof FormValidateException) {
        this.setState({ ...data, isSubmitting: false, tapIndex: error.tap })
        this.dialog.current?.error(error.message, "Invalid")
        return
      }

      this.setState({ ...data, isSubmitting: false })
      this.dialog.current?.error(error.message, "Invalid")
    }
  }

  async handlerChangeMenu(index: number) {
    this.setState({ ...this.state, tapIndex: index })
  }

  HeaderTaps = () => {
    return (
      <>
        <MenuButton
          active={this.state.tapIndex === 0}
          onClick={() => this.handlerChangeMenu(0)}
        >
          General
        </MenuButton>
        <MenuButton
          active={this.state.tapIndex === 2}
          onClick={() => this.handlerChangeMenu(2)}
        >
          Content
        </MenuButton>
        <MenuButton
          active={this.state.tapIndex === 1}
          onClick={() => this.handlerChangeMenu(1)}
        >
          Logistic
        </MenuButton>
        <MenuButton
          active={this.state.tapIndex === 4}
          onClick={() => this.handlerChangeMenu(4)}
        >
          Accounting
        </MenuButton>
        <MenuButton
          active={this.state.tapIndex === 3}
          onClick={() => this.handlerChangeMenu(3)}
        >
          Attachment
        </MenuButton>
      </>
    )
  }

  hanndAddNewItem() {
    if (!this.state?.CardCode) return
    if (this.state.DocType === "dDocument_Items")
      return this.itemModalRef.current?.onOpen(this.state?.CardCode, "sale")
    this.serviceRef.current?.onOpen(this.state?.CardCode)
  }

  FormRender = () => {
    return (
      <>
        <ServiceModalComponent
          ref={this.serviceRef}
          onOk={this.handlerConfirmItem}
        />
        <form
          id="formData"
          onSubmit={this.handlerSubmit}
          className="h-full w-full flex flex-col gap-4 relative"
        >
          {this.state.loading ? (
            <div className="w-full h-full flex item-center justify-center">
              <LoadingProgress />
            </div>
          ) : (
            <>
              <div className="grow">
                {this.state.tapIndex === 0 && (
                  <GeneralForm
                    data={this.state}
                    edit={this.props?.edit}
                    handlerChange={(key, value) => this.handlerChange(key, value)}
                  />
                )}

                {this.state.tapIndex === 1 && (
                  <LogisticForm
                    data={this.state}
                    edit={this.props?.edit}
                    handlerChange={(key, value) => {
                      this.handlerChange(key, value)
                    }}
                  />
                )}

                {this.state.tapIndex === 2 && (
                  <ContentForm
                    data={this.state}
                    handlerAddItem={() => {
                      this.hanndAddNewItem()
                    }}
                    handlerRemoveItem={(items: any[]) =>
                      this.setState({ ...this.state, Items: items })
                    }
                    handlerChangeItem={this.handlerChangeItems}
                    onChangeItemByCode={this.handlerChangeItemByCode}
                    onChange={this.handlerChange}
                  />
                )}

                {this.state.tapIndex === 3 && (
                  <AttachmentForm
                    data={this.state}
                    handlerChange={(key: any, value: any) => {
                      this.handlerChange(key, value)
                    }}
                  />
                )}
                {this.state.tapIndex === 4 && (
                  <AccountingForm
                    data={this.state}
                    edit={this.props?.edit}
                    handlerChange={(key, value) => {
                      this.handlerChange(key, value)
                    }}
                  />
                )}
              </div>
            </>
          )}

          <div className="sticky w-full bottom-4  mt-2 ">
            <div className="backdrop-blur-sm bg-white p-2 rounded-lg shadow-lg z-[1000] flex justify-between gap-3 border drop-shadow-sm">
              <div className="flex ">
                <LoadingButton
                  size="small"
                  sx={{ height: "25px" }}
                  variant="contained"
                  disableElevation
                >
                  <span className="px-3 text-[11px] py-1 text-white">Copy To</span>
                </LoadingButton>
              </div>
              <div className="flex items-center">
                <LoadingButton
                  type="submit"
                  sx={{ height: "25px" }}
                  className="bg-white"
                  loading={false}
                  size="small"
                  variant="contained"
                  disableElevation
                >
                  <span className="px-6 text-[11px] py-4 text-white">Save</span>
                </LoadingButton>
              </div>
            </div>
          </div>
        </form>
      </>
    )
  }
}

export default withRouter(Form)

const getItem = (items: any, type: any) =>
  items?.map((item: any) => {
    if (type !== "dDocument_Items")
      return {
        AccountCode: item.ItemCode,
        VatGroup: item.VatGroup || null,
        DiscountPercent: parseFloat(item.Discount),
        Currency: "AUD",
        UnitPrice: item.LineTotal,
      }

    return {
      ItemCode: item.ItemCode || null,
      ItemDescription: item.ItemName || item.Name || null,
      Quantity: item.Quantity || null,
      UnitPrice: item.UnitPrice || item.total,
      DiscountPercent: item.Discount || 0,
      VatGroup: item.VatGroup || item.taxCode || null,
      UoMCode: item.UomGroupCode || null,
      UoMEntry: item.UomEntry || null,
      Currency: "AUD",
    }
  })
