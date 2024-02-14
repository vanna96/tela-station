import React, { useState } from "react";
import { Button } from "@mui/material";
import { HiRefresh } from "react-icons/hi";
import { BiFilterAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { AiOutlineSetting } from "react-icons/ai";
import MaterialReactTable from "material-react-table";
import { BsPencilSquare, BsSortDown } from "react-icons/bs";
import MenuCompoment from "@/components/data_table/MenuComponent";
import ColumnSearch from "@/components/data_table/ColumnSearch";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import Papa from "papaparse";
import { useQuery } from "react-query";
import request from "@/utilies/request";

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

  const {
    data: dataCSV,
    isLoading,
    refetch,
    isFetching,
  }: any = useQuery({
    queryKey: ["export-to-csv", props.dataUrl, exportButtonClicked],
    enabled: exportButtonClicked,
    queryFn: async () => {
      const response: any = await request("GET", props.dataUrl)
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
  });
  const handleExportToCSV = async () => {
    // Trigger refetching the data
    await refetch();

    // Check if data is available
    if (dataCSV && dataCSV.length > 0) {
      const csvContent = convertToCSV(dataCSV);

      // Prepend the UTF-8 Byte Order Mark (BOM)
      const bom = "\ufeff";
      const csvContentWithBom = bom + csvContent;

      // Create a blob with the CSV content
      const blob = new Blob([csvContentWithBom], {
        type: "text/csv;charset=utf-8;",
      });

      // Create a download link and trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "exported_data.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log("No data available to export.");
    }
  };

  const convertToCSV = (data: any[]) => {
    // Specify the desired field names
    const fields = [
      "Document Number",
      "Card Code",
      "Card Name",
      "Document Total",
      "Posting Date",
      "Document Status",
    ];

    // Map the data to the desired field names
    const mappedData = data?.map((row) => ({
      "Document Number": row.DocNum,
      "Card Code": row.CardCode,
      "Card Name": row.CardName,
      "Document Total": row.DocTotal,
      "Posting Date": row.TaxDate.slice(0, 10), // Extract the date part
      "Document Status": row.DocumentStatus.replace("bost_", ""),
    }));

    // Create CSV content with the specified fields
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
            <span className="text-lg mr-2">
              <BsPencilSquare />
            </span>
            <span className="capitalize text-sm">Create</span>
          </Button>
          <Button size="small" variant="text" onClick={props.handlerRefresh}>
            <span className="text-lg mr-2">
              <HiRefresh />
            </span>
            <span className="capitalize text-sm">Refresh</span>
          </Button>
          <MenuCompoment
            title={
              <div className="flex gap-2">
                <span className="text-lg">
                  <BsSortDown />
                </span>{" "}
                <span className="text-[13px] capitalize">Sort </span>
              </div>
            }
            items={props.columns}
            onClick={props.handlerSortby}
          />

          <Button
            size="small"
            variant="text"
            onClick={() => {
              if (props.data && props.data.length > 0) {
                handleExportToCSV();
              } else {
                // Handle the case when there is no data to export
                console.log("No data to export");
              }
            }}
          >
            <span className="text-sm mr-2">
              <InsertDriveFileOutlinedIcon
                style={{ fontSize: "18px", marginBottom: "2px" }}
              />
            </span>
            <span className="capitalize text-[13px] ">Export to CSV</span>
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
        />

        <ColumnSearch ref={search} onOk={handlerSearch} />
      </div>
    </div>
  );
}
