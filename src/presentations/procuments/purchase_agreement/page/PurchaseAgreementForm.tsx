import React from 'react';
import CoreFormDocument from '@/components/core/CoreFormDocument';
import LogisticForm from "../components/LogisticForm";
import GeneralForm from "../components/GeneralForm";
import { withRouter } from '@/routes/withRouter';
import ContentForm from '../components/ContentForm';
import { LoadingButton } from '@mui/lab';
import AttachmentForm from '../components/AttachmentForm';
import DocumentSerieRepository from '@/services/actions/documentSerie';
import PurchaseAgreementRepository from '../../../../services/actions/purchaseAgreementRepository';
import { UpdateDataSuccess } from '../../../../utilies/ClientError';
import PurchaseAgreement from '../../../../models/PurchaseAgreement';
import MenuButton from '@/components/button/MenuButton';
import { FormValidateException } from '@/utilies/error';
import LoadingProgress from '@/components/LoadingProgress';
import { ItemType } from '@/components/modal/ItemComponentModal';

class PurchaseAgreementForm extends CoreFormDocument {
    constructor(props: any) {
        super(props)
        this.state = {
            ...this.state,
            DocType: 'amItem',
            AgreementType: 'G',
            Status: 'D',
            Renewal: false,
            // StartDate: null,
            TerminateDate: null,
            SigningDate: null,
            EndDate: null,
            loading: true,
            // isSubmitting: true,
            error: {},

        } as any;

        this.onInit = this.onInit.bind(this);
        this.handlerRemoveItem = this.handlerRemoveItem.bind(this);
        this.handlerSubmit = this.handlerSubmit.bind(this);
        this.handlerChangeMenu = this.handlerChangeMenu.bind(this);
        this.hanndAddNewItem = this.hanndAddNewItem.bind(this);

    }

    componentDidMount(): void {
        if (!this.props?.edit) {
            // setTimeout(() => this.setState({ ...this.state, loading: false, }), 800);
        }


        this.setState({loading: false})
        // this.onInit();
    }

    async onInit() {
        let state = { ...this.state };
        let seriesList: any = this.props.query.find('pa-series');
        let defaultSeries: any = this.props.query.find('pa-default-series');

        if (!seriesList) {
            seriesList = await DocumentSerieRepository.getDocumentSeries(PurchaseAgreementRepository.documentSerie);
            this.props.query.set('pa-series', seriesList)
        }

        if (!defaultSeries) {
            defaultSeries = await DocumentSerieRepository.getDefaultDocumentSerie(PurchaseAgreementRepository.documentSerie);
            this.props.query.set('pa-default-series', defaultSeries);
        }

        state['isLoadingSerie'] = false;

        if (!this.props.edit) {
            state['SerieLists'] = seriesList;
            state['Series'] = defaultSeries.Series;
            state['DocNum'] = defaultSeries.NextNumber;
        }

        if (this.props.edit) {
            const { id } = this.props.match.params;
            let data: any = this.props.query.find('pa-id-' + id);
            let disables: any = {};

            if (!data) {
                await new PurchaseAgreementRepository().find(id).then(async (res: any) => {
                    data = res;
                    this.props.query.set('pa-id-' + id, res);
                });
            }


            data['Status'] = data?.Status === 'O' ? 'F' : data?.Status;
            disables['StartDate'] = data?.Status?.includes('A') || data?.Status?.includes('T');
            disables['EndDate'] = data?.Status?.includes('A') || data?.Status?.includes('T');
            disables['PaymentMethod'] = data?.Status?.includes('A') || data?.Status?.includes('T');
            disables['PaymentMethod'] = data?.Status?.includes('A') || data?.Status?.includes('T');
            disables['ShippingType'] = data?.Status?.includes('A') || data?.Status?.includes('T');
            disables['PaymentTermType'] = data?.Status?.includes('A') || data?.Status?.includes('T');
            disables['Status'] = data?.Status?.includes('T');
            disables['AgreementType'] = data?.Status?.includes('A') || data?.Status?.includes('T');
            disables['Projects'] = data?.Status?.includes('A') || data?.Status?.includes('T');
            disables['TerminateDate'] = true;
            disables['DocumentLine'] = data?.Status?.includes('A') || data?.Status?.includes('T');
            state = { ...state, ...data, disable: disables, loading: false };
            // this.setState({ ...state, disable: disables, loading: false });
        }

        // 
        state.loading = false;
        // await new Promise((resolve) => setTimeout(() => resolve(''), 800))
        this.setState(state)
    }

    handlerRemoveItem(code: string) {
        let items = [...this.state.Items ?? []];
        const index = items.findIndex((e: any) => e?.ItemCode === code);
        items.splice(index, 1)
        this.setState({ ...this.state, Items: items })
    }


