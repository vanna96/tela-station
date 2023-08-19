import { withRouter } from '@/routes/withRouter';
import React, { Component, useEffect } from 'react'
import PurchaseAgreement from '../../../../models/PurchaseAgreement';
import Taps from '@/components/button/Taps';
import Modal from '@/components/modal/Modal';
import PreviewAttachment from '@/components/attachment/PreviewAttachment';
import { CircularProgress } from '@mui/material';
import DocumentHeaderComponent from '@/components/DocumenHeaderComponent';
import Binlocation from '@/models/Binlocation';
import BinlocationRepository from '@/services/actions/BinlocationRepository';



class BinlocationDetail extends Component<any, any> {

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
    const data = this.props.location.state as Binlocation;
    console.log(data);

    if (data) {
      setTimeout(() => {
        let warehouse = data;
        warehouse as Binlocation;
        if ("") {

        } else {
          this.setState({ ...warehouse, loading: false })
        }
      }, 500)
    } else {
      new BinlocationRepository().find(id).then((res: any) => {
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
            <div className='grid grid-cols-2 sm:grid-cols-1 gap-2 w-full shadow-sm rounded-lg bg-white text-[12px] p-6'>
              <div className='flex flex-col gap-1'>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Warehouse</span>
                  <span className='w-8/12 font-medium'>: {this.state.warehouse || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Shelf</span>
                  <span className='w-8/12 font-medium'>: {this.state.sublevel2 || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Bin Code</span>
                  <span className='w-8/12 font-medium'>: {this.state.binCode || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Aisle</span>
                  <span className='w-8/12 font-medium'>: {this.state.sublevel1 || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Level</span>
                  <span className='w-8/12 font-medium'>: {this.state.sublevel3 || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Description</span>
                  <span className='w-8/12 font-medium'>: {this.state.description || "N/A"}</span>
                </div>
              </div>
            </div>
            <div className='grow flex flex-col gap-3 p-6 shadow-sm rounded-lg bg-white'>
              <Taps
                items={['General']}
              >
                <General data={this.state} />
                <PreviewAttachment attachmentEntry={this.state.attachmentEntry} />
              </Taps>
            </div>
          </>)
        }
      </div>
    )
  }
}

export default withRouter(BinlocationDetail);



function General(props: any) {
  const { data }: any = props;


  return <div className='grow w-full grid grid-cols-2 sm:grid-cols-1 gap-2 text-[12px] py-2'>
    <div className='flex flex-col gap-2'>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Item Weight</span> <span className='col-span-2 font-medium'>: {data?.street || "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Item Quantity</span> <span className='col-span-2 font-medium'>: {data?.streetNo || "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>No. of Items</span> <span className='col-span-2 font-medium'>: {data?.block || "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>No. of Batches/Serials</span> <span className='col-span-2 font-medium'>: {data?.buildingFloorRoom || "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Alternative Sort Code</span> <span className='col-span-2 font-medium'>: {data.alternativeSortCode || "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Bar Code</span> <span className='col-span-2 font-medium'>: {data.barCode || "N/A"}</span></div>
    </div>
    <div className='flex flex-col gap-2'>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Minimun Quantity</span> <span className='col-span-2 font-medium'>: {data?.minimunQty || "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Maximun Quantity</span> <span className='col-span-2 font-medium'>: {data?.maximunQty ?? "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Maximun Weight</span> <span className='col-span-2 font-medium'>: {data.maximunWeight || "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Restricted Item Type</span> <span className='col-span-2 font-medium'>: {data?.restrictedItemType || "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Restricted UoM Type</span> <span className='col-span-2 font-medium'>: {data.restrictedUoMType || "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Batch Restriction</span> <span className='col-span-2 font-medium'>: {data.batchRestrictions || "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Transaction Restriction</span> <span className='col-span-2 font-medium'>: {data.restrictedTransType || "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Item Group</span> <span className='col-span-2 font-medium'>: {data.specificItemGroup || "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Reason</span> <span className='col-span-2 font-medium'>: {data.restrictionReason || "N/A"}</span></div>

    </div>
  </div>
}

