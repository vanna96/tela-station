import React, { FC, Fragment, useEffect, useState } from "react";
import MaterialReactTable from "material-react-table";
import { useQuery } from "react-query";
import BusinessPartnerRepository from "@/services/actions/bussinessPartnerRepository";
import { currencyFormat } from "../../utilies/index";
import BusinessPartner from "../../models/BusinessParter";
import { useMemo } from "react";
import { ThemeContext } from "@/contexts";
import {
  Box,
  CircularProgress,
  IconButton,
  LinearProgress,
  OutlinedInput,
} from "@mui/material";
import { HiSearch, HiX } from "react-icons/hi";
import { Transition, Dialog } from "@headlessui/react";
import shortid from "shortid";
import BranchQuery from "@/models/BranchQuery";
import BranchQueryRepository from "@/services/actions/BranchQueryRepository";
import { TableCell } from "@mui/material";
import LoadingProgress from "../LoadingProgress";

export type VendorModalType = "supplier" | "customer" | null;

interface VendorModalProps {
  open: boolean;
  onClose: () => void;
  onOk: (vendor: BusinessPartner) => void;
  type: VendorModalType;
  branch: string;
  passedcardcode?: string;
}

const VendorModalBranch: FC<VendorModalProps> = ({
  open,
  onClose,
  onOk,
  type,
  branch,
  passedcardcode,
}) => {
  const { theme } = React.useContext(ThemeContext);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [filterKey, setFilterKey] = React.useState("key-id");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedCardCode, setSelectedCardCode] = useState<string>(
    () => passedcardcode ?? ""
  );
  const { data, isLoading }: any = useQuery({
    queryKey: ["venders_branch", branch],
    queryFn: () =>
      new BranchQueryRepository().get(
        `?$filter=CardType eq 'C' and BPLId eq ${branch}`
      ),
    // staleTime: 10000,
    enabled: branch !== "",
  });

  const { data: businessPartnerData, isLoading: isLoadingBP } = useQuery({
    queryKey: ["business_partner", selectedCardCode],
    queryFn: () => new BusinessPartnerRepository().find(selectedCardCode),
    enabled: selectedCardCode !== "",
  });

  useEffect(() => {
    if (businessPartnerData) {
      const businessPartner = new BusinessPartner(businessPartnerData, 0);
      onOk(businessPartner);
    }
  }, [businessPartnerData]);

  const [rowSelection, setRowSelection] = React.useState({});
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "CardCode",
        header: "Customer Code",
        size: 150,
      },
      {
        accessorKey: "CardName",
        header: "Customer Name",
        size: 350,
      },
      {
        accessorKey: "Currency",
        header: "Currency",
        size: 120,
      },

      {
        accessorKey: "Balance",
        header: "Balance",
        size: 120,
        Cell: ({ cell }: any) => {
          return (
            <div
              className={
                parseFloat(cell.getValue()) > 0
                  ? "text-blue-500"
                  : "text-red-500"
              }
            >
              {cell.getValue()?.toFixed(2)}
            </div>
          );
        },
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
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto w-full ">
          <div className="flex min-h-full items-center justify-center  text-center ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`flex flex-col w-fit p-12 sm:p-10 border shadow-lg relative transform overflow-hidden rounded-lg ${
                  theme === "light" ? "bg-white" : "bg-white"
                } text-left align-middle transition-all`}
              >
                <div className={`grow text-inherit `}>
                  <div className={`data-grid `}>
                    <div className="w-full flex justify-between items-center ">
                      <h2 className="font-medium text-lg">Business Partners</h2>
                      <OutlinedInput
                        size="small"
                        key={filterKey}
                        onChange={handlerSearch}
                        className="text-sm"
                        sx={{
                          fontSize: "14px",
                          // backgroundColor: theme === "light" ? "" : "#64748b",
                        }}
                        placeholder="Card Code /Name"
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
                    <hr />

                    <MaterialReactTable
                      columns={columns}
                      data={data ?? []}
                      enableStickyHeader={true}
                      enableStickyFooter={true}
                      enablePagination={true}
                      enableDensityToggle={false}
                      initialState={{ density: "compact" }}
                      onGlobalFilterChange={setGlobalFilter}
                      onPaginationChange={setPagination}
                      enableColumnActions={false}
                      getRowId={(row: any) => row.ItemCode}
                      enableSelectAll={false}
                      enableFullScreenToggle={false}
                      enableColumnVirtualization={false}
                      enableMultiRowSelection={false}
                      positionToolbarAlertBanner="none"
                      muiTablePaginationProps={{
                        rowsPerPageOptions: [5, 10, 15],
                        showFirstButton: true,
                        showLastButton: true,
                      }}
                      muiTableBodyRowProps={({ row }) => ({
                        // onClick: () => {
                        //   onOk(new BusinessPartner(row.original, 0));
                        // },
                        // sx: { cursor: "pointer" },
                        onClick: () => {
                          setSelectedCardCode(row.original.CardCode);
                        },
                      })}
                      state={{
                        globalFilter,
                        isLoading,
                        pagination: pagination,
                        rowSelection,
                      }}
                      layoutMode="grid" //instead of the default "semantic" layout mode
                    />
                  </div>
                  {isLoadingBP && (
                    <div className=" absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                      <CircularProgress
                        color="primary"
                        variant="indeterminate"
                      />
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default VendorModalBranch;
