import CoreFormDocument from '@/components/core/CoreFormDocument';
import PurchaseAgreement from '../../../../models/PurchaseAgreement';
import GeneralForm from '../../purchase_agreement/components/LogisticForm';
import HeadingForm from '../componnent/HeadingForm';
import { withRouter } from '@/routes/withRouter';
import ContentForm from '../componnent/Content';
import { LoadingButton } from '@mui/lab';
import { FormEventHandler } from 'react';
import AttachmentForm from '@/components/attachment';
import { CoreFormDocumentState } from '../../../../components/core/CoreFormDocument';
import DocumentSerieRepository from '@/services/actions/documentSerie';
import PurchaseAgreementRepository from '../../../../services/actions/purchaseAgreementRepository';
import { ToastOptions } from 'react-toastify';
import purchaseQoutationRepository from '@/services/actions/purchaseQoutationRepository';
import Logistic from '../componnent/Logistis';
import Accounting from '../componnent/Acccounting';
import GLAccount from '@/models/GLAccount';
import PurchaseQoutationRepository from './../../../../services/actions/purchaseQoutationRepository';
import VatGroupRepository from '@/services/actions/VatGroupRepository';
import { UpdateDataSuccess } from '@/utilies/ClientError';
import PurchaseQouatation from '@/models/PurchaseQoutation';
import Formular from '@/utilies/formular';
import { CircularProgress } from '@mui/material';

class PurchaseQoutationForm extends CoreFormDocument {

  constructor(props: any) {
    super(props)
    this.state = {
      ...this.state,
      loading: true,
      docDate: new Date().toISOString(),
      docDueDate: new Date().toISOString(),
      taxDate: new Date().toISOString(),
      requriedDate: null,
    } as any;


    this.handlerRemoveItem = this.handlerRemoveItem.bind(this);
    this.onInit = this.onInit.bind(this);
    this.handlerSubmit = this.handlerSubmit.bind(this);
  }

  componentDidMount(): void {
    // Get Series Lists
    DocumentSerieRepository.getDocumentSeries(purchaseQoutationRepository?.documentSerie).then((res: any) => {
      this.setState({ ...this.state, SerieLists: res, })
    });


    this.onInit()
  }

  async onInit() {
    if (this.props.edit) {
      const { id } = this.props.match.params;
      let state: any = this.props.query.find('pr-id-' + id);
      let disables: any = {};

      if (!state) {
        await new purchaseQoutationRepository()
          .find(this.props.match.params.id)
          .then((res: any) => {
            state = res;
            this.props.query.set('pqoutation-id-' + id, res);
          }).catch(e => {
            console.log(e)
            this.setState({ message: 'Data no found.' });
            return;
          })
      }

      disables['C'] = state?.DocumentStatus !== 'Open';
      disables['CardCode'] = state?.DocumentStatus !== 'Open';
      disables['CardName'] = state?.DocumentStatus !== 'Open';
      disables['RequesterBranch'] = state?.DocumentStatus !== 'Open';
      disables['RequesterDepartment'] = state?.DocumentStatus !== 'Open';
      disables['RequesterEmail'] = state?.DocumentStatus !== 'Open';
      disables['DocDate'] = state?.DocumentStatus !== 'Open';
      disables['DocDueDate'] = state?.DocumentStatus !== 'Open';
      disables['TaxDate'] = state?.DocumentStatus !== 'Open';
      disables['RequriedDate'] = state?.DocumentStatus !== 'Open';
      disables['DocumentLine'] = state?.DocumentStatus !== 'Open';
      this.setState({ ...state, disable: disables, loading: false });
    } else {
      setTimeout(() => this.setState({ ...this.state, loading: false, }), 500);
      DocumentSerieRepository.getDefaultDocumentSerie(purchaseQoutationRepository.documentSerie).then((res: any) => {
        this.setState({ ...this.state, Series: res?.Series, DocNum: res?.NextNumber, isLoadingSerie: false })
      });
    }
  }

  handlerRemoveItem(code: string) {
    let items = [...this.state.Items ?? []];
    const index = items.findIndex((e: any) => e?.ItemCode === code);
    items.splice(index, 1)
    this.setState({ ...this.state, Items: items })
  }

  async handlerSubmit(event: any) {
    event.preventDefault();

    this.setState({ ...this.state, isSubmitting: true });
    const { id } = this.props?.match?.params

    await new PurchaseQoutationRepository().post(this.state, this.props?.edit, id).then((res: any) => {
      const purchaseQoutation = new PurchaseQouatation(res?.data)
      this.props.history.replace(this.props.location.pathname?.replace('create', purchaseQoutation.id), purchaseQoutation);
      this.props.query.set('pqoutation-id-' + id, purchaseQoutation);
      this.dialog.current?.success("Create Successfully.");
    }).catch((e: any) => {
      if (e instanceof UpdateDataSuccess) {
        this.props.history.replace(this.props.location.pathname?.replace('/edit', ''), { ...this.state, isSubmitting: false, isApproved: this.state.DocumentStatus === 'A' });
        this.dialog.current?.success(e.message);
        const purchaseQoutation = new PurchaseQouatation(this.state)
        this.props.query.set('pqoutation-id-' + id, purchaseQoutation);
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
              this.handlerOpenVendor('supplier');
            }}
            handlerChange={this.handlerChange}
            handlerOpenProject={() => this.handlerOpenProject()}
          />

          <ContentForm
            edit={this.props?.edit}
            data={this.state}
            handlerAddItem={() => this.handlerOpenItem()}
            handlerRemoveItem={this.handlerRemoveItem}
            handlerChangeItem={this.handlerChangeItems}
            handlerChange={(key, value) => this.handlerChange(key, value)}
          />
          <Logistic
            data={this.state}
            handlerChange={(key, value) => this.handlerChange(key, value)}
            edit={this.props.edit}
          />
          <Accounting
            edit={this.props.edit}
            data={this.state}
            handlerChange={(key, value) => this.handlerChange(key, value)}
            handlerOpenProject={() => this.handlerOpenProject()}

          />
          <AttachmentForm />

          <div className="sticky w-full bottom-4  mt-2/">
            <div className="backdrop-blur-sm bg-slate-700 p-2 rounded-lg shadow z-[1000] flex justify-between gap-3 border">
              <div className="flex ">
                <LoadingButton size="small" sx={{ height: '25px' }} variant="contained" disableElevation><span className="px-3 text-[11px] py-1">Copy To</span></LoadingButton>
              </div>
              <div className="flex items-center">
                <LoadingButton type="submit" sx={{ height: '25px' }} className='bg-white' loading={false} size="small" variant="contained" disableElevation>
                  <span className="px-3 text-[11px] py-1">Save & New</span>
                </LoadingButton>
              </div>
            </div>
          </div>
        </>}
      </form>
    </>
  }
}

export default withRouter(PurchaseQoutationForm)