import React, { FC } from 'react'
import Modal from './Modal';
import MaterialReactTable from 'material-react-table';
import { useQuery } from 'react-query';
import InitializeData from '@/services/actions';
import Project from '@/models/Project';
import BranchRepository from '@/services/actions/branchRepository';


interface BranhModalProps {
  open: boolean,
  onClose: () => void,
}


const BranchModal: FC<BranhModalProps> = ({ open, onClose }) => {
  const { data, isLoading }: any = useQuery({
    queryKey: ["branch"],
    queryFn: () => new BranchRepository().get(),
    staleTime: Infinity,
  });

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 8,
  });

  const handlerConfirm = () => {
  }

  const [rowSelection, setRowSelection] = React.useState({});
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "Code",
        header: "Branch Code",
      },
      {
        accessorKey: "Name",
        header: "Branch Name",
      },
      {
        accessorKey: "Description",
        header: "Description",
      },
    ],
    []
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      widthClass='w-min-[35rem]'
      title='List Of Projects'
      disableTitle={true}
      disableFooter={true}
    >
      <div className="data-table text-inherit" >
        <MaterialReactTable
          columns={columns}
          data={data ?? []}
          enableStickyHeader={true}
          enableStickyFooter={true}
          enablePagination={false}
          enableTopToolbar={true}
          enableDensityToggle={false}
          initialState={{ density: "compact" }}
          enableRowSelection={false}
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
          muiTableBodyRowProps={() => ({
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
            return <h3 className="mt-2 text-lg font-medium">List of Branches</h3>

          }}
        />
      </div>
    </Modal>
  )
}

export default BranchModal;




