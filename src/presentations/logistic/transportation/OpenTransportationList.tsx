import React from "react";
import MaterialReactTable from "material-react-table";
import { Button, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import { UseQueryResult, useQuery } from "react-query";
import TransportationOrderRepository from "@/services/actions/transportationOrderRepository";

export default function TransportationOrderList() {
  const route = useNavigate();


  const { data, isLoading }: any = useQuery({
    queryKey: ["transportation-order"],
    queryFn: () => new TransportationOrderRepository().get(),
  });

  console.log(data)
  const columns = React.useMemo(
    () => [
      { accessorKey: "index", header: "#" },

      {
        accessorKey: "u_RMCODE",
        header: "Code.", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
      },
      {
        accessorKey: "u_RMNAME",
        header: "Description",
        enableClickToCopy: true,
      },
    
      {
        accessorKey: "u_RMBASEST",
        header: "Base Station",

      },
      {
        accessorKey: "createDate",
        header: "CreateDate",

      },
      {
        accessorKey: "updateDate",
        header: "updateDate",

      },

      {
        accessorKey: "id",
        enableFilterMatchHighlighting: false,
        enableColumnFilterModes: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableColumnOrdering: false,
        header: "Action", //uses the default width from defaultColumn prop
        Cell: (cell: any) => (
          <div className="flex gap-4">
            <button onClick={() => {
              route('/logistic/transportation-order/' + cell.row.original.id, { state: cell.row.original })
            }}>
              <VisibilityIcon fontSize="small" className="text-gray-600 " />
            </button>
            <button>
              <EditIcon fontSize="small" className="text-blue-400" />
            </button>
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

  return (
    <>
      <div className="w-full h-full p-4 2xl:py-6 flex flex-col gap-3 relative bg-gray-100">
        <div className="flex px-8 shadow-sm rounded-lg justify-between items-center sticky z-10 top-0 w-full bg-white py-3">
          <h3 className="text-lg 2xl:text-base xl:text-sm">
           Logistics / Transportation Order
          </h3>
          <Button
            variant="outlined"
            disableElevation
            size="small"
            onClick={() => route("/logistic/transportation-order/create")}
          >
            <span className="text-xs">Create</span>
          </Button>
        </div>

        <div className="grow data-table">
          <MaterialReactTable
            columns={columns}
            data={data ?? []}
            enableHiding={true}
            initialState={{ density: "compact" }}
            enableDensityToggle={false}
            enableColumnResizing
            enableStickyHeader={true}
            enableStickyFooter={true}
            enablePagination={true}
            muiTablePaginationProps={{
              rowsPerPageOptions: [5, 10, 15],
            }}
            getRowId={(row: any) => row.DocEntry}
            onPaginationChange={setPagination}
            state={{
              isLoading,
              pagination,
            }}
            renderTopToolbarCustomActions={({ table }) => {
              return (
                <div className="flex gap-2 mb-6 pt-2 justify-center items-center">
                  <h3 className="font-bold text-base xl:text-sm">
                  Transportation Order
                  </h3>
                  {/* ({pagination.pageSize}/{count?.data?.data ?? 0}) */}
                </div>
              );
            }}
          />
        </div>
      </div>
    </>
  );
}
