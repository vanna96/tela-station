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
import MUISelect from "@/components/selectbox/MUISelect";
import DataTable from "./component/DatatableV";
import DriverRepository from "@/services/actions/DriverRepository";

export default function Lists() {
  const [searchValues, setSearchValues] = React.useState({
    code: "",
    name: "",
    status: "",
  });

  const route = useNavigate();
    const driver: any = useQuery({
      queryKey: ["drivers"],
      queryFn: () => new DriverRepository().get(),
      staleTime: Infinity,
    });
  console.log(driver);
  
  
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "Code",
        header: "Vehicle Code", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.Code ?? "N/A";
        },
      },
      {
        accessorKey: "Name",
        header: "Vehicle Name", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.Name ?? "N/A";
        },
      },
      {
        accessorKey: "U_Type",
        header: "Type", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.U_Type ?? "N/A";
        },
      },

      {
        accessorKey: "U_Driver",
        header: "Driver",
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "number",
        Cell: (cell: any) => {
          return (
            driver?.data?.find(
              (e: any) => e?.EmployeeID === cell.row.original.U_Driver
            )?.FirstName +
              " " +
              driver?.data?.find(
                (e: any) => e?.EmployeeID === cell.row.original.U_Driver
              )?.FirstName
          );
        },
      },
      {
        accessorKey: "U_BaseStation",
        header: "Base Station",
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.U_BaseStation ?? "N/A";
        },
      },
      {
        accessorKey: "U_Status",
        header: "Status",
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.U_Status ?? "N/A";
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
                route("/master-data/vehicle/" + cell.row.original.Code, {
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
                  `/master-data/vehicle/${cell.row.original.Code}/edit`,
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
    queryKey: [`vehicle`, `${filter !== "" ? "f" : ""}`],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/TL_VEHICLE/$count${
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
      "vehicle",
      `${pagination.pageIndex * pagination?.pageSize}_${filter !== "" ? "f" : ""}`,pagination?.pageSize
    ],
    queryFn: async () => {
      const Url = `${url}/TL_VEHICLE?$top=${pagination.pageSize}&$skip=${
        pagination.pageIndex * pagination.pageSize
      }${
        filter ? `and ${filter}` : filter
      }&$orderby=DocEntry${"&$select = DocEntry,Code,Name,U_Type,U_Driver,U_BaseStation,U_Status"}`;

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
        ? ` and (contains(Code, '${searchValues.code}'))`
        : `(contains(Code, '${searchValues.code}'))`;
    }
    if (searchValues.name) {
      queryFilters += queryFilters
        ? ` and (contains(Name, '${searchValues.name}'))`
        : `(contains(Name, '${searchValues.name}'))`;
    }
    if (searchValues.status) {
      queryFilters += queryFilters
        ? ` and (contains(U_Status, '${searchValues.status}'))`
        : `(contains(U_Status, '${searchValues.status}'))`;
    }
   
    let qurey = queryFilters + value;
    setFilter(qurey);

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
            Master Data / Vehicle{" "}
          </h3>
        </div>
        <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
          <div className="col-span-10">
            <div className="grid grid-cols-12  space-x-4">
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  label="Code"
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
                <MUISelect
                  items={[
                    { value: "tYES", label: "Yes" },
                    { value: "tNO", label: "No" },
                    { value: "", label: "None" },
                  ]}
                  onChange={(e: any) =>
                    setSearchValues({
                      ...searchValues,
                      status: e.target.value,
                    })
                  }
                  value={searchValues.status}
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
              {/* <div className="">
                <DataTableColumnFilter
                  handlerClearFilter={handlerRefresh}
                  title={
                    <div className="flex gap-2">
                      <Button variant="outlined" size="small">
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
          title="Vehicle"
        />
      </div>
    </>
  );
}
