import React, { FC } from "react";
import Modal from "./Modal";
import MaterialReactTable from "material-react-table";
import { useQuery } from "react-query";
import request from "../../utilies/request";
import BusinessPartnerRepository from "@/services/actions/bussinessPartnerRepository";
import { currencyFormat } from "../../utilies/index";
import BusinessPartner from "../../models/BusinessParter";
import { useMemo } from "react";
import EmployeesInfo from "@/models/EmployeesInfo";
import requesterRepository from "@/services/actions/requesterRepository";
import InitializeData from "../../services/actions/index";
import requesterEmployeeRepository from "@/services/actions/requesterEmployeeRepository";

interface RequesterEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onOk: (vendor: EmployeesInfo) => void;
}

const RequesterEmployeeModal: FC<RequesterEmployeeModalProps> = ({
  open,
  onClose,
  onOk,
}) => {
  const { data, isLoading }: any = useQuery({
    queryKey: ["employees"],
    queryFn: () => new requesterEmployeeRepository().get(),
    staleTime: Infinity,
  });

  // console.log(data);

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 8,
  });

  const [rowSelection, setRowSelection] = React.useState({});
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "LastName",
        header: "Last Name",
      },
      {
        accessorKey: "FirstName",
        header: "First Name",
      },
      {
        accessorKey: "EmployeeID",
        header: "Employee Code",
      },
    ],
    []
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      widthClass="w-[70%]"
      title="Requester"
      disableTitle={true}
      disableFooter={true}
    >
      <div className="data-table text-inherit">
        <MaterialReactTable
          columns={columns}
          data={data ?? []}
          enableStickyHeader={true}
          enableStickyFooter={true}
          enablePagination={true}
          enableTopToolbar={true}
          enableDensityToggle={false}
          initialState={{ density: "compact" }}
          // enableRowSelection={true}
          onPaginationChange={setPagination}
          // onRowSelectionChange={setRowSelection}
          getRowId={(row: any) => row.ItemCode}
          enableSelectAll={false}
          enableFullScreenToggle={false}
          enableColumnVirtualization={false}
          enableMultiRowSelection={false}
          positionToolbarAlertBanner="none"
          muiTablePaginationProps={{
            rowsPerPageOptions: [5, 8, 15],
            showFirstButton: false,
            showLastButton: false,
          }}
          muiTableBodyRowProps={({ row }) => ({
            // onClick: row.getToggleSelectedHandler(),
            onClick: () => {
              onOk(new EmployeesInfo(row.original));
              onClose();
            },
            sx: { cursor: "pointer" },
          })}
          state={{
            isLoading,
            pagination: pagination,
            rowSelection,
          }}
          renderTopToolbarCustomActions={({ table }) => {
            return <h2 className=" text-lg font-bold">Requester Employee</h2>;
          }}
        />
      </div>
    </Modal>
  );
};

export default RequesterEmployeeModal;
