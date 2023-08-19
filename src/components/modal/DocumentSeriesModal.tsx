import React, { FC, memo } from 'react'
import Modal from './Modal';
import MaterialReactTable from 'material-react-table';
import { useQuery } from 'react-query';
import InitializeData from '@/services/actions';
import Project from '@/models/Project';
import BranchRepository from '@/services/actions/branchRepository';
import Dimension from '@/models/Dimension';
import DimensionRepository from '@/services/actions/DimensionRepostsitory';
import { BsTag } from 'react-icons/bs';
import DocumentNumberingRepository from '@/services/actions/DocumentNumberingRepository';
import request from '@/utilies/request';
import shortid from 'shortid';
interface DocumentNumberingModalProps {
  open: boolean,
  onClose: () => void,
  series: any,
  isLoading: boolean
}


const DocumentSeriesModal: FC<DocumentNumberingModalProps> = (props) => {
  const { open, onClose, series, isLoading } = props
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 8,
  });




  const [rowSelection, setRowSelection] = React.useState({});
  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'Name',
        header: 'Name',
      },
      {
        accessorKey: 'InitialNumber',
        header: 'First No.',
      },
      {
        accessorKey: 'NextNumber',
        header: ' Next No.',
      },
      {
        accessorKey: 'LastNumber',
        header: 'Last No.',
      },
      {
        accessorKey: 'Prefix',
        header: 'Prefix',
      },
      {
        accessorKey: 'Suffix',
        header: 'Suffix',
      },
      {
        accessorKey: 'Remarks',
        header: 'Remarks',
      },
      {
        accessorKey: 'GroupCode',
        header: 'Group',
      },
      {
        accessorKey: 'PeriodIndicator',
        header: 'Period Ind.',
      },
      {
        accessorKey: 'PeriodIndicator',
        header: 'Period Ind.',
      },
    ],
    []
  );

  console.log(series?.data)

  return (
    <Modal
      open={open}
      onClose={onClose}
      widthClass='w-[75rem]'
      title='List Of Projects'
      disableTitle={true}
      disableFooter={true}
    >
      <div className="data-table text-inherit" >
        <MaterialReactTable
          columns={columns}
          data={series?.data ?? {}}
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
          muiTableBodyRowProps={() => ({
            sx: { cursor: 'pointer' },
          })}
          state={
            {
              isLoading: isLoading,
              pagination: pagination,
              rowSelection
            }
          }
          renderTopToolbarCustomActions={({ table }) => {
            return <h2 className=" text-lg font-bold">{`Series - ${series?.title || "Document"}`}</h2>
          }}
        />
      </div>
    </Modal>
  )
}

export default DocumentSeriesModal;