    async handlerSubmit(event: any) {
        event.preventDefault();
        const data: any = { ...this.state };

        try {
            this.setState({ ...this.state, isSubmitting: true });
            await new Promise((resolve) => setTimeout(() => resolve(''), 800));

            const { id } = this.props?.match?.params;

            const payloads = new PurchaseAgreement(this.state);

            if (!payloads.CardCode) {
                data['error'] = { "CardCode": "Vendor is Required!" }
                throw new FormValidateException('Vendor is Required!', 0);
            }


            if (!payloads?.EndDate) {
                data['error'] = { "EndDate": "End date is Required!" }
                throw new FormValidateException('End date is Required!', 0);
            }

            if (!payloads?.Items || payloads?.Items?.length === 0) {
                data['error'] = { "Items": "Items is missing and must at least one record!" }
                throw new FormValidateException('Items is missing', 2);
            }

            await new PurchaseAgreementRepository().post(this.state, this.props?.edit, id).then((res: any) => {
                const purchaseAgreement = new PurchaseAgreement(res?.data)
                // this.props.history.replace(this.props.location.pathname?.replace('create', purchaseAgreement.DocEntry), purchaseAgreement);
                this.dialog.current?.success("Create Successfully.", purchaseAgreement.DocEntry);
            }).catch((e: any) => {
                if (e instanceof UpdateDataSuccess) {
                    const agreement = new PurchaseAgreement(this.state);
                    this.props.query.set('pa-id-' + id, agreement);
                    this.props.history.replace(this.props.location.pathname?.replace('/edit', ''), { ...this.state });
                    // this.dialog.current?.success(e.message);
                    return;
                }
                this.dialog.current?.error(e.message);
            }).finally(() => {
                this.setState({ ...this.state, isSubmitting: false })
            });
        } catch (error: any) {
            if (error instanceof FormValidateException) {
                this.setState({ ...data, isSubmitting: false, tapIndex: error.tap });
                console.log(error);
                this.dialog.current?.error(error.message, 'Invalid');
                return;
            }

            this.setState({ ...data, isSubmitting: false });
            this.dialog.current?.error(error.message, 'Invalid');
        }
    }

    async handlerChangeMenu(index: number) {
        this.setState({ ...this.state, tapIndex: index });

    }

    HeaderTaps = () => {
        return <>
            <MenuButton active={this.state.tapIndex === 0} onClick={() => this.handlerChangeMenu(0)}>General</MenuButton>
            <MenuButton active={this.state.tapIndex === 1} onClick={() => this.handlerChangeMenu(1)}>Logistic</MenuButton>
            <MenuButton active={this.state.tapIndex === 2} onClick={() => this.handlerChangeMenu(2)}>Content</MenuButton>
            <MenuButton active={this.state.tapIndex === 3} onClick={() => this.handlerChangeMenu(3)}>Attachment</MenuButton>
        </>
    }

    hanndAddNewItem() {
        this.itemModalRef.current?.onOpen();
        // if (this.state?.DocType === 'amItem') {
        //     return;
        // }

        // const items = [...this.state.Items ?? [], { ItemCode: shortid.generate(), UnitPrice: 0, Quantity: 1 }];
        // this.setState({ ...this.state, Items: items, });
    }



    FormRender = () => {
        return <>
            <form id='formData' onSubmit={this.handlerSubmit} className='h-full w-full flex flex-col gap-4 relative'>
                {this.state.loading ? <div className='w-full h-full flex item-center justify-center'><LoadingProgress /></div> : <>
                    <div className='grow'>
                        {this.state.tapIndex === 0 && <GeneralForm
                            data={this.state}
                            edit={this.props?.edit}
                            handlerChange={(key, value) => this.handlerChange(key, value)}
                        />}

                        {
                            this.state.tapIndex === 1 && <LogisticForm
                                data={this.state}
                                edit={this.props?.edit}
                                handlerChange={(key, value) => {
                                    this.handlerChange(key, value);
                                }}
                            />
                        }

                        {
                            this.state.tapIndex === 2 &&
                            <ContentForm
                                data={this.state}
                                handlerAddItem={() => {
                                    this.hanndAddNewItem();
                                }}
                                handlerRemoveItem={(items: any[]) => this.setState({ ...this.state, Items: items })}
                                handlerChangeItem={this.handlerChangeItems}
                                // onChange={this.handlerChangeItemByCode}
                                onChangeItemByCode={this.handlerChangeItemByCode}
                                onChange={this.handlerChange}
                            />
                        }

                        {
                            this.state.tapIndex === 3 && <AttachmentForm />
                        }
                    </div>


                </>}

                <div className="sticky w-full bottom-4  mt-2 ">
                    <div className="backdrop-blur-sm bg-white p-2 rounded-lg shadow-lg z-[1000] flex justify-between gap-3 border drop-shadow-sm">
                        <div className="flex ">
                            <LoadingButton size="small" sx={{ height: '25px' }} variant="contained" disableElevation><span className="px-3 text-[11px] py-1 text-white">Copy To</span></LoadingButton>
                        </div>
                        <div className="flex items-center">
                            <LoadingButton type="submit" sx={{ height: '25px' }} className='bg-white' loading={false} size="small" variant="contained" disableElevation>
                                <span className="px-6 text-[11px] py-4 text-white">Save </span>
                            </LoadingButton>
                        </div>
                    </div>
                </div>
            </form>
        </>
    }
}

export default withRouter(PurchaseAgreementForm)