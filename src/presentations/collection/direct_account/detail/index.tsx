import { withRouter } from "@/routes/withRouter"
import { Component, useContext } from "react"
import { arrayBufferToBlob, dateFormat } from "@/utilies"
import DocumentHeaderComponent from "@/components/DocumenHeaderComponent"
import PaymentTermTypeRepository from "../../../../services/actions/paymentTermTypeRepository"
import MenuButton from "@/components/button/MenuButton"
import LoadingProgress from "@/components/LoadingProgress"
import shortid from "shortid"
import request from "@/utilies/request"
import BusinessPartner from "@/models/BusinessParter"
import { fetchSAPFile, numberWithCommas, sysInfo } from "@/helper/helper"
import { CircularProgress } from "@mui/material"
import CashAccount from "@/components/selectbox/CashAccount"
import MUITextField from "@/components/input/MUITextField"
import PaymentTable from "../components/PaymentTable"
import { APIContext } from "../context/APIContext"
import { useDocumentTotalHook } from "../hook/useDocumentTotalHook"
import PreviewAttachment from "@/components/attachment/PreviewAttachment"
import React from "react"
import ContentComponent from "../components/ContentComponents"
import MaterialReactTable from "material-react-table"
import DistributionRuleRepository from "@/services/actions/distributionRulesRepository"

