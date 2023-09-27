import request, { url } from "@/utilies/request"
import React from "react"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"
import DataTable from "./components/DataTable"
import VisibilityIcon from "@mui/icons-material/Visibility"
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline"
import MUITextField from "@/components/input/MUITextField"
import BPAutoComplete from "@/components/input/BPAutoComplete"
import { Button } from "@mui/material"
import { ModalAdaptFilter } from "./components/ModalAdaptFilter"
import { useCookies } from "react-cookie"
import MUIDatePicker from "@/components/input/MUIDatePicker"
import DataTableColumnFilter from "@/components/data_table/DataTableColumnFilter"
import BPLBranchSelect from "@/components/selectbox/BranchBPL"

export default function ReturnRequestLists() {
  const [open, setOpen] = React.useState<boolean>(false)
  const [cookies] = useCookies(["user"])
  const [searchValues, setSearchValues] = React.useState({
    docnum: 0,
    cardcode: "",
    cardname: "",
    docdate: null,
    bplid: -2,
  })
  const route = useNavigate()
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "DocNum",
        header: "Doc Num", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "number",
      },
      {
        accessorKey: "CardCode",
        header: "Customer Code",
        enableClickToCopy: true,
        visible: true,
        type: "string",
      },
      {
        accessorKey: "CardName",
        header: "Customer Name",
        visible: true,
        type: "string",
      },
      {
        accessorKey: "DocEntry",
        enableFilterMatchHighlighting: false,
        enableColumnFilterModes: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableColumnOrdering: false,
        enableSorting: false,
        minSize: 100,
        maxSize: 100,
        header: "Action",
        visible: true,
        Cell: (cell: any) => (
          <div className="flex space-x-2">
            <button
              className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
              onClick={() => {
                route("/banking/direct-account/" + cell.row.original.DocEntry, {
                  state: cell.row.original,
                  replace: true,
                })
              }}
            >
              <VisibilityIcon fontSize="small" className="text-gray-600 " /> View
            </button>
            <button
              className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
              onClick={() => {
                let url = "direct-account"

                if (cell.row.original.DocTypte === "rCustomer") {
                  const paymentInvoices =
                    cell.row.original?.PaymentInvoices?.reduce(
                      (prev: number, item: any) => {
                        return prev + parseFloat(item?.AppliedSys || 0)
                      },
                      0,
                    ) || 0

                  const totalPaymentDue =
                    (cell.row.original?.PaymentChecks?.reduce(
                      (prev: number, item: any) => {
                        return prev + parseFloat(item?.CheckSum || 0)
                      },
                      0,
                    ) || 0) /
                      (cell.row.original?.DocRate || 1) +
                    (cell.row.original?.CashSum || 0) +
                    (cell.row.original?.TransferSum || 0)

                  url =
                    parseFloat(totalPaymentDue).toFixed(2) ===
                    parseFloat(paymentInvoices).toFixed(2)
                      ? "settle-receipt"
                      : "payment-account"
                }
                route(`/banking/${url}/${cell.row.original.DocEntry}/edit`, {
                  state: cell.row.original,
                  replace: true,
                })
              }}
            >
              <DriveFileRenameOutlineIcon
                fontSize="small"
                className="text-gray-600 "
              />{" "}
              Edit
            </button>
          </div>
        ),
      },
    ],
    [],
  )

  const [filter, setFilter] = React.useState("$filter=DocType eq 'rAccount'")
  const [sortBy, setSortBy] = React.useState("")
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const Count: any = useQuery({
    queryKey: [`IncomingPayments_SettleReceipt`, `${filter !== "" ? "f" : ""}`],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/IncomingPayments/$count?${filter}`,
      )
        .then(async (res: any) => res?.data)
        .catch((e: Error) => {
          throw new Error(e.message)
        })
      return response
    },
    cacheTime: 0,
    staleTime: 0
  })

  const { data, isLoading, refetch, isFetching }: any = useQuery({
    queryKey: [
      "IncomingPayments_SettleReceipt",
      `${pagination.pageIndex * 10}_${filter !== "" ? "f" : ""}`,
    ],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/IncomingPayments?$top=${pagination.pageSize}&$skip=${
          pagination.pageIndex * pagination.pageSize
        }&${filter}`,
      )
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message)
        })
      return response
    },
    cacheTime: 0,
    staleTime: 0,
  })

  const handlerRefresh = React.useCallback(() => {
    setFilter("")
    setSortBy("")
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    })
    setTimeout(() => {
      Count.refetch()
      refetch()
    }, 500)
  }, [])

  const handlerSortby = (value: any) => {
    setSortBy(value)
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    })

    setTimeout(() => {
      refetch()
    }, 500)
  }

  const handlerSearch = (value: string) => {
    setFilter(value)
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    })

    setTimeout(() => {
      Count.refetch()
      refetch()
    }, 500)
  }

  const handleAdaptFilter = () => {
    setOpen(true)
  }

  const handleGoClick = () => {
    let queryFilters: any = [`DocType eq 'rAccount'`]
    if (searchValues.docnum) queryFilters.push(`DocNum eq ${searchValues.docnum}`)
    if (searchValues.cardcode)
      queryFilters.push(
        `(CardCode eq '${searchValues.cardcode}' or CardName eq '${searchValues.cardcode}')`,
      )
    if (searchValues.docdate)
      queryFilters.push(`DocDate eq '${searchValues.docdate}T00:00:00Z'`)
    if (searchValues.bplid > 0) queryFilters.push(`BPLID eq ${searchValues.bplid}`)

    if (queryFilters.length > 0)
      return handlerSearch(`$filter=${queryFilters.join(" and ")}`)
    return handlerSearch("")
  }

  return (
    <>
      <ModalAdaptFilter
        isOpen={open}
        handleClose={() => setOpen(false)}
      ></ModalAdaptFilter>
      <div className="w-full h-full px-6 py-2 flex flex-col gap-1 relative bg-white">
        <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2">
          <h3 className="text-base 2xl:text-base xl:text-base ">
            Collection / Direct to Account
          </h3>
        </div>
        <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
          <div className="col-span-10">
            <div className="grid grid-cols-12  space-x-4">
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  type="number"
                  label="Document No."
                  placeholder="Document No."
                  className="bg-white"
                  autoComplete="off"
                  value={searchValues.docnum}
                  onChange={(e) =>
                    setSearchValues({ ...searchValues, docnum: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  label="Customer Name / Code"
                  placeholder="Customer Name / Code"
                  className="bg-white"
                  autoComplete="off"
                  value={searchValues.cardcode}
                  onChange={(e) =>
                    setSearchValues({ ...searchValues, cardcode: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 2xl:col-span-3">
                <MUIDatePicker
                  label="Posting Date"
                  value={searchValues?.docdate}
                  onChange={(e) => {
                    setSearchValues({
                      ...searchValues,
                      docdate: e || null,
                    })
                  }}
                />
              </div>
              <div className="col-span-2 2xl:col-span-3">
                <div className="flex flex-col gap-1 text-sm">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Branch
                  </label>
                  <div className="">
                    <BPLBranchSelect
                      BPdata={cookies?.user?.UserBranchAssignment}
                      onChange={(e) => {
                        setSearchValues({
                          ...searchValues,
                          bplid: e.target.value,
                        })
                      }}
                      value={searchValues?.bplid || 0}
                      name="Branch"
                      disabled={data?.edit}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex justify-end items-center align-center space-x-2 mt-4">
              <div className="">
                <Button variant="contained" size="small" onClick={handleGoClick}>
                  Go
                </Button>
              </div>
              <div className="">
                <DataTableColumnFilter
                  handlerClearFilter={handlerRefresh}
                  title={
                    <div className="flex gap-2">
                      <Button
                        variant="outlined"
                        size="small"
                        // onClick={handleGoClick}
                      >
                        Adapt Filter
                      </Button>
                    </div>
                  }
                  items={columns?.filter(
                    (e) =>
                      e?.accessorKey !== "DocEntry" &&
                      e?.accessorKey !== "DocNum" &&
                      e?.accessorKey !== "CardCode" &&
                      e?.accessorKey !== "CardName" &&
                      e?.accessorKey !== "DocDueDate" &&
                      e?.accessorKey !== "DocumentStatus",
                  )}
                  onClick={handlerSearch}
                />
              </div>
            </div>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={data}
          handlerRefresh={handlerRefresh}
          handlerSearch={handlerSearch}
          handlerSortby={handlerSortby}
          count={Count?.data || 0}
          loading={isLoading || isFetching}
          pagination={pagination}
          paginationChange={setPagination}
          title="Settle Receipt"
        />
      </div>
    </>
  )
}
