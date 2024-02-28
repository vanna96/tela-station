import React, { FC, Fragment, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import { useQuery } from "react-query";
import { Dialog, Transition } from "@headlessui/react";
import { Button, IconButton, OutlinedInput } from "@mui/material";
import { HiSearch, HiX } from "react-icons/hi";
import shortid from "shortid";
import request from "@/utilies/request";
import WareBinLocationRepository from "@/services/whBinLocationRepository";
import UnitOfMeasurementGroupRepository from "@/services/actions/unitOfMeasurementGroupRepository";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";

export type ItemGroup = 100 | 101 | 102;

interface ItemModalProps {
  open: boolean;
  onClose: () => void;
  onOk: (item: any[]) => void;
  group?: ItemGroup;
  WarehouseCode?: any;
  BinCode?: any;
  AbsEntry?: any;
  multipleSelect?: any;
}

const ItemModal: FC<ItemModalProps> = ({
  open,
  onClose,
  group,
  BinCode,
  onOk,
  WarehouseCode,
  multipleSelect,
}) => {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [filterKey, setFilterKey] = React.useState("key-id");

  const { data: itemData, loading: isLoadingItemData }: any = useQuery({
    queryKey: ["items"],
    queryFn: async () =>
      await request(
        "GET",
        "Items?$select=ItemCode,UoMGroupEntry,InventoryUoMEntry,ForeignName,ItemName,ItemsGroupCode&$filter=ItemType eq 'itItems' and SalesItem eq 'tYES' and (ItemsGroupCode eq 100 or ItemsGroupCode eq 101 or ItemsGroupCode eq 102) &$orderby=ItemCode asc"
      ).then((res: any) => res.data?.value),
  });

  const { data, isLoading }: any = useQuery({
    queryKey: ["ware-BinLocation"],
    queryFn: () => new WareBinLocationRepository().get(),
    staleTime: Infinity,
  });

  const filteredWarehouses = data?.filter(
    (warebin: any) => warebin.WhsCode === WarehouseCode
  );

  const filteredData = filteredWarehouses?.filter((item: any) =>
    BinCode?.includes(item.BinAbsEntry.toString())
  );

  const filteredItemData = itemData?.filter(
    (item: any) => item.ItemsGroupCode === group
  );

  const uniqueData = React.useMemo(() => {
    const localUniqueItemCodes = new Set(
      filteredItemData?.map((item: any) => item.ItemCode)
    );
    return filteredData
      ?.filter((warebin: any) => {
        if (localUniqueItemCodes.has(warebin.ItemCode)) {
          localUniqueItemCodes.delete(warebin.ItemCode);
          return true;
        }
        return false;
      })
      .map((item: any) => ({
        ...item,
        UoMGroupEntry: itemData.find(
          (dataItem: any) => dataItem.ItemCode === item.ItemCode
        )?.UoMGroupEntry,
        InventoryUoMEntry: itemData.find(
          (dataItem: any) => dataItem.ItemCode === item.ItemCode
        )?.InventoryUoMEntry,
      }));
  }, [BinCode]);


  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    setTimeout(() => setRowSelection({}), 500);
  }, [uniqueData]);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "ItemCode",
        header: "Code",
        size: 80,
      },
      {
        accessorKey: "ItemName",
        header: "Name",
        size: 100,
      },
      {
        accessorKey: "ForeignName",
        header: "Foreign Name",
        size: 90,
        Cell: ({ cell }: any) => {
          return (
            <div>{cell.getValue() === null ? "N/A" : cell.getValue()}</div>
          );
        },
      },
    ],
    []
  );

  const handlerConfirm = async () => {
    const keys = Object.keys(rowSelection);
    let selectItems = keys.map((e: any) =>
      uniqueData?.find((ele: any) => ele?.ItemCode === e)
    );
    const uomGroups: any = await new UnitOfMeasurementGroupRepository().get();
    const uoms = await new UnitOfMeasurementRepository().get();
    selectItems = selectItems.map((e: any) => {
      const uomGroup: any = uomGroups.find(
        (row: any) => row.AbsEntry === e?.UoMGroupEntry
      );
      let uomLists: any[] = [];
      uomGroup?.UoMGroupDefinitionCollection?.forEach((row: any) => {
        const itemUOM = uoms.find(
          (record: any) => record?.AbsEntry === row?.AlternateUoM
        );
        if (itemUOM) {
          uomLists.push(itemUOM);
        }
      });
      const baseUOM: any = uoms.find(
        (row: any) => row.AbsEntry === uomGroup?.BaseUoM
      );

      return {
        ItemCode: e?.ItemCode,
        ItemName: e?.ItemName,
        UomEntry: e?.InventoryUoMEntry,
        ItemGroup: e?.ItemsGroupCode,
        UomLists: uomLists,
      };
    });
    onOk(selectItems);
  };

  const handlerSearch = (event: any) => setGlobalFilter(event.target.value);

  const clearFilter = React.useCallback(() => {
    if (globalFilter === "") return;
    setGlobalFilter("");
    setFilterKey(shortid.generate());
  }, [globalFilter]);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <div className="fixed inset-0 overflow-y-auto w-full bg-black bg-opacity-30">
          <div className="flex w-full h-full items-center justify-center  text-center ">
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
                className={`flex flex-col bg-white w-[50vw] px-12 py-12 border shadow-lg relative transform overflow-hidden rounded-lg  text-left align-middle  transition-all`}
              >
                <div className={`grow text-inherit`}>
                  <div className={`data-grid`}>
                    <div className="w-full flex justify-between items-center  ">
                      <h2 className="font-medium text-lg ">
                        {"List of Items"}
                      </h2>
                      <OutlinedInput
                        size="small"
                        key={filterKey}
                        onChange={handlerSearch}
                        className="text-sm"
                        sx={{ fontSize: "14px" }}
                        placeholder="Item Code/Name"
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
                      // data={items ?? []}
                      data={uniqueData ?? []}
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
                      enableMultiRowSelection={multipleSelect}
                      enableRowSelection={true}
                      onRowSelectionChange={setRowSelection}
                      positionToolbarAlertBanner="none"
                      positionPagination="bottom"
                      muiTablePaginationProps={{
                        rowsPerPageOptions: [5, 10, 15],
                        showFirstButton: true,
                        showLastButton: true,
                      }}
                      muiTableBodyRowProps={({ row }) => ({
                        onClick: row.getToggleSelectedHandler(),
                        sx: { cursor: "pointer" },
                      })}
                      state={{
                        globalFilter,
                        isLoading: isLoadingItemData || isLoading,
                        pagination: pagination,
                        rowSelection,
                      }}
                      layoutMode="grid"
                    />

                    <div className="w-full flex justify-end items-center border-t pt-3 gap-3">
                      <Button
                        size="small"
                        // disableElevation
                        variant="outlined"
                        onClick={onClose}
                      >
                        <span className="capitalize px-4  text-sm">Close</span>
                      </Button>
                      <Button
                        size="small"
                        // disableElevation
                        variant="contained"
                        onClick={handlerConfirm}
                      >
                        <span className="capitalize px-6 text-white text-sm">
                          Ok
                        </span>
                      </Button>
                    </div>
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

export default ItemModal;

interface ItemModalCompoentProps
  extends Omit<ItemModalProps, "onClose" | "open"> {
  ref?: React.RefObject<ItemBinModal | undefined>;
}

export class ItemBinModal extends React.Component<ItemModalCompoentProps, any> {
  constructor(props: ItemModalCompoentProps) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.handlerOk = this.handlerOk.bind(this);
  }

  onClose() {
    this.setState({ isOpen: false });
  }

  onOpen(WarehouseCode?: any, BinCode?: any) {
    this.setState({
      isOpen: true,
      WarehouseCode: WarehouseCode,
      BinCode: BinCode,
    });
  }

  handlerOk(items: any[]) {
    this.setState({ isOpen: false });
    this.props.onOk(items);
  }

  render(): React.ReactNode {
    return (
      <ItemModal
        open={this.state.isOpen}
        onClose={this.onClose}
        group={this.props.group}
        onOk={this.handlerOk}
        WarehouseCode={this.props?.WarehouseCode}
        BinCode={this.props?.BinCode}
        multipleSelect={this.props.multipleSelect}
      />
    );
  }
}
