import React, { FC, Fragment } from "react";
import MaterialReactTable from "material-react-table";
import { useQuery } from "react-query";
import itemRepository from "@/services/actions/itemRepostory";
import { useMemo } from "react";
import VatGroupRepository from "../../services/actions/VatGroupRepository";
import VatGroup from "@/models/VatGroup";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import UnitOfMeasurementGroupRepository from "@/services/actions/unitOfMeasurementGroupRepository";
import BusinessPartnerRepository from "@/services/actions/bussinessPartnerRepository";
import { Dialog, Transition } from "@headlessui/react";
import { Button, IconButton, OutlinedInput } from "@mui/material";
import { HiSearch, HiX } from "react-icons/hi";
import shortid from "shortid";
import WarehouseRepository from "@/services/warehouseRepository";
import WareBinLocationRepository from "@/services/whBinLocationRepository";

export type ItemType = "purchase" | "sale" | "inventory";
export type ItemGroup = "100" | "101" | "102" | "0";

interface ItemModalProps {
  open: boolean;
  onClose: () => void;
  onOk: (item: any[]) => void;
  type: ItemType;
  group?: ItemGroup;
  CardCode?: any;
  WarehouseCode?: any;
  AbsEntry?: any;
}

const ItemModal: FC<ItemModalProps> = ({
  open,
  onClose,
  type,
  group,
  onOk,
  CardCode,
  WarehouseCode,
}) => {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [filterKey, setFilterKey] = React.useState("key-id");

  const itemsGroupCodes = [100, 101, 102];
  const { data, isLoading }: any = useQuery({
    queryKey: ["items", group],
    queryFn: () =>
      // new itemRepository().getSaleItem(
      //   `&$filter=ItemType eq 'itItems' and ItemsGroupCode eq ${userSelectedItemsGroupCode} &$orderby=ItemCode asc`
      // ),
      new itemRepository().getSaleItem(
        `&$filter=ItemType eq 'itItems' and (ItemsGroupCode eq ${itemsGroupCodes.join(
          " or ItemsGroupCode eq "
        )}) &$orderby=ItemCode asc`
      ),
    staleTime: Infinity,
  });

  const vendors: any = useQuery({
    queryKey: ["venders_supplier"],
    queryFn: () =>
      new BusinessPartnerRepository().get(`&$filter=CardType eq 'cSupplier'`),
    staleTime: Infinity,
  });

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    setTimeout(() => setRowSelection({}), 500);
  }, [open]);

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
      },
      {
        accessorKey: "ForeignName",
        header: "Foreign Name",
        size: 90,
      },
      // {
      //   accessorKey: "Description",
      //   header: "Description",
      // },
    ],
    []
  );

  const items = useMemo(() => {
    switch (type) {
      case "purchase":
        return data?.filter((e: any) => e?.PurchaseItem === "tYES");
      case "sale":
        return data?.filter((e: any) => e?.SalesItem === "tYES");
      case "inventory":
        return data?.filter((e: any) => e?.InventoryItem === "tYES");
      default:
        return [];
    }
  }, [data]);

  const itemFilter = useMemo(() => {
    console.log(group);
    switch (Number(group)) {
      case 100:
        return data?.filter((e: any) => e?.ItemsGroupCode === 100);
      case 101:
        return data?.filter((e: any) => e?.ItemsGroupCode === 101);
      case 102:
        return data?.filter((e: any) => e?.ItemsGroupCode === 102);
      case 0:
        return data;
      default:
        return data;
    }
  }, [group]);

  // const itemFilter = items?.filter((e: any) => e?.ItemsGroupCode === 101);

  const handlerConfirm = async () => {
    const keys = Object.keys(rowSelection);
    let selectItems = keys.map((e: any) =>
      items.find((ele: any) => ele?.ItemCode === e)
    );
    // console.log(selectItems)
    const uomGroups: any = await new UnitOfMeasurementGroupRepository().get();
    const uoms = await new UnitOfMeasurementRepository().get();
    const warehouse = await new WarehouseRepository().get();
    const wareBinLocation = await new WareBinLocationRepository().get();

    selectItems = selectItems.map((e: any) => {
      const vendor = vendors.data?.find(
        (bp: any) => bp?.CardCode === CardCode || e?.Mainsupplier
      );
      // console.log(vendor)
      const defaultPrice = e?.ItemPrices?.find(
        (row: any) => row?.PriceList === vendor?.PriceListNum
      )?.Price;

      // const defaultItemPrice = e?.ItemPrices?.
      let vatRate: any = 0;
      let saleVatGroup: any = "";
      switch (type) {
        case "purchase":
          vatRate = (
            new VatGroupRepository().find(e?.PurchaseVATGroup) as VatGroup
          ).vatRate;
          break;
        case "sale":
          vatRate = (
            new VatGroupRepository().find(e?.SalesVATGroup) as VatGroup
          )?.vatRate;
          saleVatGroup = e?.SalesVATGroup;
          break;
        default:
          vatRate = 0;
          break;
      }

      const warebinList: any[] = wareBinLocation?.filter(
        (entry: any) =>
          WarehouseCode === entry?.WhsCode && entry.ItemCode === e?.ItemCode
      );

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

      const total = (defaultPrice ?? 0) * 1;
      const UoMEntryValues = e?.ItemUnitOfMeasurementCollection?.filter(
        (item: any) => item.UoMType === "iutSales"
      )?.map((item: any) => item.UoMEntry);
      // const warehouseCode = WarehouseCode;
      return {
        ItemCode: e?.ItemCode,
        LineVendor: vendor?.CardCode,
        ItemName: e?.ItemName,
        ItemDescription: e?.ItemName,
        UomEntry: e?.UoMGroupEntry,
        ItemGroup: e?.ItemsGroupCode,
        SaleVatGroup: e?.SalesVATGroup,
        PurchaseVatGroup: e?.PurchaseVATGroup,
        VatGroup: e?.SalesVATGroup || e?.PurchaseVATGroup,
        VatRate: e?.SalesVATGroup === "VO10" ? 10 : 0,
        Quantity: defaultPrice !== null ? 1 : 0,
        UnitPrice: defaultPrice ?? 0,
        DiscountPercent: 0,
        LineTotal: total,
        Total: total,
        WarehouseCode: WarehouseCode,
        BinAbsEntry:
          warebinList?.length > 0 ? warebinList[0]?.BinAbsEntry : null,
        BinCode: warebinList?.length > 0 ? warebinList[0]?.BinCode : null,
        LineOfBussiness: e?.U_tl_dim1,
        revenueLine: "202001",
        REV: e?.U_tl_dim2,
        // ProductLine: item.ProductLine ?? "203004",
        GrossPrice:
          defaultPrice / (1 + (e?.SalesVATGroup === "VO10" ? 10 : 0) / 100) ??
          0,
        UomGroupAbsEntry: e?.UoMGroupEntry,
        UomGroupCode: uomGroup?.Code,
        UomAbsEntry: baseUOM?.AbsEntry,
        UomCode: baseUOM?.Code,
        UomName: baseUOM?.Name,
        UomLists: uomLists,
        SaleUOMLists: UoMEntryValues,
        DocCurrency: e?.DocCurrency,
        UnitsOfMeasurement: uomGroup?.UoMGroupDefinitionCollection.find(
          (e: any) => e?.AlternateUoM === uomGroup?.BaseUoM
        )?.BaseQuantity,
        UnitsOfMeasurements: uomGroup,
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
        {/* <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child> */}

        <div className="fixed inset-0 overflow-y-auto w-full bg-black bg-opacity-30">
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
                className={`flex flex-col bg-white w-[70vw] min-h-[75vh] px-[2.5rem] border shadow-lg relative transform overflow-hidden rounded-lg  py-1 text-left align-middle  transition-all`}
              >
                <div className={`grow text-inherit`}>
                  <div className={`data-grid`}>
                    <div className="w-full flex justify-between items-center  ">
                      <h2 className="font-bold text-xl mt-12">
                        {"List of Items"}
                      </h2>
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
                    <hr />
                    <MaterialReactTable
                      columns={columns}
                      // data={items ?? []}
                      data={itemFilter ?? []}
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
                      enableMultiRowSelection={true}
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
                        isLoading,
                        pagination: pagination,
                        rowSelection,
                      }}
                      layoutMode="grid"
                    />

                    <div className="w-full flex justify-end items-center border-t pt-3 gap-3">
                      <Button
                        size="small"
                        disableElevation
                        variant="text"
                        onClick={onClose}
                      >
                        <span className="capitalize px-6  text-blue-700 text-xs">
                          Close
                        </span>
                      </Button>
                      <Button
                        size="small"
                        disableElevation
                        variant="contained"
                        onClick={handlerConfirm}
                      >
                        <span className="capitalize px-6 text-white text-xs">
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
  ref?: React.RefObject<ItemModalComponent | undefined>;
}

export class ItemModalComponent extends React.Component<
  ItemModalCompoentProps,
  any
> {
  constructor(props: ItemModalCompoentProps) {
    super(props);

    this.state = {
      isOpen: false,
      CardCode: "",
    };

    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.handlerOk = this.handlerOk.bind(this);
  }

  onClose() {
    this.setState({ isOpen: false });
  }

  onOpen(CardCode?: any, type?: any, WarehouseCode?: any) {
    this.setState({
      isOpen: true,
      CardCode: CardCode,
      type: type ?? "sale",
      WarehouseCode: WarehouseCode,
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
        type={this.state.type || this.props.type || "sale"}
        group={this.state.group || this.props.group || 100}
        onOk={this.handlerOk}
        CardCode={this.state.CardCode}
        WarehouseCode={this.state.WarehouseCode}
      />
    );
  }
}
