import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "../components/DataTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { Button, CircularProgress } from "@mui/material";
import { Breadcrumb } from "../components/Breadcrumn";
import moment from "moment";
import { useFuelLevelListHook } from "./hook/useFuelLevelListHook";
import FuelLevelHeaderFilter from "./components/FuelLevelHeaderFilter";
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { useGetBranchesAssignHook } from "@/hook/useGetBranchesAssignHook";

export default function List() {
  const route = useNavigate();

  const branches = useGetBranchesAssignHook();


  const columns = React.useMemo(
    () => [
      {
        accessorKey: "CreateDate",
        header: "No.", //uses the default width from defaultColumn prop
        size: 20,
        Cell: (cell: any) => cell.row.index + 1,
      },
      {
        accessorKey: "DocNum",
        header: "Document No", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        visible: true,
        type: "number",
      },
      {
        accessorKey: "U_tl_bplid",
        header: "Branch", //uses the default width from defaultColumn prop
        visible: true,
        Cell: (cell: any) => {
          if (branches.isLoading) return '';

          return branches.data?.find((e: any) => e?.BPLID === cell?.row?.original?.U_tl_bplid)?.BPLName
        },
      },
      {
        accessorKey: "U_tl_doc_date",
        header: "Document Date",
        Cell: (cell: any) => {
          if (!cell.row.original.U_tl_doc_date) return '';

          return moment(cell.row.original.U_tl_doc_date).format(
            "DD.MMMM.YYYY"
          )
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
            <Button
              variant="outlined"
              size="small"
              className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
              onClick={() => {
                route(`/stock-control/fuel-level/` + cell.row.original.DocEntry);
              }}
            >
              <VisibilityIcon fontSize="small" className="text-gray-600 " />{" "}
              <span style={{ textTransform: "none" }}>View</span>
            </Button>
            <Button
              variant="outlined"
              size="small"
              disabled={cell.row.original.U_tl_status === "Close" ?? false}
              className={`${cell.row.original.U_tl_status === "Close" ? "bg-gray-400" : ""
                } bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded`}
              onClick={() => {
                route(`/stock-control/fuel-level` + cell.row.original.DocEntry + "/edit");
              }}
            >
              <DriveFileRenameOutlineIcon
                fontSize="small"
                className="text-gray-600 "
              />
              <span style={{ textTransform: "none" }}> Edit</span>
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });


  const { data, loading, totalRecords, state, setFilter, setSort, exportExcelTemplate, refetchData, exporting } = useFuelLevelListHook(pagination);


  const onSubmitFilter = (queries: (string | undefined)[], query: string) => {
    setFilter(query)
  }


  const childBreadcrum = (
    <>
      <span className="" onClick={() => route(`/stock-control/fuel-level`)}>
        <span className=""></span> Fuel Level Test
      </span>
    </>
  );

  return (
    <>
      <div className="w-full h-full px-4 py-2 flex flex-col gap-1 relative bg-white ">
        <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2 bg-white">
          <Breadcrumb childBreadcrum={childBreadcrum} />
        </div>

        <FuelLevelHeaderFilter queryParams={state} onFilter={onSubmitFilter} />
        {/* */}
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
          title="Fuel Level Lists"
          createRoute={`/stock-control/fuel-level/create`}
        >
          <Button
            size="small"
            variant="text"
            onClick={exportExcelTemplate}
            disabled={loading} // Adjust based on the actual loading state
          >
            {exporting ? (
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
    </>
  );
}
