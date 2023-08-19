import React from 'react'
import VendorModal from '../modal/VendorModal';
import BusinessPartner from '../../models/BusinessParter';
import Project from '@/models/Project';
import { Backdrop } from '@mui/material';
import { VendorModalType } from '../modal/VendorModal';
import FormMessageModal from '../modal/FormMessageModal';
import EmployeesInfo from '@/models/EmployeesInfo';
import Users from '../../models/User';
import Formular from '@/utilies/formular';
import DocumentHeaderComponent from '../DocumenHeaderComponent';
import shortid from 'shortid';
import { documentType } from '@/constants';
import LoadingProgress from '../LoadingProgress';
import { ItemModalComponent } from '../modal/ItemComponentModal';

export interface CoreFormDocumentState {
    collapse: boolean,
    isOpenItem: boolean,
    isOpenVendor: boolean,
    isOpenAccount: boolean,
    isOpenProject: boolean,
    isLoadingSerie: boolean,
    Renewal: boolean,
    CardCode?: any,
    CardName?: any,
    ContactPersonCode?: number | undefined | null,
    Phone?: string | undefined | null,
    Email?: string | undefined | null,
    Owner?: any,
    Buyer?: any,
    PaymentTermType?: string | undefined | null,
    PaymentMethod?: string | undefined | null,
    Currency?: string | undefined | null,
    PriceLists?: string | undefined | null,
    SalesPersonCode?: string | undefined | null,
    ShipToDefault?: string | undefined | null,
    VendorRef?: string | undefined | null,
    DocumentStatus?: string | undefined | null,
    Remark?: string | undefined | null,
    Description?: string | undefined | null,
    DocumentServiceItemType?: string | undefined | null,
    AttachmentEntry?: number | null,
    Project?: string | undefined | null,
    ContactPersonList?: any[],
    ShippingType?: number | null,
    Items?: any[],
    Services?: any[],
    Attachments?: any[],
    SerieLists: any[],
    Series: any,
    DocNum: any,
    isSubmitting: boolean,
    title: string,
    message: string,
    showDialogMessage: boolean,
    inWhichDimension: number,
    showDistribution: boolean,
    vendorType: VendorModalType,
    loading: boolean,
    isApproved: boolean,
    isOpenRequester: boolean,
    isOpenRequesterEmployee: boolean,
    Department: any,
    Branch: any,
    ReqType: number,
    DocTotalBeforeDiscount: number,
    DocTotal: number,
    DocDiscountPercent: number | any,
    DocDiscountPrice: number | any,
    DocTaxTotal: number | any,
    Rounded: boolean,
    DocType: string,
    Address: string | null;
    Address2: string | null;
    disable: any,
    error: any,
    tapIndex: number;
}

export default abstract class CoreFormDocument extends React.Component<any, CoreFormDocumentState> {
    dialog = React.createRef<FormMessageModal>();
    protected itemModalRef = React.createRef<ItemModalComponent>();

    protected constructor(props: any) {
        super(props);
        this.state = {
            collapse: true,
            CardCode: '',
            CardName: '',
            ContactPersonCode: undefined,
            ContactPersonList: [],
            ShippingType: null,
            Phone: '',
            Email: '',
            Owner: '',
            Buyer: '',
            VendorRef: '',
            DocumentStatus: 'Open',
            Remark: '',
            Description: '',
            DocumentServiceItemType: 'I',
            AttachmentEntry: 0,
            Project: '',
            isOpenItem: false,
            isOpenVendor: false,
            isOpenAccount: false,
            isOpenProject: false,
            PaymentMethod: '',
            PaymentTermType: '',
            Currency: '',
            PriceLists: '',
            SalesPersonCode: '',
            ShipToDefault: '',
            Renewal: false,
            Items: [],
            SerieLists: [],
            Series: '',
            DocNum: '',
            isLoadingSerie: true,
            isSubmitting: false,
            message: '',
            showDialogMessage: false,
            title: '',
            showDistribution: false,
            inWhichDimension: 0,
            vendorType: 'customer',
            loading: true,
            isApproved: false,
            isOpenRequester: false,
            isOpenRequesterEmployee: false,
            Department: '',
            Branch: '',
            ReqType: 12,
            DocTaxTotal: 0,
            DocTotal: 0,
            DocTotalBeforeDiscount: 0,
            DocDiscountPercent: 0,
            DocDiscountPrice: 0,
            Rounded: false,
            DocType: 'dDocument_Items',
            Address: null,
            Address2: null,
            disable: {},
            tapIndex: 0,
            error: {},
        }

        this.handlerConfirmItem = this.handlerConfirmItem.bind(this)
        this.handlerChangeItems = this.handlerChangeItems.bind(this);
        this.handlerChange = this.handlerChange.bind(this);
        this.handlerChangeItemByCode = this.handlerChangeItemByCode.bind(this);

    }


