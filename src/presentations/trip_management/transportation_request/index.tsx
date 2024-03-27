import React from "react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MUITextField from "@/components/input/MUITextField";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { conditionString, displayTextDate } from "@/lib/utils";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { UseTransportationRequestListHook } from "./hook/UseTransportationRequestListHook";
import DataTable from "@/presentations/stock_control/components/DataTable";
import MUISelect from "@/components/selectbox/MUISelect";
import request, { url } from "@/utilies/request";
import { useQuery } from "react-query";
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
    waiting,
  } = UseTransportationRequestListHook(pagination);

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
  const emp: any = useQuery({
    queryKey: ["S_P"],
    queryFn: async () => {
      const response: any = await request("GET", `${url}/SalesPersons`)
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e?.message);
        });
      return response;
    },
    staleTime: Infinity,
  });

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "DocNum",
        header: "No.", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        Cell: (cell: any) => {
          return cell.row.index + 1;
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
        accessorKey: "U_Requester",
        header: "Requester",
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          const requester = emp?.data?.find(
            (e: any) =>
              e?.SalesEmployeeCode === cell?.row?.original?.U_Requester
          );
          const fullName = requester ? `${requester?.SalesEmployeeName}` : "-";
          return fullName;
        },
      },

      {
        accessorKey: "U_RequestDate",
        header: "Request Date",
        size: 40,
        visible: true,
        Cell: ({ cell }: any) => {
          return <span>{displayTextDate(cell?.getValue())}</span>;
        },
      },
      {
        accessorKey: "U_Status",
        header: "Status",
        size: 60,
        visible: true,
        type: "string",
        Cell: ({ cell }: any) => (
          <span
            className={`${cell.getValue() === "O" ? "text-green-500" : "text-red-500"}`}
          >
            {cell.getValue() === "O" ? "Open" : "Close"}
          </span>
        ),
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
                  "/trip-management/transportation-request/" +
                    cell.row.original.DocEntry,
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
                  "/trip-management/transportation-request/" +
                    cell.row.original.DocEntry +
                    `/edit?status=${cell.row.original?.U_Status}`,
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
    [branchAss, emp, data]
  );

  return (
    <>
      <div className="w-full h-full px-6 py-2 flex flex-col gap-1 relative bg-white">
        <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2">
          <h3 className="text-base 2xl:text-base xl:text-base ">
            Trip Management / Transportation Request
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
            title="Transportation Request Lists"
            createRoute={`create`}
          >
            <Button
              size="small"
              variant="text"
              onClick={exportExcelTemplate}
              disabled={false}
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
                          { value: "O", name: "Open" },
                          { value: "C", name: "Close" },
                          { value: null, name: "All" },
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
