
import React, { FC, Fragment, useEffect, useState } from "react";
import MaterialReactTable from "material-react-table";
import { useQuery } from "react-query";
import BusinessPartnerRepository from "@/services/actions/bussinessPartnerRepository";
import { currencyFormat } from "../../utilies/index";
import BusinessPartner from "../../models/BusinessParter";
import { useMemo } from "react";
import { ThemeContext } from "@/contexts";
import { IconButton, OutlinedInput } from "@mui/material";
import { HiSearch, HiX } from "react-icons/hi";
import { Transition, Dialog } from "@headlessui/react";
import shortid from "shortid";
import BranchQuery from "@/models/BranchQuery";
import BranchQueryRepository from "@/services/actions/BranchQueryRepository";

export type VendorModalType = "supplier" | "customer" | null;

interface VendorModalProps {
  open: boolean;
  onClose: () => void;
  onOk: (vendor: BusinessPartner) => void;
  type: VendorModalType;
  branch: string;
}

const VendorModalBranch: FC<VendorModalProps> = ({
  open,
  onClose,
  onOk,
  type,
  branch,
}) => {
  const { theme } = React.useContext(ThemeContext);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [filterKey, setFilterKey] = React.useState("key-id");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedCardCode, setSelectedCardCode] = useState<string | null>(null);
  const [businessPartnerData, setBusinessPartnerData] = useState<any | null>(
    null
  );

  const { data, isLoading }: any = useQuery({
    queryKey: ["venders_branch", branch],
    queryFn: () =>
      new BranchQueryRepository().get(`?$filter=BPLId eq ${branch}`),
    staleTime: 10000,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedCardCode && !businessPartnerData) {
          const data = await new BusinessPartnerRepository().find(
            selectedCardCode
          );

          if (data) {
            setBusinessPartnerData(data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error); // Debugging line
      }
    };

    fetchData();
  }, [selectedCardCode, businessPartnerData]);

  const [rowSelection, setRowSelection] = React.useState({});
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "CardCode",
        header: "Card Code",
        size: 50,
      },
      {
        accessorKey: "CardName",
        header: "Card Name",
        size: 60,
      },
      {
        accessorKey: "Currency",
        header: "Currency",
        size: 50,
      },

      {
        accessorKey: "CurrentAccountBalance",
        header: "Balance",
        size: 100,
        Cell: ({ cell }: any) => {
          return (
            <div
              className={
                parseFloat(cell.getValue()) > 0
                  ? "text-blue-500"
                  : "text-red-500"
              }
            >
              {currencyFormat(cell.getValue())}
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

  useEffect(() => {
    if (businessPartnerData) {
      const businessPartner = new BusinessPartner(businessPartnerData, 0);
      onOk(businessPartner);
    }
  }, [businessPartnerData]);

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
                className={`flex flex-col w-[60vw] min-h-[70vh] px-[2.5rem] border shadow-lg relative transform overflow-hidden rounded-lg ${
                  theme === "light" ? "bg-white" : "bg-white"
                } py-1 px-5 text-left align-middle  transition-all`}
              >
                <div className={`grow text-inherit `}>
                  <div className={`data-grid `}>
                    <div className="w-full flex justify-between items-center px-4 pb-2 pt-6">
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
                        showFirstButton: false,
                        showLastButton: false,
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
                    />
                  </div>
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
