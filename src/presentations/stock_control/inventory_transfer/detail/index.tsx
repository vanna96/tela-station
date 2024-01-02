import { withRouter } from "@/routes/withRouter";
import { Component } from "react";
import { useMemo } from "react";
import {
  arrayBufferToBlob,
  currencyDetailFormat,
  currencyFormat,
  dateFormat,
} from "@/utilies";
import PreviewAttachment from "@/components/attachment/PreviewAttachment";
import DocumentHeaderComponent from "@/components/DocumenHeaderComponent";
import DocumentHeader from "@/components/DocumenHeader";
import PaymentTermTypeRepository from "../../../../services/actions/paymentTermTypeRepository";
import ShippingTypeRepository from "@/services/actions/shippingTypeRepository";
import ItemGroupRepository from "@/services/actions/itemGroupRepository";
import MenuButton from "@/components/button/MenuButton";
import LoadingProgress from "@/components/LoadingProgress";
import shortid from "shortid";
import request from "@/utilies/request";
import BusinessPartner from "@/models/BusinessParter";
import { fetchSAPFile } from "@/helper/helper";
import MaterialReactTable from "material-react-table";
import { Breadcrumb } from "../../components/Breadcrumn";
import { useNavigate } from "react-router-dom";
import { Checkbox, CircularProgress, darken } from "@mui/material";
import WarehouseRepository from "@/services/warehouseRepository";
import Attachment from "@/models/Attachment";
import UnitOfMeasurementGroupRepository from "@/services/actions/unitOfMeasurementGroupRepository";
import { NumericFormat } from "react-number-format";
import DocumentHeaderDetails from "@/components/DocumentHeaderDetails";

