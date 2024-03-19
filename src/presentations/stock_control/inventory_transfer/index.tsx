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
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { useInventoryTransferListHook } from "./hook/useInventoryTransferListHook";

export default function InventoryTransferList() {

  const navigate = useNavigate();
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, loading, refetchData, setFilter, setSort, totalRecords, exportExcelTemplate, state } = useInventoryTransferListHook(pagination)

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "DocEntry",
        header: "No", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        Cell: (cell: any, index: number) => {
          return (
            <span>{cell?.row?.index + 1}</span>
          );
        },
      },
      {
        accessorKey: "DocNum",
        header: "Document No", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
      },
      {
        accessorKey: "FromWarehouse",
        header: "From Warehouese", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.FromWarehouse;
        },
      },

      {
        accessorKey: "ToWarehouse",
        header: "To Warehouse", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
        visible: true,
        type: "string",
        Cell: (cell: any) => {
          return cell.row.original.ToWarehouse;
        },
      },

      {
        accessorKey: "DocumentStatus",
        header: "Status",
        size: 40,
        visible: true,
        Cell: (cell: any) => {
          return cell.row.original.DocumentStatus === "bost_Open"
            ? "Open"
            : "Closed";
        },
      },
      {
        accessorKey: "DocEntry",
        minSize: 100,
        maxSize: 100,
        header: "Action",
        visible: true,
        Cell: (cell: any) => (
          <div className="flex space-x-2">
            <button
              className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
              onClick={() => {
                navigate(
                  "/stock-control/stock-transfer/" +
                  cell.row.original.DocEntry,
                  {
                    state: cell.row.original,
                    replace: true,
                  }
                );
              }}
            >
              <VisibilityIcon fontSize="small" className="text-gray-600 " />
            </button>
            <button
              className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
              onClick={() => {
                navigate(
                  `/stock-control/stock-transfer/${cell.row.original.DocEntry}/edit`,
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

  return (
    <>
      <div className="w-full h-full px-6 py-2 flex flex-col gap-1 relative bg-white">
        <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2">
          <h3 className="text-base 2xl:text-base xl:text-base ">
            Stock Control / Inventory Transfer
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
            title="Inventory Transfer Lists"
            createRoute={`/stock-control/stock-transfer/create`}
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
  DocNum_$eq_number: undefined | string,
  FromWarehouse_$eq: undefined | string,
  ToWarehouse_$eq: undefined | string,
  DocumentStatus_$eq: undefined | string,
}

const defaultValueFilter: FilterProps = {
  DocNum_$eq_number: undefined,
  FromWarehouse_$eq: undefined,
  ToWarehouse_$eq: undefined,
  DocumentStatus_$eq: '',
}

export const InventoryTransferFilter = ({ onFilter }: { onFilter?: (values: (string | undefined)[], query: string) => any }) => {
  const {
    handleSubmit,
    setValue,
    control,
    watch
  } = useForm({
    defaultValues: defaultValueFilter
  });


  function onSubmit(data: any) {
    const queryString: (string | undefined)[] = [];
    for (const [key, value] of Object.entries(data)) {
      if (!value) continue;

      queryString.push('and');
      queryString.push(conditionString(key, value as any))
    }

    queryString.splice(0, 1);
    const query = queryString.join(' ');

    if (onFilter) onFilter(queryString, query);
  }


  return <form
    onSubmit={handleSubmit(onSubmit)}
    className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
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
                  onBlur={(e) => setValue('DocNum_$eq_number', e.target.value)}
                />
              );
            }}
          />

        </div>

        <div className="col-span-2 2xl:col-span-3">
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              From Warehouses
            </label>
            <div className="">
              <Controller
                name="FromWarehouse_$eq"
                control={control}
                render={({ field }) => {
                  return (
                    <ToWarehouseAutoComplete onChange={(e: any) => {
                      setValue('FromWarehouse_$eq', e?.WarehouseCode)
                    }} />
                  );
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-span-2 2xl:col-span-3">
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              To Warehouse
            </label>
            <div className="">
              <Controller
                name="ToWarehouse_$eq"
                control={control}
                render={({ field }) => {
                  return (
                    <ToWarehouseAutoComplete onChange={(e: any) => {
                      setValue('ToWarehouse_$eq', e?.WarehouseCode)
                    }} />
                  );
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-span-2 2xl:col-span-3">
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Status
            </label>
            <div className="">

              <Controller
                name="DocumentStatus_$eq"
                control={control}
                render={({ field }) => {
                  return (
                    <MUISelect
                      items={[
                        { id: "", name: "All" },
                        { id: "bost_Open", name: "Open" },
                        { id: "bost_Close", name: "Closed" },
                      ]}
                      onChange={(e) => setValue('DocumentStatus_$eq', e?.target?.value as string,)}
                      value={watch('DocumentStatus_$eq')} // Set default value to "All"
                      aliasvalue="id"
                      aliaslabel="name"
                      name="U_Status"
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
          <Button variant="contained" size="small" type="submit" > Go </Button>
        </div>
      </div>
    </div>
  </form>
}
