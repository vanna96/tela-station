// import request, { url } from "@/utilies/request";
// import React from "react";
// import { useQuery } from "react-query";
// import { useNavigate } from "react-router-dom";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
// import MUITextField from "@/components/input/MUITextField";
// import { Button } from "@mui/material";
// import MUISelect from "@/components/selectbox/MUISelect";
// import DepartmentRepository from "@/services/actions/departmentRepository";
// import BranchBPLRepository from "@/services/actions/branchBPLRepository";
// import DataTable from "@/presentations/master_data/components/DataTable";
// import { displayTextDate } from "@/lib/utils";

// export default function Lists() {
//   const [searchValues, setSearchValues] = React.useState({
//     DocumentNumber: "",
//     active: "tYES",
//   });
//   const branchAss: any = useQuery({
//     queryKey: ["branchAss"],
//     queryFn: () => new BranchBPLRepository().get(),
//     staleTime: Infinity,
//   });
//   // console.log(branchAss);

//   const route = useNavigate();

//   const [filter, setFilter] = React.useState("");
//   const [sortBy, setSortBy] = React.useState("");

//   const [pagination, setPagination] = React.useState({
//     pageIndex: 0,
//     pageSize: 10,
//   });

//   const Count: any = useQuery({
//     queryKey: [`TL_TO-COUNT`, `${filter !== "" ? "f" : ""}`],
//     queryFn: async () => {
//       const response: any = await request(
//         "GET",
//         `${url}/TL_TO/$count?${filter}`
//       )
//         .then(async (res: any) => res?.data)
//         .catch((e: Error) => {
//           throw new Error(e.message);
//         });
//       return response;
//     },
//     cacheTime: 0,
//     staleTime: 0,
//   });

//   const { data, isLoading, refetch, isFetching }: any = useQuery({
//     queryKey: [
//       "TL_TO",
//       `${pagination.pageIndex * pagination.pageSize}_${
//         filter !== "" ? "f" : ""
//       }`,
//       pagination.pageSize,
//     ],
//     queryFn: async () => {
//       const response: any = await request(
//         "GET",
//         `${url}/TL_TO?$top=${pagination.pageSize}&$skip=${
//           pagination.pageIndex * pagination.pageSize
//         }&$orderby= DocNum desc &${filter}`
//       )
//         .then((res: any) => res?.data?.value)
//         .catch((e: Error) => {
//           throw new Error(e.message);
//         });
//       return response;
//     },
//     cacheTime: 0,
//     staleTime: 0,
//     refetchOnWindowFocus: false,
//   });
//   const columns = React.useMemo(
//     () => [
//       {
//         accessorKey: "Index",
//         header: "No.", //uses the default width from defaultColumn prop
//         enableClickToCopy: true,
//         enableFilterMatchHighlighting: true,
//         size: 88,
//         visible: true,
//         Cell: (cell: any) => {
//           return cell?.row?.index + 1;
//         },
//       },
//       {
//         accessorKey: "DocNum",
//         header: "Document Number", //uses the default width from defaultColumn prop
//         enableClickToCopy: true,
//         enableFilterMatchHighlighting: true,
//         size: 88,
//         visible: true,
//         type: "string",
//         Cell: (cell: any) => {
//           return cell.row.original.DocNum;
//         },
//       },

//       {
//         accessorKey: "U_Branch",
//         header: "Branch", //uses the default width from defaultColumn prop
//         enableClickToCopy: true,
//         enableFilterMatchHighlighting: true,
//         size: 100,
//         visible: true,
//         type: "number",
//         Cell: (cell: any) => {
//           return branchAss?.data?.find(
//             (e: any) => e?.BPLID === cell.row.original.U_Branch
//           )?.BPLName;
//         },
//       },
//       {
//         accessorKey: "U_BaseStation",
//         header: "Terminal",
//         size: 40,
//         visible: true,
//         type: "number",

