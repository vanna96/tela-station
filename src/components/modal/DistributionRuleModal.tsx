import React, { FC } from 'react'
import Modal from './Modal';
import MaterialReactTable from 'material-react-table';
import { useQuery } from 'react-query';
import InitializeData from '@/services/actions';
import { useMemo } from 'react';
import DistributionRule from '@/models/DistributionRule';
import DistributionRuleRepository from '../../services/actions/distributionRulesRepository';


interface DistributionRuleModalProps {
  open: boolean,
  onClose: () => void,
  inWhichNum?: number,
  onOk: (record: any) => void
}


const DistributionRuleModal: FC<DistributionRuleModalProps> = ({ open, onClose, inWhichNum, onOk }) => {
  const { data, isLoading }: any = useQuery({
    queryKey: ["distribution-rules"],
    queryFn: () => new DistributionRuleRepository().get(),
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
        accessorKey: "FactorCode",
        header: "Distribution Rule",
      },
      {
        accessorKey: "FactorDescription",
        header: "Loading Factor Name",
      },
    ],
    []
  );

  const items = useMemo(() => data?.filter((e: any) => e.InWhichDimension === inWhichNum), [data, inWhichNum])

  return (
    <Modal
      open={open}
      onClose={onClose}
      widthClass='w-[40rem]'
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
              onOk(new DistributionRule(row.original));
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
            return <h2 className=" text-lg font-bold">List Of Distribution Rule</h2>
          }}
        />
      </div>
    </Modal>
  )
}

export default DistributionRuleModal;