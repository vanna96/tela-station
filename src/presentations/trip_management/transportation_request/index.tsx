import request, { url } from "@/utilies/request";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import DataTable from "@/presentations/master_data/components/DataTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MUITextField from "@/components/input/MUITextField";
import { Button } from "@mui/material";
import DataTableColumnFilter from "@/components/data_table/DataTableColumnFilter";
import { useCookies } from "react-cookie";
// import { APIContext } from "../context/APIContext";
import { APIContext } from "@/presentations/master_data/context/APIContext";
import MUISelect from "@/components/selectbox/MUISelect";
import moment from "moment";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import EmployeeRepository from "@/services/actions/employeeRepository";
import ExpdicRepository from "@/services/actions/ExpDicRepository";
import ManagerRepository from "@/services/actions/ManagerRepository";

export default function TransportationRequestList() {
  const [open, setOpen] = React.useState<boolean>(false);
  // const { branchBPL }: any = React.useContext(APIContext);
  const [cookies] = useCookies(["user"]);

const branchAss: any = useQuery({
     queryKey: ["branchAss"],
     queryFn: () => new BranchBPLRepository().get(),
     staleTime: Infinity,
   });
  // console.log(branchAss);

  const emp: any = useQuery({
    queryKey: ["manager"],
    queryFn: () => new ManagerRepository().get(),
    staleTime: Infinity,
  });

//  console.log(emp);
  

  const [searchValues, setSearchValues] = React.useState<any>({
    active: "",
    code: "",
  });

  const route = useNavigate();
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "DocNum",
        header: "No.", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
      },
      {
        accessorKey: "DocNum",
        header: "Document Number", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.DocNum ?? "N/A";
        },
      },

      {
        accessorKey: "U_Branch",
        header: "Branch", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 100,
        visible: true,
        type: "number",
        Cell: (cell: any) => {
          return (
            branchAss?.data?.find(
              (e: any) => e?.BPLID === cell.row.original.U_Branch
            )?.BPLName ?? "N/A"
          );
        },
      },
      
      {
        accessorKey: "U_Terminal",
        header: "Terminal",
        size: 40,
        visible: true,
        type: "number",
        Cell: (cell: any) => {
          return cell.row.original.U_Terminal ?? "N/A";
        },
      },
      {
        accessorKey: "U_Requester",
        header: "Requester",
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          const requester = emp?.data?.find(
            (e: any) => e?.EmployeeID === cell.row.original.U_Requester
          );
      
          const fullName = requester
            ? `${requester.FirstName} ${requester.LastName}`
            : "N/A";
      
          return fullName;
        },
      },
      
      {
        accessorKey: "U_RequestDate",
        header: "Request Date",
        size: 40,
        visible: true,
        Cell: (cell: any) => {
          const formattedDate = moment(cell.row.original.U_RequestDate).format(
            "YYYY-MM-DD"
          );
          return <span>{formattedDate}</span>;
        },
      },
      {
        accessorKey: "Status",
        header: "Status",
        size: 40,
        visible: true,
        Cell: (cell: any) => {
          return cell.row.original.Status === "O"
            ? "Active"
            : "Inactive" ?? "N/A";
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
                route("/trip-management/transportation-request/" + cell.row.original.DocEntry, {
                  state: cell.row.original,
                  replace: true,
                });
              }}
            >
              <VisibilityIcon fontSize="small" className="text-gray-600 " />
              View
            </button>
            <button
              className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
              onClick={() => {
                route(`/trip-management/transportation-request/${cell.row.original.DocEntry}/edit`, {
                  state: cell.row.original,
                  replace: true,
                });
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
    queryKey: [`TL_TR`, `${filter !== "" ? "f" : ""}`],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/TL_TR/$count?${filter}`
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
      "TL_TR",
      `${pagination.pageIndex * pagination.pageSize}_${
        filter !== "" ? "f" : ""
      }`,
      pagination.pageSize,
    ],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/TL_TR?$top=${pagination.pageSize}&$skip=${
          pagination.pageIndex * pagination.pageSize
        }&$orderby= DocNum desc &${filter}`
      )
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    cacheTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
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
    const str = value.slice(0, 4);
    const query = str.includes("and") ? value.substring(4) : value;

    setFilter(`$filter=${query}`);
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
    console.log(searchValues);
    let queryFilters: any = [];
    if (searchValues.active)
      queryFilters.push(`startswith(U_active, '${searchValues.active}')`);
    if (searchValues.code)
      queryFilters.push(`contains(Code, '${searchValues.code}')`);
    if (queryFilters.length > 0)
      return handlerSearch(`${queryFilters.join(" and ")}`);
      if (searchValues.U_active) {
        searchValues.U_active === "All"
          ? (queryFilters += queryFilters)
          : (queryFilters += queryFilters ? ` and Active eq '${searchValues.U_active}'` : `Active eq '${searchValues.U_active}'`);
      }
    return handlerSearch("");
  };

  return (
    <>
      <div className="w-full h-full px-6 py-2 flex flex-col gap-1 relative bg-white">
        <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2">
          <h3 className="text-base 2xl:text-base xl:text-base ">
            Trip Management / Transportation Request{" "}
          </h3>
        </div>
        <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
          <div className="col-span-10">
            <div className="grid grid-cols-12  space-x-4">
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  label="Document Number"
                  placeholder="Document Number"
                  className="bg-white"
                  autoComplete="off"
                  value={searchValues.code}
                  onChange={(e) =>
                    setSearchValues({ ...searchValues, vv   : e.target.value })
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
                        { id: "Y", name: "Active" },
                        { id: "N", name: "Inactive" },
                        { id: "All", name: "All" },
                      ]}
                      onChange={(e) =>
                        setSearchValues({
                          ...searchValues,
                          active: e?.target?.value,
                        })
                      }
                      value={searchValues.active}
                      aliasvalue="id"
                      aliaslabel="name"
                      name="U_active"
                    />
                  </div>
                </div>
              </div>
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
                  onClick={handleGoClick}
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
          title="Transportation Request"
          createRoute="/trip-management/transportation-request/create"
        />
      </div>
    </>
  );
}
