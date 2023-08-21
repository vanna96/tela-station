import React from "react";
import Modal from '@/components/modal/Modal';
import MUITextField from "@/components/input/MUITextField";
import VatGroupTextField from "@/components/input/VatGroupTextField";
import { currencyFormat } from "@/utilies";

interface ItemModalProps {
    ref?: React.RefObject<ItemModal | undefined>,
    onSave?: (value: any) => void,
    columns: any[],
}

export class ItemModal extends React.Component<ItemModalProps, any>  {
    constructor(props: any) {
        super(props);

        this.state = {
            open: false
        } as any

        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onSave = this.onSave.bind(this);
        this.handChange = this.handChange.bind(this);
    }


    onOpen(data?: any) {
        this.setState({ open: true, ...data });
    }

    onClose() {
        this.setState({ open: false })
    }

    onSave() {
        if (this.props.onSave) {
            const temps: any = { ...this.state };
            delete temps.open;
            this.props.onSave(temps);
        }

        this.setState({ open: false })
    }


    handChange(event: any, field: string) {
        const temps = { ...this.state };
        temps[field] = event.target.value;

        if (field.includes('Quantity') || field.includes('UnitPrice') || field.includes('Discount')) {
            let total = parseFloat(temps['Quantity'] ?? 0) * (parseFloat(temps['UnitPrice']) ?? 0);
            total = total - (total * parseFloat(temps['Discount'] ?? 0) / 100)
            temps['LineTotal'] = total;
            temps['GrossPrice'] = temps['LineTotal'] + (temps['LineTotal'] * (temps['VatRate'] ?? 1) / 100)
        }

        if (field === 'VatGroup') {
            temps['VatGroup'] = event.target.value.code;
            temps['VatRate'] = event.target.value.vatRate;
            temps['GrossPrice'] = temps['LineTotal'] + (temps['LineTotal'] * (event.target.value?.vatRate ?? 1) / 100)
        }

        this.setState({ ...temps });
    }


    render() {
        return (
            <Modal
                title={`Item - ${this.state?.ItemCode ?? ''}`}
                titleClass="pt-3 px-4 font-bold w-full"
                open={this.state.open}
                widthClass="w-[70vw] sm:w-[90vw]"
                heightClass="h-[90vh]"
                onClose={this.onClose}
                onOk={this.onSave}
                okLabel="Save"
            >
                <>
                    <div className="flex flex-col gap-3 px-4 py-6 text-xs" key={this.state.key}>
                        <div className="grid grid-cols-4 lg:grid-cols-2 sm:grid-cols-1 gap-3">
                            <MUITextField label="Item Code" value={this.state?.ItemCode} />
                            <MUITextField label="Description" value={this.state?.ItemName} />
                        </div>
                        <div className=" border-b pb-2 mt-3 uppercase font-medium text-gray-600">
                            Item Pricing
                        </div>
                        <div className="grid grid-cols-4 lg:grid-cols-2 sm:grid-cols-1 gap-3">
                            <MUITextField label="Unit Price" startAdornment={'USD'} defaultValue={currencyFormat(this.state?.UnitPrice)} onChange={(event) => this.handChange(event, 'UnitPrice')} />
                            <MUITextField label="Quantity" defaultValue={this.state?.Quantity} onChange={(event) => this.handChange(event, 'Quantity')} />
                            <MUITextField label="Discount" startAdornment={'%'} defaultValue={this.state?.Discount} onChange={(event) => this.handChange(event, 'Discount')} />
                            {/* <MUITextField label="Tax Code" value={this.state?.VatGroup} endAdornment onChange={(event) => this.handChange(event, 'UnitPrice')} /> */}
                            <VatGroupTextField label="Tax Code" value={this.state?.VatGroup} onChange={(event) => this.handChange(event, 'VatGroup')} type={"OutputTax"} />
                            <MUITextField label="Gross Price" startAdornment={'USD'} value={currencyFormat(this.state?.GrossPrice)} />
                            <MUITextField label="Total" startAdornment={'USD'} value={currencyFormat(this.state?.LineTotal)} />
                        </div>

                        <div className="col-span-4 border-b pb-2 mt-3 uppercase font-medium text-gray-600">
                            Additional Input
                        </div>
                        <div className="grid grid-cols-4 lg:grid-cols-2 sm:grid-cols-1 gap-3">
                            <MUITextField label="Item Group" value={this.state?.ItemGroup} />
                            <MUITextField label="UOM Group" value={this.state?.UomGroup} />
                            <MUITextField label="UOM Code" value={this.state?.UomCode} />
                            <MUITextField label="Item Per Unit" value={this.state?.UnitOfMeasuremnt} />
                            <MUITextField label="Business Line" endAdornment />
                            <MUITextField label="Product Line" endAdornment />
                            <MUITextField label="Revenue Line" endAdornment />
                        </div>

                    </div>
                </>
            </Modal>
        )
    }
}
