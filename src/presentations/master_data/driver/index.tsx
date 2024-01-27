import request, { url } from "@/utilies/request";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MUITextField from "@/components/input/MUITextField";
import { Button } from "@mui/material";
import DataTableColumnFilter from "@/components/data_table/DataTableColumnFilter";
import { useCookies } from "react-cookie";
import { APIContext } from "../context/APIContext";
import DataTable from "./component/DataTableD";
import MUISelect from "@/components/selectbox/MUISelect";
import DepartmentRepository from "@/services/actions/departmentRepository";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";

export default function Lists() {
  const [searchValues, setSearchValues] = React.useState({
    code: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
    active: "tYES",
  });
   const branchAss: any = useQuery({
     queryKey: ["branchAss"],
     queryFn: () => new BranchBPLRepository().get(),
     staleTime: Infinity,
   });
  // console.log(branchAss);
  
  const route = useNavigate();
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "Name",
        header: "Driver Name", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return (
            cell.row.original.FirstName + " " + cell.row.original.LastName ??
            "N/A"
          );
        },
      },
      {
        accessorKey: "Gender",
        header: "Gender", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 60,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return (cell.row.original.Gender)?.replace('gt_','') ?? "N/A";
        },
      },
      {
        accessorKey: "Department",
        header: "Department", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return (
            new DepartmentRepository().find(cell.row.original.Department)
              ?.Name ?? "N/A"
          );
        },
      },
      {
        accessorKey: "BPLID",
        header: "Branch", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 100,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return (
            branchAss?.data?.find((e: any) => e?.BPLID === cell.row.original.BPLID)?.BPLName??
            "N/A"
          );
        },
      },
      {
        accessorKey: "Active",
        header: "Active",
        size: 60,
        visible: true,
        type: "string",
        Cell: ({ cell }: any) =>
          cell.getValue() === "tYES" ? "Active" : "Inactive",
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
                route("/master-data/driver/" + cell.row.original.EmployeeID, {
                  state: cell.row.original,
                  replace: true,
                });
              }}
            >
              <VisibilityIcon fontSize="small" className="text-gray-600 " />{" "}
              View
            </button>
            <button
              className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
              onClick={() => {
                route(
                  `/master-data/driver/${cell.row.original.EmployeeID}/edit`,
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
    queryKey: [`Driver`, `${filter !== "" ? "f" : ""}`],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/EmployeesInfo/$count?$filter=U_tl_driver eq 'Y'${
          filter ? ` and ${filter}` : ""
        }`
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
      "Driver",
      `${pagination.pageIndex * 10}_${filter !== "" ? "f" : ""}`,
    ],
    queryFn: async () => {
      const Url = `${url}/EmployeesInfo?$top=${pagination.pageSize}&$skip=${
        pagination.pageIndex * pagination.pageSize
      }&$filter=U_tl_driver eq 'Y'${
        filter ? ` and ${filter}` : filter
      }&$orderby=EmployeeID asc${"&$select =EmployeeID,FirstName,LastName,Gender,Department,BPLID,Active"}`;

      const response: any = await request("GET", `${Url}`)
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
    if (searchValues.code) {
      queryFilters += queryFilters
        ? ` and (contains(EmployeeCode, '${searchValues.code}'))`
        : `(contains(EmployeeCode, '${searchValues.code}'))`;
    }
    if (searchValues.firstName) {
      queryFilters += queryFilters
        ? ` and (contains(FirstName, '${searchValues.firstName}'))`
        : `(contains(FirstName, '${searchValues.firstName}'))`;
    }
    if (searchValues.lastName) {
      queryFilters += queryFilters
        ? ` and (contains(LastName, '${searchValues.lastName}'))`
        : `(contains(LastName, '${searchValues.lastName}'))`;
    }
    if (searchValues.active) {
      queryFilters += queryFilters
        ? ` and Active eq '${searchValues.active}'`
        : `Active eq '${searchValues.active}'`;
    }

    let query = queryFilters;

    if (value) {
      query = queryFilters + `and ${value}`
    }
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
            Master Data / Driver{" "}
          </h3>
        </div>
        <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
          <div className="col-span-10">
            <div className="grid grid-cols-12  space-x-4">
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  type="string"
                  label="Driver Name"
                  // placeholder="Employee Code"
                  className="bg-white"
                  autoComplete="off"
                  value={searchValues.code}
                  onChange={(e) =>
                    setSearchValues({ ...searchValues, code: e.target.value })
                  }
                  
                />
              </div>

           

              <div className="col-span-2 2xl:col-span-3">
                <div className="">
                  <label
                    htmlFor="Code"
                    className="text-gray-500 text-[14.1px] mb-[0.5px] inline-block"
                  >
                    Status
                  </label>
                </div>
                {/* {searchValues.active === null && (
                  <div>
                    <MUITextField
                      label="LastName"
                      // placeholder="LastName"
                      className="bg-white"
                      onChange={(e) =>
                        setSearchValues({
                          ...searchValues,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                )} */}
                <MUISelect
                  items={[
                    { value: "", label: "All" },
                    { value: "tYES", label: "Active" },
                    { value: "tNO", label: "Inactive" },
                  ]}
                  onChange={(e: any) =>
                    setSearchValues({
                      ...searchValues,
                      active: e.target.value,
                    })
                  }
                  value={
                    // searchValues.active === null ? "tYES" : searchValues.active
                    searchValues.active
                  }
                  aliasvalue="value"
                  aliaslabel="label"
                />
              </div>

              <div className="col-span-2 2xl:col-span-3"></div>
              {/*  */}

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
              <div className="">
                <DataTableColumnFilter
                  handlerClearFilter={handlerRefresh}
                  title={
                    <div className="flex gap-2">
                      <Button variant="outlined" size="small">
                        Adapt Filter
                      </Button>
                    </div>
                  }
                  items={columns?.filter((e) => e?.accessorKey !== "DocEntry")}
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
          title="Driver"
        />
      </div>
    </>
  );
}
