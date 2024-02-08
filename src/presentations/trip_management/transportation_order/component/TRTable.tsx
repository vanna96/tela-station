import React, { useState } from "react";
import { Button } from "@mui/material";
import { HiRefresh } from "react-icons/hi";
import { BiFilterAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { AiOutlineSetting } from "react-icons/ai";
import MaterialReactTable, {
  MRT_RowSelectionState,
} from "material-react-table";
import { BsPencilSquare, BsSortDown } from "react-icons/bs";
import MenuCompoment from "@/components/data_table/MenuComponent";
import { ThemeContext } from "@/contexts";
import DataTableColumnFilter from "@/components/data_table/DataTableColumnFilter";
import ColumnSearch from "@/components/data_table/ColumnSearch";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import Papa from "papaparse";
import request, { url } from "@/utilies/request";
import DepartmentRepository from "@/services/actions/departmentRepository";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { useQuery } from "react-query";
import shortid from "shortid";
interface DataTableProps {
  filter: any;
  columns: any[];
  data: any[];
  count: number;
  handlerRefresh: () => void;
  loading: boolean;
  handlerSortby: (value: string) => void;
  handlerSearch: (value: string) => void;
  pagination: any;
  paginationChange: (value: any) => void;
  title?: string;
  createRoute?: string;
  setRowSelection: any;
  rowSelection: any;
}

export default function TRTable(props: DataTableProps) {
  const route: any = useNavigate();
  const search = React.createRef<ColumnSearch>();
  const [colVisibility, setColVisibility] = React.useState<
    Record<string, boolean>
  >({});

  React.useEffect(() => {
    const cols: any = {};
    props.columns.forEach((e) => {
      cols[e.accessorKey] = e?.visible ?? true;
    });
    setColVisibility(cols);
  }, []);

  const handlerSearch = (queries: any) => {
    if (queries === "") return;
    props.handlerSearch("&$filter=" + queries);
  };
  const branchAss: any = useQuery({
    queryKey: ["branchAss"],
    queryFn: () => new BranchBPLRepository().get(),
    staleTime: Infinity,
  });

  return (
    <div
      className={` rounded-lg shadow-sm  p-4 flex flex-col gap-3 bg-white border`}
    >
      <div className="flex justify-between">
        <div className="flex gap-4 items-center w-full justify-between">
          <h3 className="text-base">{props.title}</h3>
          <Button size="small" variant="text" onClick={props.handlerRefresh}>
            <span className="text-lg mr-2">
              <HiRefresh />
            </span>
            <span className="capitalize text-sm">Refresh</span>
          </Button>
        </div>
      </div>
      <div className="grow data-grid border-t bg-inherit ">
        <MaterialReactTable
          columns={props.columns}
          data={props.data ?? []}
          enableHiding={false}
          initialState={{
            density: "compact",
            columnVisibility: colVisibility,
          }}
          enableDensityToggle={true}
          // enableColumnResizing
          enableRowSelection={true}
          enableMultiRowSelection={true}
          onRowSelectionChange={props?.setRowSelection}
          enableFullScreenToggle={false}
          enableStickyHeader={false}
          enableStickyFooter={false}
          enablePagination={true}
          enableColumnFilters={false}
          manualPagination={true}
          enableColumnActions={false}
          enableSorting={false}
          muiTablePaginationProps={{
            rowsPerPageOptions: [5, 10, 15],
          }}
          enableFilters={false}
          enableGlobalFilter={false}
          rowCount={props.count ?? 0}
          getRowId={(row: any) => {
            // return `${shortid.generate()}_${row?.DocNum}_${row?.Type}`;
            return `${shortid.generate()+'_'+row?.DocNum}`;
          }}
          onPaginationChange={props.paginationChange}
          state={{
            isLoading: props.loading,
            pagination: props.pagination,
            columnVisibility: colVisibility,
            rowSelection: props?.rowSelection,
          }}
          enableColumnVirtualization={false}
          onColumnVisibilityChange={setColVisibility}
        />

        <ColumnSearch ref={search} onOk={handlerSearch} />
      </div>
    </div>
  );
}
