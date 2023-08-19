import { withRouter } from '@/routes/withRouter';
import React, { Component } from 'react'
import PurchaseAgreement, { PurchaseAgreementDocumentLine } from '../../../../models/PurchaseAgreement';
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
import ItemGroupRepository from '@/services/actions/itemGroupRepository';
import { getUOMGroupByCode } from '@/helpers';
import UnitOfMeasurementGroupRepository from '@/services/actions/unitOfMeasurementGroupRepository';
import { useQuery } from 'react-query';
import MenuButton from '@/components/button/MenuButton';
import LoadingProgress from '@/components/LoadingProgress';
import shortid from 'shortid';
import ContentComponent from '@/components/core/ContentComponent';

class PurchaseAgreementDetail extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            loading: true,
            isError: false,
            message: '',
            tapIndex: 0,
        }

        this.fetchData = this.fetchData.bind(this);
        this.onTap = this.onTap.bind(this);
    }

    componentDidMount(): void {
        this.fetchData()
    }

    async fetchData() {
        const { id } = this.props.match.params;
        const data = this.props.query.find('pa-id-' + id);
        this.setState({ ...this.state, loading: true });
        await new Promise((resolve) => setTimeout(() => resolve(''), 800));


        if (!data) {
            new PurchaseAgreementRepository().find(id).then(async (res: any) => {
                this.props.query.set('pa-id-' + id, res);
                this.setState({ ...res, loading: false });
            }).catch((e: Error) => {
                this.setState({ isError: true, message: e.message });
            })
        } else {
            this.setState({ ...data, loading: false });
        }
    }

    onTap(index: number) {
        this.setState({ ...this.state, tapIndex: index });
    }

    render() {
        return (
            <>
                <DocumentHeaderComponent
                    data={this.state}
                    menuTabs={['General', 'Logistic', 'Content', 'Attachment']
                        .map((e, index) => <MenuButton key={shortid.generate()} active={this.state.tapIndex === index} onClick={() => this.onTap(index)}>{e}</MenuButton>)}
                />
                <div className='w-full h-full flex flex-col gap-4'>

                    {this.state.loading ? <div className='grow flex justify-center items-center pb-6'>
                        <LoadingProgress />
                    </div> :
                        (<div className='grow w-full h-full  flex flex-col gap-3 px-7 mt-4'>

                            <div className='grow flex flex-col gap-3 '>
                            <General data={this.state} />
                            <Logistic data={this.state} />
                            <Content data={this.state} />
                            <PreviewAttachment attachmentEntry={this.state.AttachmentEntry} />
                                {/* {this.state.tapIndex === 0 && <General data={this.state} />}
                                {this.state.tapIndex === 1 && <Logistic data={this.state} />}
                                {this.state.tapIndex === 2 && <Content data={this.state} />}
                                {this.state.tapIndex === 3 && <PreviewAttachment attachmentEntry={this.state.AttachmentEntry} />} */}
                                <div className='mb-5'></div>
                            </div>
                        </div>)

                    }

                </div>
            </>
        )
    }
}

export default withRouter(PurchaseAgreementDetail);



function General(props: any) {
    return (
        <div className='bg-white shadow-lg border grid grid-cols-2 sm:grid-cols-1 gap-2 w-full rounded-lg  text-[15px] px-8 py-6'>
            <h2 className='col-span-2 border-b pb-2 mb-2 font-bold text-lg'>General</h2>
            <div className='flex flex-col gap-1 '>
                <div className='flex gap-2'>
                    <span className='w-4/12 text-gray-500 text-sm'>Vendor Code</span>
                    <span className='w-8/12 font-medium text-sm'>: {props.data.CardCode}</span>
                </div>
                <div className='flex gap-2'>
                    <span className='w-4/12 text-gray-500 text-sm'>Vendor Name</span>
                    <span className='w-8/12 font-medium text-sm'>: {props.data.CardName}</span>
                </div>
                <div className='flex gap-2'>
                    <span className='w-4/12 text-gray-500 text-sm'>Contact Person Code</span>
                    <span className='w-8/12 font-medium text-sm'>: {props.data?.ContactPersonList?.find((e: ContactEmployee) => e.id === props.data.contactPersonCode)?.name ?? 'N/A'}</span>
                </div>
                <div className='flex gap-2'>
                    <span className='w-4/12 text-gray-500 text-sm'>Email</span>
                    <span className='w-8/12 font-medium text-sm'>: {props.data?.Email}</span>
                </div>
                <div className='flex gap-2'>
                    <span className='w-4/12 text-gray-500 text-sm'>Phone</span>
                    <span className='w-8/12 font-medium text-sm'>: {props.data?.Phone}</span>
                </div>
            </div>
            <div className='flex flex-col gap-1'>
                <div className='flex gap-2'>
                    <span className='w-4/12 text-gray-500 text-sm '>Document Numbering</span>
                    <span className='w-8/12 font-medium text-sm'>: {props.data.DocNum}</span>
                </div>
                <div className='flex gap-2'>
                    <span className='w-4/12 text-gray-500 text-sm'>Agreement Type</span>
                    <span className='w-8/12 font-medium text-sm'>: {PurchaseAgreement.getType(props.data.AgreementMethod)}</span>
                </div>
                <div className='flex gap-2'>
                    <span className='w-4/12 text-gray-500 text-sm'>Start Date</span>
                    <span className='w-8/12 font-medium text-sm'>: {dateFormat(props.data.StartDate)}</span>
                </div>
                <div className='flex gap-2'>
                    <span className='w-4/12 text-gray-500 text-sm'>End Date</span>
                    <span className='w-8/12 font-medium text-sm'>: {dateFormat(props.data.EndDate)}</span>
                </div>

            </div>
        </div>
    )
}


