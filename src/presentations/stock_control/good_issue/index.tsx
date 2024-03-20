import React from "react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MUITextField from "@/components/input/MUITextField";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { conditionString, displayTextDate } from "@/lib/utils";
import DataTable from "../components/DataTable";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import moment from "moment";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BranchAssignmentAuto from "@/components/input/BranchAssignment";
import { UseGoodIssueListHook } from "./hook/UseGoodIssueListHook";
import GetBranchAutoComplete from "../components/GetBranchAutoComplete";
// import {displayT}
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
    waiting,
  } = UseGoodIssueListHook(pagination);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "DocNum",
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
        accessorKey: "BPLName",
        header: "Branch",
        enableClickToCopy: true,
        visible: true,
        size: 88,
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
        Cell: ({ cell }: any) => {
          return <span>{displayTextDate(cell?.getValue())}</span>;
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
        Cell: ({ cell }: any) => <>{cell.getValue()?.toFixed(2)}</>,
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
              className={` bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded`}
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
            handlerSearch={() => { }}
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
              disabled={loading} // Adjust based on the actual loading state
            >
              {waiting ? (
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
      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={waiting}
        // onClick={handleClose}
      >
        <div className="flex flex-col justify-center gap-3 items-center">
          <CircularProgress color="inherit" size={25} />
          <span className="text-sm -mr-2">Waiting for export to CSV ...</span>
        </div>
      </Backdrop> */}
    </>
  );
}

export interface FilterProps {
  DocNum_$eq_number: undefined | string;
  DocDate_$eq: undefined | string;
  BPL_IDAssignedToInvoice_$eq_number: undefined | number;
}

const defaultValueFilter: FilterProps = {
  DocNum_$eq_number: undefined,
  DocDate_$eq: undefined,
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
                Posting Date
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
                  name="BPL_IDAssignedToInvoice_$eq_number"
                  control={control}
                  render={({ field }) => {
                    return (
                      <GetBranchAutoComplete
                        onChange={(e: any) => {
                    
                          setValue(
                            "BPL_IDAssignedToInvoice_$eq_number",
                            e?.BPLID
                          );
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
