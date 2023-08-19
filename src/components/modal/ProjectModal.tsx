import React, { FC } from 'react'
import Modal from './Modal';
import MaterialReactTable from 'material-react-table';
import { useQuery } from 'react-query';
import InitializeData from '@/services/actions';
import Project from '@/models/Project';
import ProjectRepository from '@/services/actions/projectRepository';


interface ProjectModalProps {
  open: boolean,
  onClose: () => void,
  onOk: (prject: Project) => void
}


const ProjectModal: FC<ProjectModalProps> = ({ open, onClose, onOk }) => {
  const { data, isLoading }: any = useQuery({
    queryKey: ["projects"],
    queryFn: () => new ProjectRepository().get(),
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
        header: "Project Code",
      },
      {
        accessorKey: "Name",
        header: "Project Name",
      },
    ],
    []
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      widthClass='w-[70%]'
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
          muiTableBodyRowProps={({ row }) => ({
            onClick: () => {
              onOk(new Project(row.original));
              onClose();
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
            return <h2 className=" text-lg font-bold">List Of Projects</h2>
          }}
        />
      </div>
    </Modal>
  )
}

export default ProjectModal;