function Logistic(props: any) {
    const { data }: any = props;
    return <div className='w-full bg-white shadow-lg border px-8 py-6 rounded-lg grid grid-cols-2 sm:grid-cols-1 gap-2 text-[15px] '>
        <h2 className='col-span-2 border-b pb-2 mb-2 font-bold text-lg  '>Logisitic</h2>
        <div className='flex flex-col gap-2'>
            <div className='grid grid-cols-3 gap-2'><span className='text-gray-500 font-medium text-sm'>Agreement Type</span> <span className='col-span-2 font-medium text-sm '>: {PurchaseAgreement.getType(data.AgreementType)}</span></div>
            <div className='grid grid-cols-3 gap-2'><span className='text-gray-500 font-medium text-sm'>Payment Terms</span> <span className='col-span-2 font-medium text-sm '>: {new PaymentTermTypeRepository().find(data.PaymentTermType)?.PaymentTermsGroupName ?? 'N/A'}</span></div>
            <div className='grid grid-cols-3 gap-2'><span className='text-gray-500 font-medium text-sm'>Payment Method</span> <span className='col-span-2 font-medium text-sm '>: {data.PaymentMethod ?? 'N/A'}</span></div>
            <div className='grid grid-cols-3 gap-2'><span className='text-gray-500 font-medium text-sm'>Shipping Type</span> <span className='col-span-2 font-medium text-sm '>: {new ShippingTypeRepository().find(data.ShippingType)?.Name ?? 'N/A'}</span></div>
            <div className='grid grid-cols-3 gap-2'><span className='text-gray-500 font-medium text-sm'>Settlement Probability %</span> <span className='col-span-2 font-medium text-sm '>: {data.SettlementProbability?.toFixed(2)}</span></div>
            <div className='grid grid-cols-3 gap-2'><span className='text-gray-500 font-medium text-sm'>Remark</span> <span className='col-span-2 font-medium text-sm '>: {data.Remark ?? 'N/A'}</span></div>
        </div>
        <div className='flex flex-col gap-2'>
            <div className='grid grid-cols-3 gap-2'><span className='text-gray-500 font-medium text-sm'>Status</span> <span className='col-span-2 font-medium text-sm '>: {DocumentStatus.getFullNameStatus(data?.Status)}</span></div>
            <div className='grid grid-cols-3 gap-2'><span className='text-gray-500 font-medium text-sm'>Owner</span> <span className='col-span-2 font-medium text-sm '>: {new OwnerRepository().find(data.Owner)?.name}</span></div>
            <div className='grid grid-cols-3 gap-2'><span className='text-gray-500 font-medium text-sm'>Reminder</span> <span className='col-span-2 font-medium text-sm '>: {data.remindTime} {PurchaseAgreement.getRemindUnit(data.RemindUnit)}</span></div>
        </div>
    </div>
}

function Content(props: any) {
    const { data } = props;
    const itemGroupRepo = new ItemGroupRepository();

    const itemColumn = useMemo(() => [
        {
            accessorKey: "ItemCode",
            header: "Item NO.", //uses the default width from defaultColumn prop
            enableClickToCopy: true,
            enableFilterMatchHighlighting: true,
            size: 88,
        },
        {
            accessorKey: "ItemName",
            header: "Item Description",
            enableClickToCopy: true,
        },
        {
            accessorKey: "ItemGroup",
            header: "Item Group",
            Cell: ({ cell }: any) => itemGroupRepo.find(cell.getValue())?.GroupName,
        },
        {
            accessorKey: "Quantity",
            header: "Quantity",
            Cell: ({ cell }: any) => currencyFormat(cell.getValue()),
        },
        {
            accessorKey: "UnitPrice",
            header: "Unit Price",
            Cell: ({ cell }: any) => currencyFormat(cell.getValue()),
        },
        {
            accessorKey: "UoMGroup",
            header: "UoM Group",
            Cell: ({ cell }: any) => getUOMGroupByCode(cell.row.original.ItemCode)?.Code,
        },
        {
            accessorKey: "UomCode",
            header: "UoM Group",
            Cell: ({ cell }: any) => cell.getValue(),
        },
        {
            accessorKey: "UnitsOfMeasurement",
            header: "Item Per Units",
            Cell: ({ cell }: any) => cell.getValue(),
        },
    ], [data]);

    const serviceColumns = React.useMemo(
        () => [
            {
                accessorKey: "PlannedAmountLC",
                header: "Planned Amount (LC)",
                visible: true,
                Cell: ({ cell }: any) => currencyFormat(cell.getValue()),
            },
            {
                accessorKey: "LineDiscount",
                header: "Line Discount",
                visible: true,
                Cell: ({ cell }: any) => currencyFormat(cell.getValue()),
            },
            {
                accessorKey: "OpenAmountLC",
                header: "Open Amount (LC)",
                visible: true,
                Cell: ({ cell }: any) => currencyFormat(cell.getValue()),
            },
            {
                accessorKey: "ShppingType",
                header: "Shipping Type",
                visible: true,
            },
            {
                accessorKey: "Project",
                header: "Project",
                visible: true,
            },
        ],
        [data]
    );


    return <>
        <ContentComponent
            columns={itemColumn}
            items={data?.Items ?? []}
            viewOnly={true}
            type={data?.DocType}
            onChange={function (key: any, value: any): void {
                throw new Error('Function not implemented.');
            }} onRemoveChange={function (record: any[]): void {
                throw new Error('Function not implemented.');
            }} />
    </>
}
