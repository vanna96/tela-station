import CoreFormDocument from "@/components/core/CoreFormDocument"
import { withRouter } from "@/routes/withRouter"
import { LoadingButton } from "@mui/lab"
import DocumentSerieRepository from "@/services/actions/documentSerie"
import MenuButton from "@/components/button/MenuButton"
import { FormValidateException } from "@/utilies/error"
import LoadingProgress from "@/components/LoadingProgress"

import GeneralForm from "./../components/GeneralForm"
import ContentForm from "./../components/ContentForm"
import AttachmentForm from "../components/AttachmentForm"
import React, { useContext } from "react"
import { ServiceModalComponent } from "../components/ServiceModalComponent"
import { fetchSAPFile, formatDate, getAttachment } from "@/helper/helper"
import request from "@/utilies/request"
import BusinessPartner from "@/models/BusinessParter"
import { arrayBufferToBlob } from "@/utilies"
import shortid from "shortid"
import { APIContext } from "../context/APIContext"
import PaymentForm from "../components/PaymentForm"
import { useDocumentTotalHook } from "../hook/useDocumentTotalHook"

class Form extends CoreFormDocument {
  serviceRef = React.createRef<ServiceModalComponent>()

  constructor(props: any) {
    super(props)
    this.state = {
      ...this.state,
      DocType: "rSupplier",
      PaymentonAccount: "tNo",
      DocContentType: "dDocument_Items",
      ContentLoading: false,
      ExchangeRate: 1,
      LineofBusiness: "",
      SalesPersonCode: "",
      Branch: 1,
    } as any

    this.onInit = this.onInit.bind(this)
    this.handlerRemoveItem = this.handlerRemoveItem.bind(this)
    this.handlerSubmit = this.handlerSubmit.bind(this)
    this.handlerChangeMenu = this.handlerChangeMenu.bind(this)
    this.hanndAddNewItem = this.hanndAddNewItem.bind(this)
    this.hanndResetState = this.hanndResetState.bind(this)
    this.incoming = this.incoming.bind(this)
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
        Document: "24",
      })
      this.props?.query?.set("return-series", seriesList)
    }

    if (!defaultSeries) {
      defaultSeries = await DocumentSerieRepository.getDefaultDocumentSerie({
        Document: "24",
      })
      this.props?.query?.set("return-default-series", defaultSeries)
    }

    if (this.props.edit) {
      const { id }: any = this.props?.match?.params || 0
      await request("GET", `IncomingPayments(${id})`)
        .then(async (res: any) => {
          const data: any = res?.data
          // vendor
          const vendor: any = await request(
            "GET",
            `/BusinessPartners('${data?.CardCode}')`,
          )
            .then((res: any) => new BusinessPartner(res?.data, 0))
            .catch((err: any) => console.log(err))

          // invoice
          const invoice = await request(
            "GET",
            `/sml.svc/TL_AR_INCOMING_PAYMENT?$filter = InvoiceType  eq 'it_Invoice' and BPCode eq '${data?.CardCode}' and BPLId eq ${data?.BPLID}`,
          )
            .then((res: any) => {
              return res.data?.value?.sort(
                (a: any, b: any) =>
                  parseInt(b.OverDueDays) - parseInt(a.OverDueDays),
              )
            })
            .catch((err: any) => {})

          // attachment
          let AttachmentList: any = []

          if (data?.AttachmentEntry > 0) {
            AttachmentList = await request(
              "GET",
              `/Attachments2(${data?.AttachmentEntry})`,
            )
              .then(async (res: any) => {
                const attachments: any = res?.data?.Attachments2_Lines
                if (attachments.length <= 0) return

                const files: any = attachments.map(async (e: any) => {
                  const req: any = await fetchSAPFile(
                    `/Attachments2(${data?.AttachmentEntry})/$value?filename='${e?.FileName}.${e?.FileExtension}'`,
                  )
                  const blob: any = await arrayBufferToBlob(
                    req.data,
                    req.headers["content-type"],
                    `${e?.FileName}.${e?.FileExtension}`,
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
          // console.log(data);
          // DocCurrency: data?.Currency,
          // CashAccount: data?.GLCash || "",
          // CashSum: data?.GLCashAmount || 0,

          // TransferAccount: data?.GLBank || "",
          // TransferSum: data?.GLBankAmount || 0,

          // CheckAccount: data?.GLCheck || "",

          state = {
            ...data,
            GLCheck: data?.CheckAccount,

            GLCash: data?.CashAccount,
            GLCashAmount: data?.CashSumFC || data?.CashSum,

            GLBank: data?.TransferAccount,
            GLBankAmount: (data?.TransferSum || 0) * (data?.DocRate || 1),
            Currency: data?.DocCurrency,
            Items: data?.PaymentInvoices?.map((inv: any) => {
              // DocumentNo === i.DocEntry || DocEntry === i.DocEntry
              const find = invoice?.find(
                ({ DocumentNo, DocEntry }: any) => DocEntry === inv.DocEntry,
              )
              if (find) {
                return {
                  ...find,
                  ...inv,
                  TotalPayment: inv?.AppliedFC || inv?.AppliedSys,
                }
              }
            }),
            ExchangeRate: data?.DocRate || 1,
            vendor,
            paymentMeanCheckData:
              data?.PaymentChecks?.map((check: any) => {
                return {
                  due_date: check?.DueDate || new Date(),
                  amount: check?.CheckSum || 0,
                  bank: check?.BankCode || "",
                  check_no: check?.CheckNumber,
                }
              }) || [],
            // DocDiscount: data?.DiscountPercent,
            // BPAddresses: vendor?.bpAddress?.map(
            //   ({ addressName, addressType }: any) => {
            //     return { addressName: addressName, addressType: addressType }
            //   },
            // ),
            // disabledFields,
            AttachmentList,
            isStatusClose: data?.DocumentStatus === "bost_Close",
            edit: true,
            PostingDate: data?.DocDate,
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
        data["error"] = { CardCode: "Customer is Required!" }
        throw new FormValidateException("Customer is Required!", 0)
      }

      // attachment
      let AttachmentEntry = null
      const files = data?.AttachmentList?.map((item: any) => item)
      if (files?.length > 0) AttachmentEntry = await getAttachment(files)

      // on Edit

      if (id) {
        return await request("PATCH", `/IncomingPayments(${id})`, {
          TaxDate: `${formatDate(data?.DocumentDate || new Date())}"T00:00:00Z"`,
        })
          .then(
            (res: any) => this.dialog.current?.success("Update Successfully.", id),
          )
          .catch((err: any) => this.dialog.current?.error(err.message))
          .finally(() => this.setState({ ...this.state, isSubmitting: false }))
      }

      // PaymentChecks
      const PaymentChecks = data?.paymentMeanCheckData?.map((check: any) => {
        return {
          DueDate: check?.due_date || new Date(),
          CheckSum: check?.amount || 0,
          BankCode: check?.bank || "",
          CheckNumber: check?.check_no || "",
        }
      })

      // items
      const PaymentInvoices =
        data?.Items?.filter(
          ({ TotalPayment, DocTotal }: any) =>
            parseFloat(TotalPayment || 0) > 0 ||
            (DocTotal < 0 && parseFloat(TotalPayment || 0) !== 0),
        )?.map((item: any) => {
          return {
            DocEntry: item.DocEntry,
            DocNum: item.DocumentNo,
            SumApplied:
              item?.FCCurrency === sysInfo()?.data?.SystemCurrency
                ? parseFloat(item.TotalPayment).toFixed(2) || 0
                : 0,
            AppliedSys:
              item?.FCCurrency === sysInfo()?.data?.SystemCurrency
                ? parseFloat(item.TotalPayment).toFixed(2) || 0
                : 0,
            AppliedFC:
              item?.FCCurrency !== sysInfo()?.data?.SystemCurrency
                ? parseFloat(Math.abs(item.TotalPayment).toString()).toFixed(2)
                : 0,
            DiscountPercent: item?.Discount || 0,
            InvoiceType: item?.InvoiceType,
          }
        }) || []

      const payload = {
        // general
        Series: data?.Series || null,
        DocTypte: `rCustomer`,
        DocDate: `${formatDate(data?.PostingDate || new Date())}"T00:00:00Z"`,
        TaxDate: `${formatDate(data?.DocumentDate || new Date())}"T00:00:00Z"`,
        CardCode: data?.CardCode,
        CardName: data?.CardName,
        BPLID: data?.Branch,

        DocCurrency: data?.Currency,
        CashAccount: data?.GLCash || "",
        CashSum: data?.GLCashAmount || 0,

        TransferAccount: data?.GLBank || "",
        TransferSum: data?.GLBankAmount || 0,

        CheckAccount: data?.GLCheck || "",
        PaymentChecks: PaymentChecks,
        ControlAccount: data?.ControlAccount,

        PaymentInvoices,
        AttachmentEntry,
      }

      await request("POST", "/IncomingPayments", payload)
        .then(
          (res: any) =>
            this.dialog.current?.success(
              "Create Successfully.",
              res?.data?.DocEntry,
            ),
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

  hanndResetState(props: any) {
    this.setState({
      DocType: "rSupplier",
      PaymentonAccount: "tNo",
      DocContentType: "dDocument_Items",
      BPProject: "",
      JournalMemo: "",
      Description: "",
      ContentLoading: "",
      //
      collapse: true,
      CardCode: "",
      CardName: "",
      ContactPersonCode: undefined,
      ContactPersonList: [],
      ShippingType: null,
      Phone: "",
      Email: "",
      Owner: "",
      Buyer: "",
      VendorRef: "",
      DocumentStatus: "Open",
      Remark: "",
      DocumentServiceItemType: "I",
      AttachmentEntry: 0,
      Project: "",
      isOpenItem: false,
      isOpenVendor: false,
      isOpenAccount: false,
      isOpenProject: false,
      PaymentMethod: "",
      PaymentTermType: "",
      Currency: "",
      PriceLists: "",
      SalesPersonCode: "",
      ShipToDefault: "",
      Renewal: false,
      Items: [],
      isSubmitting: false,
      message: "",
      showDialogMessage: false,
      title: "",
      showDistribution: false,
      inWhichDimension: 0,
      vendorType: "customer",
      isApproved: false,
      isOpenRequester: false,
      isOpenRequesterEmployee: false,
      Department: "",
      Branch: "",
      ReqType: 12,
      DocTaxTotal: 0,
      DocTotal: 0,
      DocTotalBeforeDiscount: 0,
      DocDiscountPercent: 0,
      DocDiscountPrice: 0,
      Rounded: false,
      Address: null,
      Address2: null,
      disable: {},
      tapIndex: 0,
      error: {},
      ...props,
    } as any)
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
          active={this.state.tapIndex === 1}
          onClick={() => this.handlerChangeMenu(1)}
        >
          Payment Means
        </MenuButton>
        <MenuButton
          active={this.state.tapIndex === 2}
          onClick={() => this.handlerChangeMenu(2)}
        >
          Content
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
    this.serviceRef.current?.onOpen(this.state?.CardCode)
  }

  incoming: any = async (data: any, LineOfBussiness: any) => {
    let filter: any = []
    if (!this.state?.CardCode) return
    //
    if (this.state?.CardCode) filter.push(`BPCode eq '${this.state?.CardCode}'`)
    if (this.state?.Branch) filter.push(`BPLId eq ${this.state?.Branch}`)
    if (
      !(
        (this.state?.SalesPersonCode || "") == "" ||
        this.state?.SalesPersonCode == "-1"
      )
    )
      filter.push(` SlpCode eq ${this.state?.SalesPersonCode}`)
    if (this.state?.Lob) {
      const FactorDescription = LineOfBussiness?.find(
        ({ FactorCode }: any) => FactorCode === this.state?.Lob,
      )?.FactorDescription
      filter.push(` NumAtCard eq '${FactorDescription}'`)
    }

    await request(
      "GET",
      `/sml.svc/TL_AR_INCOMING_PAYMENT?$filter = InvoiceType  eq 'it_Invoice' and ${filter.join(
        " and ",
      )}`,
    )
      .then((res: any) => {
        const results = res.data?.value
          ?.sort(
            (a: any, b: any) => parseInt(b.OverDueDays) - parseInt(a.OverDueDays),
          )
          .filter(({ DocStatus }: any) => DocStatus === "O")
        this.setState({ ...this.state, Items: results, ContentLoading: false })
      })
      .catch((err: any) => this.setState({ ...this.state, ContentLoading: false }))
  }

  FormRender = () => {
    let { LineOfBussiness }: any = useContext(APIContext)
    let CardCode: any = this.state?.CardCode || ""
    let BranchIDD: any = this.state?.Branch || ""
    let Lob: any = this.state?.Lob || ""
    let SalesPersonCode: any = this.state?.SalesPersonCode || ""
    let SerieListsData: any = this.state?.SerieLists || []

    let prevData = usePrevious({ CardCode, BranchIDD, Lob, SalesPersonCode })

    React.useEffect(() => {
      if (!this.props.edit) {
        if (
          CardCode &&
          (prevData?.CardCode !== CardCode ||
            prevData?.Lob !== Lob ||
            prevData?.SalesPersonCode !== SalesPersonCode)
        ) {
          this.setState({
            ...this.state,
            ContentLoading: true,
          })
          this.incoming(this.state, LineOfBussiness)
        }

        if (SerieListsData.length > 0 && prevData?.BranchIDD !== BranchIDD) {
          const serie = this.state?.SerieLists?.find(
            ({ BPLID }: any) => BPLID === BranchIDD,
          )
          this.setState({
            ...this.state,
            Series: serie?.Series,
            DocNum: serie?.NextNumber,
            ContentLoading: true,
          })
          this.incoming(this.state, LineOfBussiness)
        }
      }
    }, [CardCode, BranchIDD, Lob, SalesPersonCode, this.state?.SerieLists])

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
                    hanndResetState={this.hanndResetState}
                    data={this.state}
                    edit={this.props?.edit}
                    handlerChange={(key, value) => this.handlerChange(key, value)}
                  />
                )}

                {this.state.tapIndex === 1 && (
                  <PaymentForm
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
                    ContentLoading={this.state.ContentLoading}
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
                    ContentLoading={this.state.ContentLoading}
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
                  <span className="px-3 text-[11px] py-1 text-white">Cancel</span>
                </LoadingButton>
              </div>
              <div className="flex items-center space-x-4">
                <LoadingButton
                  type="submit"
                  sx={{ height: "25px" }}
                  className="bg-white"
                  loading={false}
                  size="small"
                  variant="contained"
                  disableElevation
                >
                  <span className="px-6 text-[11px] py-4 text-white">
                    {this.props.edit ? "Update" : "Save"}
                  </span>
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

function usePrevious(value: any) {
  const ref: any = React.useRef()
  React.useEffect(() => {
    ref.current = value
  })
  return ref.current
}
