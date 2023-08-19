import React, { FC } from 'react'
import MUITextField from './MUITextField'
import GLAccountModal from '../modal/GLAccountModal';
import VatGroup from '@/models/VatGroup';
import VatGroupModal from '../modal/VatGroupModal';

interface VatGroupField {
    value: any,
    onChange: (vatgroup: any) => void
    name: any
}

const VatGroupField: FC<VatGroupField> = ({ value, onChange,name }: VatGroupField) => {
    const [open, setOpen] = React.useState<boolean>(false)

    const handlerConfirm = (vatgroup: VatGroup) => {
        onChange({ target: { value: vatgroup } })
    }

    const onClose = () => setOpen(false);

    return <>
        <VatGroupModal open={open} onClose={onClose} onOk={handlerConfirm} />
        <MUITextField endAdornment value={value} name={name} onClick={() => setOpen(true)} />
    </>
}


export default VatGroupField;