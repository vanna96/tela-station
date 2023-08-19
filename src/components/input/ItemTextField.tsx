import React, { FC } from 'react'
import MUITextField from './MUITextField'
import VatGroupModal, { VatCategory } from '../modal/VatGroupModal';
import ItemModal from '../modal/ItemModal';

type ITEM_TYPE = 'purchase' | 'sale' | 'inventory';

interface ItemTextFieldProps {
    value: any,
    onChange: (item: any) => void
    name?: any,
    type: ITEM_TYPE,
    disabled?: boolean,
    label?: string,
}

const ItemTextField: FC<ItemTextFieldProps> = ({ value, onChange, name, type, disabled, label }: ItemTextFieldProps) => {
    const [open, setOpen] = React.useState<boolean>(false)

    const handlerConfirm = (item: any) => {
        onChange({ target: { value: item } })
    }

    const onClose = () => setOpen(false);

    return <>
        <ItemModal type={type} open={open} onClose={onClose} onOk={handlerConfirm} />
        <MUITextField label={label} disabled={disabled} endAdornment value={value} name={name} onClick={() => setOpen(true)} />
    </>
}


export default ItemTextField;