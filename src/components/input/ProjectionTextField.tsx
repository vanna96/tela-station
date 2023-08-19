import React, { FC } from 'react'
import MUITextField from './MUITextField'
import Project from '@/models/Project';
import ProjectModal from '../modal/ProjectModal';


interface ProjectionTextField {
    value: any,
    onChange: (project: any) => void
}

const ProjectionTextField: FC<ProjectionTextField> = ({ value, onChange }: ProjectionTextField) => {
    const [open, setOpen] = React.useState<boolean>(false)

    const handlerConfirm = (project: Project) => {
        onChange({ target: { value: project.code } })
    }

    const onClose = () => setOpen(false);

    return <>
        <ProjectModal open={open} onClose={onClose} onOk={handlerConfirm} />
        <MUITextField endAdornment value={value} onClick={() => setOpen(true)} />
    </>
}


export default ProjectionTextField;