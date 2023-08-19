import React, { FC, useMemo } from "react"
import Modal from "../modal/Modal"
import MaterialReactTable from "material-react-table"
import { useQuery } from "react-query"
import AttachmentRepository from "@/services/actions/attachmentRepository"
import { fileToBase64 } from "@/utilies"

interface PreviewAttachmentProps {
    attachmentEntry?: number
}

const PreviewAttachment: FC<PreviewAttachmentProps> = ({
    attachmentEntry,
}: PreviewAttachmentProps) => {
    const column = useMemo(
        () => [
            {
                accessorKey: "sourcePath",
                header: "File Path", //uses the default width from defaultColumn prop
                // enableClickToCopy: true,
                // enableFilterMatchHighlighting: true,
                // size: 400,
            },
            {
                accessorKey: "fileName",
                header: "Filename",
                enableClickToCopy: true,
            },
            {
                accessorKey: "fileExtension",
                header: "Extension",
                Cell: ({ cell }: any) => cell.getValue(),
            },
            {
                accessorKey: "attachmentDate",
                header: "Attachment Date",
            },
            {
                accessorKey: "freeText",
                header: "FreeText",
            },
        ],
        [attachmentEntry]
    )

    const attachments = useQuery({
        queryKey: ["attachment_" + attachmentEntry],
        queryFn: () => new AttachmentRepository().find(attachmentEntry),
        staleTime: Infinity,
    })

    const [image, setImage] = React.useState<any>(null)
    const [previewImage, setPreviewImage] = React.useState(false)

    return (
        <div className="bg-white shadow-lg border px-8 py-6 rounded-lg">
            <h2 className='col-span-2 border-b pb-2 mb-4 font-bold text-lg  '>Attachments</h2>
            <div className="data-table text-inherit border-none p-0 mt-3 ">
                <Modal
                    disableShadow
                    open={previewImage}
                    pannelClass="bg-transparent"
                    disableTitle={true}
                    title={""}
                    onClose={() => setPreviewImage(false)}
                    disableFooter={true}
                    widthClass="w-[30rem]"
                >
                    <img src={image} />
                </Modal>

                <MaterialReactTable
                    columns={column}
                    data={attachments?.data ?? []}
                    enableHiding={true}
                    initialState={{ density: "compact" }}
                    enableDensityToggle={false}
                    enableColumnResizing
                    enableStickyHeader={true}
                    enableStickyFooter={true}
                    enableTableHead={true}
                    enableTopToolbar={false}
                    enableColumnActions={false}
                    enableGlobalFilter={false}
                    enableFilters={false}
                    enableFullScreenToggle={false}
                    enablePagination={false}
                    getRowId={(row: any) => row.DocEntry}
                    state={{
                        isLoading: attachments.isLoading,
                    }}
                    muiTableBodyRowProps={({ row }) => ({
                        onClick: async () => {
                            setImage(await fileToBase64(row.original.file))
                            setPreviewImage(true)
                        },
                        sx: { cursor: "pointer" },
                    })}
                />
            </div>
        </div>
    )
}

export default PreviewAttachment
