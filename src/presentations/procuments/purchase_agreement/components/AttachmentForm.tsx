import React from 'react'
import { IoChevronForwardSharp } from "react-icons/io5";
import MaterialReactTable from "material-react-table";
import moment from 'moment'
import { AiOutlineDelete, AiOutlineEye, AiOutlineDownload } from "react-icons/ai";

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { fileToBase64 } from '../../../../utilies/index';
import FormCard from '@/components/card/FormCard';
import { Button } from '@mui/material';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '60%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '6px',
    p: 1,
};

export function PreviewImage({ open, close, base64Image }: any) {
    return (
        <Modal
            open={open}
            onClose={close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className='w-full h-[30rem] flex flex-col'>
                    <div className='grow ' style={{ backgroundImage: `url('${base64Image}')`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                        {/* <img src={base64Image} /> */}
                    </div>
                </div>
            </Box>
        </Modal>
    )
}


export default function AttachmentForm() {
    const [collapse, setCollapse] = React.useState(true);
    const [data, setData] = React.useState<any>([]);
    const [preview, setPreview] = React.useState(false);
    const [image, setImage] = React.useState('');

    const columns = React.useMemo(
        () => [
            {
                accessorKey: "Action",
                header: "",
                size: 80,
                Cell: ({ cell }: any) => {
                    // return ;
                    return <div className='flex gap-2'>
                        <div role="button" className="p-1 border-[1.5px] rounded " onClick={() => handlerRemoveRow(cell.row.original)}><AiOutlineDelete /></div>
                        <div role="button" className="p-1 border-[1.5px] rounded " onClick={() => handlerPreviewImage(cell.row.original)}><AiOutlineEye /></div>
                        {/* <div size="small" className="p-1 border-[1.5px] rounded " onClick={() => handlerRemoveRow(cell.row.original, data)}><AiOutlineDownload /></div> */}
                    </div>;
                },
            },
            {
                accessorKey: "Path",
                header: "Path",
            },
            {
                accessorKey: "Filename",
                header: "Filename", //uses the default width from defaultColumn prop
            },
            {
                accessorKey: "Extension",
                header: "Extension",
            },
            {
                accessorKey: "FreeText",
                header: "Free Text",
            },

            {
                accessorKey: "AttachmentDate",
                header: "Attachment Date",
            },
        ],
        [data]
    );


    const handlerRemoveRow = (row: any) => {
        const temps = [...data];
        const newArr = temps.filter((e) => e.key != row.key);
        setData([...newArr]);
    }

    const handlerAttachment = (event: any) => {
        let temps = Object.values(event.target.files)
            .map((e: any, index) => ({
                key: Date.now(),
                file: e,
                Path: 'C:/Attachments2',
                Filename: e.name,
                Extension: '.' + e.name.split('.')[1]?.toUpperCase(),
                FreeText: '',
                AttachmentDate: moment(new Date().toISOString()).format('DD/MM/YYYY')
            }));

        let files = [...data, ...temps];
        setData(files)
    }

    const handlerPreviewImage = async (row: any) => {
        setImage('')
        setPreview(true)
        const file: any = await fileToBase64(row.file);
        setImage(file)
    }

    return (
        <>
            <PreviewImage open={preview} close={() => setPreview(false)} base64Image={image} />
            <FormCard title='Attachments'>
                <div className='col-span-2 data-table'>
                    <MaterialReactTable
                        columns={columns}
                        data={data}
                        enableStickyHeader={true}
                        enableColumnActions={false}
                        enableColumnFilters={false}
                        enablePagination={false}
                        enableSorting={false}
                        enableBottomToolbar={false}
                        enableTopToolbar={false}
                        enableColumnResizing={true}
                        enableColumnFilterModes={false}
                        enableDensityToggle={false}
                        enableFilters={false}
                        enableFullScreenToggle={false}
                        enableGlobalFilter={false}
                        enableHiding={true}
                        initialState={{
                            columnVisibility: { FreeText: false, AttachmentDate: false },
                            density: "compact",
                        }}
                    />
                </div>

            </FormCard>
        </>
    )
}




