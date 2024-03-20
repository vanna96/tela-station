import request, { url } from "@/utilies/request";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
// import DataTable from "../components/DataTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MUITextField from "@/components/input/MUITextField";
import BPAutoComplete from "@/components/input/BPAutoComplete";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { BiFilterAlt } from "react-icons/bi";
import DataTableColumnFilter from "@/components/data_table/DataTableColumnFilter";
import moment from "moment";
import MUISelect from "@/components/selectbox/MUISelect";
import { Breadcrumb } from "../components/Breadcrumn";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import BPLBranchSelect from "@/components/selectbox/BranchBPL";
import { useCookies } from "react-cookie";
import BranchAutoComplete from "@/components/input/BranchAutoComplete";
import SalePersonRepository from "@/services/actions/salePersonRepository";
import DataTable from "./components/DataTable";

export default function DispenserList() {
  const [open, setOpen] = React.useState<boolean>(false);
  const route = useNavigate();

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "DocEntry",
        header: "No.", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        Cell: (cell: any) => cell?.row?.index + 1,
      },
      {
        accessorKey: "Code",
        header: "Pump Code", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 40,
        visible: true,
      },
      {
        accessorKey: "Name",
        header: "Pump Description", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 40,
        visible: true,
      },
      // {
      //   accessorKey: "U_tl_empid",
      //   header: "Employee", //uses the default width from defaultColumn prop
      //   enableClickToCopy: true,
      //   enableFilterMatchHighlighting: true,
      //   size: 40,
      //   visible: true,
      //   Cell: ({ cell }: any) => {
      //     if(!cell.getValue()) return "";
      //     return new SalePersonRepository().find(cell.getValue())?.name;
      //   },
      // },
      // {
      //   accessorKey: "U_tl_type",
      //   header: "LOB", //uses the default width from defaultColumn prop
      //   enableClickToCopy: true,
      //   enableFilterMatchHighlighting: true,
      //   size: 40,
      //   visible: true,
      // },
      {
        accessorKey: "U_tl_pumpnum",
        header: "Number of Nozzle", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 40,
        visible: true,
      },
      {
        accessorKey: "U_tl_status",
        header: "Status", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 40,
        visible: true,
      },
      {
        accessorKey: "id",
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
          <div className="flex space-x-2" key={`${cell.row.original.Code}`}>
            <button
              variant="outlined"
              size="small"
              className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
              onClick={() => {
                route("/master-data/pump/" + cell.row.original.Code, {
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
              size="small"
              disabled={
                cell.row.original.DocumentStatus === "bost_Close" ?? false
              }
              onClick={() => {
                route(
                  "/master-data/pump/" + cell.row.original.Code + "/edit",
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
    queryKey: ["pa-count" + filter !== "" ? "-f" : ""],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/TL_Dispenser/$count?$select=Code${filter}`
      )
        .then(async (res: any) => res?.data)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
  });
  
  const { data, isLoading, refetch, isFetching }: any = useQuery({
    queryKey: [
      "pa",
      `${pagination.pageIndex * pagination.pageSize}_${filter !== "" ? "f" : ""}`,
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize,
    ],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/TL_Dispenser?$top=${pagination.pageSize}&$skip=${
          pagination.pageIndex * pagination.pageSize
        }${filter}${sortBy !== "" ? "&$orderby=" + sortBy : ""}`
      )
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    keepPreviousData: true
  });

  const [cookies] = useCookies(["user"]);
  const [searchValues, setSearchValues] = React.useState({
    Code: "",
    Name: "",
    status: ""
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
    const qurey = value;
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

  const handleGoClick = () => {
    let queryFilters: any = [];

    if (searchValues.Code) queryFilters.push(`contains(Code , '${searchValues.Code}')`);
    if (searchValues.Name) queryFilters.push(`contains(Name , '${searchValues.Name}')` );
    if (searchValues.status && searchValues.status !== "All") queryFilters.push(`U_tl_status eq '${searchValues.status}'`);

    if (queryFilters.length > 0)
      return handlerSearch(`&$filter=${queryFilters.join(" and ")}`);
    return handlerSearch("");
  };
  const { id }: any = useParams();

  const childBreadcrum = (
    <>
      <span className="" onClick={() => route("/master-data/pump")}>
     {" "}  Pump
      </span>
    </>
  );

  return (
    <>
      <div className="w-full h-full px-4 py-2 flex flex-col gap-1 relative bg-white ">
        <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2 bg-white">
          <Breadcrumb childBreadcrum={childBreadcrum} />
        </div>

        <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
          <div className="col-span-10">
            <div className="grid grid-cols-12  space-x-4">
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  label="Pump Code"
                  placeholder="Pump Code"
                  className="bg-white"
                  autoComplete="off"
                  type="text"
                  value={searchValues.Code}
                  onChange={(e) => setSearchValues({ ...searchValues, Code: e.target.value })}
                />
              </div>
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  label="Pump Description"
                  placeholder="Pump Description"
                  className="bg-white"
                  autoComplete="off"
                  type="text"
                  value={searchValues.Name}
                  onChange={(e) =>
                    setSearchValues({ ...searchValues, Name: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 2xl:col-span-3">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Status
                  </label>
                  <div className="">
                    <MUISelect
                      items={[
                        { label: "All", value: "All" },
                        { label: "New", value: "New" },
                        { label: "Active", value: "Active" },
                        { label: "Inactive", value: "Inactive"}
                      ]}
                      onChange={(e) => {
                        setSearchValues({
                          ...searchValues,
                          status: e.target.value as string, // Ensure e.target.value is treated as a string
                        });
                      }}
                      value={searchValues.status || "All"}
                    />
                  </div>
                </div>
              {/* <div className="col-span-2 2xl:col-span-3">
                <BPAutoComplete
                  type="Customer"
                  label="Customer"
                  value={searchValues.cardcode}
                  onChange={(selectedValue) =>
                    setSearchValues({
                      ...searchValues,
                      cardcode: selectedValue,
                    })
                  }
                />
              </div>
              <div className="col-span-2 2xl:col-span-3">
                <div className="flex flex-col gap-1 text-sm">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Branch
                  </label>
                  <div className="">
                    <BranchAutoComplete
                      BPdata={cookies?.user?.UserBranchAssignment}
                      onChange={(selectedValue) =>
                        setSearchValues({
                          ...searchValues,
                          bplid: selectedValue,
                        })
                      }
                      value={searchValues.bplid}
                    />
                  </div>
                </div>
              </div> */}
              {/* <div className="col-span-2 2xl:col-span-3">
                <MUIDatePicker
                  label="Delivery Date"
                  value={searchValues.deliveryDate}
                  // onChange={(e: any) => handlerChange("PostingDate", e)}
                  onChange={(e) => {
                    setSearchValues({
                      ...searchValues,
                      deliveryDate: e,
                    });
                  }}
                />
              </div> */}
              {/* <div className="col-span-2 2xl:col-span-3">
                <div className="flex flex-col gap-1 text-sm">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Status
                  </label>
                  <div className="">
                    <MUISelect
                      items={[
                        { label: "None", value: "" },
                        { label: "Open", value: "bost_Open" },
                        { label: "Close", value: "bost_Close" },
                        // { label: "Paid", value: "bost_Paid" },
                        // { label: "Delivered", value: "bost_Delivered" },
                      ]}
                      // onChange={(e) =>
                      //   setSearchValues({ ...searchValues, status: e.target.value })
                      // }
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
          title="Pump Lists"
          createRoute="/master-data/pump/create"
          filter={filter}
        />
      </div>
    </>
  );
}
