import React, { FC } from 'react'
import MUITextField from './MUITextField'
import Project from '@/models/Project';
import ProjectModal from '../modal/ProjectModal';
import UoMListModal from '../modal/UomListModal';


interface UOMTextField {
    value: any,
    data: any[],
    onChange?: (project: any) => void,
    disabled?: boolean
}

const UOMTextField: FC<UOMTextField> = ({ value, onChange, data, disabled }: UOMTextField) => {
    const [open, setOpen] = React.useState<boolean>(false)

    const handlerConfirm = (value: any) => {
        if (onChange) onChange({ target: { value: value } })

    }

    const onClose = () => setOpen(false);

    return <>
        <UoMListModal open={open} onClose={onClose} onOk={handlerConfirm} data={data} />
        <MUITextField disabled={disabled} endAdornment={onChange !== undefined && !disabled} value={value} onClick={() => setOpen(true)} />
    </>
}


export default UOMTextField;