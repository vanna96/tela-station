import request, { url } from "@/utilies/request"
import { Button } from "@mui/material"
import React from "react"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"
import DataTable from "./components/DataTable"
import VisibilityIcon from "@mui/icons-material/Visibility"
import EditIcon from "@mui/icons-material/Edit"

export default function ReturnRequestLists() {
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
      // {
      //     accessorKey: "StartDate",
      //     header: "Start Date",
      //     type: 'date',
      //     visible: true,
      //     enableClickToCopy: true,
      //     Cell: ({ cell }: any) => {
      //         return (
      //             <>
      //                 {dateFormat(cell.getValue())}
      //             </>
      //         );
      //     },
      // },
      // {
      //     accessorKey: "EndDate",
      //     header: "End Date",
      //     type: 'date',
      //     visible: true,
      //     Cell: ({ cell }: any) => (
      //         <>
      //             {dateFormat(cell.getValue())}
      //         </>
      //     ),

      // },

      // {
      //     accessorKey: "SigningDate",
      //     header: "Signing Date",
      //     type: 'date',
      //     visible: false,
      //     Cell: ({ cell }: any) => (
      //         <>
      //             {dateFormat(cell.getValue())}
      //         </>
      //     ),

      // },

      // {
      //     accessorKey: "TerminationDate",
      //     header: "Termination Date",
      //     type: 'date',
      //     visible: false,
      //     Cell: ({ cell }: any) => (
      //         <>
      //             {dateFormat(cell.getValue())}
      //         </>
      //     ),
      // },
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
        Cell: (cell: any) => (
          <div className="flex gap-4">
            <button
              onClick={() => {
                route("/sale/return-request/" + cell.row.original.DocEntry, {
                  state: cell.row.original,
                  replace: true,
                })
              }}
            >
              <VisibilityIcon fontSize="small" className="text-gray-600 " />
            </button>
            <button
              title="back"
              onClick={() =>
                route(
                  "/sale/return-request/" + cell.row.original.DocEntry + "/edit",
                  { state: cell.row.original, replace: true }
                )
              }
            >
              <EditIcon fontSize="small" className="text-blue-400" />
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

  const returnRequestCount: any = useQuery({
    queryKey: ["pa-count" + filter !== "" ? "-f" : ""],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/ReturnRequest/$count?$select=DocNum${filter}`
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
        `${url}/ReturnRequest?$top=${pagination.pageSize}&$skip=${
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
      returnRequestCount.refetch()
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
      returnRequestCount.refetch()
      refetch()
    }, 500)
  }

  return (
    <>
      <div className="w-full h-full px-6 py-2 flex flex-col gap-1 relative ">
        <div className="flex px-2  rounded-lg justify-between items-center sticky z-10 top-0 w-full  py-2">
          <h3 className="text-base 2xl:text-base xl:text-base ">
            Sale / Return Request
          </h3>
          <Button
            variant="contained"
            disableElevation
            size="small"
            onClick={() => route("/sale/return-request/create")}
          >
            <span className="text-sm capitalize text-white px-3">Create</span>
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={data}
          handlerRefresh={handlerRefresh}
          handlerSearch={handlerSearch}
          handlerSortby={handlerSortby}
          count={returnRequestCount?.data || 0}
          loading={isLoading || isFetching}
          pagination={pagination}
          paginationChange={setPagination}
          title="Return Request"
        />
      </div>
    </>
  )
}
