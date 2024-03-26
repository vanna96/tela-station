import React from "react";
import { Button } from "@mui/material";
import { HiRefresh } from "react-icons/hi";
import MaterialReactTable from "material-react-table";
import shortid from "shortid";

interface DataTableSProps {
  columns: any[];
  data: any[];
  count: number;
  handlerRefresh: () => void;
  loading: boolean;
  pagination: any;
  paginationChange: (value: any) => void;
  title?: string;
  setRowSelection: any;
  rowSelection: any;
}

export default function DataTable(props: DataTableSProps) {

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
            rowsPerPageOptions: [5, 8, 10, 15],
          }}
          enableFilters={false}
          enableGlobalFilter={false}
          rowCount={props.count ?? 0}
          getRowId={(row: any) => `_${row?.U_Type}_${row?.U_SourceDocEntry}`}
          onPaginationChange={props.paginationChange}
          state={{
            isLoading: props.loading,
            pagination: props.pagination,
            rowSelection: props?.rowSelection,
          }}
          enableColumnVirtualization={false}
        />
      </div>
    </div>
  );
}
