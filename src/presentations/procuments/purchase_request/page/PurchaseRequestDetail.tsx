import { withRouter } from "@/routes/withRouter";
import React, { Component, useEffect } from "react";
import PurchaseRequest from "@/models/PurchaseRequest";
// import { PurchaseRequestProps, PurchaseRequestDocumentLineProps } from '../../../../models/PurchaseRequest';
import Taps from "@/components/button/Taps";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { currencyFormat, fileToBase64 } from "@/utilies";
import Modal from "@/components/modal/Modal";
import { CircularProgress } from "@mui/material";
import PreviewAttachment from "@/components/attachment/PreviewAttachment";
import Formular from "../../../../utilies/formular";
import DocumentHeaderComponent from '../../../../components/DocumenHeaderComponent';
import OwnerRepository from '@/services/actions/ownerRepository';
import DepartmentRepository from '@/services/actions/departmentRepository';
import { dateFormat } from '../../../../utilies/index';
import BranchRepository from '../../../../services/actions/branchRepository';
import PurchaseRequestRepository from "../repository/purchaseRequestRepository";

class PurchaseRequestDetail extends Component<any, any> {
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

  async initData() {
    const { id } = this.props.match.params;
    let state: any = this.props.query.find('pr-id-' + id);
    if (!state) {
      await new PurchaseRequestRepository()
        .find(this.props.match.params.id)
        .then((res: any) => {
          state = res;
          this.props.query.set('pr-id-' + id, res);
        }).catch((e) => {
          this.setState({ isError: true, message: e.message });
          return;
        })
    }
    this.setState({ ...state, loading: false });
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
            <div className="min-h-[10rem] grid grid-cols-2 gap-2 w-full shadow-sm rounded-lg bg-white text-[12px] p-6">
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500 ">
                    Doc Num
                  </span>
                  <span className="w-8/12 font-medium">
                    : {this.state.DocNum}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Requester</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.CardCode}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Requester Name</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.CardName}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Branch</span>
                  <span className="w-8/12 font-medium">
                    : {new BranchRepository().find(this.state.RequesterBranch)?.Name}
                    {/* : {new Branchrepository().find(this.state.requesterBranch)?.name} */}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Department</span>
                  <span className="w-8/12 font-medium">
                    {/* : {this.state.requesterDepartment} */}
                    : {new DepartmentRepository().find(this.state.RequesterDepartment)?.Name}

                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">E-mail Address</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.RequesterEmail}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Status</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.Status?.replace("bost_", "")}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Posting Date</span>
                  <span className="w-8/12 font-medium">
                    : {dateFormat(this.state.DocDate)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Valid Until</span>
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
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Required Date</span>
                  <span className="w-8/12 font-medium">
                    : {dateFormat(this.state.RequriedDate)}
                  </span>
                </div>
              </div>
            </div>
            <div className="grow flex flex-col gap-3 p-6 shadow-sm rounded-lg bg-white">
              <Taps items={["Content", "Attachment"]}>
                <Content data={this.state} />
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

export default withRouter(PurchaseRequestDetail);

function Content(props: any) {
  const { data } = props;

  const itemColumn = useMemo(
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
        header: "Item Description", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 200,
      },
      {
        accessorKey: "Quantity",
        header: "Required Qty.",
        enableClickToCopy: true,

      },
      {
        accessorKey: "UnitPrice",
        header: "Info Price",
        enableClickToCopy: true,
        Cell: ({ cell }: any) => currencyFormat(cell.getValue()),
      },
      {
        accessorKey: "DiscountPercent",
        header: "Discount %	",
        enableClickToCopy: true,
      },
      {
        accessorKey: "VatGroup",
        header: "Tax Code",
        enableClickToCopy: true,
      },
      {
        accessorKey: "LineTotal",
        header: "Total (LC)	",
        enableClickToCopy: true,
        Cell: ({ cell }: any) => currencyFormat(cell.getValue()),
      },
      {
        accessorKey: "UomCode",
        header: "UoM Code",
      },
    ],
    [data]
  );

  const serviceColumns = React.useMemo(
    () => [
      {
        accessorKey: "ItemName",
        header: "Description",
        Cell: ({ cell }: any) => (cell.getValue()),
      },
      {
        accessorKey: "RequiredDate",
        header: "Required Date",
        Cell: ({ cell }: any) => dateFormat(cell.getValue()),
      },
      {
        accessorKey: "LineVendor",
        header: "Vendor",
        Cell: ({ cell }: any) => (cell.getValue()),
      },
      {
        accessorKey: "AccountCode",
        header: "G/L Account",
      },
      {
        accessorKey: "AccountName",
        header: "G/L Account Name",
      },
      {
        accessorKey: "VatGroup",
        header: "Tax Code",
      },
      {
        accessorKey: "LineTotal",
        header: "Total (LC)",
        Cell: ({ cell }: any) => currencyFormat(cell.getValue()),

      },
    ],
    [data]
  );

  return (
    <div className="data-table text-inherit  border-none p-0 mt-3">
      <MaterialReactTable
        columns={data?.DocType === "dDocument_Items" ? itemColumn : serviceColumns}
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
      <div className="grow w-full grid grid-cols-2 gap-2 text-[12px] py-2">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Owner</span>
            <span className="col-span-2 font-medium">
              : {(new OwnerRepository()?.find(data?.Owner)?.name) ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Remark</span>
            <span className="col-span-2 font-medium">: {data?.Comments ?? "N/A"}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Total Before Discount</span>
            <span className="col-span-2 font-medium">
              : {currencyFormat(Formular.findTotalBeforeDiscount(data?.Items)) ?? ""}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Freight</span>
            <span className="col-span-2 font-medium">: {data.Freight ?? "N/A"}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Tax</span>
            <span className="col-span-2 font-medium">: {currencyFormat(data.VatSumSys)}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Total Payment Due</span>
            <span className="col-span-2 font-medium">: {currencyFormat(data.DocTotalSys)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