class Details extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      isError: false,
      message: "",
      tapIndex: 0,
    };

    this.fetchData = this.fetchData.bind(this);
    this.onTap = this.onTap.bind(this);
  }

  componentDidMount(): void {
    this.fetchData();
  }

  async fetchData() {
    const { id } = this.props.match.params;
    const data = this.props.query.find("pa-id-" + id);
    this.setState({ ...this.state, loading: true });
    await new Promise((resolve) => setTimeout(() => resolve(""), 800));

    if (!data) {
      const { id }: any = this.props?.match?.params || 0;
      await request("GET", `StockTransfers(${id})`)
        .then(async (res: any) => {
          const data: any = res?.data;
          // vendor
          // attachment
          let AttachmentList: any = [];
          let disabledFields: any = {
            CurrencyType: true,
          };

          if (data?.AttachmentEntry > 0) {
            AttachmentList = await request(
              "GET",
              `/Attachments2(${data?.AttachmentEntry})`
            )
              .then(async (res: any) => {
                const attachments: any = res?.data?.Attachments2_Lines;
                if (attachments.length <= 0) return;

                const files: any = attachments.map(async (e: any) => {
                  const req: any = await fetchSAPFile(
                    `/Attachments2(${data?.AttachmentEntry})/$value?filename='${e?.FileName}.${e?.FileExtension}'`
                  );
                  const blob: any = await arrayBufferToBlob(
                    req.data,
                    req.headers["content-type"],
                    `${e?.FileName}.${e?.FileExtension}`
                  );

                  return {
                    id: shortid.generate(),
                    key: Date.now(),
                    file: blob,
                    Path: "C:/Attachments2",
                    Filename: `${e?.FileName}.${e?.FileExtension}`,
                    Extension: `.${e?.FileExtension}`,
                    FreeText: "",
                    AttachmentDate: e?.AttachmentDate?.split("T")[0],
                  };
                });
                return await Promise.all(files);
              })
              .catch((error) => console.log(error));
          }
          this.setState({
            ...data,
            Description: data?.Comments,
            Owner: data?.DocumentsOwner,
            Currency: data?.DocCurrency,
            Items: data?.StockTransferLines?.map((item: any) => {
              return {
                ItemCode: item.ItemCode || null,
                ItemName: item.ItemDescription || item.Name || null,
                Quantity: item.Quantity || null,
                UnitPrice: item.UnitPrice || item.total,
                GrossPrice: item.GrossPrice || item.total,
                GrossTotal: item.GrossTotal,
                Discount: item.DiscountPercent || 0,
                VatGroup: item.VatGroup || "",
                UomGroupCode: item.UoMCode || null,
                UomEntry: item.UoMEntry || null,
                Currency: item.Currency,
                LineTotal: item.LineTotal,
                VatRate: item.TaxPercentagePerRow,
                WarehouseCode: item.WarehouseCode,
                DiscountPercent: item.DiscountPercent,
                MeasureUnit: item.MeasureUnit,
                ItemsGroupCode: item.CostingCode,
              };
            }),
            ExchangeRate: data?.DocRate || 1,
            ShippingTo: data?.ShipToCode || null,
            BillingTo: data?.PayToCode || null,
            JournalRemark: data?.JournalMemo,
            PaymentTermType: data?.PaymentGroupCode,
            ShippingType: data?.TransportationCode,
            FederalTax: data?.FederalTaxID || null,
            CurrencyType: "B",
            DocDiscount: data?.DiscountPercent,
            AttachmentList,
            disabledFields,
            isStatusClose: data?.DocumentStatus === "bost_Close",
            RoundingValue:
              data?.RoundingDiffAmountFC || data?.RoundingDiffAmount,
            Rounding: (data?.Rounding == "tYES").toString(),
            Edit: true,
            PostingDate: data?.DocDate,
            DueDate: data?.DocDueDate,
            DocumentDate: data?.TaxDate,
            loading: false,
            BPProject: data?.Project,
            QRCode: data?.CreateQRCodeFrom,
            CashDiscount: data?.CashDiscountDateOffset,
          });
        })
        .catch((err: any) =>
          this.setState({ isError: true, message: err.message })
        );
    } else {
      this.setState({ ...data, loading: false });
    }
  }

  navigateToSalesOrder = () => {
    const { history } = this.props;
    history.push("/sale/sales-order");
  };

  onTap(index: number) {
    this.setState({ ...this.state, tapIndex: index });
  }
  async handlerChangeMenu(index: number) {
    this.setState({ ...this.state, tapIndex: index });
  }
  HeaderTabs = () => {
    return (
      <>
        <div className="w-full flex justify-between">
          <div className="">
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
              <span>Content</span>
            </MenuButton>

            <MenuButton
              active={this.state.tapIndex === 3}
              onClick={() => this.handlerChangeMenu(3)}
            >
              Attachment
            </MenuButton>
          </div>
        </div>
      </>
    );
  };

  render() {
    return (
      <>
        <DocumentHeader
          data={this.state}
          menuTabs={this.HeaderTabs}
          handlerChangeMenu={this.handlerChangeMenu}
        />

        <form
          id="formData"
          className="h-full w-full flex flex-col gap-4 relative"
        >
          {this.state.loading ? (
            <div className="w-full h-full flex item-center justify-center">
              <LoadingProgress />
            </div>
          ) : (
            <>
              <div className="relative">
                <div className="grow  px-16 py-4 ">
                  {this.state.tapIndex === 0 && <General data={this.state} />}
                  {this.state.tapIndex === 1 && <Content data={this.state} />}

                  {this.state.tapIndex === 3 && (
                    <PreviewAttachment
                      attachmentEntry={this.state.AttachmentEntry}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </form>
      </>
    );
  }
}

export default withRouter(Details);

function General(props: any) {
  return (
    <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-full">
      <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
        <h2>Basic Information</h2>
      </div>
      {/*  */}
      <div className="py-4 px-8">
        <div className="grid grid-cols-12 ">
          <div className="col-span-5">
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700 ">Branch</div>
              <div className="col-span-1 text-gray-900">
                {props?.data?.BPLName ?? "N/A"}
              </div>
            </div>
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700 ">From Warehouse</div>
              <div className="col-span-1 text-gray-900">
                {new WarehouseRepository().find(props?.data?.FromWarehouse)
                  ?.WarehouseName ?? "N/A"}
              </div>
            </div>

            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700 ">To Warehouse</div>
              <div className="col-span-1 text-gray-900">
                {new WarehouseRepository().find(props?.data?.ToWarehouse)
                  ?.WarehouseName ?? "N/A"}
              </div>
            </div>
            {/* <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700 ">Bin Location</div>
              <div className="col-span-1 text-gray-900">
                {props.data.CardCode}
              </div>
            </div> */}
          </div>
          {/*  */}
          <div className="col-span-2"></div>
          {/*  */}
          <div className="col-span-5 ">
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700">Series</div>
              <div className="col-span-1  text-gray-900">
                {props.data.Series}
              </div>
            </div>
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700">DocNum</div>
              <div className="col-span-1  text-gray-900">
                {props.data.DocNum}
              </div>
            </div>
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700 ">Posting Date</div>
              <div className="col-span-1 text-gray-900">
                {dateFormat(props.data.TaxDate)}
              </div>
            </div>
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700 ">Delivery Date</div>
              <div className="col-span-1 text-gray-900">
                {dateFormat(props.data.DueDate)}
              </div>
            </div>

            {/* <div className="grid grid-cols-2 py-1">
              <div className="col-span-1 text-gray-700 ">Line of Business</div>
              <div className="col-span-1 text-gray-900">
                {props?.data?.U_tl_arbusi ?? "N/A"}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

function Content(props: any) {
  const { data } = props;
  const itemGroupRepo = new ItemGroupRepository();

  const itemColumn: any = useMemo(
    () => [
      {
        accessorKey: "ItemCode",
        header: "Item NO.", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 150,
      },
      {
        accessorKey: "ItemName",
        header: "Item Description",
        enableClickToCopy: true,
        size: 200,
      },

      {
        accessorKey: "Quantity",
        header: "Quantity ",
        size: 60,
        Cell: ({ cell }: any) => (
          <NumericFormat
            value={cell.getValue() ?? 0}
            thousandSeparator
            fixedDecimalScale
            disabled
            className="bg-white w-full"
            decimalScale={1}
          />
        ),
      },

      {
        accessorKey: "FromWarehouseCode",
        header: "From Warehouse",
        size: 60,
        Cell: ({ cell }: any) =>
          new WarehouseRepository().find(cell.getValue())?.WarehouseName,
      },
      {
        accessorKey: "WarehouseCode",
        header: "To Warehouse",
        size: 60,
        Cell: ({ cell }: any) =>
          new WarehouseRepository().find(cell.getValue())?.WarehouseName,
      },
      {
        accessorKey: "UoMCode",
        header: "UoM ",
        enableClickToCopy: true,
        size: 70,
      },
      {
        accessorKey: "StockTransferLinesBinAllocations",
        header: "From Bin",
        size: 60,
        Cell: ({ cell }: any) => {
          // Access the StockTransferLinesBinAllocations array
          const binAllocations = cell.getValue();

          // Extract and concatenate BinAbsEntry values into a string
          const binAbsEntries = binAllocations
            ?.map((allocation: any) => allocation.BinAbsEntry)
            ?.join(", ");

          return binAbsEntries;
        },
      },
    ],
    [data]
  );

  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-full">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
          <h2>Content Information</h2>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
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
            muiTableProps={{
              sx: {
                border: "1px solid rgba(211,211,211)",
              },
            }}
          />
        </div>
        <div>
          <div className="py-4 px-8">
            <div className="grid grid-cols-12 ">
              <div className="col-span-5">
                <div className="grid grid-cols-2 py-2">
                  <div className="col-span-1 text-gray-700 ">Remark</div>
                  <div className="col-span-1 text-gray-900">
                    {props?.data?.Comments ?? "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <div className="col-span-1 text-gray-700 ">
                    Journal Remark
                  </div>
                  <div className="col-span-1 text-gray-900">
                    {props.data.JournalMemo ?? "N/A"}
                  </div>
                </div>
              </div>
              {/*  */}
              <div className="col-span-2"></div>
              {/*  */}
              <div className="col-span-5 "></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

//test
