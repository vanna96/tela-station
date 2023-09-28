import React, { FC, useState } from "react";
import Modal from "./Modal";
import MaterialReactTable from "material-react-table";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import GLAccount from "../../models/GLAccount";
import GLAccountRepository from "@/services/actions/GLAccountRepository";
import shortid from "shortid";
import { IconButton, OutlinedInput } from "@mui/material";
import { HiSearch, HiX } from "react-icons/hi";

interface GLAccountProps {
  open: boolean;
  onClose: () => void;
  onOk: (account: GLAccount) => void;
}

const GLAccountModal: FC<GLAccountProps> = ({ open, onClose, onOk }) => {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [filterKey, setFilterKey] = React.useState("key-id");

  const { data, isLoading }: any = useQuery({
    queryKey: ["accounts"],
    queryFn: () => new GLAccountRepository().get(),
    staleTime: Infinity,
  });

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 8,
  });

  const [rowSelection, setRowSelection] = React.useState({});
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "Code",
        header: "Account Number",
        minSize: 100, //min size enforced during resizing
        maxSize: 300, //max size enforced during resizing
        size: 100,
      },
      {
        accessorKey: "Name",
        header: "Account Name",
        minSize: 100, //min size enforced during resizing
        maxSize: 400, //max size enforced during resizing
        size: 180,
      },
    ],
    []
  );
  const handlerSearch = (event: any) => setGlobalFilter(event.target.value);

  const clearFilter = React.useCallback(() => {
    if (globalFilter === "") return;
    setGlobalFilter("");
    setFilterKey(shortid.generate());
  }, [globalFilter]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      widthClass="w-[55%]"
      title="Account Lists"
      disableTitle={true}
      disableFooter={true}
    >
      <div className="data-table text-inherit">
        <div className="w-full flex justify-between items-center p-2 pt-6">
          <h2 className="mt-4 font-bold text-lg ">List of Accounts</h2>

          <div className="mt-4">
            <OutlinedInput
              size="small"
              key={filterKey}
              onChange={handlerSearch}
              className="text-sm"
              sx={{ fontSize: "14px" }}
              placeholder="Search..."
              endAdornment={
                <IconButton size="small" onClick={clearFilter}>
                  {globalFilter !== "" ? (
                    <HiX className="text-xl" />
                  ) : (
                    <HiSearch className="text-xl" />
                  )}
                </IconButton>
              }
            />
          </div>
        </div>
        <hr />
        <MaterialReactTable
          layoutMode="grid"
          columns={columns}
          data={data ?? []}
          enableStickyHeader={true}
          enableStickyFooter={true}
          enableColumnResizing={false}
          enablePagination={true}
          enableTopToolbar={false}
          enableDensityToggle={false}
          initialState={{ density: "compact" }}
          // enableRowSelection={true}
          onGlobalFilterChange={setGlobalFilter}
          onPaginationChange={setPagination}
          onRowSelectionChange={setRowSelection}
          getRowId={(row: any) => row.ItemCode}
          enableSelectAll={false}
          enableFullScreenToggle={false}
          enableColumnVirtualization={false}
          enableMultiRowSelection={false}
          positionToolbarAlertBanner="bottom"
          muiTablePaginationProps={{
            rowsPerPageOptions: [5, 8, 15],
            showFirstButton: false,
            showLastButton: false,
          }}
          muiTableBodyRowProps={({ row }) => ({
            onClick: () => {
              onOk(new GLAccount(row.original));
              onClose();
            },
            sx: { cursor: "pointer" },
          })}
          
          state={{
            globalFilter,
            isLoading,
            pagination: pagination,
            rowSelection,
          }}
        />
      </div>
    </Modal>
  );
};

export default GLAccountModal;
