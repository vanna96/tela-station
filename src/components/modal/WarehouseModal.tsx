import React, { FC } from 'react'
import Modal from './Modal';
import MaterialReactTable from 'material-react-table';
import { useQuery } from 'react-query';
import WarehouseRepository from '@/services/warehouseRepository';



interface WarehouseModalProps {
    open: boolean,
    onClose: () => void,
    onOk: (warehouse: any[]) => void,
}


const WarehouseModal: FC<WarehouseModalProps> = ({ open, onClose, onOk }) => {


    const { data, isLoading }: any = useQuery({ queryKey: ['warehouse'], queryFn: () => new WarehouseRepository().get(), staleTime: Infinity });
    // console.log(data)
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 8,
    });


    const [rowSelection, setRowSelection] = React.useState({});

    const columns = React.useMemo(
        () => [
            {
                accessorKey: "WarehouseCode",
                header: "Code",
            },
            {
                accessorKey: "WarehouseName",
                header: "Name",
            },

        ],
        []
    );

    const handlerConfirm = () => {
        const keys = Object.keys(rowSelection);
        // console.log(keys)
        const selectItems = keys.map((key: string) => {
            const wh = data.find((element: any) => (element?.WarehouseCode) === (key));
            if (wh) {
                return {
                    warehouseCode: wh?.WarehouseCode,
                    warehouseName: wh?.WarehouseName,
                    key: `${key}`

                };
            }
            console.log(wh)
            return null;
        }).filter(Boolean);
        console.log(selectItems);
        onOk(selectItems);
    };



    return (
        <Modal
            open={open}
            onClose={onClose}
            widthClass='w-[50%]'
            title='Warehouses'
            disableTitle={true}
            onOk={handlerConfirm}
        >
            <div className="data-table text-inherit" >
                <MaterialReactTable
                    columns={columns}
                    data={data ?? []}
                    enableStickyHeader={true}
                    enableStickyFooter={true}
                    enablePagination={true}
                    enableTopToolbar={true}
                    enableDensityToggle={false}
                    initialState={{ density: "compact" }}
                    enableRowSelection={true}
                    onPaginationChange={setPagination}
                    onRowSelectionChange={setRowSelection}
                    getRowId={(row: any) => row.WarehouseCode}
                    enableSelectAll={true}
                    enableFullScreenToggle={false}
                    enableColumnVirtualization={false}
                    positionToolbarAlertBanner="bottom"
                    muiTablePaginationProps={{
                        rowsPerPageOptions: [5, 8, 15],
                        showFirstButton: false,
                        showLastButton: false,
                    }}
                    muiTableBodyRowProps={({ row }) => ({
                        onClick: row.getToggleSelectedHandler(),
                        sx: { cursor: 'pointer' },
                    })}
                    state={
                        {
                            isLoading,
                            pagination: pagination,
                            rowSelection
                        }
                    }
                    renderTopToolbarCustomActions={({ table }) => {
                        return <h2 className=" text-lg font-bold">Warehouses</h2>
                    }}
                />
            </div>
        </Modal>
    )
}

export default WarehouseModal;


