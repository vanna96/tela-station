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
import RouteMaster from '@/models/RouteMaster';
import RouteMasterRepository from '@/services/actions/RouteMasterRepository';
import HeadingForm from '../component/HeadingForm';
import ContentForm from '../component/ContentForm';


class RouteMasterForm extends CoreFormDocument {

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
  }



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

        <HeadingForm
          data={this.state}
          edit={this.props?.edit}
          handlerOpenVendor={() => {
            this.handlerOpenVendor('customer');
          }}
          handlerChange={(key, value) => this.handlerChange(key, value)}
          handlerOpenProject={() => this.handlerOpenProject()}
        />
  {/* <ContentForm
          edit={this.props?.edit}
          data={this.state}
          handlerAddItem={() => this.handlerOpenItem()}
          handlerRemoveItem={this.handlerRemoveItem}
          handlerChangeItem={this.handlerChangeItems}
          handlerChange={(key, value) => this.handlerChange(key, value)}
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

export default withRouter(RouteMasterForm)