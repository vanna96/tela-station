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
import { ModalAdaptFilter } from "../cash_account/components/ModalAdaptFilter";
import DataTable from "./components/DataTable";
export default function Routelistpage() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [cookies] = useCookies(["user"]);
  const [searchValues, setSearchValues] = React.useState({
    status: "",
    code: "",
  });
  const route = useNavigate();
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "DocEntry",
        header: "No.", //uses the default width from defaultColumn prop
        size: 20,
        maxSize: 20,
        minSize: 20,
        type: 'number',
        Cell: (cell: any) => {
          return cell.row.index + 1
        },
      },
      {
        accessorKey: "Code",
        header: "Route Code", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 100,
        visible: true,
        type: "string",
      },
      {
        accessorKey: "Name",
        header: "Route Name", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.Name;
        },
      },

      {
        accessorKey: "U_BaseStation",
        header: "Base Station", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.U_BaseStation;
        },
      },

      {
        accessorKey: "U_Destination",
        header: "Destination",
        size: 40,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.U_Destination;
        },
      },
      {
        accessorKey: "U_Distance",
        header: "Distance",
        size: 40,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.U_Distance;
        },
      },
      {
        accessorKey: "U_Status",
        header: "Status",
        size: 40,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.U_Status === "Y" ? "Active" : "Inactive";
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
                route("/master-data/route/" + cell.row.original.Code, {
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
                route(`/master-data/route/${cell.row.original.Code}/edit`, {
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
    queryKey: [`TL_ROUTE`, `${filter !== "" ? "f" : ""}`],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/TL_ROUTE/$count?${filter ? `$filter=${filter}` : ""}`
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
      "TL_ROUTE",
      `${pagination.pageIndex * pagination.pageSize}_${filter !== "" ? "f" : ""
      }`,
      pagination.pageSize,
    ],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/TL_ROUTE?$top=${pagination.pageSize}&$skip=${pagination.pageIndex * pagination.pageSize
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
    if (searchValues.code) {
      queryFilters += queryFilters
        ? ` and (contains(Code, '${searchValues.code}'))`
        : `contains(Code, '${searchValues.code}')`;
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
      <ModalAdaptFilter
        isOpen={open}
        handleClose={() => setOpen(false)}
      ></ModalAdaptFilter>
      <div className="w-full h-full px-6 py-2 flex flex-col gap-1 relative bg-white">
        <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2">
          <h3 className="text-base 2xl:text-base xl:text-base ">
            Master Data / Route
          </h3>
        </div>
        <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
          <div className="col-span-10">
            <div className="grid grid-cols-12  space-x-4">
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  label=" Code"
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
          title="Route"
          enableRowNumbers={false}
        // createRoute="/master-data/route/create"
        />
      </div>
    </>
  );
}