class FormDetail extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      loading: true,
      isError: false,
      message: "",
      tapIndex: 0,
    }

    this.fetchData = this.fetchData.bind(this)
    this.onTap = this.onTap.bind(this)
  }

  componentDidMount(): void {
    this.fetchData()
  }

  async fetchData() {
    const { id } = this.props.match.params
    const data = this.props.query.find("pa-id-" + id)
    this.setState({ ...this.state, loading: true })
    await new Promise((resolve) => setTimeout(() => resolve(""), 800))

    if (!data) {
      const { id }: any = this.props?.match?.params || 0
      await request("GET", `IncomingPayments(${id})`)
        .then(async (res: any) => {
          const data: any = res?.data

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

          // vendor
          const vendor: any = await request(
            "GET",
            `/BusinessPartners('${data?.CardCode}')`,
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

          console.log(data?.PaymentAccounts)

          this.setState({
            ...data,
            Currency: data?.DocCurrency,
            ExchangeRate: data?.DocRate || 1,
            Edit: true,
            PostingDate: data?.DocDate,
            DueDate: data?.DocDueDate,
            DocumentDate: data?.TaxDate,
            loading: false,

            GLCash: data?.CashAccount || "",
            GLCashAmount: parseFloat(data?.CashSumFC || data?.CashSum || 0).toFixed(
              2,
            ),
            GLBank: data?.TransferAccount,
            GLBankAmount: parseFloat(
              (data?.TransferSum || 0) * (data?.DocRate || 1),
            ).toFixed(2),
            CheckAccount: data?.GLCheck || "",

            paymentMeanCheckData:
              data?.PaymentChecks?.map((check: any) => {
                return {
                  due_date: check?.DueDate || new Date(),
                  amount: check?.CheckSum || 0,
                  bank: check?.BankCode || "",
                  check_no: check?.CheckNumber,
                }
              }) || [],

            AttachmentList,

            Items: data?.PaymentAccounts?.map((inv: any) => {
              return {
                ItemCode: inv.AccountCode,
                VatGroup: inv.VatGroup || null,
                ItemName: inv.AccountName || null,
                LineTotal: inv.SumPaid || 0,
                UnitPrice: inv.SumPaid || 0,
                VatRate:
                  (parseFloat(inv?.VatAmount || 0) * parseFloat(inv.SumPaid || 0)) /
                  100,
                LineOfBussiness: inv?.ProfitCenter || "",
                revenueLine: inv?.ProfitCenter2 || "",
                REV: inv?.ProfitCenter3 || "",
              }
            }),
          })
        })
        .catch((err: any) => this.setState({ isError: true, message: err.message }))
    } else {
      this.setState({ ...data, loading: false })
    }
  }

  onTap(index: number) {
    this.setState({ ...this.state, tapIndex: index })
  }

  render() {
    return (
      <>
        <div className="w-full px-4 py-2 flex flex-col gap-1 relative bg-white ">
          <DocumentHeaderComponent data={this.state} menuTabs />

          <div className="w-full h-full flex flex-col gap-4">
            {this.state.loading ? (
              <div className="grow flex justify-center items-center pb-6">
                <CircularProgress />
              </div>
            ) : (
              <div className="grow w-full h-full  flex flex-col gap-3 px-7 mt-4">
                <div className="grow flex flex-col gap-3 ">
                  <div className="bg-white  w-full px-8 py-4  ">
                    <General data={this.state} />
                    <PaymentMean data={this.state} />
                    <Content data={this.state} />
                    <PreviewAttachment
                      attachmentEntry={this.state.AttachmentEntry}
                    />
                  </div>

                  <div className="mb-5"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    )
  }
}

export default withRouter(FormDetail)

function General(props: any) {
  const { data }: any = props
  return (
    <>
      {/* <fieldset className="border border-solid border-gray-300 p-3 mb-6 shadow-md">
        <legend className="text-md px-2 font-bold">General Information</legend> */}

      {/* <div className="overflow-auto w-full bg-white shadow-lg border p-4 rounded-lg mb-6">
        <h2 className="col-span-2 border-b pb-2 mb-4 font-bold text-lg">
          Payment Means -{" "}
          <b>
            {data?.Currency || sysInfo?.SystemCurrency}{" "}
            {parseFloat(totalUsd).toFixed(2) || "0.00"}
          </b>
        </h2> */}

      <div className="overflow-auto w-full bg-white shadow-lg border p-4 rounded-lg mb-6 py-4 px-8">
        <h2 className="col-span-2 border-b pb-2 mb-4 font-bold text-lg">General</h2>
        <div className="grid grid-cols-12 ">
          <div className="col-span-5">
            <div className="grid grid-cols-2 py-1">
              <div className="col-span-1 text-gray-700 ">Customer</div>
              <div className="col-span-1 text-gray-900">{props.data.CardCode}</div>
            </div>
            <div className="grid grid-cols-2 py-1">
              <div className="col-span-1 text-gray-700 ">Name</div>
              <div className="col-span-1 text-gray-900">{props.data.CardName}</div>
            </div>
            <div className="grid grid-cols-2 py-1">
              <div className="col-span-1 text-gray-700 ">Branch</div>
              <div className="col-span-1 text-gray-900">
                {data?.BPLName ?? "N/A"}
              </div>
            </div>
            <div className="grid grid-cols-2 py-1">
              <div className="col-span-1 text-gray-700 ">Currency</div>
              <div className="col-span-1 text-gray-900">
                {data?.Currency ?? "N/A"}{" "}
                {data?.ExchangeRate > 1 && ` - ${data?.ExchangeRate}`}
              </div>
            </div>
          </div>
          <div className="col-span-2"></div>
          <div className="col-span-5 ">
            <div className="grid grid-cols-2 py-1">
              <div className="col-span-1 text-gray-700">DocNum</div>
              <div className="col-span-1  text-gray-900">{props.data.DocNum}</div>
            </div>
            <div className="grid grid-cols-2 py-1">
              <div className="col-span-1 text-gray-700 ">Posting Date</div>
              <div className="col-span-1 text-gray-900">
                {dateFormat(props.data.TaxDate)}
              </div>
            </div>
            <div className="grid grid-cols-2 py-1">
              <div className="col-span-1 text-gray-700 ">Document Date</div>
              <div className="col-span-1 text-gray-900">
                {dateFormat(props.data.DocDate)}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </fieldset> */}
    </>
  )
}

function PaymentMean(props: any) {
  const { data } = props
  const { sysInfo }: any = useContext(APIContext)
  const [totalUsd] = useDocumentTotalHook(data)

  return (
    <>
      <div className="overflow-auto w-full bg-white shadow-lg border p-4 rounded-lg mb-6 py-4 px-8">
        <h2 className="col-span-2 border-b pb-2 mb-4 font-bold text-lg">
          Payment Means -{" "}
          <b>
            {data?.Currency || sysInfo?.SystemCurrency}{" "}
            {parseFloat(totalUsd).toFixed(2) || "0.00"}
          </b>
        </h2>
        <div className="mt-6">
          {/* <fieldset className="border border-solid border-gray-300 p-3 mb-6 shadow-md">
          <legend className="text-md px-2 font-bold">Payment Means - Check</legend> */}
          <div className="grid grid-cols-2 my-4">
            <div className="pl-4 pr-20">
              <div className="grid grid-cols-5">
                <div className="col-span-2">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    GL Check Account
                  </label>
                </div>
                <div className="col-span-3">
                  <CashAccount
                    // onChange={(e: any) => onChange("GLCheck", e.target.value)}
                    value={data?.GLCheck}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
            <div className="pl-20"></div>
          </div>
          <PaymentTable data={data} onChange={() => console.log()} />
          {/* </fieldset>
        <fieldset className="border border-solid border-gray-300 p-3 mb-6 shadow-md">
          <legend className="text-md px-2 font-bold">
            Payment Means - Bank Transfer
          </legend> */}
          <div className="grid grid-cols-2 my-4">
            <div className="pl-4 pr-20">
              <div className="grid grid-cols-5">
                <div className="col-span-2">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    GL Bank Account
                  </label>
                </div>
                <div className="col-span-3">
                  <CashAccount
                    // onChange={(e: any) => onChange("GLBank", e.target.value)}
                    value={data?.GLBank}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
            <div className="pl-20">
              <div className="grid grid-cols-5 py-2">
                <div className="col-span-2">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Total
                  </label>
                </div>
                <div className="col-span-3">
                  <MUITextField
                    // onChange={(e: any) => onChange("GLBankAmount", e.target.value)}
                    value={data?.GLBankAmount}
                    type="number"
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* </fieldset>
        <fieldset className="border border-solid border-gray-300 p-3 mb-6 shadow-md">
          <legend className="text-md px-2 font-bold">Payment Means - Cash</legend> */}
          <div className="grid grid-cols-2 my-4">
            <div className="pl-4 pr-20">
              <div className="grid grid-cols-5">
                <div className="col-span-2">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    GL Cash Account
                  </label>
                </div>
                <div className="col-span-3">
                  <CashAccount
                    // onChange={(e: any) => onChange("GLCash", e.target.value)}
                    value={data?.GLCash}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
            <div className="pl-20">
              <div className="grid grid-cols-5 py-2">
                <div className="col-span-2">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Total
                  </label>
                </div>
                <div className="col-span-3">
                  <MUITextField
                    // onChange={(e: any) => onChange("GLCashAmount", e.target.value)}
                    value={data?.GLCashAmount}
                    type="number"
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* </fieldset> */}
        </div>
      </div>
    </>
  )
}

