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
import DataTable from "./components/DataTable";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import moment from "moment";
import { formatDate } from "@/helper/helper";
import MUIDatePicker from "@/components/input/MUIDatePicker";
export default function DepositList() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [cookies] = useCookies(["user"]);
  const [searchValues, setSearchValues] = React.useState({
    depositno: "",
    depositcode: "",
    depositdate: "",
  });
  const branchAss: any = useQuery({
    queryKey: ["branchAss"],
    queryFn: () => new BranchBPLRepository().get(),
    staleTime: Infinity,
  });
  const deposit = useNavigate();
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
        accessorKey: "DepositNumber",
        header: "Deposit No.", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
      },
      {
        accessorKey: "U_tl_cash_acc",
        header: "Deposit Code", //uses the default width from defaultColumn prop
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
        header: "Currency", //uses the default width from defaultColumn prop
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
        accessorKey: "BPLID",
        header: "Branch", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 100,
        visible: true,
        type: "number",
        Cell: (cell: any) => {
          return (
            branchAss?.data?.find(
              (e: any) => e?.BPLID === cell.row.original.BPLID
            )?.BPLName
          );
        },
      },
      {
        accessorKey: "DepositDate",
        header: "Deposit Date",
        size: 40,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          const formattedDate = moment(cell.row.original.DepositDate).format(
            "YYYY-MM-DD"
          );
          return <span>{formattedDate}</span>;
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
                deposit("/banking/deposit/" + cell.row.original.AbsEntry, {
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
                deposit(
                  `/banking/deposit/${cell.row.original.AbsEntry}/edit`,
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
    queryKey: [`Deposits`, `${filter !== "" ? "f" : ""}`],
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
      "Deposits",
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
    if (searchValues.depositno) {
      queryFilters += queryFilters
        ? ` and (contains(DepositNumber, '${searchValues.depositno}'))`
        : `contains(DepositNumber, '${searchValues.depositno}')`;
    }
    if (searchValues.depositcode) {
      queryFilters += queryFilters
        ? ` and (contains(DepositAccount, '${searchValues.depositcode}'))`
        : `contains(DepositAccount, '${searchValues.depositcode}')`;
    }

    if (searchValues.depositdate) {
      const formattedDate = formatDate(searchValues.depositdate);
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
            Collection / Deposits
          </h3>
        </div>
        <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
          <div className="col-span-10">
            <div className="grid grid-cols-12  space-x-4">
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  label="Deposit No."
                  placeholder="Deposit No."
                  className="bg-white"
                  autoComplete="off"
                  value={searchValues.depositno}
                  onChange={(e) =>
                    setSearchValues({
                      ...searchValues,
                      depositno: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  label="Deposit Code"
                  placeholder="Deposit Code"
                  className="bg-white"
                  autoComplete="off"
                  value={searchValues.depositcode}
                  onChange={(e) =>
                    setSearchValues({
                      ...searchValues,
                      depositcode: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-span-2 2xl:col-span-3 -mt-[2px]">
                <MUIDatePicker
                  label="Delivery Date"
                  value={searchValues?.depositdate}
                  placeholder=""
                  onChange={(e: any) => {
                    setSearchValues({
                      ...searchValues,
                      depositdate: e,
                    });
                  }}
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
          title="Deposit"
          createRoute="/banking/deposit/create"
          filter={filter}
        />
      </div>
    </>
  );
}
