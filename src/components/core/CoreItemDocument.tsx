import React from 'react'
import { HiOutlineEye, HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight, HiOutlineDocumentAdd, HiOutlineChevronDown } from "react-icons/hi";
import VendorModal from '../modal/VendorModal';
import BusinessPartner from '../../models/BusinessParter';
import BackButton from '../button/BackButton';
import { Backdrop, CircularProgress } from '@mui/material';
import Modal from '../modal/Modal';
import { ToastContainer, ToastOptions, TypeOptions, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { VendorModalType } from '../modal/VendorModal';
import FormMessageModal from '../modal/FormMessageModal';
import WarehouseModal from '../modal/WarehouseModal';

const contextClass: any = {
    success: "bg-blue-600",
    error: "bg-red-600",
    info: "bg-gray-600",
    warning: "bg-orange-400",
    default: "bg-indigo-600",
    dark: "bg-white-600 font-gray-300",
};

type ModelDialog = 'success' | 'error'


export interface CoreItemDocumentState {
    isOpenItem: boolean,
    isOpenWarehouse: boolean,
    cardCode?: any,
    cardName?: any,
    items?: any[],
    attachments?: any[],
    attachmentEntry?: null,
    series: any[],
    serie: any,
    docNum: any,
    isSubmitting: boolean,
    title: string,
    message: string,
    showDialogMessage: boolean,
    collapse: boolean,
    loading: boolean,
    isOpenVendor: boolean,
    vendorType: VendorModalType,
    isLoadingSerie: boolean,
    warehouse?: any[]


}

export default abstract class CoreItemDocument extends React.Component<any, CoreItemDocumentState> {

    dialog = React.createRef<FormMessageModal>();

    protected constructor(props: any) {
        super(props);
        this.state = {
            isLoadingSerie: true,
            collapse: true,
            cardCode: null,
            cardName: null,
            attachmentEntry: null,
            isOpenItem: false,
            isOpenWarehouse: false,
            items: [],
            series: [],
            serie: '',
            docNum: null,
            isSubmitting: false,
            message: '',
            showDialogMessage: false,
            title: '',
            loading: true,
            isOpenVendor: false,
            vendorType: 'customer',
            warehouse: []


        }

        this.handlerConfirmVendor = this.handlerConfirmVendor.bind(this)
        this.handlerConfirmWarehouse = this.handlerConfirmWarehouse.bind(this);
        this.handlerChangeWarehouse = this.handlerChangeWarehouse.bind(this);
        this.handlerDeleteWarehouse = this.handlerDeleteWarehouse.bind(this);
    }

    abstract FormRender(): JSX.Element;

    render() {

        return (
            <>
                <VendorModal open={this.state.isOpenVendor} onOk={this.handlerConfirmVendor} onClose={() => this.handlerCloseVendor()} type={this.state.vendorType} />
                <WarehouseModal open={this.state.isOpenWarehouse} onClose={() => this.handlerCloseWarehouse()} onOk={this.handlerConfirmWarehouse} />


                <ToastContainer
                    toastClassName={({ type }: any) => contextClass[type || "default"] +
                        " relative flex p-1 min-h-6 rounded-md justify-between overflow-hidden cursor-pointer"
                    }
                    bodyClassName={() => "text-sm font-white font-med block p-3"}
                />
                <Modal title={this.state.title} open={this.state.showDialogMessage} onClose={() => { }} onOk={() => { }} widthClass='w-[30rem]' >
                    <span className='text-sm'>{this.state.message}</span>
                </Modal>

                <FormMessageModal ref={this.dialog} />

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={this.state.isSubmitting}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <div className='bg-gray-100 flex flex-col  w-full h-full p-4 relative'>
                    <div className=" rounded-lg px-6 py-4 flex items-center justify-between sticky top-3 gap-3  border-b bg-white shadow-sm xl:text-sm font-bold z-20">
                        <div className="flex gap-3 items-center">
                            <BackButton />
                            <div>Item Master Data</div>
                        </div>

                        <div className="px-3 flex items-center gap-3">
                            <div role="button" className=" hover:bg-gray-200 rounded-lg p-2 px-3 text-base border hover:text-blue-500"><HiOutlineDocumentAdd className="" /></div>
                            <div role="button" className=" hover:bg-gray-200 rounded-lg p-2 px-3 text-base border hover:text-blue-500"><HiOutlineEye className="" /></div>
                            <div role="button" className=" hover:bg-gray-200 rounded-lg p-2 px-3 text-base border hover:text-blue-500"><HiChevronDoubleLeft className="" /></div>
                            <div role="button" className=" hover:bg-gray-200 rounded-lg p-2 px-3 text-base border hover:text-blue-500"><HiChevronLeft className="" /></div>
                            <div role="button" className=" hover:bg-gray-200 rounded-lg p-2 px-3 text-base border hover:text-blue-500"><HiChevronRight className="" /></div>
                            <div role="button" className=" hover:bg-gray-200 rounded-lg p-2 px-3 text-base border hover:text-blue-500"><HiChevronDoubleRight className="" /></div>
                        </div>

                        <div role="button"
                            onClick={() => this.handlerCollapse()}
                            className={`hover:border absolute left-[45%] -bottom-4 p-[8px] bg-white hover:bg-gray-200 border shadow rounded-full text-xl text-gray-600 transition-all transform duration-200 delay-100 ${this.state.collapse ? 'rotate-0' : 'rotate-180'}`}> <HiOutlineChevronDown />
                        </div>
                    </div>

                    <div className={`w-full p-3 flex justify-between gap-3 stick ${this.state.collapse ? '' : 'hidden'} transition-transform  delay-100 duration-200  my-3 rounded-lg xl:text-sm font-bold bg-white shadow-sm border z-10`}>
                        <div></div>
                        <div className="flex items-center">
                            <div role='button' className={`p-2 px-4 flex flex-col ${false ? 'border-b-[3px] border-blue-500' : ''}`}
                            >
                                <span className="">General</span>
                            </div>
                            <div role='button' className={`p-2 px-4 flex flex-col ${false ? 'border-b-[3px] border-blue-500' : ''}`}>Content</div>
                            <div role='button' className={`p-2 px-4 flex flex-col ${false ? 'border-b-[3px] border-blue-500' : ''}`}>Attachment</div>
                        </div>
                    </div>

                    <div className={`grow flex flex-col gap-4 w-full ${this.state.collapse ? '' : 'mt-4'}`}>
                        <this.FormRender />
                        <div className='mt-4'></div>
                    </div>


                </div>
            </>
        );
    }


    protected handlerCollapse() {
        this.setState({ ...this.state, collapse: !this.state.collapse })
    }

    protected handlerOpenItem() {
        this.setState({ ...this.state, isOpenItem: true })
    }

    protected handlerConfirmItem(data: any[]) {
        let oldItems = [...this.state.items ?? []];


        this.setState({ ...this.state, isOpenItem: false, items: [...oldItems, ...data] })
    }

    private handlerCloseItem() {
        // this.setState({ ...this.state, isOpenItem: false })
    }


    protected handlerOpenWarehouse() {
        this.setState({ ...this.state, isOpenWarehouse: true })
    }

    // protected handlerConfirmWarehouse2(data: any[]) {
    //     let oldWarehouse = [...this.state.warehouse ?? []];


    //     this.setState({ ...this.state, isOpenWarehouse: false, warehouse: [...oldWarehouse, ...data] })
    // }

    protected handlerConfirmWarehouse(data: any[]) {
        let oldItems = [...this.state.warehouse ?? []];
      
        // Filter out items that already exist in the state
        const newItems = data.filter((newItem) => !oldItems.some((oldItem) => oldItem.warehouseCode === newItem.warehouseCode));
      
        this.setState({ ...this.state, isOpenWarehouse: false, warehouse: [...oldItems, ...newItems] });
      }
      

    private handlerCloseWarehouse() {
        // this.setState({ ...this.state, isOpenItem: false })
    }




    protected handlerChange(key: string, value: any) {
        let temps: any = { ...this.state };
        temps[key] = value;

        this.setState(temps)
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




    protected handlerChangeWarehouse({ value, record, field }: any) {
        let warehouse = [...this.state.warehouse ?? []];
        let item = this.state.warehouse?.find((e: any) => e?.warehouseCode === record?.warehouseCode);
        item[field] = value;
        const index = warehouse.findIndex((e: any) => e?.WarehouseCode === record.warehouseCode);
        if (index > 0) warehouse[index] = item;

        this.setState({ ...this.state, warehouse })
    }

    protected handlerDeleteWarehouse(code: string) {
        let warehouse = [...this.state.warehouse ?? []];
        const index = warehouse.findIndex((e: any) => e?.WarehouseCode === code);
        warehouse.splice(index, 1)
        this.setState({ ...this.state, warehouse: warehouse })
    }



    // handler vendor 
    protected handlerConfirmVendor(record: BusinessPartner) {
        this.setState({
            ...this.state,
            cardCode: record.cardCode,
            cardName: record.cardName,
            isOpenVendor: false,
        });
    }

    protected handlerOpenVendor(type: VendorModalType) {
        this.setState({ ...this.state, isOpenVendor: true, vendorType: type })
    }
    private handlerCloseVendor() {
        // this.setState({ ...this.state, isOpenVendor: false })
    }
}
