import request, { url } from "@/utilies/request";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MUITextField from "@/components/input/MUITextField";
import { Button } from "@mui/material";
import { useCookies } from "react-cookie";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import DataTable from "../components/DataTable";
import { formatDate } from "@/helper/helper";
export default function InventoryTransferList() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [cookies] = useCookies(["user"]);
  const [searchValues, setSearchValues] = React.useState({
    docno: "",
    fromwarehouse: "",
    towarehouse: "",
    status: "",
  });

  const transfer = useNavigate();
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "DocEntry",
        header: "No", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        Cell: (cell: any, index: number) => {
          console.log(sortBy);
          return (
            <span>
              {sortBy.includes("asc") || sortBy === ""
                ? cell?.row?.index + 1
                : Count?.data - cell?.row?.index}
            </span>
          );
        },
      },
      {
        accessorKey: "DocNum",
        header: "Document No.", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
      },
      {
        accessorKey: "FromWarehouse",
        header: "From Warehouse", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.FromWarehouse;
        },
      },

      {
        accessorKey: "ToWarehouse",
        header: "To Warehouse", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.ToWarehouse;
        },
      },

      {
        accessorKey: "DocumentStatus",
        header: "Status",
        size: 40,
        visible: true,
        Cell: (cell: any) => {
          return cell.row.original.U_active === "bost_Open"
            ? "Active"
            : "Inactive";
        },
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
                transfer("/stock-control/stock-transfer/" + cell.row.original.DocEntry, {
                  state: cell.row.original,
                  replace: true,
                });
              }}
            >
              <VisibilityIcon fontSize="small" className="text-gray-600 " />
            </button>
            <button
              className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
              onClick={() => {
                transfer(
                  `/banking/stock-transfer/${cell.row.original.DocEntry}/edit`,
                  {
                    state: cell.row.original,
                    replace: true,
                  }
                );
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
  );

  const [filter, setFilter] = React.useState("");
  const [sortBy, setSortBy] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const Count: any = useQuery({
    queryKey: [`StockTransfers`, `${filter !== "" ? "f" : ""}`],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/StockTransfers/$count?${filter ? `$filter=${filter}` : ""}`
      )
        .then(async (res: any) => res?.data)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    cacheTime: 0,
    staleTime: 0,
  });
  const { data, isLoading, refetch, isFetching }: any = useQuery({
    queryKey: [
      "StockTransfers",
      `${pagination.pageIndex * pagination.pageSize}_${
        filter !== "" ? "f" : ""
      }`,
      pagination.pageSize,
    ],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/StockTransfers?$top=${pagination.pageSize}&$skip=${
          pagination.pageIndex * pagination.pageSize
        }&$orderby= DocEntry desc ${filter ? `&$filter=${filter}` : filter}`
      )
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    cacheTime: 0,
    staleTime: 0,
  });

  const handlerRefresh = React.useCallback(() => {
    setFilter("");
    setSortBy("");
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
    setTimeout(() => {
      Count.refetch();
      refetch();
    }, 500);
  }, []);

  const handlerSortby = (value: any) => {
    setSortBy(value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });

    setTimeout(() => {
      refetch();
    }, 500);
  };
  let queryFilters = "";
  const handlerSearch = (value: string) => {
    if (searchValues.docno) {
      queryFilters += queryFilters
        ? ` and (contains(DocNum, '${searchValues.docno}'))`
        : `contains(DocNum, '${searchValues.docno}')`;
    }
    if (searchValues.fromwarehouse) {
      queryFilters += queryFilters
        ? ` and (contains(FromWarehouse, '${searchValues.fromwarehouse}'))`
        : `contains(FromWarehouse, '${searchValues.fromwarehouse}')`;
    }

    if (searchValues.towarehouse) {
        queryFilters += queryFilters
          ? ` and (contains(ToWarehouse, '${searchValues.towarehouse}'))`
          : `contains(ToWarehouse , '${searchValues.towarehouse}')`;
      }

    if (searchValues.status) {
      const formattedDate = formatDate(searchValues.status);
      queryFilters += queryFilters
        ? ` and (DepositDate eq '${formattedDate}')`
        : `DepositDate eq '${formattedDate}'`;
    }

    console.log(queryFilters);

    let query = queryFilters;

    if (value) {
      query = queryFilters + ` and ${value}`;
    }
    console.log(queryFilters);
    setFilter(query);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });

    setTimeout(() => {
      Count.refetch();
      refetch();
    }, 500);
  };

  return (
    <>
      <div className="w-full h-full px-6 py-2 flex flex-col gap-1 relative bg-white">
        <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2">
          <h3 className="text-base 2xl:text-base xl:text-base ">
            Stock Control / Inventory Transfer
          </h3>
        </div>
        <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
          <div className="col-span-10">
            <div className="grid grid-cols-12  space-x-4">
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  label="Document No."
                  placeholder="Document No."
                  className="bg-white"
                  autoComplete="off"
                  value={searchValues.docno}
                  onChange={(e) =>
                    setSearchValues({
                      ...searchValues,
                      docno: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  label="From Warehouse"
                  placeholder="From Warehouse"
                  className="bg-white"
                  autoComplete="off"
                  value={searchValues.fromwarehouse}
                  onChange={(e) =>
                    setSearchValues({
                      ...searchValues,
                      fromwarehouse: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  label="To Warehouse"
                  placeholder="To Warehouse"
                  className="bg-white"
                  autoComplete="off"
                  value={searchValues.towarehouse}
                  onChange={(e) =>
                    setSearchValues({
                      ...searchValues,
                      towarehouse: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  label="Status"
                  placeholder="Deposit Code"
                  className="bg-white"
                  autoComplete="off"
                  value={searchValues.status}
                  onChange={(e) =>
                    setSearchValues({
                      ...searchValues,
                      status: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-span-2 2xl:col-span-3"></div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex justify-end items-center align-center space-x-2 mt-4">
              <div className="">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handlerSearch("")}
                >
                  Go
                </Button>
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
          title="Invantory Transfer"
          createRoute="/stock-control/stock-transfer/create"
        //   filter={filter}
        />
      </div>
    </>
  );
}
