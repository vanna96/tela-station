import React, { FC } from 'react'
import Modal from './Modal';
import MaterialReactTable from 'material-react-table';
import { useQuery } from 'react-query';
import VatGroupRepository from '@/services/actions/VatGroupRepository';
import VatGroup from '@/models/VatGroup';

export type VatCategory = 'InputTax' | 'OutputTax';

interface VatGroupProps {
  open: boolean,
  onClose: () => void,
  type: VatCategory,
  onOk: (account: VatGroup) => void,
}


const VatGroupModal: FC<VatGroupProps> = ({ open, onClose, onOk, type }) => {
  const { data, isLoading }: any = useQuery({
    queryKey: ["vat-groups"],
    queryFn: () => new VatGroupRepository().get(),
    staleTime: Infinity,
  });

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 8,
  });

  const [rowSelection, setRowSelection] = React.useState({});
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "code",
        header: "Code",
      },
      {
        accessorKey: "name",
        header: "Name",
      },
    ],
    []
  );



  const items = React.useMemo(() => data?.filter((e: any) => e?.category === type), [data, type]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      widthClass='w-[70%]'
      title='List Of Accounts'
      disableTitle={true}
      disableFooter={true}
    >
      <div className="data-table text-inherit" >
        <MaterialReactTable
          columns={columns}
          data={items ?? []}
          enableStickyHeader={true}
          enableStickyFooter={true}
          enablePagination={true}
          enableTopToolbar={true}
          enableDensityToggle={false}
          initialState={{ density: "compact" }}
          // enableRowSelection={true}
          onPaginationChange={setPagination}
          onRowSelectionChange={setRowSelection}
          getRowId={(row: any) => row.ItemCode}
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
            onClick: () => {
              onOk(row.original);
              onClose()
            },
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
            return <h2 className=" text-lg font-bold">List Of Taxes</h2>
          }}
        />
      </div>
    </Modal>
  )
}

export default VatGroupModal;