//       },
//       {
//         accessorKey: "CreateDate",
//         header: "Document Date",
//         size: 40,
//         visible: true,
//         type: "number",
//         Cell: ({ cell }: any) => {
//           return <span>{displayTextDate(cell?.getValue())}</span>;
//         },
//       },
//       {
//         accessorKey: "Status",
//         header: "Status",
//         size: 60,
//         visible: true,
//         type: "string",
//         Cell: ({ cell }: any) => (cell.getValue() === "O" ? "Open" : "Close"),
//       },
//       {
//         accessorKey: "DocEntry",
//         enableFilterMatchHighlighting: false,
//         enableColumnFilterModes: false,
//         enableColumnActions: false,
//         enableColumnFilters: false,
//         enableColumnOrdering: false,
//         enableSorting: false,
//         minSize: 100,
//         maxSize: 100,
//         header: "Action",
//         visible: true,
//         Cell: (cell: any) => (
//           <div className="flex space-x-2">
//             <button
//               className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
//               onClick={() => {
//                 route(
//                   "/trip-management/transportation-order/" +
//                     cell.row.original.DocEntry,
//                   {
//                     state: cell.row.original,
//                     replace: true,
//                   }
//                 );
//               }}
//             >
//               <VisibilityIcon fontSize="small" className="text-gray-600 " />
//               View
//             </button>
//             <button
//               className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
//               onClick={() => {
//                 route(
//                   `/trip-management/transportation-order/${cell.row.original.DocEntry}/edit`,
//                   {
//                     state: cell.row.original,
//                     replace: true,
//                   }
//                 );
//               }}
//             >
//               <DriveFileRenameOutlineIcon
//                 fontSize="small"
//                 className="text-gray-600 "
//               />{" "}
//               Edit
//             </button>
//           </div>
//         ),
//       },
//     ],
//     [Count, sortBy]
//   );

//   const handlerRefresh = React.useCallback(() => {
//     setFilter("");
//     setSortBy("");
//     setPagination({
//       pageIndex: 0,
//       pageSize: 10,
//     });
//     setTimeout(() => {
//       Count.refetch();
//       refetch();
//     }, 500);
//   }, []);

//   const handlerSortby = (value: any) => {
//     setSortBy(value);
//     setPagination({
//       pageIndex: 0,
//       pageSize: 10,
//     });
//     setTimeout(() => {
//       refetch();
//     }, 500);
//   };

//   let queryFilters = "";
//   const handlerSearch = (value: string) => {
//     if (searchValues.DocumentNumber) {
//       queryFilters += queryFilters
//         ? ` and (contains(DocumentNo, '${searchValues.DocumentNumber}'))`
//         : `(contains(DocumentNo, '${searchValues.DocumentNumber}'))`;
//     }

//     if (searchValues.active) {
//       searchValues.active === "All"
//         ? (queryFilters += queryFilters ? "" : "")
//         : (queryFilters += queryFilters
//             ? ` and Active eq '${searchValues.active}'`
//             : `Active eq '${searchValues.active}'`);
//     }

//     let query = queryFilters;

//     if (value) {
//       query = queryFilters + `and ${value}`;
//     }
//     setFilter(query);
//     setPagination({
//       pageIndex: 0,
//       pageSize: 10,
//     });

//     setTimeout(() => {
//       Count.refetch();
//       refetch();
//     }, 500);
//   };

//   return (
//     <>
//       <div className="w-full h-full px-6 py-2 flex flex-col gap-1 relative bg-white">
//         <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2">
//           <h3 className="text-base 2xl:text-base xl:text-base ">
//             Trip Management / Transportation Order{" "}
//           </h3>
//         </div>
//         <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
//           <div className="col-span-10">
//             <div className="grid grid-cols-12  space-x-4">
//               <div className="col-span-2 2xl:col-span-3">
//                 <MUITextField
//                   type="string"
//                   label="Document Number"
//                   className="bg-white"
//                   autoComplete="off"
//                   value={searchValues.DocumentNumber}
//                   onChange={(e) =>
//                     setSearchValues({
//                       ...searchValues,
//                       DocumentNumber: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="col-span-2 2xl:col-span-3">
//                 <div className="">
//                   <label
//                     htmlFor="Code"
//                     className="text-gray-500 text-[14.1px] mb-[0.5px] inline-block"
//                   >
//                     Status
//                   </label>
//                 </div>
//                 {/* {searchValues.active === null && (
//                   <div>
//                     <MUITextField
//                       label="LastName"
//                       // placeholder="LastName"
//                       className="bg-white"
//                       onChange={(e) =>
//                         setSearchValues({
//                           ...searchValues,
//                           lastName: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 )} */}
//                 <MUISelect
//                   items={[
//                     { value: "All", label: "All" },
//                     { value: "tYES", label: "Initiated" },
//                     { value: "tNO", label: "Inactive" },
//                   ]}
//                   onChange={(e: any) => {
//                     setSearchValues({
//                       ...searchValues,
//                       active: e.target.value,
//                     });
//                   }}
//                   value={
//                     // searchValues.active === null ? "tYES" : searchValues.active
//                     searchValues.active
//                   }
//                   aliasvalue="value"
//                   aliaslabel="label"
//                 />
//               </div>

