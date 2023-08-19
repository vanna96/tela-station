import React, { RefObject } from "react";
import { Checkbox, Radio } from "@mui/material";
import Modal from "../modal/Modal";
import shortid from "shortid";
import MUITextField from "../input/MUITextField";
import MUISelect from "../selectbox/MUISelect";
import MUIDatePicker from "../input/MUIDatePicker";



export interface ColumnSearchProps {
    onOk: (columns: any) => void,
    ref?: RefObject<ColumnSearch>,
}


export default class ColumnSearch extends React.Component<ColumnSearchProps> {

    state = {
        open: false,
        form: {},
    } as any

    componentDidMount(): void {
    }

    handlerChange(value: any, field: any) {
        let form: any = { ...this.state.form };
        form[field] = value;
        this.setState({ ...this.state, form: form });
    }

    handlerOpen() {
        this.setState({ ...this.state, open: true });
    }

    handlerClose() {
        this.setState({ ...this.state, open: false });
    }

    handlerOk() {
        this.props.onOk(this.state.form);
        this.setState({ ...this.state, open: false });
    }


    render() {
        return <>
            <Modal
                title="Filter Documents"
                titleClass="font-bold text-md"
                widthClass="w-[70%]"
                heightClass="h-[80vh]"
                okLabel="Search"
                // open={true}
                open={this.state.open}
                onClose={() => this.handlerClose()}
                onOk={() => this.handlerOk()}>
                <form className="w-full flex flex-col">
                    <hr />
                    <div className="w-full  grid grid-cols-2 gap-x-16 gap-y-4 text-[13px] my-3">

                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <span className="mt-1">Document Num</span>
                                <div className="col-span-2"><MUITextField placeholder="" defaultValue={this.state?.form?.DocNum} onBlur={(event) => this.handlerChange(event.target.value, 'DocNum')} /></div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <span className="mt-1">Vendor</span>
                                <div className="col-span-2"><MUITextField placeholder="" defaultValue={this.state?.form?.BPCode} onBlur={(event) => this.handlerChange(event.target.value, 'BPCode')} onClick={() => { }} endAdornment /></div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <span className="mt-1">Customer Ref.</span>
                                <div className="col-span-2"><MUITextField placeholder="" defaultValue={this.state?.form?.NumAtCard} onBlur={(event) => this.handlerChange(event.target.value, 'NumAtCard')} onClick={() => { }} endAdornment /></div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <span className="mt-1">Shipping Type</span>
                                <div className="col-span-2"><MUITextField placeholder="" defaultValue={this.state?.form?.ShippingType} onBlur={(event) => this.handlerChange(event.target.value, 'ShippingType')} onClick={() => { }} endAdornment /></div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <span className="mt-1">Payment Method</span>
                                <div className="col-span-2"><MUITextField placeholder="" defaultValue={this.state?.form?.PaymentMethod} onClick={() => { }} endAdornment /></div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <span className="mt-1">Payment Terms</span>
                                <div className="col-span-2"><MUITextField placeholder="" defaultValue={this.state?.form?.PaymentTermsCode} onClick={() => { }} endAdornment /></div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <span className="mt-1">Agreement Type</span>
                                <div className="col-span-2"><MUISelect items={[]} /></div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <span className="mt-1">Start Date</span>
                                <div className="col-span-2"><MUIDatePicker value={this.state?.form?.StartDate ?? null} onChange={(value) => this.handlerChange(value, 'StartDate')} /></div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <span className="mt-1">End Date</span>
                                <div className="col-span-2"><MUIDatePicker value={this.state?.form?.EndDate ?? null} onChange={(value) => this.handlerChange(value, 'EndDate')} /></div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <span className="mt-1">Signing Date</span>
                                <div className="col-span-2"><MUIDatePicker value={this.state?.form?.SigningDate ?? null} onChange={(value) => this.handlerChange(value, 'SigningDate')} /></div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <span className="mt-1">Termination Date</span>
                                <div className="col-span-2"><MUIDatePicker value={this.state?.form?.TerminationDate ?? null} onChange={(value) => this.handlerChange(value, 'TerminationDate')} /></div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <span className="mt-1">Project</span>
                                <div className="col-span-2"><MUITextField placeholder="" onClick={() => { }} endAdornment /></div>
                            </div>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    }
}



type FilterModeType = 'string' | 'number' | 'date';

interface FilterSelectModeProps {
    onChange?: (value: any) => void,
    type?: FilterModeType,
}

const filterTypeString = [
    { label: 'Eqaul', value: 'eq' },
    { label: 'Contains', value: 'contains' },
    { label: 'Start With', value: 'startswith' },
    { label: 'End with', value: 'endswith' },
    { label: 'Not Equal', value: 'ne' },
]

const filterTypeDate = [
    { label: 'Eqaul', value: 'eq' },
    { label: 'Start With', value: 'startswith' },
    { label: 'End with', value: 'endswith' },
    { label: 'Not Equal', value: 'ne' },
    { label: 'Between', value: 'between' },
]

const filterTypeNumber = [
    { label: 'Eqaul', value: 'eq' },
    { label: 'Between', value: 'between' },
    { label: 'Less Than', value: 'lt' },
    { label: 'Less Than or Equal', value: 'le' },
    { label: 'Greater Than', value: 'gt' },
    { label: 'Greater Than or Equal', value: 'gl' },
    { label: 'Not Equal', value: 'ne' },
];


const filterTypeMode = (type?: FilterModeType) => {
    let data = [];

    switch (type) {
        case 'string':
            return filterTypeString;
        case 'date':
            return filterTypeDate;
        case 'number':
            return filterTypeNumber;
        default:
            return [];
    }
}

const FilterSelectMode = (props: FilterSelectModeProps) => {

    return <MUISelect
        className="mt-[4px]"
        value={'eq'}
        items={filterTypeMode(props.type)} />
}

