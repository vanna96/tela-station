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
import { useCallback } from 'react';
import DocumentSeriesModal from './DocumentSeriesModal';
import { log } from 'console';
import { AiOutlineExpandAlt } from "react-icons/ai"
interface DocumentNumberingModalProps {
  open: boolean,
  onClose: () => void,
}


const DocumentNumberingModal: FC<DocumentNumberingModalProps> = ({ open, onClose }) => {
  const { data, isLoading }: any = useQuery({
    queryKey: ["documentNumbering"],
    queryFn: () => new DocumentNumberingRepository().get(),
    staleTime: Infinity,
  });

  const [pagination, setPagination] = React.useState<any>({
    pageIndex: 0,
    pageSize: 8,
  });
  const [openSeries, setOpenSeries] = React.useState<boolean>(false);
  const [series, setSeries] = React.useState<any>({});
  const closeSeries = React.useCallback(() => setOpenSeries(false), []);

  const handlerConfirm = () => {
  }

  const [rowSelection, setRowSelection] = React.useState({});
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "None",
        header: "Detail",
        Cell: (record: any) => (
          <span className=' p-0 text-[22px] text-neutral-500 rounded-sm' onClick={() => fetchSeries(record)}>
            <AiOutlineExpandAlt />
          </span>
        ),
      },
      {
        accessorKey: "ObjectName",
        header: "Document",

      },
      {
        accessorKey: "DfltSeries",
        header: "default Series",
      },
      {
        accessorKey: "UpdCounter",
        header: "Fist No",
      },
      {
        accessorKey: "as",
        header: "Next No",

      },
      {
        accessorKey: "AutoKey",
        header: "Last No",

      },
      {
        accessorKey: "as",
        header: "Change Menu Name",
      },
    ],
    []
  );


  const fetchSeries = async (record: any) => {
    setOpenSeries(true)
    // console.log(record)
    setSeries({ title: record?.row?.original?.ObjectName, isLoading: true, data: [] });
    const payload: any = {
      DocumentTypeParams: {
        Document: record?.row?.original.ObjectCode,
        DocumentSubType: record?.row?.original.DocSubType
      }
    };
    const { data }: any = await request('POST', '/SeriesService_GetDocumentSeries', payload);

    let reponseData = [];
    if (data) {
      reponseData = data?.value?.map((e: any) => { return { key: shortid.generate(), ...e } })
    }

    setSeries({ title: record?.row?.original?.ObjectName, data: reponseData, isLoading: false });
  }



  return (
    <Modal
      open={open}
      onClose={onClose}
      widthClass='w-[75rem]'
      title='List Of Projects'
      disableTitle={true}
      disableFooter={true}
    >
      <>
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
              sx: { cursor: 'pointer' },
              onClick: row.getToggleSelectedHandler(),
            })}
            state={
              {
                isLoading,
                pagination: pagination,
                rowSelection,
              }
            }
            renderTopToolbarCustomActions={({ table }) => {
              return <h2 className=" text-lg font-bold">List Of Document Numbering</h2>
            }}
          />
        </div>
        <DocumentSeriesModal isLoading={series?.isLoading} series={series} open={openSeries} onClose={closeSeries} />
      </>
    </Modal>
  )
}

export default DocumentNumberingModal;




