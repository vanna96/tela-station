import React from "react";
import MaterialReactTable from "material-react-table";
import { Button, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment/moment";
//Date Picker Imports
import { useNavigate } from "react-router-dom";
import { UseQueryResult, useQuery } from "react-query";
import PurchaseRequestRepository from "@/services/purchaseRequestRepository";
import VehicelRepository from "@/services/actions/VehicelRepository";
import OpenDeliveryRepository from "@/services/actions/openDeliveryRepository";
import OpenTransportationRepository from "@/services/actions/OpenTransportationRepository";

export default function OpenTransportationLists() {
  const route = useNavigate();

  const { data, isLoading }: any = useQuery({
    queryKey: ["ot"],
    queryFn: () => new OpenTransportationRepository().get(),
  });
  console.log(data);
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "docEntry",
        header: "Order Num", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
      },
      {
        accessorKey: "u_TRANSPROUTE",
        header: "Route",
        enableClickToCopy: true,
      },
      {
        accessorKey: "u_TRANSPVEHICLE",
        header: "	Vehicle",
        // size: 200, //increase the width of this column
      },
      {
        accessorKey: "driver",
        header: "Driver",

      },
      {
        accessorKey: "u_TRANSPSTATUS",
        header: "Status",

      },

      // {
      //   accessorKey: "id",
      //   enableFilterMatchHighlighting: false,
      //   enableColumnFilterModes: false,
      //   enableColumnActions: false,
      //   enableColumnFilters: false,
      //   enableColumnOrdering: false,
      //   header: "Action", //uses the default width from defaultColumn prop
      // },
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
            Master Data / Open Transportation
          </h3>
          <Button
            variant="outlined"
            disableElevation
            size="small"
            onClick={() => route("/logistic/open-transportation/create")}
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
                    Open Transportation
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
