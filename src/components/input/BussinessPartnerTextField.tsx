import React, { FC } from 'react'
import MUITextField from './MUITextField'
import VendorModal, { VendorModalType } from '../modal/VendorModal';
import BusinessPartner from '@/models/BusinessParter';

interface BussinessPartnerTextField {
    value: any,
    onChange: (account: any) => void
    name: any,
    type: VendorModalType,
}

const BussinessPartnerTextField: FC<BussinessPartnerTextField> = ({ value, onChange, name, type }: BussinessPartnerTextField) => {
    const [open, setOpen] = React.useState<boolean>(false)

    const handlerConfirm = (data: BusinessPartner) => {
        onChange({ target: { value: data } })
    }

    const onClose = () => setOpen(false);

    return <>
        <VendorModal open={open} onClose={onClose} onOk={handlerConfirm} type={type} />
        <MUITextField endAdornment value={value} name={name} onClick={() => setOpen(true)} />
    </>
}


export default BussinessPartnerTextField;