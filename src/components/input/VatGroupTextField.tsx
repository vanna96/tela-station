import React, { FC } from 'react'
import MUITextField from './MUITextField'
import VatGroupModal, { VatCategory } from '../modal/VatGroupModal';


interface VatGroupTextField {
    value: any,
    onChange: (businessPartner: any) => void
    name?: any,
    type: VatCategory,
    disabled?: boolean,
    label?: string,
}

const VatGroupTextField: FC<VatGroupTextField> = ({ value, onChange, name, type, disabled, label }: VatGroupTextField) => {
    const [open, setOpen] = React.useState<boolean>(false)

    const handlerConfirm = (businessPartner: any) => {
        onChange({ target: { value: businessPartner } })
    }

    const onClose = () => setOpen(false);

    return <>
        <VatGroupModal type={type} open={open} onClose={onClose} onOk={handlerConfirm} />
        <MUITextField label={label} disabled={disabled} endAdornment value={value} name={name} onClick={() => setOpen(true)} />
    </>
}


export default VatGroupTextField;