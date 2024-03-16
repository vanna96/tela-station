// import request, { url } from "@/utilies/request";
// import React from "react";
// import { useQuery } from "react-query";
// import { useNavigate, useParams } from "react-router-dom";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
// import MUITextField from "@/components/input/MUITextField";
// import BPAutoComplete from "@/components/input/BPAutoComplete";
// import {
//   Button,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
// } from "@mui/material";
// import { BiFilterAlt } from "react-icons/bi";
// import DataTableColumnFilter from "@/components/data_table/DataTableColumnFilter";
// import moment from "moment";
// import MUISelect from "@/components/selectbox/MUISelect";
// import { Breadcrumb } from "../components/Breadcrumn";
// import MUIDatePicker from "@/components/input/MUIDatePicker";
// import BranchBPLRepository from "@/services/actions/branchBPLRepository";
// import BPLBranchSelect from "@/components/selectbox/BranchBPL";
// import { useCookies } from "react-cookie";
// import BranchAutoComplete from "@/components/input/BranchAutoComplete";
// import DataTable from "./components/DataTableGI";
// import BranchAssignmentAuto from "@/components/input/BranchAssignment";
// import { log } from "util";

// export default function GoodIssueList() {
//    const [searchValues, setSearchValues] = React.useState({
//      docnum: "",
//      deliveryDate: "",
//      branch:""
//    });
//   const [open, setOpen] = React.useState<boolean>(false);
//   const route = useNavigate();
//   const salesTypes = useParams();
//   const salesType = salesTypes["*"];

//   const columns = React.useMemo(
//     () => [
//       {
//         accessorKey: "No",
//         header: "No.", //uses the default width from defaultColumn prop
//         size: 40,
//         visible: true,
//         type: "number",
//         Cell: (cell: any) => {
//           return <span>{cell?.row?.id}</span>;
//         },
//       },
//       {
//         accessorKey: "DocNum",
//         header: "Document No", //uses the default width from defaultColumn prop
//         enableClickToCopy: true,
//         enableFilterMatchHighlighting: true,
//         visible: true,
//         type: "number",
//         size: 88,
//       },
//       {
//         accessorKey: "BPL_IDAssignedToInvoice",
//         header: "Branch",
//         enableClickToCopy: true,
//         visible: true,
//         size: 88,

//         Cell: ({ cell }: any) =>
//           new BranchBPLRepository().find(cell.getValue())?.BPLName,
//       },
//       {
//         accessorKey: "U_tl_whsdesc",
//         header: "Warehouse", //uses the default width from defaultColumn prop
//         enableClickToCopy: true,
//         enableFilterMatchHighlighting: true,
//         visible: true,
//         size: 88,

//         type: "number",
//       },
//       {
//         accessorKey: "TaxDate",
//         header: "Posting Date",
//         visible: true,
//         type: "string",
//         align: "center",
//         size: 88,
//         Cell: (cell: any) => {
//           const formattedDate = moment(cell.value).format("YY.MM.DD");
//           return <span>{formattedDate}</span>;
//         },
//       },
//       {
//         accessorKey: "DocumentStatus",
//         header: " Status",
//         visible: true,
//         type: "string",
//         size: 88,

