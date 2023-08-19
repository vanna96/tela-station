import React, { FC } from 'react'
import MUITextField from './MUITextField'
import VendorModal from '../modal/VendorModal'
import { VendorModalType } from '../modal/VendorModal';
import BusinessPartner from '../../models/BusinessParter';


interface BusinessPartnerTextField {
    value: any,
    onChange: (businessPartner: any) => void
    name?: any,
    type: VendorModalType
}

const BusinessPartnerTextField: FC<BusinessPartnerTextField> = ({ value, onChange, name, type }: BusinessPartnerTextField) => {
    const [open, setOpen] = React.useState<boolean>(false)

    const handlerConfirm = (businessPartner: BusinessPartner) => {
        onChange({ target: { value: businessPartner } })
    }

    const onClose = () => setOpen(false);

    return <>
        <VendorModal type={type} open={open} onClose={onClose} onOk={handlerConfirm} />
        <MUITextField endAdornment value={value} name={name} onClick={() => setOpen(true)} />
    </>
}


export default BusinessPartnerTextField;