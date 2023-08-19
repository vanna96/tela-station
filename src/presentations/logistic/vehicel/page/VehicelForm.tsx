import CoreFormDocument from '@/components/core/CoreFormDocument';
import { withRouter } from '@/routes/withRouter';
import { LoadingButton } from '@mui/lab';
import DocumentSerieRepository from '@/services/actions/documentSerie';
import PurchaseAgreementRepository from '../../../../services/actions/purchaseAgreementRepository';
import GLAccount from '@/models/GLAccount';
import { CircularProgress } from '@mui/material';
import { UpdateDataSuccess } from '../../../../utilies/ClientError';
import PurchaseAgreement from '../../../../models/PurchaseAgreement';
import { QueryClient, useMutation } from 'react-query';
import WarehouseRepository from '@/services/actions/WarehouseRepository';
import Warehouses from '@/models/Warehouses';
import Vehicel from '@/models/Vehicel';
import VehicelRepository from '@/services/actions/VehicelRepository';
import General from '../component/General';
import Compartement from '../component/Compartement';
import shortid from 'shortid';

class VehicelForm extends CoreFormDocument {

  constructor(props: any) {
    super(props)
    this.state = {
      ...this.state,
      loading: true,
      items: [{
        id: shortid.generate(),
        u_VEHCOMPNO: null,
        u_VEHCOMPVO: null,
        u_VEHCOMPHA: null
      }]


    } as any;
    this.handlerSubmit = this.handlerSubmit.bind(this);
    this.handlerChangeCompartement = this.handlerChangeCompartement.bind(this)
    // this.handlerChangePartment = this.handlerChangePartment.bind(this);

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
        new VehicelRepository().find(this.props.match.params.id).then((res: any) => {
          this.setState({ ...res, loading: false });
        }).catch((e: Error) => {
          this.setState({ message: e.message });
        })
      }
    }
  }


  async handlerSubmit(event: any) {
    event.preventDefault();

    this.setState({ ...this.state, isSubmitting: true });
    const { id } = this.props?.match?.params

    await new VehicelRepository().post(this.state, this.props?.edit, id).then((res: any) => {
      const vehicel = new Vehicel(res?.data)

      this.props.history.replace(this.props.location.pathname?.replace('create', vehicel.id), vehicel);
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

  protected handlerChangeCompartement({ value, record, field }: any) {
    let items = [...this.state.Items ?? []];
    let item = this.state.Items?.find(
      (e: any) => e?.id === record?.id
    );
    item[field] = value;
    const index = items.findIndex(
      (e: any) => e?.Id === record.id
    );
    if (index > 0) items[index] = item;
    this.setState({ ...this.state, Items: items });
  }
  FormRender = () => {

    return <>
      <form onSubmit={this.handlerSubmit} className='h-full w-full flex flex-col gap-4'>
        {this.state.loading ? <div className='h-full w-full flex items-center justify-center'><CircularProgress /></div> : <>

          <General
            data={this.state}
            handlerChange={(key, value) => this.handlerChange(key, value)}
            edit={this.props.edit}
          />

          <Compartement
            handlerChangeItem={this.handlerChangeCompartement}

            data={this.state}
            edit={this.props.edit}
          />
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

export default withRouter(VehicelForm)