    abstract FormRender(): JSX.Element;

    abstract HeaderTaps(): JSX.Element;

    render() {
        return (
            <div className='grow flex flex-col'>
                <FormMessageModal ref={this.dialog} />
                <ItemModalComponent ref={this.itemModalRef} type={'purchase'} onOk={this.handlerConfirmItem}  />
                <Backdrop
                    sx={{ color: '#fff', backgroundColor: "rgb(251 251 251 / 60%)", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={this.state.isSubmitting}
                >
                    <LoadingProgress />
                </Backdrop>

                <div className='flex flex-col w-full  grow '>
                    <DocumentHeaderComponent data={this.state} menuTabs={<this.HeaderTaps />} />
                    <div className={`grow  flex flex-col px-4 py-3 gap-2 w-full `}>
                        <this.FormRender />
                        <div className='mt-4'></div>
                    </div>
                </div>
            </div>
        );
    }


    protected handlerCollapse() {
        this.setState({ ...this.state, collapse: !this.state.collapse })
    }

    protected handlerConfirmItem(data: any[]) {
        let oldItems = [...this.state.Items ?? []];
        const newItems = data.filter((newItem) => !oldItems.find((e) => e?.ItemCode === newItem.ItemCode));   // Filter out items that already exist in the state
        this.setState({ ...this.state, isOpenItem: false, error: {}, Items: [...oldItems, ...newItems] });
    }

    protected handlerChange(key: string, value: any) {
        let temps: any = { ...this.state };
        temps[key] = value;

        // discount
        let DocDiscountPercent = this.state.DocDiscountPercent;
        let DocTotalBeforeDiscount = this.state.DocTotalBeforeDiscount;

        if (key in this.state.error) {
            temps['error'] = {};
        }

        switch (key) {
            case 'vendor':
                const vendor = value as BusinessPartner;
                temps['CardCode'] = vendor.cardCode;
                temps['CardName'] = vendor.cardName;
                temps['ContactPersonCode'] = vendor.contactEmployee!.length > 0 ? vendor.contactEmployee![0].id : undefined;
                temps['ContactPersonList'] = vendor.contactEmployee ?? [];
                temps['ShippingType'] = vendor?.shippingType;
                temps['Email'] = vendor.email;
                temps['Phone'] = vendor.phone;
                temps['PaymentTermType'] = vendor.paymentTermTypeCode;
                temps['PaymentMethod'] = vendor.paymentMethod;
                temps['isOpenVendor'] = false;
                temps['Currency'] = vendor.defaultCurrency || vendor.currency;
                temps['PriceLists'] = vendor.priceLists;
                temps['SalesPersonCode'] = vendor.salePersonCode;
                temps['Address2'] = vendor.getShipTo();
                temps['Address'] = vendor.getBillToAddress();
                temps['Owner'] = vendor?.owner ?? null;
                temps['PriceMode'] = vendor?.PriceMode ?? null;
                temps['BPAddresses'] = vendor?.bpAddress ?? [];
                temps['JournalRemark'] = `Return Request - ${vendor?.cardCode}`;
                break;
            case 'Status':
                temps['disable'] = { ...temps['disable'], TerminateDate: !(value === 'T') };
                break;
            case 'DocType':
                temps['Items'] = [];
                break;
            case 'Series':
                const document = this.state.SerieLists.find((e: any) => e.Series === value);
                temps['DocNum'] = document?.NextNumber;
                break;
            case 'ReqType':
                temps['Department'] = null;
                temps['Branch'] = null;
                temps['CardCode'] = null;
                temps['CardName'] = null;
                break;
            case 'DocDiscountPercent':
                let discount = parseFloat(value);
                temps['DocDiscountPrice'] = discount >= 100 ? 0 : (DocTotalBeforeDiscount * value) / 100;
                temps['DocDiscountPercent'] = discount > 100 ? 100 : value;
                temps = this.findTotalVatRate(temps);
                break;
            case 'DocDiscountPrice':
                const total = parseFloat(value) > DocTotalBeforeDiscount;
                DocDiscountPercent = total ? 100 : ((value / DocTotalBeforeDiscount) * 100);
                temps['DocDiscountPercent'] = (DocDiscountPercent >= 10 ? DocDiscountPercent : DocDiscountPercent / 10);
                temps['DocDiscountPrice'] = total ? 0 : value;
                temps = this.findTotalVatRate(temps);
                break;
            default:
                break;
        }
        this.setState(temps)
    }

    findTotalVatRate(temps: any) {
        let totalVatRate = temps.items?.reduce((prev: any, current: any) => prev + (current?.vatRate ?? 0), 0);
        const total = temps['DocTotalBeforeDiscount'] - temps['DocDiscountPrice'];
        totalVatRate = ((temps['DocDiscountPrice'] === 0 ? temps.docTotalBeforeDiscount : temps['DocDiscountPrice']) * totalVatRate) / 100;
        temps['DocTaxTotal'] = totalVatRate;
        temps['DocTotal'] = total + temps['DocTaxTotal'];
        return temps;
    }

    protected handlerChangeItems({ value, record, field }: any) {
        let items: any[] = [...this.state.Items ?? []];
        let item: any = {};

        if (this.state.DocType === documentType[1].value && !record?.ItemCode) {
            item['ItemCode'] = shortid.generate();
            item[field] = value;
            items.push(item);
            this.setState({ ...this.state, Items: items });
            return;
        }

        let existingItem = items?.find((e: any) => e?.ItemCode === record?.ItemCode);
        if (!existingItem) return;


        const index = items.findIndex((e: any) => e?.ItemCode === record.ItemCode);
        switch (field) {
            case 'AccountNo':
            case 'AccountCode':
                items[index][field] = value.code;
                items[index]['AccountName'] = value.name;
                break;
            case 'VatGroup':
                items[index][field] = value.code;
                items[index]['VatRate'] = value.vatRate;
                break;
            case 'UomCode':
                items[index][field] = value?.Code;
                items[index]['UoMAbsEntry'] = value?.AlternateUoM;
                items[index]['UnitsOfMeasurement'] = value?.BaseQuantity;
                break;
            case 'LineTotal':
                items[index][field] = value;
                items[index]['Quantity'] = items[index]['Quantity'] ?? 1;
                items[index]['UnitPrice'] = items[index][field] / items[index]['Quantity'];
                items[index]['DiscountPercent'] = items[index]['DiscountPercent'] ?? 0;
                break;
            default:
                items[index][field] = value;
        }

        let DocTotalBeforeDiscount = this.state.DocTotalBeforeDiscount;
        let DocTaxTotal = this.state.DocTaxTotal;
        let DocTotal = this.state.DocTotal;

        if (field === 'Quantity' || field === 'UnitPrice' || field === 'DiscountPercent' || field?.includes('Vat') || field === 'LineTotal') {
            items[index]['LineTotal'] = Formular.findLineTotal(items[index]['Quantity'], items[index]['UnitPrice'], items[index]['DiscountPercent']);
        }

        this.setState({ ...this.state, Items: items, DocTotalBeforeDiscount, DocTaxTotal, DocTotal })
    }

    protected handlerChangeItemByCode(value: any) {
        const items: any[] = [...this.state.Items ?? []];
        const index = items.findIndex((e: any) => e?.ItemCode === value?.ItemCode);

        if (index >= 0) {
            items[index] = value;
            this.setState({ ...this.state, error: {}, Items: items });
        }
    }
}