function Content(props: any) {
  const { data }: any = props

  const serviceColumns = React.useMemo(
    () => [
      {
        accessorKey: "ItemCode",
        header: "G/L Account", //uses the default width from defaultColumn prop
        visible: true,
        Header: (header: any) => <label>G/L Account</label>,
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.ItemCode)
            return (
              <div
                role="button"
                className="px-4 py-2 text-inherit rounded hover:bg-gray-200 border shadow-inner"
                // onClick={handlerAddItem}
              >
                Add Row
              </div>
            )

          return (
            <MUITextField
              key={"ItemCode_" + cell.getValue()}
              value={cell.row.original?.ItemCode ?? ""}
              type="text"
              readOnly={true}
              endAdornment
            />
          )
        },
      },
      {
        accessorKey: "ItemName",
        header: "G/L Account Name", //uses the default width from defaultColumn prop
        visible: true,
        Header: (header: any) => <label>G/L Account Name</label>,
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.ItemCode) return

          return (
            <MUITextField
              key={"ItemName_" + cell.getValue()}
              type="text"
              value={cell.row.original?.ItemName}
              readOnly={true}
            />
          )
        },
      },
      {
        accessorKey: "VatGroup",
        header: "Tax Code", //uses the default width from defaultColumn prop
        visible: true,
        Header: (header: any) => <label>Tax Code</label>,
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.ItemCode) return
          return (
            <MUITextField
              key={"unitPrice_" + cell.getValue()}
              value={cell.getValue()}
              type="text"
              readOnly={true}
            />
          )
        },
      },
      {
        accessorKey: "revenueLine",
        header: "Revenue Line", //uses the default width from defaultColumn prop
        visible: true,
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.ItemCode) return
          return (
            <MUITextField
              key={"revenueLine_" + cell.getValue()}
              value={
                new DistributionRuleRepository().find(cell.row.original?.revenueLine)
                  ?.FactorDescription
              }
              type="text"
              readOnly={true}
            />
          )
        },
      },
      {
        accessorKey: "REV",
        header: "Product Line", //uses the default width from defaultColumn prop
        visible: true,
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.ItemCode) return
          console.log(cell.row.original)

          return (
            <MUITextField
              key={"REV_" + cell.getValue()}
              value={
                new DistributionRuleRepository().find(cell.row.original?.REV)
                  ?.FactorDescription
              }
              type="text"
              readOnly={true}
            />
          )
        },
      },
      {
        accessorKey: "OpenAmountLC",
        header: "Amount", //uses the default width from defaultColumn prop
        visible: true,
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.ItemCode) return null
          return (
            <MUITextField
              startAdornment={data?.Currency}
              value={cell.row?.original?.UnitPrice || 0}
              readOnly={true}
            />
          )
        },
      },
    ],
    [],
  )

  const [paymentMeans, netTotal, rate] = useDocumentTotalHook(props?.data)

  return (
    <div className="overflow-auto w-full bg-white shadow-lg border p-4 rounded-lg mb-6 py-4 px-8">
      <h2 className="col-span-2 border-b pb-2 mb-4 font-bold text-lg">Content</h2>
      {/* <fieldset className="border border-solid border-gray-300 p-3 mb-6 shadow-md">
        <legend className="text-md px-2 font-bold">Content Information</legend> */}
      <MaterialReactTable
        columns={serviceColumns}
        data={data?.Items ?? []}
        enableRowNumbers={true}
        enableStickyHeader={true}
        enableColumnActions={false}
        enableColumnFilters={false}
        enablePagination={false}
        enableSorting={false}
        enableTopToolbar={false}
        enableColumnResizing={true}
        enableColumnFilterModes={false}
        enableDensityToggle={false}
        enableFilters={false}
        enableFullScreenToggle={false}
        enableGlobalFilter={false}
        enableHiding={true}
        enablePinning={true}
        enableStickyFooter={false}
        enableMultiRowSelection={true}
        state={{}}
        muiTableBodyRowProps={() => ({
          sx: { cursor: "pointer" },
        })}
        enableTableFooter={false}
      />
      <div className="col-span-2">
        <div className="grid grid-cols-2">
          <div className="w-full grid grid-cols-2 mt-4"></div>
          <div className="pl-20">
            <div className="grid grid-cols-5 mb-4"></div>
            <div className="grid grid-cols-5">
              <div className="col-span-2">
                <span className="flex items-center pt-1 text-sm">
                  <b>Net Total:</b>
                </span>
              </div>
              <div className="col-span-3">
                <MUITextField
                  placeholder="0.00"
                  type="text"
                  startAdornment={props?.data?.Currency}
                  readOnly={true}
                  value={netTotal.toFixed(2)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5">
              <div className="col-span-2">
                <span className="flex items-center pt-1 text-sm">
                  <b>Total Tax:</b>
                </span>
              </div>
              <div className="col-span-3">
                <MUITextField
                  placeholder="0.00"
                  type="text"
                  startAdornment={props?.data?.Currency}
                  readOnly={true}
                  value={rate.toFixed(2)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5">
              <div className="col-span-2">
                <span className="flex items-center pt-1 text-sm">
                  <b>Total Amount Due:</b>
                </span>
              </div>
              <div className="col-span-3">
                <MUITextField
                  placeholder="0.00"
                  type="text"
                  startAdornment={props?.data?.Currency}
                  readOnly={true}
                  value={(netTotal + rate).toFixed(2)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </fieldset> */}
    </div>
  )
}