//               <div className="col-span-2 2xl:col-span-3"></div>
//               {/*  */}

//               <div className="col-span-2 2xl:col-span-3"></div>
//             </div>
//           </div>
//           <div className="col-span-2">
//             <div className="flex justify-end items-center align-center space-x-2 mt-4">
//               <div className="">
//                 <Button
//                   variant="contained"
//                   size="small"
//                   onClick={() => handlerSearch("")}
//                 >
//                   Go
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <DataTable
//           columns={columns}
//           data={data}
//           handlerRefresh={handlerRefresh}
//           handlerSearch={handlerSearch}
//           handlerSortby={handlerSortby}
//           count={Count?.data || 0}
//           loading={isLoading || isFetching}
//           pagination={pagination}
//           paginationChange={setPagination}
//           title="Driver"
//           createRoute="create"
//           // filter={filter}
//         />
//       </div>
//     </>
//   );
// }

import React from "react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MUITextField from "@/components/input/MUITextField";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { conditionString, displayTextDate } from "@/lib/utils";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import MUISelect from "@/components/selectbox/MUISelect";
import request, { url } from "@/utilies/request";
import { useQuery } from "react-query";
import {
  UseTransportationOrderListHook,
  status,
} from "./hook/UseTransportationOrderListHook";
import DataTable from "@/presentations/stock_control/components/DataTable";
// import {displayT}
export default function Lists() {
  const route = useNavigate();
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data,
    loading,
    refetchData,
    setFilter,
    setSort,
    totalRecords,
    exportExcelTemplate,
    state,
    waiting,
  } = UseTransportationOrderListHook(pagination);
  const branchAss: any = useQuery({
    queryKey: ["branchAss"],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/BusinessPlaces?$select=BPLID, BPLName, Address`
      )
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    staleTime: Infinity,
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
        accessorKey: "U_BaseStation",
        header: "Terminal",
        size: 40,
        visible: true,
        type: "number",
      },
      {
        accessorKey: "CreateDate",
        header: "Document Date",
        size: 40,
        visible: true,
        type: "number",
        Cell: ({ cell }: any) => {
          return <span>{displayTextDate(cell?.getValue())}</span>;
        },
      },
      {
        accessorKey: "Status",
        header: "Status",
        size: 60,
        visible: true,
        type: "string",
        Cell: ({ cell }: any) => {
          return <span>{cell?.getValue() === "C" ? "Close" : "Open"}</span>;
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
        header: "Action",
        minSize: 100,
        maxSize: 100,
        visible: true,
        Cell: (cell: any) => (
          <div className="flex space-x-2">
            <Button
              variant="outlined"
              size="small"
              className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
              onClick={() => {
                route(
                  "/trip-management/transportation-order/" + cell.row.original.DocEntry,
                  {
                    state: cell.row.original,
                    replace: true,
                  }
                );
              }}
            >
              <VisibilityIcon fontSize="small" className="text-gray-600 " />{" "}
              <span style={{ textTransform: "none" }}>View</span>
            </Button>
            <Button
              variant="outlined"
              size="small"
              className={` bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded`}
              onClick={() => {
                route(
                  "/trip-management/transportation-order/" +
                    cell.row.original.DocEntry +
                    "/edit",
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
              <span style={{ textTransform: "none" }}> Edit</span>
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className="w-full h-full px-6 py-2 flex flex-col gap-1 relative bg-white">
        <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2">
          <h3 className="text-base 2xl:text-base xl:text-base ">
            Trip Management / Transportation Order
          </h3>
        </div>

        <InventoryTransferFilter
          onFilter={(queries, queryString) => setFilter(queryString)}
        />

        <div className="grow">
          <DataTable
            columns={columns}
            data={data}
            handlerRefresh={refetchData}
            handlerSearch={() => {}}
            handlerSortby={setSort}
            count={totalRecords}
            loading={loading}
            pagination={pagination}
            paginationChange={setPagination}
            title="Transportation Order Lists"
            createRoute={`create`}
          >
            <Button
              size="small"
              variant="text"
              onClick={exportExcelTemplate}
              disabled={false} // Adjust based on the actual loading state
            >
              {loading ? (
                <>
                  <span className="text-xs mr-2">
                    <CircularProgress size={16} />
                  </span>
                  <span className="capitalize text-[13px]">Exporting...</span>
                </>
              ) : (
                <>
                  <span className="text-xs mr-1 text-gray-700">
                    <InsertDriveFileOutlinedIcon
                      style={{ fontSize: "18px", marginBottom: "2px" }}
                    />
                  </span>
                  <span className="capitalize text-xs">Export to CSV</span>
                </>
              )}
            </Button>
          </DataTable>
        </div>
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={waiting}
        // onClick={handleClose}
      >
        <div className="flex flex-col justify-center gap-3 items-center">
          <CircularProgress color="inherit" size={25} />
          <span className="text-sm -mr-2">Waiting for export to CSV ...</span>
        </div>
      </Backdrop>
    </>
  );
}

export interface FilterProps {
  DocNum_$eq_number: undefined | string;
  U_Status_$eq: undefined | string;
  BPL_IDAssignedToInvoice_$eq_number: undefined | number;
}

const defaultValueFilter: FilterProps = {
  DocNum_$eq_number: undefined,
  U_Status_$eq: undefined,
  BPL_IDAssignedToInvoice_$eq_number: undefined,
};

export const InventoryTransferFilter = ({
  onFilter,
}: {
  onFilter?: (values: (string | undefined)[], query: string) => any;
}) => {
  const { handleSubmit, setValue, control, watch } = useForm({
    defaultValues: defaultValueFilter,
  });

  function onSubmit(data: any) {
    const queryString: (string | undefined)[] = [];
    for (const [key, value] of Object.entries(data)) {
      if (!value) continue;

      queryString.push("and");
      queryString.push(conditionString(key, value as any));
    }

    queryString.splice(0, 1);
    const query = queryString.join(" ");

    if (onFilter) onFilter(queryString, query);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white "
    >
      <div className="col-span-10">
        <div className="grid grid-cols-12  space-x-4">
          <div className="col-span-2 2xl:col-span-3">
            <Controller
              name="DocNum_$eq_number"
              control={control}
              render={({ field }) => {
                return (
                  <MUITextField
                    label="Document Number"
                    placeholder="Document Number"
                    className="bg-white"
                    onBlur={(e) =>
                      setValue("DocNum_$eq_number", e.target.value)
                    }
                  />
                );
              }}
            />
          </div>

          <div className="col-span-2 2xl:col-span-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 mt-0 text-[14px]">
                Status
              </label>
              <div className="">
                <Controller
                  name="U_Status_$eq"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        items={[
                          { label: "Initiated", value: "I" },
                          { label: "Planned", value: "P" },
                          { label: "Seal Number", value: "S" },
                          { label: "Dispatched", value: "D" },
                          { label: "Released", value: "R" },
                          { label: "Completed", value: "CP" },
                          { label: "Cancelled", value: "C" },
                        ]}
                        onChange={(e: any) => {
                          setValue("U_Status_$eq", e?.target?.value);
                        }}
                        value={field?.value || null}
                        aliasvalue="value"
                        aliaslabel="name"
                      />
                      // <MUIDatePicker
                      //   {...field}
                      //   onChange={(e: any) => {
                      //     setValue("DocDate_$eq", e);
                      //   }}
                      //   value={field.value}
                      // />
                    );
                  }}
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
            <Button variant="contained" size="small" type="submit">
              {" "}
              Go{" "}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
