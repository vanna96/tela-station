import { withRouter } from '@/routes/withRouter';
import React, { Component, useEffect } from 'react'
import StockTransfer from '../../../../models/StockTransfer';
import { StockTransferProps, StockTransferDocumentLineProps } from '../../../../models/StockTransfer';
import { HiOutlineEye, HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight, HiOutlineDocumentAdd, HiOutlineChevronDown } from "react-icons/hi";
import Taps from '@/components/button/Taps';
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import { currencyDetailFormat, currencyFormat, dateFormat, discountFormat, fileToBase64 } from '@/utilies';
import { AttachmentLine } from '../../../../models/Attachment';
import Modal from '@/components/modal/Modal';
import PreviewAttachment from '@/components/attachment/PreviewAttachment';
import { CircularProgress } from '@mui/material';
import DocumentHeaderComponent from '@/components/DocumenHeaderComponent';
import OwnerRepository from '@/services/actions/ownerRepository';
import PaymentTermTypeRepository from '@/services/actions/paymentTermTypeRepository';
import ShippingTypeRepository from '@/services/actions/shippingTypeRepository';
import BusinessPartner, { ContactEmployee } from '@/models/BusinessParter';
import BuyerRepository from '@/services/actions/BuyerRepository';
import BusinessPartnerRepository from '@/services/actions/bussinessPartnerRepository';
import InternalTransferRepository from '@/services/actions/internalTransferRepository';
import WarehouseRepository from '@/services/warehouseRepository';
import InternalTransfer from '@/models/InternalTransfer';
import PriceListRepository from '@/services/actions/pricelistRepository';


