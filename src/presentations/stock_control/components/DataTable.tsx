import React, { useMemo } from "react"
import { Button } from "@mui/material"
import { HiRefresh } from "react-icons/hi"
import { useNavigate } from "react-router-dom"
import MaterialReactTable from "material-react-table"
import { BsPencilSquare, BsSortDown } from "react-icons/bs"
import MenuCompoment from "@/components/data_table/MenuComponent"
import ColumnSearch from "@/components/data_table/ColumnSearch"

interface DataTableProps {
  columns: any[]
  data: any[]
  count: number
  handlerRefresh: () => void
  loading: boolean
  handlerSortby: (value: string) => void
  handlerSearch: (value: string) => void
  pagination: any
  paginationChange: (value: any) => void
  title?: string
  createRoute?: string,
  children?: React.ReactNode,
}

export default function DataTable(props: DataTableProps) {
  const route = useNavigate()
  const search = React.createRef<ColumnSearch>()
  const [colVisibility, setColVisibility] = React.useState<Record<string, boolean>>(
    {}
  )

  React.useEffect(() => {
    const cols: any = {}
    props.columns.forEach((e) => {
      cols[e.accessorKey] = e?.visible ?? true
    })
    setColVisibility(cols)
  }, [])

  return (
    <div
      className={` rounded-lg shadow-sm  p-4 flex flex-col gap-3 bg-white border`}
    >
      <div className="flex justify-between">
        <div className="flex gap-4 items-center justify-center">
          <h3 className="text-base">{props.title}</h3>

        </div>
        <div className="flex justify-end gap-2 items-center text-[13px]">
          <Button
            size="small"
            variant="text"
            onClick={() => route(props?.createRoute ?? '')}
          >
            <span className="text-lg mr-2">
              <BsPencilSquare />
            </span>
            <span className="capitalize text-sm">Create</span>
          </Button>
          <Button size="small" variant="text" onClick={props.handlerRefresh}>
            <span className="text-lg mr-2">
              <HiRefresh />
            </span>
            <span className="capitalize text-sm">Refresh</span>
          </Button>
          <MenuCompoment
            title={
              <div className="flex gap-2">
                <span className="text-lg">
                  <BsSortDown />
                </span>{" "}
                <span className="text-[13px] capitalize">Sort By</span>
              </div>
            }
            items={props.columns}
            onClick={props.handlerSortby}
          />
          {props.children}
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
          getRowId={(row: any) => row.DocEntry}
          onPaginationChange={props.paginationChange}
          state={{
            isLoading: props.loading,
            pagination: props.pagination,
            columnVisibility: colVisibility,
          }}
          enableColumnVirtualization={false}
          onColumnVisibilityChange={setColVisibility}
        />


      </div>
    </div>
  )
}
