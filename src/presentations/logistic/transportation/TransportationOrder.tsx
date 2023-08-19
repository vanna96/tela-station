import CoreFormDocument from '@/components/core/CoreFormDocument';
import { withRouter } from '@/routes/withRouter';
import { LoadingButton } from '@mui/lab';
import DocumentSerieRepository from '@/services/actions/documentSerie';
import GLAccount from '@/models/GLAccount';
import { Button, Chip, CircularProgress } from '@mui/material';
import { Query, QueryClient, useMutation, useQuery } from 'react-query';
import WarehouseRepository from '@/services/actions/WarehouseRepository';
import Warehouses from '@/models/Warehouses';
import RouteMaster from '@/models/RouteMaster';
import RouteMasterRepository from '@/services/actions/RouteMasterRepository';
import { UpdateDataSuccess } from '@/utilies/ClientError';
import HeadingForm from './component/HeadingForm';
import MUISelect from '@/components/selectbox/MUISelect';
import MUITextField from '@/components/input/MUITextField';
// import HeadingForm from '../component/HeadingForm';
import TransportationOrderRepository from '@/services/actions/transportationOrderRepository';
import shortid from 'shortid';



interface TransportationData {
  docEntry: string;
  u_TRANSPVEHICLE: string;
  driver: string;
  u_TRANSPROUTE: string;
  u_TRANSPSTATUS: string;
}