//         Cell: ({ cell }: any) => <>{cell.getValue()?.split("bost_")}</>,
//       },
//       {
//         accessorKey: "DocTotal",
//         header: "Total Qty",
//         visible: true,
//         type: "string",
//         align: "center",
//         size: 88,
//         // Cell: (cell: any) => {
//         //   const formattedDate = moment(cell.value).format("YY.MM.DD");
//         //   return <span>{formattedDate}</span>;
//         // },
//       },
//       {
//         accessorKey: "DocEntry",
//         enableFilterMatchHighlighting: false,
//         enableColumnFilterModes: false,
//         enableColumnActions: false,
//         enableColumnFilters: false,
//         enableColumnOrdering: false,
//         enableSorting: false,
//         header: "Action",
//         minSize: 100,
//         maxSize: 100,
//         visible: true,
//         Cell: (cell: any) => (
//           <div className="flex space-x-2">
//             <Button
//               variant="outlined"
//               size="small"
//               className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
//               onClick={() => {
//                 // route(
//                 //   `/stock-control/${salesType}/` + cell.row.original.DocEntry,
//                 //   {
//                 //     state: cell.row.original,
//                 //     replace: true,
//                 //   }
//                 // );
//                  route(
//                    "/stock-control/good-issue/" + cell.row.original.DocEntry,
//                    {
//                      state: cell.row.original,
//                      replace: true,
//                    }
//                  );
//               }}
//             >
//               <VisibilityIcon fontSize="small" className="text-gray-600 " />{" "}
//               <span style={{ textTransform: "none" }}>View</span>
//             </Button>
//             <Button
//               variant="outlined"
//               size="small"
//               disabled={
//                 cell.row.original.DocumentStatus === "bost_Close" ?? false
//               }
//               className={`${
//                 cell.row.original.DocumentStatus === "bost_Close"
//                   ? "bg-gray-400"
//                   : ""
//               } bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded`}
//               onClick={() => {
//                 route(
//                   "/stock-control/good-issue/" + cell.row.original.DocEntry + "/edit",
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
//               <span style={{ textTransform: "none" }}> Edit</span>
//             </Button>
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   const [filter, setFilter] = React.useState("");
//   const [sortBy, setSortBy] = React.useState("");
//   const [pagination, setPagination] = React.useState({
//     pageIndex: 0,
//     pageSize: 10,
//   });

//  const Count: any = useQuery({
//    queryKey: [`good-issue-count`, `${filter !== "" ? "f" : ""}`],
//    queryFn: async () => {
//      const response: any = await request(
//        "GET",
//        `${url}/InventoryGenExits/$count?${filter ? `$filter=${filter}` : ""}`
//      )
//        .then(async (res: any) => {
//         //  console.log(res);
//          return res?.data
//        })
//        .catch((e: Error) => {
//          throw new Error(e.message);
//        });

//      return response;
//    },
//    cacheTime: 0,
//    staleTime: 0,
//  });

//  const { data, isLoading, refetch, isFetching }: any = useQuery({
//    queryKey: [
//      "good-issue",
//      `${pagination.pageIndex * pagination.pageSize}_${
//        filter !== "" ? "f" : ""
//      }`,
//      pagination.pageSize,
//    ],
//    queryFn: async () => {
//      const Url = `${url}/InventoryGenExits?$top=${pagination.pageSize}&$skip=${
//        pagination.pageIndex * pagination.pageSize
//      }${filter ? `&$filter=${filter}` : filter}${
//        sortBy !== "" ? "&$orderby=" + sortBy : ""
//      }`;

//      const response: any = await request("GET", `${Url}`)
//        .then((res: any) => res?.data?.value)
//        .catch((e: Error) => {
//          throw new Error(e.message);
//        });
//      return response;
//    },
//    cacheTime: 0,
//    staleTime: 0,
//    refetchOnWindowFocus: false,
//  });
//  const handlerSortby = (value: any) => {
//    setSortBy(value);
//    setPagination({
//      pageIndex: 0,
//      pageSize: 10,
//    });

//    setTimeout(() => {
//      refetch();
//    }, 500);
//  };

//  const handlerRefresh = React.useCallback(() => {
//    setFilter("");
//    setSortBy("");
//    setPagination({
//      pageIndex: 0,
//      pageSize: 10,
//    });
//    setTimeout(() => {
//      Count.refetch();
//      refetch();
//    }, 500);
//  }, []);

//  let queryFilters = "";
//  const handlerSearch = (value: string) => {
//    if (searchValues.docnum) {
//      queryFilters += queryFilters
//        ? ` and (contains(DocNum, '${searchValues.docnum}'))`
//        : `(contains(DocNum, '${searchValues.docnum}'))`;
//    }

//    if (searchValues.deliveryDate) {
//      queryFilters += queryFilters
//        ? ` and (contains(DocDate, '${searchValues.deliveryDate}'))`
//        : `(contains(DocDate, '${searchValues.deliveryDate}'))`;
//    }
//    if (searchValues.branch) {
//      queryFilters += queryFilters
//        ? ` and BPL_IDAssignedToInvoice eq ${searchValues.branch}`
//        : `BPL_IDAssignedToInvoice eq ${searchValues.branch}`;
//    }
//    let query = queryFilters;

