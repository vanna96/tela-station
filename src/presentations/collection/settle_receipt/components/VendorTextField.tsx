import React, { FC, Fragment, useState, useMemo, useCallback } from "react"
import { useQuery } from "react-query"
import BusinessPartnerRepository from "@/services/actions/bussinessPartnerRepository"
import { ThemeContext } from "@/contexts"
import { IconButton, OutlinedInput } from "@mui/material"
import { HiSearch, HiX } from "react-icons/hi"
import { Transition, Dialog } from "@headlessui/react"
import shortid from "shortid"
import BusinessPartner from "@/models/BusinessParter"
import MUITextField, { MUITextFieldProps } from "@/components/input/MUITextField"
import MaterialReactTable from "material-react-table"
import request from "@/utilies/request"

export type VendorModalType = "supplier" | "customer" | null

interface VendorModalProps {
  open: boolean
  onClose: () => void
  onOk: (vendor: BusinessPartner) => void
  type: VendorModalType
}

const VendorModal: FC<VendorModalProps> = ({ open, onClose, onOk, type }) => {
  const { theme } = React.useContext(ThemeContext)
  const [globalFilter, setGlobalFilter] = useState("")
  const [filterKey, setFilterKey] = useState("key-id")
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: count }: any = useQuery({
    queryKey: ["venders_Total" + type],
    queryFn: async () => {
      const response: any = await request("GET", `/BusinessPartners/$count`)
        .then(async (res: any) => res?.data)
        .catch((e: Error) => {
          throw new Error(e.message)
        })
      return response
    },
  })

  const { data, isLoading, isFetching }: any = useQuery({
    queryKey: [
      "venders_" + type,
      pagination.pageIndex,
      pagination.pageSize,
      globalFilter,
    ],
    queryFn: async () => {
      let condition = ""
      if (globalFilter) {
        condition = `and (contains(CardName , '${globalFilter}') or contains(CardCode, '${globalFilter}'))`
      }

      return new BusinessPartnerRepository().get(
        `&$top=${pagination.pageSize}&$skip=${
          pagination.pageIndex * pagination.pageSize
        }&$filter=CardType eq 'c${type?.charAt(0).toUpperCase()}${type?.slice(
          1
        )}' ${condition}`
      )
    },
    keepPreviousData: true,
  })

  const columns = useMemo(
    () => [
      {
        accessorKey: "CardCode",
        header: "Card Code",
        size: 50,
      },
      {
        accessorKey: "CardName",
        header: "Card Name",
        size: 60,
      },
      {
        accessorKey: "Currency",
        header: "Currency",
        size: 50,
      },
      {
        accessorKey: "CurrentAccountBalance",
        header: "Balance",
        size: 100,
        Cell: ({ cell }: any) => (
          <div
            className={
              parseFloat(cell.getValue()) > 0 ? "text-blue-500" : "text-red-500"
            }
          >
            {cell.getValue()}
          </div>
        ),
      },
    ],
    []
  )

  const items = useMemo(
    () => data?.filter((e: any) => e?.CardType?.slice(1)?.toLowerCase() === type),
    [data, type]
  )

  const handlerSearch = (event: any) => setGlobalFilter(event.target.value)

  const clearFilter = useCallback(() => {
    if (globalFilter === "") return
    setGlobalFilter("")
    setFilterKey(shortid.generate())
  }, [globalFilter])

  return (
    <Transition appear show={open || false} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
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
                className={`flex flex-col w-[60vw] min-h-[70vh] px-[2.5rem] border shadow-lg relative transform overflow-hidden rounded-lg ${
                  theme === "light" ? "bg-white" : "bg-white"
                } py-1 px-5 text-left align-middle  transition-all`}
              >
                <div className={`grow text-inherit `}>
                  <div className={`data-grid `}>
                    <div className="w-full flex justify-between items-center px-4 pb-2 pt-6">
                      <h2 className="font-medium text-lg">Business Partners</h2>
                      <OutlinedInput
                        size="small"
                        key={filterKey}
                        onChange={handlerSearch}
                        className="text-sm"
                        sx={{
                          fontSize: "14px",
                        }}
                        placeholder="Search..."
                        endAdornment={
                          <IconButton size="small" onClick={clearFilter}>
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

                    <MaterialReactTable
                      columns={columns}
                      data={items ?? []}
                      enableStickyHeader={true}
                      enableStickyFooter={true}
                      enablePagination={true}
                      enableDensityToggle={false}
                      initialState={{ density: "compact" }}
                      onGlobalFilterChange={setGlobalFilter}
                      onPaginationChange={setPagination}
                      enableColumnActions={false}
                      getRowId={(row: any) => row.ItemCode}
                      enableSelectAll={false}
                      enableFullScreenToggle={false}
                      enableColumnVirtualization={false}
                      enableMultiRowSelection={false}
                      positionToolbarAlertBanner="none"
                      manualPagination
                      muiTablePaginationProps={{
                        rowsPerPageOptions: [5, 10, 15],
                        showFirstButton: false,
                        showLastButton: false,
                      }}
                      muiTableBodyRowProps={({ row }) => ({
                        onClick: () => {
                          onOk(new BusinessPartner(row.original, 0))
                        },
                        sx: { cursor: "pointer" },
                      })}
                      state={{
                        globalFilter,
                        isLoading,
                        pagination,
                        rowSelection,
                        showProgressBars: isFetching,
                        showSkeletons: isFetching,
                      }}
                      rowCount={count || 0}
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

interface VendorTextFieldProps extends MUITextFieldProps {
  vtype: VendorModalType
}

export const VendorTextField: FC<VendorTextFieldProps> = (
  props: VendorTextFieldProps
) => {
  const [open, setOpen] = useState<boolean>(false)

  const handlerConfirm = (vendor: any) => {
    if (!props.onChange) return
    props.onChange(vendor)
  }

  const onClose = () => setOpen(false)

  return (
    <>
      <VendorModal
        type={props.vtype}
        open={open}
        onClose={onClose}
        onOk={handlerConfirm}
      />
      <MUITextField {...props} endAdornment onClick={() => setOpen(true)} />
    </>
  )
}
