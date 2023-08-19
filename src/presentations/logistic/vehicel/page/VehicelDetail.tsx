import { withRouter } from '@/routes/withRouter';
import React, { Component, useEffect } from 'react'
import PurchaseAgreement from '../../../../models/PurchaseAgreement';
import Taps from '@/components/button/Taps';
import MaterialReactTable from 'material-react-table';
import { useMemo } from 'react';
import { currencyFormat, dateFormat, fileToBase64 } from '@/utilies';
import Modal from '@/components/modal/Modal';
import PreviewAttachment from '@/components/attachment/PreviewAttachment';
import { CircularProgress } from '@mui/material';
import PurchaseAgreementRepository from '../../../../services/actions/purchaseAgreementRepository';
import DocumentHeaderComponent from '@/components/DocumenHeaderComponent';
import DocumentStatus from '@/constants/documentStatus';
import { ContactEmployee } from '@/models/BusinessParter';
import BusinessPartnerRepository from '@/services/actions/bussinessPartnerRepository';
import BusinessPartner from '../../../../models/BusinessParter';
import OwnerRepository from '@/services/actions/ownerRepository';
import PaymentTermTypeRepository from '../../../../services/actions/paymentTermTypeRepository';
import ShippingTypeRepository from '@/services/actions/shippingTypeRepository';
import Warehouses from '@/models/Warehouses';
import WarehouseRepository from '@/services/actions/WarehouseRepository';
import CountryRepository from '@/services/actions/CountryRepository';
import cityRepository from '@/services/actions/CityRepository';
import CityRepository from '@/services/actions/CityRepository';
import Vehicel from '@/models/Vehicel';
import VehicelRepository from '@/services/actions/VehicelRepository';



class VehicelDetail extends Component<any, any> {

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
    const data = this.props.location.state as Vehicel;
    console.log(data);

    if (data) {
      setTimeout(() => {
        let warehouse = data;
        warehouse as Vehicel;
        if ("") {

        } else {
          this.setState({ ...warehouse, loading: false })
        }
      }, 500)
    } else {
      new VehicelRepository().find(id).then((res: any) => {
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
                  <span className='w-4/12 text-gray-500'>Vehicle Code</span>
                  <span className='w-8/12 font-medium'>: {this.state.u_VEHCODE || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Vehicle Name</span>
                  <span className='w-8/12 font-medium'>: {this.state.u_VEHNAME || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Driver</span>
                  <span className='w-8/12 font-medium'>: {this.state.u_VEHDRIVER || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Vehicle Type</span>
                  <span className='w-8/12 font-medium'>: {this.state.u_VEHTYPE || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Make</span>
                  <span className='w-8/12 font-medium'>: {this.state.u_VEHMAKE || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Model</span>
                  <span className='w-8/12 font-medium'>: {this.state.u_VEHMODEL || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>VIN Number</span>
                  <span className='w-8/12 font-medium'>: {this.state.u_VEHVINNO || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Plate Number</span>
                  <span className='w-8/12 font-medium'>: {this.state.u_VEHPLATENO || "N/A"}</span>
                </div>
              </div>
              <div className='flex flex-col gap-1'>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Inspection Expiry</span>
                  <span className='w-8/12 font-medium'>: {this.state.u_VEHEXPDATE || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Next Maint. Date</span>
                  <span className='w-8/12 font-medium'>: {this.state.u_VEHNEXTMAINT || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Op. License Expiry</span>
                  <span className='w-8/12 font-medium'>: {this.state.u_VEHOPLICED || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Stage Bin</span>
                  <span className='w-8/12 font-medium'>: {this.state.u_VEHSTAGING || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Length ( cm )</span>
                  <span className='w-8/12 font-medium'>: {this.state.u_VEHLENGTH || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Width ( cm )</span>
                  <span className='w-8/12 font-medium'>: {this.state.u_VEHWEIGHT || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Height ( cm )</span>
                  <span className='w-8/12 font-medium'>: {this.state.u_VEHWIDTH || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Weight ( kg )</span>
                  <span className='w-8/12 font-medium'>: {this.state.u_VEHWEIGHT || "N/A"}</span>
                </div>
                <div className='flex gap-2'>
                  <span className='w-4/12 text-gray-500'>Volumn ( Lt )</span>
                  <span className='w-8/12 font-medium'>: {this.state.u_VEHVOLUME || "N/A"}</span>
                </div>
              </div>

            </div>

          </>)

        }

      </div>
    )
  }
}

export default withRouter(VehicelDetail);



function General(props: any) {
  const { data }: any = props;


  return <div className='grow w-full grid grid-cols-2 sm:grid-cols-1 gap-2 text-[12px] py-2'>
    <div className='flex flex-col gap-2'>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Street/PO Box</span> <span className='col-span-2 font-medium'>: {data?.street || "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Street Number:</span> <span className='col-span-2 font-medium'>: {data?.streetNo || "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Block</span> <span className='col-span-2 font-medium'>: {data?.block || "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Building/Floor/Room</span> <span className='col-span-2 font-medium'>: {data?.buildingFloorRoom || "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Zip Code</span> <span className='col-span-2 font-medium'>: {data.zipCode || "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>City</span> <span className='col-span-2 font-medium'>: {data.city || "N/A"}</span></div>
    </div>
    <div className='flex flex-col gap-2'>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>County</span> <span className='col-span-2 font-medium'>: {data?.county || "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Country/Region</span> <span className='col-span-2 font-medium'>: {new CountryRepository().find(data.country)?.Name ?? "N/A"} ({new CountryRepository().find(data.country)?.Code ?? "N/A"})</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>State</span> <span className='col-span-2 font-medium'>: {new CityRepository().find(data.state)?.Name || "N/A"} ({new CityRepository().find(data.state)?.Code})</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>Federal Tax ID</span> <span className='col-span-2 font-medium'>: {data?.federalTaxID || "N/A"}</span></div>
      <div className='grid grid-cols-3 gap-2'><span className='text-gray-500'>GLN</span> <span className='col-span-2 font-medium'>: {data.globalLocationNumber || "N/A"}</span></div>
    </div>
  </div>
}