class StockDamageRequestDetail extends Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      isError: false,
      message: '',
    }

    this.initData = this.initData.bind(this);
  }


  componentDidMount(): void {
    this.initData()
  }

  initData() {
    const { id } = this.props.match.params;
    const data = this.props.location.state as InternalTransfer;
    console.log(data);

    if (data) {
      setTimeout(() => {
        let stockTransfer = data;
        stockTransfer as InternalTransfer;
        if (stockTransfer.contactPerson) {
          new BusinessPartnerRepository().findContactEmployee(stockTransfer.cardCode!).then((res: BusinessPartner) => {
            stockTransfer.contactPersonList = res.contactEmployee || [];
            stockTransfer.shippingType = res.bpAddress || [];
            this.setState({ ...stockTransfer, loading: false })
          })
        }
        // if (stockTransfer.shipToDefault) {
        //   new BusinessPartnerRepository().findShipToAddress(stockTransfer.shipToDefault!).then((res: BusinessPartner) => {
        //     stockTransfer.shippingList = res.bpAddress || [];
        //     this.setState({ ...stockTransfer, loading: false })
        //   })
        else {
          this.setState({ ...stockTransfer, loading: false })
        }
      }, 500)
    } else {
      new InternalTransferRepository().find(id).then((res: any) => {
        this.setState({ ...res, loading: false });
      }).catch((e: Error) => {
        this.setState({ isError: true, message: e.message });
      })
    }
  }

  render() {

    return (
      <div className='w-full h-full flex flex-col p-4 gap-4'>
        <DocumentHeaderComponent data={this.state} />

        <Modal open={this.state.isError} title='Oop' onClose={() => { }} onOk={() => console.log(this.props.history.goBack())}>
          <span>
            {this.state?.message}
          </span>
        </Modal>

        {this.state.loading ? <div className='grow flex justify-center items-center'>
          <CircularProgress />
        </div> :
          (<>
            <div className='min-h-[10rem] grid grid-cols-2 gap-3 w-full shadow-sm rounded-lg bg-white text-[12px] p-6'>
              <div className='flex flex-col gap-1'>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Document Number</span>
                  <span className='w-8/12 font-medium'>: {this.state.docNum || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Card Code</span>
                  <span className='w-8/12 font-medium'>: {this.state.cardCode || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Card Name</span>
                  <span className='w-8/12 font-medium'>: {this.state.cardName || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Contact Person</span>
                  <span className='w-8/12 font-medium'>: {this.state?.contactPersonList?.find((e: ContactEmployee) => e.id === this.state.contactPerson)?.name || "N/A"}</span>

                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Ship To Code</span>
                  <span className='w-8/12 font-medium'>: {this.state?.shipToCode || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Ship To Address</span>
                  <span className='w-8/12 font-medium'>: {this.state?.address || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Price List</span>
                  <span className='w-8/12 font-medium'>: {new PriceListRepository().find(this.state.priceList)?.PriceListName || "N/A"}</span>
                </div>

              </div>
              <div className='flex flex-col gap-1'>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Status</span>
                  <span className='w-8/12 font-medium'>: {this.state.documentStatus?.replace('bost_', '') || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Posting Date</span>
                  <span className='w-8/12 font-medium'>: {dateFormat(this.state.docDate) || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Valid Until</span>
                  <span className='w-8/12 font-medium'>: {dateFormat(this.state.dueDate) || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Document Date</span>
                  <span className='w-8/12 font-medium'>: {dateFormat(this.state.taxDate) || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>From Warehouse</span>
                  <span className='w-8/12 font-medium'>: {this.state.fromWarehouse} {new WarehouseRepository().find(parseFloat(this.state.fromWarehouse))?.WarehouseName}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>To Warehouse</span>
                  <span className='w-8/12 font-medium'>: {this.state.toWarehouse}   {new WarehouseRepository().find(this.state.toWarehouse)?.WarehouseName}</span>

                </div>


              </div>
            </div>
            <div className='grow flex flex-col gap-3 p-6 shadow-sm rounded-lg bg-white'>
              <Taps
                items={['Content', 'Attachment']}
              >
                <Content data={this.state} />
                <PreviewAttachment attachmentEntry={this.state.attachmentEntry || "N/A"} />
              </Taps>
            </div>
          </>)

        }

      </div>
    )
  }
}

export default withRouter(StockDamageRequestDetail);



function Content(props: any) {

  const { data } = props;

  const itemColumn = useMemo(() => [
    {
      accessorKey: "itemCode",
      header: "Item NO.", //uses the default width from defaultColumn prop
      enableClickToCopy: true,
      enableFilterMatchHighlighting: true,
      size: 88,
    },
    {
      accessorKey: "itemDescription",
      header: "Descriptions",

    },
    // {
    //   accessorKey: "fromWarehouseCode",
    //   header: "	From Warehouse ",
    //   enableClickToCopy: true,
    // },
    // {
    //   accessorKey: "warehouseCode",
    //   header: "	To Warehouse",
    //   enableClickToCopy: true,
    // },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "unitPrice",
      header: "Price",
      Cell: ({ cell }: any) => currencyDetailFormat(cell.getValue()),
    },
    {
      accessorKey: "distributionRule",
      header: "Line of Business",
      Cell: ({ cell }: any) => cell.getValue(),
    },
    {
      accessorKey: "distributionRule1",
      header: "Product Line",
      Cell: ({ cell }: any) => cell.getValue(),
    },
    {
      accessorKey: "distributionRule2",
      header: "	Department",
      Cell: ({ cell }: any) => (cell.getValue()),
    },
  ], [data]);

  return <div className="data-table text-inherit  border-none p-0 mt-3">
    <MaterialReactTable
      columns={itemColumn}
      data={data?.items || []}
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
      state={{
        // isLoading: true,
      }}
    />
    <div className='flex flex-col gap-3'>
      <div className='flex gap-2'>
        <span className='w-4/12 text-gray-500 text-sm'>Sale Employee</span>
        <span className="w-8/12 font-medium text-sm">
          : {new BuyerRepository().find(data.salesPersonCode)?.name || "N/A"}
        </span>
      </div>
      <div className='flex gap-2'>
        <span className='w-4/12 text-gray-500 text-sm'>Pick and Pack Remark</span>
        <span className="w-8/12 font-medium text-sm">
          : {data?.pickAndPackRemarks ?? "N/A"}

        </span>
      </div>
      <div className='flex gap-2'>
        <span className='w-4/12 text-gray-500 text-sm'>Journal Remarks</span>
        <span className='w-8/12 font-medium text-sm'>: {data?.journalMemo || "N/A"}</span>
      </div>
      <div className='flex gap-2'>
        <span className='w-4/12 text-gray-500 text-sm'>Remarks</span>
        <span className='w-8/12 font-medium text-sm'>: {data?.comments || "N/A"}</span>
      </div>

    </div>
  </div>

}