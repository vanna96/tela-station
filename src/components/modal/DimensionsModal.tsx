import React, { FC } from 'react'
import Modal from './Modal';
import MaterialReactTable from 'material-react-table';
import { useQuery } from 'react-query';
import InitializeData from '@/services/actions';
import Project from '@/models/Project';
import BranchRepository from '@/services/actions/branchRepository';
import Dimension from '@/models/Dimension';
import DimensionRepository from '@/services/actions/DimensionRepostsitory';
import { BsTag } from 'react-icons/bs';
import { log } from 'console';

interface DimensionModalProps {
  open: boolean,
  onClose: () => void,
}


const dimensionModal: FC<DimensionModalProps> = ({ open, onClose }) => {
  const { data, isLoading }: any = useQuery({
    queryKey: ["dimension"],
    queryFn: () => new DimensionRepository().get(),
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
        accessorKey: "DimensionCode",
        header: "Branch Code",
      },
      {
        accessorKey: "DimensionName",
        header: "Branch Name",
      },
      {
        accessorKey: "IsActive",
        header: "Active",
      },
      {
        accessorKey: "DimensionDescription",
        header: "Discription",
      },
    ],
    []
  );
  return (
    <Modal
      open={open}
      onClose={onClose}
      widthClass='w-[60rem]'
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
          enablePagination={true}
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
            return <h2 className=" text-lg font-bold">List Of Dimension</h2>
          }}
        />
      </div>
    </Modal>
  )
}

export default dimensionModal;




