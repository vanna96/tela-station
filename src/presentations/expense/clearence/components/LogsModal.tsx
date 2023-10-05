import React, { Fragment } from "react"
import MaterialReactTable from "material-react-table"
import { Dialog, Transition } from "@headlessui/react"
import { Button, IconButton, OutlinedInput } from "@mui/material"
import { numberWithCommas } from "@/helper/helper"
import { HiSearch, HiX } from "react-icons/hi"

const DataTable = (props: any) => {
  const { items, globalFilter, handlerOk, onClose }: any = props
  const [rowSelection, setRowSelection]: any = React.useState({})

  const columns: any = [
    {
      accessorKey: "CreateDate",
      header: "Date",
      Cell: ({ cell }: any) => cell.getValue().replace("T00:00:00Z", ""),
    },
    {
      accessorKey: "DocNum",
      header: "Document Number",
    },
    {
      accessorKey: "U_tl_cashacct",
      header: "Cash Account",
    },
    {
      accessorKey: "Object",
      header: "Document Type",
      Cell: ({ cell }: any) => "Expense Log",
    },
    {
      accessorKey: "U_tl_doctotal",
      header: "Total",
      Cell: ({ cell }: any) => numberWithCommas(cell.getValue(0).toFixed(2)),
    },
  ]

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={items || []}
        enableStickyHeader={true}
        enableStickyFooter={true}
        enablePagination={true}
        enableDensityToggle={false}
        initialState={{ density: "compact" }}
        enableColumnActions={false}
        getRowId={(row: any) => row.ItemCode}
        enableSelectAll={false}
        enableFullScreenToggle={false}
        enableColumnVirtualization={false}
        enableMultiRowSelection={true}
        enableRowSelection={true}
        onRowSelectionChange={setRowSelection}
        enableFilters={true}
        positionToolbarAlertBanner="none"
        positionPagination="bottom"
        muiTablePaginationProps={{
          rowsPerPageOptions: [5, 10, 15],
          showFirstButton: true,
          showLastButton: true,
        }}
        muiTableBodyRowProps={({ row }) => ({
          onClick: row.getToggleSelectedHandler(),
          sx: { cursor: "pointer" },
        })}
        state={{
          globalFilter,
          rowSelection,
        }}
      />
      <div className="w-full flex justify-end items-center border-t pt-3 gap-3">
        <Button size="small" disableElevation variant="text" onClick={onClose}>
          <span className="capitalize px-6  text-blue-700 text-xs">Close</span>
        </Button>
        <Button
          size="small"
          disableElevation
          variant="contained"
          onClick={() => {
            const rows: any = Object.keys(rowSelection)
            if (rows?.length > 0) handlerOk(rows)
          }}
        >
          <span className="capitalize px-6 text-white text-xs">Ok</span>
        </Button>
      </div>
    </>
  )
}

export class LogsModal extends React.Component<any> {
  constructor(props: any) {
    super(props)

    this.state = {
      isOpen: false,
      items: [],
      globalFilter: "",
    } as any

    this.onClose = this.onClose.bind(this)
    this.onOpen = this.onOpen.bind(this)
    this.handlerOk = this.handlerOk.bind(this)
  }

  onClose() {
    this.setState({ isOpen: false })
  }

  onOpen(items: any, refLogs?: any) {
    this.setState({ isOpen: true, items, refLogs })
  }

  handlerOk(rows: any) {
    let refLogs: any = this.state.refLogs || []
    let list: any = [...refLogs]
    let result: any = []

    this.state.items
      ?.filter(
        (e: any, index: string) =>
          rows.includes(index.toString()) &&
          e.TL_EXPEN_LOG_LINESCollection.length > 0,
      )
      ?.map((e: any) => e.TL_EXPEN_LOG_LINESCollection.map((i: any) => list.push(i)))

    list?.reduce(function (res: any, value: any) {
      if (!res[value.U_tl_expcode]) {
        res[value.U_tl_expcode] = {
          ...value,
          U_tl_expcode: value.U_tl_expcode,
          U_tl_linetotal: 0,
        }
        result.push(res[value.U_tl_expcode])
      }
      res[value.U_tl_expcode].U_tl_linetotal += value.U_tl_linetotal
      return res
    }, {})

    this.props?.handlerChange({
      Logs: list,
      Items: result,
      LogsEntry: this.state.items?.map(({ DocEntry }: any) => {
        return {
          DocEntry,
        }
      }),
    })
    this.setState({ isOpen: false })
  }

  render() {
    const { globalFilter }: any = this.state
    return (
      <Transition appear show={this.state?.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={this.onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto w-full ">
            <div className="flex min-h-full items-center justify-center  text-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`flex flex-col bg-white w-[70vw] min-h-[90vh] px-[2.5rem] border shadow-lg relative transform overflow-hidden rounded-lg  py-1 text-left align-middle  transition-all`}
                >
                  <div className={`grow text-inherit`}>
                    <div className={`data-grid`}>
                      <div className="w-full flex justify-between items-center p-0 pt-6">
                        <h2 className="font-bold text-xl capitalize">
                          Expense Logs
                        </h2>
                        <OutlinedInput
                          size="small"
                          value={globalFilter}
                          onChange={(event: any) =>
                            this.setState({
                              ...this.state,
                              globalFilter: event.target.value,
                            })
                          }
                          className="text-sm"
                          sx={{ fontSize: "14px" }}
                          placeholder="Search..."
                          endAdornment={
                            <IconButton
                              size="small"
                              onClick={() => {
                                this.setState({
                                  ...this.state,
                                  globalFilter: "",
                                })
                              }}
                            >
                              {globalFilter !== "" ? (
                                <HiX className="text-xl" />
                              ) : (
                                <HiSearch className="text-xl" />
                              )}
                            </IconButton>
                          }
                        />
                      </div>
                      <hr />
                      <DataTable
                        items={this.state?.items || []}
                        globalFilter={globalFilter}
                        handlerOk={(e: any) => this.handlerOk(e)}
                        onClose={this.onClose}
                      />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    )
  }
}
