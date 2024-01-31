import request, { url } from "@/utilies/request";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import DataTable from "./components/DataTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MUITextField from "@/components/input/MUITextField";
import { Button } from "@mui/material";
import { ModalAdaptFilter } from "./components/ModalAdaptFilter";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BPLBranchSelect from "@/components/selectbox/BranchBPL";
import DataTableColumnFilter from "@/components/data_table/DataTableColumnFilter";
import { useCookies } from "react-cookie";
import { APIContext } from "../context/APIContext";
import GLAccountRepository from "@/services/actions/GLAccountRepository";
import CashACAutoComplete from "@/components/input/CashAccountAutoComplete";
import MUISelect from "@/components/selectbox/MUISelect";

export default function Lists() {
  const [open, setOpen] = React.useState<boolean>(false);
  const { branchBPL }: any = React.useContext(APIContext);
  const [cookies] = useCookies(["user"]);
  const [searchValues, setSearchValues] = React.useState({
    search: "",
    docnum: 0,
    code: "",
    name: "",
    docdate: null,
    account: -1,
    status
  });
  const route = useNavigate();
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "Code",
        header: "Expense Code", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        // type: "number",
      },
      {
        accessorKey: "Name",
        header: "Description", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
      },
      {
        accessorKey: "U_tl_expacct",
        header: "G/L Account", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
          Cell: ({ cell }:any) => {
          return ` ${cell.getValue() ?? "N/A"} - ${gl6?.find((e:any) => cell.getValue() === e.Code)?.Name ?? "N/A"}`;
        },
      },
      // {
      //   accessorKey: "AccoutName",
      //   header: "Account Name", //uses the default width from defaultColumn prop
      //   enableClickToCopy: true,
      //   enableFilterMatchHighlighting: true,
      //   size: 100,
      //   visible: true,
      //   Cell: (cell: any) => {
      //     return new GLAccountRepository().find(cell.row.original.U_tl_expacct)
      //       ?.Name;
      //   },
      // },
      // {
      //   accessorKey: "CreateDate",
      //   header: "Document Date", //uses the default width from defaultColumn prop
      //   enableClickToCopy: true,
      //   enableFilterMatchHighlighting: true,
      //   size: 88,
      //   visible: true,
      //   Cell: (cell: any) => {
      //     if (!cell.row.original?.CreateDate) return;
      //     return cell.row.original?.CreateDate.toString().replace(
      //       "T00:00:00Z",
      //       ""
      //     );
      //   },
      // },
      {
        accessorKey: "U_tl_expactive",
        header: "Status",
        size: 40,
        visible: true,
        Cell: ({ cell }: any) => (cell.getValue() === "Y" ? "Active" : "Inactive"),
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
                route(
                  "/master-data/expense-dictionary/" + cell.row.original.Code,
                  {
                    state: cell.row.original,
                    replace: true,
                  }
                );
              }}
            >
              <VisibilityIcon fontSize="small" className="text-gray-600 " />{" "}
              View
            </button>
            <button
              className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
              onClick={() => {
                route(
                  `/master-data/expense-dictionary/${cell.row.original.Code}/edit`,
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
  const [sortBy, setSortBy] = React.useState("DocEntry desc");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const Count: any = useQuery({
    queryKey: [`TL_ExpDic`, `${filter !== "" ? "f" : ""}`],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/TL_ExpDic/$count?${filter.replace('&', '')}`
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
      "TL_ExpDic",
      `${pagination.pageIndex * pagination.pageSize}_${filter !== "" ? "f" : ""}`,
      pagination.pageSize,
      pagination.pageIndex
    ],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/TL_ExpDic?$top=${pagination.pageSize}&$skip=${
          pagination.pageIndex * pagination.pageSize
        }${filter}${sortBy !== "" ? "&$orderby=" + sortBy : ""}`
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

  const { data:gl6 }: any = useQuery({
    queryKey: ["gl_account_6"],
    queryFn: async () => await request("GET", "ChartOfAccounts?$filter=startswith(Code, '6') and ActiveAccount eq 'tYES' &$select=Code,Name,ActiveAccount,CashAccount&$orderby=Code asc").then((res:any) => res.data?.value),
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

  const handlerSearch = (value: string) => {
    setFilter(value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });

    setTimeout(() => {
      Count.refetch();
      refetch();
    }, 500);
  };

  const handleAdaptFilter = () => {
    setOpen(true);
  };

  const handleGoClick = () => {
    let queryFilters: any = [];
    if (searchValues.search)
      queryFilters.push(`contains(Code, '${searchValues.search}') or contains(Name, '${searchValues.search}') or contains(U_tl_expacct, '${searchValues.search}')`);
    if (searchValues.docnum)
      queryFilters.push(`startswith(DocNum, '${searchValues.docnum}')`);
    if (searchValues.status)
      queryFilters.push(`U_tl_expactive eq '${searchValues.status}'`);
    if (searchValues.code)
      queryFilters.push(`startswith(Code, '${searchValues.code}')`);
    if (searchValues.name)
      queryFilters.push(`startswith(Name, '${searchValues.name}')`);
    if (searchValues.docdate)
      queryFilters.push(
        `startswith(CreateDate, '${searchValues.docdate}T00:00:00Z')`
      );
    if (searchValues.account > 0)
      queryFilters.push(`startswith(U_tl_expacct, '${searchValues.account}')`);

    if (queryFilters.length > 0)
      return handlerSearch(`&$filter=${queryFilters.join(" and ")}`);
    return handlerSearch("");
  };

  return (
    <>
      <ModalAdaptFilter
        isOpen={open}
        handleClose={() => setOpen(false)}
      ></ModalAdaptFilter>
      <div className="w-full h-full px-6 py-2 flex flex-col gap-1 relative bg-white">
        <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2">
          <h3 className="text-base 2xl:text-base xl:text-base ">
            Master Data / Expense Dictionary{" "}
          </h3>
        </div>
        <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
          <div className="col-span-10">
            <div className="grid grid-cols-12  space-x-4">
              <div className="col-span-3 2xl:col-span-3">
                <MUITextField
                  label="Search"
                  placeholder="Search"
                  className="bg-white"
                  autoComplete="off"
                  value={searchValues.search}
                  onChange={(e) =>
                    setSearchValues({ ...searchValues, search: e.target.value })
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
                        { label: "None", value: "" },
                        { label: "Active", value: "Y" },
                        { label: "Inactive", value: "N"}
                      ]}
                      onChange={(e) => {
                        if (e) {
                          setSearchValues({
                            ...searchValues,
                            status: e.target.value as string, // Ensure e.target.value is treated as a string
                          });
                        }
                      }}
                      value={searchValues.status}
                    />
                  </div>
                </div>
              </div>
              {/* <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  label="Expese Code"
                  placeholder="Code"
                  className="bg-white"
                  autoComplete="off"
                  value={searchValues.code}
                  onChange={(e) =>
                    setSearchValues({ ...searchValues, code: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  label="Name"
                  placeholder="Name"
                  className="bg-white"
                  autoComplete="off"
                  value={searchValues.name}
                  onChange={(e) =>
                    setSearchValues({ ...searchValues, name: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 2xl:col-span-3">
                <div className="flex flex-col gap-1 text-sm">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Account
                  </label>
                  <div className="">
                    <CashACAutoComplete
                      value={searchValues.account}
                      onChange={(e) =>
                        setSearchValues({ ...searchValues, account: e })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-2 2xl:col-span-3">
                <MUIDatePicker
                  label="Create Date"
                  value={searchValues?.docdate}
                  onChange={(e) => {
                    setSearchValues({
                      ...searchValues,
                      docdate: e || null,
                    });
                  }}
                />
              </div> */}
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex justify-end items-center align-center space-x-2 mt-4">
              <div className="">
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleGoClick}
                >
                  Go
                </Button>
              </div>
              {/* <div className="">
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
                      e?.accessorKey !== "DocumentStatus"
                  )}
                  onClick={handlerSearch}
                />
              </div> */}
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
          title="Expense Dictionary Lists"
          filter={filter}
        />
      </div>
    </>
  );
}