function TransportationOrderTile({ data }: { data: TransportationData[] }) {
  return (
    <>
      {data?.map((data) => (
        <div
          key={shortid.generate()}
          className="flex gap-2 p-3 border rounded m-2 flex-col hover:bg-gray-50 hover:shadow-lg cursor-pointer"
        >
          <h2 className="text-sm text-slate-600 font-bold">
            Transp. Order: {data.docEntry ?? "N/A"}
          </h2>
          <div className="grid grid-cols-1 gap-2">
            <p className="text-sm text-slate-600">Truck#: {data.u_TRANSPVEHICLE ?? "N/A"}</p>
            <p className="text-sm text-slate-600">Driver: {data.driver ?? "N/A"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-sm text-slate-600">Route: {data.u_TRANSPROUTE ?? "N/A"}</p>
            <p className="text-sm text-slate-600">Status: <Chip label={data.u_TRANSPSTATUS ?? "N/A"} color="success" />
            </p>
          </div>
        </div>
      ))}
    </>
  );
}

class TransportationOrder extends CoreFormDocument {

  constructor(props: any) {
    super(props)
    this.state = {
      ...this.state,
      loading: true,

    } as any;
    this.handlerSubmit = this.handlerSubmit.bind(this);
  }

  componentDidMount(): void {

    if (!this.props?.edit) {
      setTimeout(() => this.setState({ ...this.state, loading: false, }), 500)
    }

    if (this.props.edit) {
      if (this.props.location.state) {
        const routeState = this.props.location.state;

        setTimeout(() => this.setState({ ...this.props.location.state }), 500)
      } else {
        new RouteMasterRepository().find(this.props.match.params.id).then((res: any) => {
          this.setState({ ...res, loading: false });
        }).catch((e: Error) => {
          this.setState({ message: e.message });
        })
      }
    }

    this.fetchTransportData();


  }
  fetchTransportData = async () => {
    try {
      const transportData = await new TransportationOrderRepository().get();
      this.setState({
        transportData,
        isLoading: false,
      });
      console.log(transportData);
    } catch (error) {
      console.error(error);
    }
  };



  async handlerSubmit(event: any) {
    event.preventDefault();

    this.setState({ ...this.state, isSubmitting: true });
    const { id } = this.props?.match?.params

    await new RouteMasterRepository().post(this.state, this.props?.edit, id).then((res: any) => {
      const routeData = new RouteMaster(res?.data)

      this.props.history.replace(this.props.location.pathname?.replace('create', routeData.id), routeData);
      this.dialog.current?.success("Create Successfully.");
    }).catch((e: any) => {
      if (e instanceof UpdateDataSuccess) {
        this.props.history.replace(this.props.location.pathname?.replace('/edit', ''), { ...this.state, isSubmitting: false });
        this.dialog.current?.success(e.message);
        // const query = this.props.query.query as QueryClient;
        return;
      }
      this.dialog.current?.error(e.message);
    }).finally(() => {
      this.setState({ ...this.state, isSubmitting: false })
    });
  }



  FormRender = () => {
    return <>
      <form onSubmit={this.handlerSubmit} className='h-full w-full flex flex-col gap-4'>
        {this.state.loading ? <div className='h-full w-full flex items-center justify-center'><CircularProgress /></div> : <>

          <div className="h-full w-full flex lg:flex-col  gap-5">
            <div className="min-w-[22rem] lg:min-w-full">

              {/* <TransportationOrderTile data={data} /> */}
              <MUITextField
                label="Route Code"
                // value={this.state?.u_RMNAME}
                name="RouteName"
              />
              <MUITextField
                label="Route Code"
                // value={this.state?.u_RMNAME}
                name="RouteName"
              />
              <MUITextField
                label="Route Code"
                // value={this.state?.u_RMNAME}
                name="RouteName"
              />
             
            </div>
            <div className="grow lg:w-full rounded">
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-4 gap-3">
                  {/* <MUITextField label="Business Partner" disabled={edit} value={data?.cardCode} name="BPCode" onClick={handlerOpenVendor} endAdornment={!edit} /> */}
                  <MUITextField
                    label="Base Station"
                    // value={this.state?.u_RMCODE}
                    name="RouteCode"
                  />
                  <MUITextField
                    label="Route Code"
                    // value={this.state?.u_RMNAME}
                    name="RouteName"
                  />
                  <div>
                    <label htmlFor="AgreementMethod" className="text-gray-500 text-[14px]">
                      Document Type
                    </label>
                    <MUISelect
                      items={[
                        { value: "15", name: "Delivery" },
                        { value: "60", name: "Good Issue" },
                        { value: "1250000001", name: "Inventory Transfer Request" }
                      ]}
                      aliaslabel='name'
                      aliasvalue='value'
                    // onChange={handleSelectChangeB} value={data?.batchRestrictions ?? "N"} name="BatchRestrictions" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {/* <IconButton
                type={availableDoc?.length > 0 || dropPlanDoc?.length > 0 ? "primary" : "default"}
                    disabled={availableDoc?.length > 0 || dropPlanDoc?.length > 0 ? false : true}
                    onClick={() => setOpen(true)}
                  >
                    Load Vihicle
                  </Iconbutton>
                  <Button loading={loadingAvailableDoc} type="primary" onClick={hanlderLoadAvailableDoc}>
                    Load
                  </Button> */}
                    <Button variant="outlined" size="small"  >Load Vehicle</Button>
                    <Button variant="contained" size="small"  >Load</Button>
                  </div>
                </div>



                <div className="grid grid-cols-2 gap-3"></div>
              </div>
              <div>

              </div>
            </div>
          </div>
          {/* <HeadingForm
              data={this.state}
              edit={this.props?.edit}
              handlerOpenVendor={() => {
                this.handlerOpenVendor('customer');
              }}
              handlerChange={(key, value) => this.handlerChange(key, value)}
              handlerOpenProject={() => this.handlerOpenProject()}
            /> */}



          <div className="sticky w-full bottom-4  mt-2">
            <div className="backdrop-blur-sm bg-slate-700 p-2 rounded-lg shadow z-[1000] flex justify-between gap-3 border">
              <div className="flex ">
                <LoadingButton size="small" sx={{ height: '25px' }} variant="contained" disableElevation><span className="px-3 text-[11px] py-1">Copy To</span></LoadingButton>
              </div>
              <div className="flex items-center">
                <LoadingButton type="submit" sx={{ height: '25px' }} className='bg-white' loading={false} size="small" variant="contained" disableElevation>
                  <span className="px-3 text-[11px] py-1">Save </span>
                </LoadingButton>
              </div>
            </div>
          </div>
        </>}
      </form>
    </>
  }
}

export default withRouter(TransportationOrder)