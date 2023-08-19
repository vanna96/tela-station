import React, { FC } from 'react'
import MUITextField, { MUITextFieldProps } from './MUITextField'
import VendorModal, { VendorModalType } from '../modal/VendorModal';
import { useQuery } from 'react-query';
import BusinessPartnerRepository from '@/services/actions/bussinessPartnerRepository';


interface VendorTextFieldProps extends MUITextFieldProps {
    vtype: VendorModalType,
}


const VendorTextField: FC<VendorTextFieldProps> = (props: VendorTextFieldProps) => {
    const [open, setOpen] = React.useState<boolean>(false);

    const handlerConfirm = (vendor: any) => {
        if (!props.onChange) return;
        props.onChange(vendor);
    }

    const onClose = () => setOpen(false);

    return <>
        <VendorModal type={props.vtype} open={open} onClose={onClose} onOk={handlerConfirm} />
        <MUITextField {...props} endAdornment onClick={() => setOpen(true)} />
    </>
}


export default VendorTextField;