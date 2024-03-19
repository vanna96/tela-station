import request, { url } from "@/utilies/request";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MUITextField from "@/components/input/MUITextField";
import { Button } from "@mui/material";
import MUISelect from "@/components/selectbox/MUISelect";
import DepartmentRepository from "@/services/actions/departmentRepository";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import DataTable from "@/presentations/master_data/components/DataTable";


export default function Lists() {
  const [searchValues, setSearchValues] = React.useState({
    DocumentNumber: "",
    active: "tYES",
  });
  const branchAss: any = useQuery({
    queryKey: ["branchAss"],
    queryFn: () => new BranchBPLRepository().get(),
    staleTime: Infinity,
  });
  // console.log(branchAss);

  const route = useNavigate();

  const [filter, setFilter] = React.useState("");
  const [sortBy, setSortBy] = React.useState("");

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const Count: any = useQuery({
    queryKey: [`TL_TO-COUNT`, `${filter !== "" ? "f" : ""}`],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/TL_TO/$count?${filter}`
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
      "TL_TO",
      `${pagination.pageIndex * pagination.pageSize}_${
        filter !== "" ? "f" : ""
      }`,
      pagination.pageSize,
    ],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/TL_TO?$top=${pagination.pageSize}&$skip=${
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
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "Index",
        header: "No.", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        Cell: (cell: any) => {
          return cell?.row?.index + 1;
        },
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
          return cell.row.original.DocNum;
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
          return branchAss?.data?.find(
            (e: any) => e?.BPLID === cell.row.original.U_Branch
          )?.BPLName;
        },
      },
      {
        accessorKey: "U_Terminal",
        header: "Terminal",
        size: 40,
        visible: true,
        type: "number",
        Cell: (cell: any) => {
          return cell.row.original.U_Terminal;
        },
      },
      {
        accessorKey: "CreateDate",
        header: "Document Date",
        size: 40,
        visible: true,
        type: "number",
        Cell: (cell: any) => {
          return cell.row.original.CreateDate?.split("T")[0];
        },
      },
      {
        accessorKey: "Status",
        header: "Status",
        size: 60,
        visible: true,
        type: "string",
        Cell: ({ cell }: any) => (cell.getValue() === "O" ? "Open" : "Close"),
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
                  "/trip-management/transportation-order/" +
                    cell.row.original.DocEntry,
                  {
                    state: cell.row.original,
                    replace: true,
                  }
                );
              }}
            >
              <VisibilityIcon fontSize="small" className="text-gray-600 " />
              View
            </button>
            <button
              className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
              onClick={() => {
                route(
                  `/trip-management/transportation-order/${cell.row.original.DocEntry}/edit`,
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
    [Count, sortBy]
  );

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
    if (searchValues.DocumentNumber) {
      queryFilters += queryFilters
        ? ` and (contains(DocumentNo, '${searchValues.DocumentNumber}'))`
        : `(contains(DocumentNo, '${searchValues.DocumentNumber}'))`;
    }

    if (searchValues.active) {
      searchValues.active === "All"
        ? (queryFilters += queryFilters ? "" : "")
        : (queryFilters += queryFilters
            ? ` and Active eq '${searchValues.active}'`
            : `Active eq '${searchValues.active}'`);
    }

    let query = queryFilters;

    if (value) {
      query = queryFilters + `and ${value}`;
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
            Trip Management / Transportation Order{" "}
          </h3>
        </div>
        <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
          <div className="col-span-10">
            <div className="grid grid-cols-12  space-x-4">
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  type="string"
                  label="Document Number"
                  className="bg-white"
                  autoComplete="off"
                  value={searchValues.DocumentNumber}
                  onChange={(e) =>
                    setSearchValues({
                      ...searchValues,
                      DocumentNumber: e.target.value,
                    })
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
                    { value: "All", label: "All" },
                    { value: "tYES", label: "Initiated" },
                    { value: "tNO", label: "Inactive" },
                  ]}
                  onChange={(e: any) => {
                    setSearchValues({
                      ...searchValues,
                      active: e.target.value,
                    });
                  }}
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
          createRoute="create"
          // filter={filter}
        />
      </div>
    </>
  );
}