//    if (value) {
//      query = queryFilters + `and ${value}`;
//    }
//    setFilter(query);
//    setPagination({
//      pageIndex: 0,
//      pageSize: 10,
//    });

//    setTimeout(() => {
//      Count.refetch();
//      refetch();
//    }, 500);
//  };

//   function capitalizeHyphenatedWords(str: any) {
//     return str
//       .split("-")
//       .map((word: any) => {
//         if (word.toLowerCase() === "lpg") {
//           return word.toUpperCase();
//         } else {
//           return word.charAt(0).toUpperCase() + word.slice(1);
//         }
//       })
//       .join(" ");
//   }

//   const childBreadcrum = (
//     <>
//       <span className="" onClick={() => route(`/stock-control/${salesType}`)}>
//         <span className=""></span> {capitalizeHyphenatedWords(salesType)}
//       </span>
//     </>
//   );

//   return (
//     <>
//       <div className="w-full h-full px-4 py-2 flex flex-col gap-1 relative bg-white ">
//         <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2 bg-white">
//           <Breadcrumb childBreadcrum={childBreadcrum} />
//         </div>

//         <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
//           <div className="col-span-10">
//             <div className="grid grid-cols-12  space-x-4">
//               <div className="col-span-2 2xl:col-span-3">
//                 <MUITextField
//                   label="Document No."
//                   placeholder=""
//                   className="bg-white"
//                   autoComplete="off"
//                   type="number"
//                   value={searchValues.docnum}
//                   onChange={(e) =>
//                     setSearchValues({ ...searchValues, docnum: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="col-span-2 2xl:col-span-3 -mt-[2px]">
//                 <MUIDatePicker
//                   label="Delivery Date"
//                   value={searchValues.deliveryDate}
//                   placeholder=""
//                   // onChange={(e: any) => handlerChange("PostingDate", e)}
//                   onChange={(e: any) => {
//                     setSearchValues({
//                       ...searchValues,
//                       deliveryDate: e,
//                     });
//                   }}
//                 />
//               </div>
//               <div className="col-span-2 2xl:col-span-3">
//                 <div className="flex flex-col gap-1 text-sm">
//                   <label htmlFor="Code" className="text-gray-500 text-[14px]">
//                     Branch
//                   </label>
//                   <div className="">
//                     <BranchAssignmentAuto
//                     // BPdata={cookies?.user?.UserBranchAssignment}
//                       onChange={(e) => {
//                           setSearchValues({
//                             ...searchValues,
//                             branch: e?.BPLID,
//                           });
//                       }

//                     }
//                     value={searchValues.branch}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* <div className="col-span-2 2xl:col-span-3">
//                 <div className="flex flex-col gap-1 text-sm">
//                   <label htmlFor="Code" className="text-gray-500 text-[14px]">
//                     Status
//                   </label>
//                   <div className="">
//                     <MUISelect
//                       items={[
//                         { label: "None", value: "" },
//                         { label: "Open", value: "bost_Open" },
//                         { label: "Close", value: "bost_Close" },
//                       ]}
//                       onChange={(e) => {
//                         if (e) {
//                           setSearchValues({
//                             ...searchValues,
//                             status: e.target.value as string,
//                           });
//                         }
//                       }}
//                       value={searchValues.status}
//                     />
//                   </div>
//                 </div>
//               </div> */}
//             </div>
//           </div>
//           <div className="col-span-2">
//             <div className="flex justify-end items-center align-center space-x-2 mt-4">
//               <div className="">
//                 <Button
//                   variant="contained"
//                   size="small"
//                   onClick={()=>handlerSearch("")}
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
//           title="Good Issue "
//           createRoute={`/stock-control/${salesType}/create`}
//           filter={filter}
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
import { Button, CircularProgress } from "@mui/material";
import MUISelect from "@/components/selectbox/MUISelect";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import ToWarehouseAutoComplete from "../inventory_transfer_request/components/ToWarehouseAutoComplete";
import { Controller, useForm } from "react-hook-form";
import { conditionString } from "@/lib/utils";
import DataTable from "../components/DataTable";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import moment from "moment";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BranchAssignmentAuto from "@/components/input/BranchAssignment";
import { UseGoodIssueListHook } from "./hook/UseGoodIssueListHook";

