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

export default function ReturnRequestLists() {
  const [open, setOpen] = React.useState<boolean>(false)
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
                route("/sale/return/" + cell.row.original.DocEntry, {
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
                route("/sale/return/" + cell.row.original.DocEntry, {
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
    []
  )

  const [filter, setFilter] = React.useState("")
  const [sortBy, setSortBy] = React.useState("")
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const Count: any = useQuery({
    queryKey: ["pa-count" + filter !== "" ? "-f" : ""],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/Returns/$count?$select=DocNum${filter}`
      )
        .then(async (res: any) => res?.data)
        .catch((e: Error) => {
          throw new Error(e.message)
        })
      return response
    },
    staleTime: Infinity,
  })

  const { data, isLoading, refetch, isFetching }: any = useQuery({
    queryKey: ["pa", `${pagination.pageIndex * 10}_${filter !== "" ? "f" : ""}`],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/Returns?$top=${pagination.pageSize}&$skip=${
          pagination.pageIndex * pagination.pageSize
        }${filter}${sortBy !== "" ? "&$orderby=" + sortBy : ""}`
      )
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message)
        })
      return response
    },
    staleTime: Infinity,
    retry: 1,
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
    const qurey = value.replace("CardCode", "BPCode").replace("CardName", "BPName")
    setFilter(qurey)
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

  return (
    <>
      <ModalAdaptFilter isOpen={open} handleClose={() => setOpen(false)}></ModalAdaptFilter>
      <div className="w-full h-full px-6 py-2 flex flex-col gap-1 relative">
        <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2">
          <h3 className="text-base 2xl:text-base xl:text-base ">Sale / Returns</h3>
        </div>
        <div className="grid grid-cols-5 gap-3 mb-5 mt-4">
          <MUITextField
            label="Search"
            placeholder="Search"
            className="bg-white"
            autoComplete="off"
          />
          <MUITextField
            label="Document No."
            placeholder="Document No."
            className="bg-white"
            autoComplete="off"
          />
          <BPAutoComplete label="Customer" />
          <MUITextField
            label="Posting Date"
            placeholder="Posting Date"
            className="bg-white"
            type="date"
          />
          <div className="flex justify-end items-center align-center space-x-4 mt-4">
            <Button variant="contained" size="small">
              Go
            </Button>
            <Button variant="outlined" size="small" onClick={handleAdaptFilter}>
              Adapt Filter
            </Button>
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
          title="Returns"
        />
      </div>
    </>
  )
}
