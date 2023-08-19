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
import HeadingForm from '../component/HeadingForm';
import WarehouseRepository from '@/services/actions/WarehouseRepository';
import Warehouses from '@/models/Warehouses';
import General from '../component/General';
import BinlocationRepository from '@/services/actions/BinlocationRepository';
import Binlocation from '@/models/Binlocation';
import React, { Component } from 'react';
import FormMessageModal from '@/components/modal/FormMessageModal';
import { ToastContainer, ToastOptions, TypeOptions, toast } from 'react-toastify';

const contextClass: any = {
  success: "bg-blue-600",
  error: "bg-red-600",
  info: "bg-gray-600",
  warning: "bg-orange-400",
  default: "bg-indigo-600",
  dark: "bg-white-600 font-gray-300",
};

class BinlocationForm extends Component<any, any>{

  constructor(props: any) {
    super(props)
    this.state = {
      ...this.state,
    } as any;
    this.handlerSubmit = this.handlerSubmit.bind(this);
  }
  dialog = React.createRef<FormMessageModal>();

  componentDidMount(): void {

    if (!this.props?.edit) {
      setTimeout(() => this.setState({ ...this.state, loading: false, }), 500)
    }

    if (this.props.edit) {
      if (this.props.location.state) {
        const routeState = this.props.location.state;

        setTimeout(() => this.setState({ ...this.props.location.state }), 500)
      } else {
        new BinlocationRepository().find(this.props.match.params.id).then((res: any) => {
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

    await new BinlocationRepository().post(this.state, this.props?.edit, id).then((res: any) => {
      const warehouses = new Binlocation(res?.data)

      this.props.history.replace(this.props.location.pathname?.replace('create', warehouses.id), warehouses);
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

  protected toast(message: string, type: TypeOptions) {
    toast(message, {
      position: 'top-right',
      type: type,
      theme: 'colored',
      icon: false,
    })
  }


  protected showMessage(title: string, message: string) {
    this.setState({
      ...this.state,
      title: title,
      message: message,
      showDialogMessage: true,
      isSubmitting: false,
    })
  }

  protected handlerCloseDialogMessage(cb?: Function) {
    this.setState({
      ...this.state,
      showDialogMessage: false,
    });

    if (cb) {
      cb();
    }
  }
  protected handlerChange(key: string, value: any) {
    let temps: any = { ...this.state };
    temps[key] = value;

    this.setState(temps)
  }

  render = () => {
    return <>
      <form onSubmit={this.handlerSubmit} className='h-full w-full flex flex-col gap-4'>
        {this.state.loading ? <div className='h-full w-full flex items-center justify-center'><CircularProgress /></div> : <>
          <ToastContainer
            toastClassName={({ type }: any) => contextClass[type || "default"] +
              " relative flex p-1 min-h-6 rounded-md justify-between overflow-hidden cursor-pointer"
            }
            bodyClassName={() => "text-sm font-white font-med block p-3"}
          />
          <HeadingForm
            data={this.state}
            edit={this.props?.edit}
            handlerChange={(key, value) => this.handlerChange(key, value)}
          />
          <General
            data={this.state}
            edit={this.props?.edit}
            handlerChange={(key, value) => this.handlerChange(key, value)}
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

export default withRouter(BinlocationForm)