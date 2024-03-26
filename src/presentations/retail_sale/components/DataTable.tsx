import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { HiRefresh } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import MaterialReactTable from "material-react-table";
import { BsPencilSquare, BsSortDown } from "react-icons/bs";
import MenuCompoment from "@/components/data_table/MenuComponent";
import ColumnSearch from "@/components/data_table/ColumnSearch";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import Papa from "papaparse";
import { useQuery } from "react-query";
import request from "@/utilies/request";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";

interface DataTableProps {
  columns: any[];
  data: any[];
  count: number;
  handlerRefresh: () => void;
  loading: boolean;
  handlerSortby: (value: string) => void;
  handlerSearch: (value: string) => void;
  pagination: any;
  paginationChange: (value: any) => void;
  title?: string;
  createRoute?: string;
  dataUrl: string;
  havePump?: boolean;
}

export default function DataTable(props: DataTableProps) {
  const route = useNavigate();
  const search = React.createRef<ColumnSearch>();
  const [colVisibility, setColVisibility] = React.useState<
    Record<string, boolean>
  >({});

  React.useEffect(() => {
    const cols: any = {};
    props.columns.forEach((e) => {
      cols[e.accessorKey] = e?.visible ?? true;
    });
    setColVisibility(cols);
  }, []);

  const handlerSearch = (queries: any) => {
    if (queries === "") return;
    props.handlerSearch("&$filter=" + queries);
  };
  const [exportButtonClicked, setExportButtonClicked] = useState(false);

  const fetchDataForExport = async () => {
    setExportButtonClicked(true); // To trigger refetch
  };

  // Adjust the useQuery hook to automatically refetch when exportButtonClicked changes
  const {
    data: dataCSV,
    isLoading,
    refetch,
  } = useQuery(
    ["export-to-csv", props.dataUrl, exportButtonClicked],
    async () => {
      const response = await request("GET", props.dataUrl)
        .then((res) => res?.data?.value)
        .catch((e) => {
          throw new Error(e.message);
        });
      setExportButtonClicked(false); // Reset the trigger
      return response;
    },
    {
      enabled: exportButtonClicked, // This ensures the query does not automatically run
      onSettled: (data) => {
        if (data && data.length > 0) {
          // Directly call to convert and download CSV
          convertToCSVAndDownload(data);
        }
      },
    }
  );

  const convertToCSV = (data: any[]) => {
    // Specify the desired field names
    const fields = [
      "Document Number",
      "Card Code",
      "Card Name",
      "Branch",
      ...(props.havePump ? ["Pump Code"] : []),
      "Document Status",
      "Document Date",
    ];

    // Map the data to the desired field names
    const mappedData = data?.map((row) => ({
      "Document Number": row.DocNum,
      "Card Code": row.U_tl_cardcode,
      "Card Name": row.U_tl_cardname,
      Branch: new BranchBPLRepository().find(row.U_tl_bplid)?.BPLName,
      ...(props.havePump ? { "Pump Code": row.U_tl_pump } : {}),
      "Document Status": row?.U_tl_status,
      "Document Date": row?.U_tl_docdate?.slice(0, 10),
    }));
    const csvContent = Papa.unparse(
      {
        fields,
        data: mappedData,
      },
      {
        delimiter: ",", // Specify the delimiter
        header: true, // Include headers in the CSV
      }
    );

    return csvContent;
  };

  const convertToCSVAndDownload = (data: any) => {
    const csvContent = convertToCSV(data);
    const bom = "\ufeff";
    const csvContentWithBom = bom + csvContent;
    const blob = new Blob([csvContentWithBom], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "exported_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={` rounded-lg shadow-sm  p-4 flex flex-col gap-3 bg-white border`}
    >
      <div className="flex justify-between">
        <div className="flex gap-4 items-center justify-center">
          <h3 className="text-base">{props.title}</h3>
        </div>
        <div className="flex justify-end gap-2 items-center text-[13px]">
          <Button
            size="small"
            variant="text"
            onClick={() => route(props?.createRoute)}
          >
            <span className="text-lg mr-1 text-gray-700">
              <BsPencilSquare />
            </span>
            <span className="capitalize text-xs">Create</span>
          </Button>
          <Button size="small" variant="text" onClick={props.handlerRefresh}>
            <span className="text-lg mr-1 text-gray-700">
              <HiRefresh />
            </span>
            <span className="capitalize text-xs ">Refresh</span>
          </Button>

          <MenuCompoment
            title={
              <div className="flex gap-1">
                <span className="text-lg text-gray-700">
                  <BsSortDown />
                </span>{" "}
                <span className="text-xs capitalize">Sort </span>
              </div>
            }
            items={props.columns}
            onClick={props.handlerSortby}
          />

          <Button
            size="small"
            variant="text"
            onClick={fetchDataForExport}
            disabled={isLoading || exportButtonClicked} // Adjust based on the actual loading state
          >
            {isLoading || exportButtonClicked ? (
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
        </div>
      </div>

      <div className="grow data-grid border-t bg-inherit ">
        <MaterialReactTable
          columns={props.columns}
          data={props.data ?? []}
          enableHiding={false}
          initialState={{
            density: "compact",
            columnVisibility: colVisibility,
          }}
          enableDensityToggle={true}
          // enableColumnResizing

          enableFullScreenToggle={false}
          enableStickyHeader={false}
          enableStickyFooter={false}
          enablePagination={true}
          enableColumnFilters={false}
          manualPagination={true}
          enableColumnActions={false}
          enableSorting={false}
          muiTablePaginationProps={{
            rowsPerPageOptions: [5, 10, 15],
          }}
          enableFilters={false}
          enableGlobalFilter={false}
          rowCount={props.count ?? 0}
          getRowId={(row: any) => row.DocEntry}
          onPaginationChange={props.paginationChange}
          state={{
            isLoading: props.loading,
            pagination: props.pagination,
            columnVisibility: colVisibility,
          }}
          enableColumnVirtualization={false}
          onColumnVisibilityChange={setColVisibility}
          muiTableProps={() => ({
            sx: {
              "& .MuiTableHead-root .MuiTableCell-root": {
                backgroundColor: "#e4e4e7",
                fontWeight: "500",
                paddingTop: "8px",
                paddingBottom: "8px",
              },
              border: "1px solid #d1d5db",
            },
          })}
        />

        <ColumnSearch ref={search} onOk={handlerSearch} />
      </div>
    </div>
  );
}
