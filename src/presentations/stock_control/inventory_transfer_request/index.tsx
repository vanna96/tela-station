import request, { url } from "@/utilies/request";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MUITextField from "@/components/input/MUITextField";
import { Button } from "@mui/material";
import { useCookies } from "react-cookie";
import MUISelect from "@/components/selectbox/MUISelect";
import DataTableList from "./components/DataTableList";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import moment from "moment";
import { formatDate } from "@/helper/helper";
export default function InventoryTransferRequestList() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [cookies] = useCookies(["user"]);
  const [searchValues, setSearchValues] = React.useState({
    docno: "",
    towarehouse: "",
    fromwarehouse: "",
    status: "",
  });
  const branchAss: any = useQuery({
    queryKey: ["branchAss"],
    queryFn: () => new BranchBPLRepository().get(),
    staleTime: Infinity,
  });
  const transferRequest = useNavigate();
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "AbsEntry",
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
        accessorKey: "U_tl_cash_acc",
        header: "Attention Terminal", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.U_tl_cash_acc;
        },
      },

      {
        accessorKey: "DepositCurrency",
        header: "To Warehouse", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.DepositCurrency;
        },
      },

      {
        accessorKey: "U_active",
        header: "Status",
        size: 40,
        visible: true,
        Cell: (cell: any) => {
          return cell.row.original.U_active === "Y"
            ? "Active"
            : "Inactive";
        },
      },
      {
        accessorKey: "AbsEntry",
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
                transferRequest("/stock-control/inventory-transfer-request/" + cell.row.original.AbsEntry, {
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
                transferRequest(
                  `/stock-control/inventory-transfer-request/${cell.row.original.AbsEntry}/edit`,
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
    queryKey: [`TransferR`, `${filter !== "" ? "f" : ""}`],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/Deposits/$count?${filter ? `$filter=${filter}` : ""}`
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
      "TransferR",
      `${pagination.pageIndex * pagination.pageSize}_${
        filter !== "" ? "f" : ""
      }`,
      pagination.pageSize,
    ],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/Deposits?$top=${pagination.pageSize}&$skip=${
          pagination.pageIndex * pagination.pageSize
        }&$orderby= AbsEntry desc ${filter ? `&$filter=${filter}` : filter}`
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
        ? ` and (contains(DepositNumber, '${searchValues.docno}'))`
        : `contains(DepositNumber, '${searchValues.docno}')`;
    }
    if (searchValues.towarehouse) {
      queryFilters += queryFilters
        ? ` and (contains(DepositAccount, '${searchValues.towarehouse}'))`
        : `contains(DepositAccount, '${searchValues.towarehouse}')`;
    }

    if (searchValues.fromwarehouse) {
      queryFilters += queryFilters
        ? ` and (contains(DepositAccount, '${searchValues.fromwarehouse}'))`
        : `contains(DepositAccount, '${searchValues.fromwarehouse}')`;
    }
    if (searchValues.status) {
      searchValues.status === "All"
        ? (queryFilters += queryFilters ? "" : "")
        : (queryFilters += queryFilters
          ? ` and U_Status eq '${searchValues.status}'`
          : `U_Status eq '${searchValues.status}'`);
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
            Stock Control / Inventory Transfer Request
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
                  label="Attention Warehouse"
                  placeholder="Attention Warehouse"
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
                <div className="flex flex-col gap-1 text-sm">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Status
                  </label>
                  <div className="">
                    <MUISelect
                      items={[
                        { id: "All", name: "All" },
                        { id: "Y", name: "Active" },
                        { id: "N", name: "Inactive" },
                      ]}
                      onChange={(e) =>
                        setSearchValues({
                          ...searchValues,
                          status: e?.target?.value as string,
                        })
                      }
                      value={searchValues.status || "All"} // Set default value to "All"
                      aliasvalue="id"
                      aliaslabel="name"
                      name="U_Status"
                    />
                  </div>
                </div>
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
        <DataTableList
          columns={columns}
          data={data}
          handlerRefresh={handlerRefresh}
          handlerSearch={handlerSearch}
          handlerSortby={handlerSortby}
          count={Count?.data || 0}
          loading={isLoading || isFetching}
          pagination={pagination}
          paginationChange={setPagination}
          title="Invantory Transfer Request"
          createRoute="/stock-control/inventory-transfer-request/create"
          filter={filter}
        />
      </div>
    </>
  );
}
