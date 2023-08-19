import { withRouter } from "@/routes/withRouter"
import { Component } from "react"
import { useMemo } from "react"
import { arrayBufferToBlob, currencyFormat, dateFormat } from "@/utilies"
import PreviewAttachment from "@/components/attachment/PreviewAttachment"
import DocumentHeaderComponent from "@/components/DocumenHeaderComponent"
import PaymentTermTypeRepository from "../../../../services/actions/paymentTermTypeRepository"
import ShippingTypeRepository from "@/services/actions/shippingTypeRepository"
import ItemGroupRepository from "@/services/actions/itemGroupRepository"
import MenuButton from "@/components/button/MenuButton"
import LoadingProgress from "@/components/LoadingProgress"
import shortid from "shortid"
import request from "@/utilies/request"
import BusinessPartner from "@/models/BusinessParter"
import { fetchSAPFile } from "@/helper/helper"
import MaterialReactTable from "material-react-table"

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
      await request("GET", `ReturnRequest(${id})`)
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
          this.setState({
            ...data,
            Description: data?.Comments,
            Owner: data?.DocumentsOwner,
            Currency: data?.DocCurrency,
            Items: data?.DocumentLines?.map((item: any) => {
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
            loading: false,
            BPProject: data?.Project,
            QRCode: data?.CreateQRCodeFrom,
            CashDiscount: data?.CashDiscountDateOffset,
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
        <DocumentHeaderComponent
          data={this.state}
          menuTabs={[
            "General",
            "Logistic",
            "Content",
            "Accounting",
            "Attachment",
          ].map((e, index) => (
            <MenuButton
              key={shortid.generate()}
              active={this.state.tapIndex === index}
              onClick={() => this.onTap(index)}
            >
              {e}
            </MenuButton>
          ))}
        />
        <div className="w-full h-full flex flex-col gap-4">
          {this.state.loading ? (
            <div className="grow flex justify-center items-center pb-6">
              <LoadingProgress />
            </div>
          ) : (
            <div className="grow w-full h-full  flex flex-col gap-3 px-7 mt-4">
              <div className="grow flex flex-col gap-3 ">
                <General data={this.state} />
                <Logistic data={this.state} />
                <Accounting data={this.state} />
                <Content data={this.state} />
                <PreviewAttachment attachmentEntry={this.state.AttachmentEntry} />
                <div className="mb-5"></div>
              </div>
            </div>
          )}
        </div>
      </>
    )
  }
}

export default withRouter(FormDetail)

const Accounting = (props: any) => {
  const { data }: any = props
  return (
    <div className="w-full bg-white shadow-lg border px-8 py-6 rounded-lg grid grid-cols-2 sm:grid-cols-1 gap-2 text-[15px] ">
      <h2 className="col-span-2 border-b pb-2 mb-2 font-bold text-lg  ">
        Accounting
      </h2>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500 font-medium text-sm">Journal Remark</span>{" "}
          <span className="col-span-2 font-medium text-sm ">
            : {data.JournalRemark}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500 font-medium text-sm">Payment Method</span>{" "}
          <span className="col-span-2 font-medium text-sm ">
            :{" "}
            {
              data?.vendor?.bpPaymentMethod?.find(
                (e: any) => e.PaymentMethodCode === data?.PaymentMethod
              )?.PaymentMethodCode
            }
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500 font-medium text-sm">BP Project</span>{" "}
          <span className="col-span-2 font-medium text-sm ">
            {/* : {new ProjectRepository().find(data.BPProject)} */}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500 font-medium text-sm">Federal Tax ID</span>{" "}
          <span className="col-span-2 font-medium text-sm ">
            : {data?.FederalTax ?? "N/A"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500 font-medium text-sm">Payment Terms</span>{" "}
          <span className="col-span-2 font-medium text-sm ">
            :{" "}
            {new PaymentTermTypeRepository().find(data?.PaymentTermType)
              ?.PaymentTermsGroupName ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500 font-medium text-sm">
            Cash Discount Date Offset
          </span>{" "}
          <span className="col-span-2 font-medium text-sm ">
            : {data?.CashDiscount ?? "N/A"}{" "}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500 font-medium text-sm">
            Create QR Code From
          </span>{" "}
          <span className="col-span-2 font-medium text-sm ">
            : {data?.QRCode ?? "N/A"}
          </span>
        </div>
      </div>
    </div>
  )
}

function General(props: any) {
  console.log([props.data.ContactPersonCode, props?.data?.vendor?.contactEmployee])

  return (
    <div className="bg-white shadow-lg border grid grid-cols-2 sm:grid-cols-1 gap-2 w-full rounded-lg  text-[15px] px-8 py-6">
      <h2 className="col-span-2 border-b pb-2 mb-2 font-bold text-lg">General</h2>
      <div className="flex flex-col gap-1 ">
        <div className="flex gap-2">
          <span className="w-4/12 text-gray-500 text-sm">Customer Code</span>
          <span className="w-8/12 font-medium text-sm">: {props.data.CardCode}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-4/12 text-gray-500 text-sm">Customer Name</span>
          <span className="w-8/12 font-medium text-sm">: {props.data.CardName}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-4/12 text-gray-500 text-sm">Contact Person Code</span>
          <span className="w-8/12 font-medium text-sm">
            :{" "}
            {props?.data?.vendor?.contactEmployee?.find(
              (e: any) => e.id == props.data.ContactPersonCode
            )?.name ?? "N/A"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="w-4/12 text-gray-500 text-sm">Customer Ref.No</span>
          <span className="w-8/12 font-medium text-sm">
            : {props.data?.NumAtCard}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          <span className="w-4/12 text-gray-500 text-sm ">Document Numbering</span>
          <span className="w-8/12 font-medium text-sm">: {props.data.DocNum}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-4/12 text-gray-500 text-sm">Posting Date</span>
          <span className="w-8/12 font-medium text-sm">
            : {dateFormat(props.data.PostingDate)}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="w-4/12 text-gray-500 text-sm">Return Date</span>
          <span className="w-8/12 font-medium text-sm">
            : {dateFormat(props.data.DueDate)}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="w-4/12 text-gray-500 text-sm">Document Date</span>
          <span className="w-8/12 font-medium text-sm">
            : {dateFormat(props.data.DocumentDate)}
          </span>
        </div>
      </div>
    </div>
  )
}

function Logistic(props: any) {
  const { data }: any = props
  return (
    <div className="w-full bg-white shadow-lg border px-8 py-6 rounded-lg grid grid-cols-2 sm:grid-cols-1 gap-2 text-[15px] ">
      <h2 className="col-span-2 border-b pb-2 mb-2 font-bold text-lg  ">
        Logisitic
      </h2>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500 font-medium text-sm">Ship-to Address</span>{" "}
          <span className="col-span-2 font-medium text-sm ">
            : {data.ShippingTo}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500 font-medium text-sm">Shipping Type</span>{" "}
          <span className="col-span-2 font-medium text-sm ">
            : {new ShippingTypeRepository().find(data?.ShippingType)?.Name ?? "N/A"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500 font-medium text-sm">Bill-to Address</span>{" "}
          <span className="col-span-2 font-medium text-sm ">: {data.BillingTo}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500 font-medium text-sm">Stamp No</span>{" "}
          <span className="col-span-2 font-medium text-sm ">: N/A</span>
        </div>
      </div>
    </div>
  )
}

function Content(props: any) {
  const { data } = props
  const itemGroupRepo = new ItemGroupRepository()

  const itemColumn: any = useMemo(
    () => [
      {
        accessorKey: "ItemCode",
        header: "Item NO.", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
      },
      {
        accessorKey: "ItemName",
        header: "Item Description",
        enableClickToCopy: true,
      },
      {
        accessorKey: "Quantity",
        header: "Quantity",
        Cell: ({ cell }: any) => currencyFormat(cell.getValue()),
      },
      {
        accessorKey: "UnitPrice",
        header: "Unit Price",
        Cell: ({ cell }: any) => currencyFormat(cell.getValue()),
      },
      {
        accessorKey: "ItemGroup",
        header: "Item Group",
        Cell: ({ cell }: any) => itemGroupRepo.find(cell.getValue())?.GroupName,
      },
      {
        accessorKey: "UomCode",
        header: "UoM Group",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "UnitsOfMeasurement",
        header: "Item Per Units",
        Cell: ({ cell }: any) => cell.getValue(),
      },
    ],
    [data]
  )

  return (
    <>
      <div className="bg-white shadow-lg border grid grid-cols-1 sm:grid-cols-1 gap-2 w-full rounded-lg  text-[15px] px-8 py-6">
        <div
          className={`col-span-2 grid grid-cols-3 md:grid-cols-1  gap-4 ${
            !props.viewOnly && "my-6"
          }`}
        >
          <div className="flex gap-4 items-start">
            <label htmlFor="currency" className=" flex pt-1 text-[#656565] text-sm">
              Currency
            </label>
            <span className="text-sm pt-1 ">
              : {data?.Currency} - {data?.DocRate}
            </span>
          </div>
          <div className="col-span-2 grid grid-cols-3 gap-3">
            <label
              htmlFor="currency"
              className="text-sm col-span-2 md:col-span-1 flex items-center justify-end md:justify-start text-[#656565]"
            >
              Item / Service Type :
            </label>
            <div className="md:col-span-2">Items</div>
            <label
              htmlFor="currency"
              className="text-sm col-span-2 md:col-span-1 flex items-center justify-end md:justify-start text-[#656565] "
            >
              Price Mode :
            </label>
            <div className="md:col-span-2">
              {data?.PriceMode?.replace("pmd", "")}
            </div>
          </div>
        </div>
        <MaterialReactTable
          enableColumnActions={false}
          enableColumnFilters={false}
          enablePagination={false}
          enableSorting={false}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          muiTableBodyRowProps={{ hover: false }}
          columns={itemColumn}
          data={data?.Items || []}
        />
        <div className="clearfix"></div>
        <div className="w-full flex justify-between">
          <div className="text-right"></div>
          <div className="grid grid-cols-2 gap-0  w-[26rem] text-gray-600">
            <p className="text-base text-gray-800 font-semibold">Total Summary</p>
            <span></span>
            <div className="col-span-2 my-1 border-b"></div>
            <span className="flex items-center pt-1 text-sm">
              Total Before Discount {}
            </span>
            {data?.Currency}{" "}
            {((data?.DocTotalSys - data?.VatSumSys) * (data?.DocRate || 1)).toFixed(
              2
            )}
            <span className="flex items-center pt-1 text-sm">Discount</span>
            <div className="grid grid-cols-2 gap-2">
              {parseFloat(data?.DocDiscount) || 0.0}
              <span className="w-full  flex items-center pt-1 justify-end text-sm">
                {data?.Currency}{" "}
                {(data?.TotalDiscountFC || data?.TotalDiscountSC).toFixed(2)}
              </span>
            </div>
            <span className="flex items-center pt-1 text-sm">Freight</span>
            <span className="pt-1 text-sm">: {data?.Currency} 0.00</span>
            <span className="flex items-center pt-1 text-sm">Rounding</span>
            <div className="grid grid-cols-1 gap-1">
              : {data?.Currency}{" "}
              {parseFloat(
                data?.RoundingDiffAmountFC || data?.RoundingDiffAmount
              ).toFixed(2)}
            </div>
            <span className="flex items-center pt-1 text-sm">Tax</span>
            <span className="flex items-center pt-1 text-sm">
              : {data?.Currency} {(data?.VatSumFc || data?.VatSum).toFixed(2)}
            </span>
            <span className="flex items-center pt-1 text-sm">Total Payment Due</span>
            <span className="flex items-center pt-1 text-sm">
              : {data?.Currency} {(data?.DocTotalFc || data?.DocTotalSys).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
