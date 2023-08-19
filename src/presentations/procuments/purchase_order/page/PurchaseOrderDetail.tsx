import { withRouter } from "@/routes/withRouter";
import React, { Component } from "react";
import Taps from "@/components/button/Taps";
import { useMemo } from "react";
import { currencyDetailFormat, currencyFormat } from "@/utilies";
import Modal from "@/components/modal/Modal";
import PreviewAttachment from "@/components/attachment/PreviewAttachment";
import { CircularProgress } from "@mui/material";
import OwnerRepository from "@/services/actions/ownerRepository";
import PaymentTermTypeRepository from "@/services/actions/paymentTermTypeRepository";
import ShippingTypeRepository from "@/services/actions/shippingTypeRepository";
import DocumentHeaderComponent from "@/components/DocumenHeaderComponent";
import BusinessPartner, { ContactEmployee } from "@/models/BusinessParter";
import { dateFormat } from "../../../../utilies/index";
import BusinessPartnerRepository from "@/services/actions/bussinessPartnerRepository";
import PurchaseOrder from "../model";
import MaterialReactTable from "material-react-table";
import BuyerRepository from "@/services/actions/buyerRepository";
import { isItemType } from "@/constants";
import PurchaseOrderRepository from "../repository";

class PurchaseOrderDetail extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      isError: false,
      message: "",
    };

    this.initData = this.initData.bind(this);
  }

  componentDidMount(): void {
    this.initData();
  }

  initData() {
    const { id } = this.props.match.params;
    const data = this.props.query.find('po-id-' + id);
    if (!data) {
      new PurchaseOrderRepository().find(id).then(async (res: any) => {
        this.props.query.set('po-id-' + id, res);
        this.setState({ ...res, loading: false });
      }).catch((e: Error) => {
        this.setState({ isError: true, message: e.message });
      })
    } else {
      this.setState({ ...data, loading: false });
    }
  }

  render() {

    return (
      <div className="w-full h-full flex flex-col p-4 gap-4">
        <DocumentHeaderComponent data={this.state} />

        <Modal
          open={this.state.isError}
          title="Oop"
          onClose={() => { }}
          onOk={() => this.props.history.goBack()}
        >
          <span>{this.state?.message}</span>
        </Modal>

        {this.state.loading ? (
          <div className="grow flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <>
            <div className="min-h-[10rem] grid grid-cols-2 gap-3 w-full shadow-sm rounded-lg bg-white text-[12px] p-6">
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Document Number</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.DocNum}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Vendor</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.CardCode}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Name</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.CardName}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Contact Person</span>
                  <span className="w-8/12 font-medium ">
                    :
                    {
                      this.state?.ContactPersonList?.find(
                        (e: ContactEmployee) =>
                          e.id === this.state.ContactPersonCode
                      )?.name
                    }
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Vendor Ref .No</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.NumAtCard ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500 ">Local Currency</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.Currency}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Status</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.DocumentStatus?.replace("bost_", "")}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Posting Date</span>
                  <span className="w-8/12 font-medium">
                    : {dateFormat(this.state.DocDate)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Delivery Date</span>
                  <span className="w-8/12 font-medium">
                    : {dateFormat(this.state.DocDueDate)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Document Date</span>
                  <span className="w-8/12 font-medium">
                    : {dateFormat(this.state.TaxDate)}
                  </span>
                </div>
              </div>
            </div>
            <div className="grow flex flex-col gap-3 p-6 shadow-sm rounded-lg bg-white">
              <Taps
                items={["Content", "Logistic", "Accountting", "Attachment"]}
              >
                <Content data={this.state} />
                <Logistic data={this.state} />
                <Account data={this.state} />

                <PreviewAttachment
                  attachmentEntry={this.state.AttachmentEntry}
                />
              </Taps>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default withRouter(PurchaseOrderDetail);

function Content(props: any) {
  const { data } = props;
  const subTotal = data.Items?.reduce((accumulator: any, currentLine: any) => {
    return accumulator + currentLine.LineTotal;
  }, 0);
  const itemColumn = useMemo(
    () => [
      {
        accessorKey: "ItemCode",
        header: "Item NO.", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 95,
      },
      {
        accessorKey: "Quantity",
        header: "  Required Qty.",
        enableClickToCopy: true,
        size: 150,
      },
      {
        accessorKey: "UnitPrice",
        header: "Info Price",
        Cell: ({ cell }: any) => currencyDetailFormat(cell.getValue()),
      },
      {
        accessorKey: "DiscountPercent",
        header: "  Discount %",
        Cell: ({ cell }: any) => currencyFormat(cell.getValue()),
      },
      {
        accessorKey: "VatGroup",
        header: "Tax Code",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "LineTotal",
        header: "Total (LC)",
        Cell: ({ cell }: any) => currencyDetailFormat(cell.getValue()),
      },
      {
        accessorKey: "UomCode",
        header: "UoM Code",
        Cell: ({ cell }: any) => cell.getValue(),
      },
    ],
    [data]
  );

  const serviceColumns = React.useMemo(
    () => [
      {
        accessorKey: "ItemName",
        header: "Descrition",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "AccountNo",
        header: "G/L Account",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "AccountNameD",
        header: "G/L Account Name",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "VatGroup",
        header: "Tax Code",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "LineTotal",
        header: "Total (LC)",
        Cell: ({ cell }: any) => cell.getValue(),
      },
      {
        accessorKey: "BlanketAgreementNumber",
        header: "BlanketAgreementNumber",
        Cell: ({ cell }: any) => cell.getValue(),
      },
    ],
    [data]
  );

  return (
    <div className="data-table text-inherit  border-none p-0 mt-3">
      <MaterialReactTable
        columns={isItemType(data?.DocType) ? itemColumn : serviceColumns}
        data={data?.Items ?? []}
        enableHiding={true}
        initialState={{ density: "compact" }}
        enableDensityToggle={false}
        enableColumnResizing
        enableStickyHeader={true}
        enableStickyFooter={true}
        enableTableHead={true}
        enableTopToolbar={false}
        enableColumnActions={false}
        enableGlobalFilter={false}
        enableFilters={false}
        enableFullScreenToggle={false}
        enablePagination={false}
        getRowId={(row: any) => row.DocEntry}
        state={
          {
            // isLoading: true,
          }
        }
      />
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <span className="w-4/12 text-gray-500 text-sm">Buyer</span>
          <span className="w-8/12 font-medium text-sm">
            : {new BuyerRepository().find(data.SalesPersonCode)?.name ?? "N/A"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="w-4/12 text-gray-500 text-sm">Owner</span>
          <span className="w-8/12 font-medium text-sm">
            : {new OwnerRepository().find(data.DocumentsOwner)?.name}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="w-4/12 text-gray-500 text-sm">
            Total Before Discount
          </span>
          <span className="w-8/12 font-medium text-sm">
            : {currencyFormat(subTotal)}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="w-4/12 text-gray-500 text-sm">Freight</span>
          <span className="w-8/12 font-medium text-sm">
            : {data?.Freight || "N/A"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="w-4/12 text-gray-500 text-sm">Tax</span>
          <span className="w-8/12 font-medium text-sm">: {currencyFormat(data?.VatSum)}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-4/12 text-gray-500 text-sm">
            Total Payment Due
          </span>
          <span className="w-8/12 font-medium text-sm">
            : {currencyFormat(data?.DocTotalSys)}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="w-4/12 text-gray-500 text-sm">Remark</span>
          <span className="w-8/12 font-medium text-sm">
            : {data?.Comments ?? "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
function Account(props: any) {
  const { data }: any = props;

  return (
    <div className="grow w-full grid grid-cols-2 gap-2 text-sm py-2">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Jounral Remark</span>{" "}
          <span className="col-span-2 font-medium">
            : {data.JournalMemo?.replace("at", "") ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Payment Terms</span>{" "}
          <span className="col-span-2 font-medium">
            :{" "}
            {
              new PaymentTermTypeRepository().find(
                data.PaymentGroupCode ?? "N/A"
              )?.PaymentTermsGroupName
            }
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Payment Methods</span>
          <span className="col-span-2 font-medium">
            : {data.PaymentMethod ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Manually Recalulate Due Date</span>{" "}
          <span className="col-span-2 font-medium">
            : {data.ManualNumber ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Cash Discount Date Offset</span>{" "}
          <span className="col-span-2 font-medium">
            : {data.CashDiscountDateOffset ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Bussiness partner Projec</span>{" "}
          <span className="col-span-2 font-medium">
            : {data.Project ?? "N/A"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Create QR Code From</span>{" "}
          <span className="col-span-2 font-medium">
            : {data.CreateQRCodeFrom || "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Cancellation Date</span>{" "}
          <span className="col-span-2 font-medium">
            : {dateFormat(data.CancelDate)}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Indicator</span>{" "}
          <span className="col-span-2 font-medium">
            : {data.Indicator ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Federal Tax ID</span>{" "}
          <span className="col-span-2 font-medium">
            : {data.FederalTaxID ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Order Number</span>{" "}
          <span className="col-span-2 font-medium">
            : {data.ImportFileNum ?? "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}

function Logistic(props: any) {
  const { data }: any = props;

  return (
    <div className="grow w-full grid grid-cols-2 gap-2 text-sm py-2">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500 ">Ship To</span>{" "}
          <span className="col-span-2 font-medium">: {data.Address2}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Pay To</span>{" "}
          <span className="col-span-2 font-medium">: {data.Address}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Shiping Type</span>{" "}
          <span className="col-span-2 font-medium">
            : {new ShippingTypeRepository().find(data.TransportationCode)?.Name}
          </span>
        </div>
      </div>
    </div>
  );
}