export default function InventoryTransferList() {
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
  } = UseGoodIssueListHook(pagination);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "No",
        header: "No.", //uses the default width from defaultColumn prop
        size: 40,
        visible: true,
        type: "number",
        Cell: (cell: any) => {
          return <span>{cell?.row?.id}</span>;
        },
      },
      {
        accessorKey: "DocNum",
        header: "Document No", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        visible: true,
        type: "number",
        size: 88,
      },
      {
        accessorKey: "BPL_IDAssignedToInvoice",
        header: "Branch",
        enableClickToCopy: true,
        visible: true,
        size: 88,

        Cell: ({ cell }: any) =>
          new BranchBPLRepository().find(cell.getValue())?.BPLName,
      },
      {
        accessorKey: "U_tl_whsdesc",
        header: "Warehouse", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        visible: true,
        size: 88,

        type: "number",
      },
      {
        accessorKey: "TaxDate",
        header: "Posting Date",
        visible: true,
        type: "string",
        align: "center",
        size: 88,
        Cell: (cell: any) => {
          const formattedDate = moment(cell.value).format("YY.MM.DD");
          return <span>{formattedDate}</span>;
        },
      },
      {
        accessorKey: "DocumentStatus",
        header: " Status",
        visible: true,
        type: "string",
        size: 88,

        Cell: ({ cell }: any) => <>{cell.getValue()?.split("bost_")}</>,
      },
      {
        accessorKey: "DocTotal",
        header: "Total Qty",
        visible: true,
        type: "string",
        align: "center",
        size: 88,
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
                // route(
                //   `/stock-control/${salesType}/` + cell.row.original.DocEntry,
                //   {
                //     state: cell.row.original,
                //     replace: true,
                //   }
                // );
                route(
                  "/stock-control/good-issue/" + cell.row.original.DocEntry,
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
              disabled={
                cell.row.original.DocumentStatus === "bost_Close" ?? false
              }
              className={`${
                cell.row.original.DocumentStatus === "bost_Close"
                  ? "bg-gray-400"
                  : ""
              } bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded`}
              onClick={() => {
                route(
                  "/stock-control/good-issue/" +
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
            Stock Control / Goods Issue
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
            title="Goods Issue Lists"
            createRoute={`/stock-control/good-issue/create`}
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
    </>
  );
}

export interface FilterProps {
  DocNum_$eq_number: undefined | string;
  DocDate_$eq: undefined | string;
  BPL_IDAssignedToInvoice_$eq: undefined | number;
}

const defaultValueFilter: FilterProps = {
  DocNum_$eq_number: undefined,
  DocDate_$eq: undefined,
  BPL_IDAssignedToInvoice_$eq: undefined,
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
                    label="Document No."
                    placeholder="Document No."
                    className="bg-white"
                    autoComplete="off"
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
              <label htmlFor="Code" className="text-gray-500 -mt-1 text-[14px]">
                Delivery Date
              </label>
              <div className="">
                <Controller
                  name="DocDate_$eq"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        {...field}
                        onChange={(e: any) => {
                          setValue("DocDate_$eq", e);
                        }}
                        value={field.value}
                      />
                    );
                  }}
                />
              </div>
            </div>
          </div>

          <div className="col-span-2 2xl:col-span-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Branch
              </label>
              <div className="">
                <Controller
                  name="BPL_IDAssignedToInvoice_$eq"
                  control={control}
                  render={({ field }) => {
                    return (
                      <BranchAssignmentAuto
                        onChange={(e: any) => {
                          setValue("BPL_IDAssignedToInvoice_$eq", e?.BPLID);
                        }}
                        // value={searchValues.branch}
                      />
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
