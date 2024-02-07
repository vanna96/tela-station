import React, { FC, Fragment, useEffect } from "react";
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
export type ItemGroup = 100 | 101 | 102;

interface ItemModalProps {
  open: boolean;
  onClose: () => void;
  onOk: (item: any[]) => void;
  type: ItemType;
  group?: ItemGroup;
  CardCode?: any;
  WarehouseCode?: any;
  AbsEntry?: any;
  Currency?: any;
  multipleSelect?: any;
  priceList?: number;
  U_ti_revenue?: any;
}

const ItemModal: FC<ItemModalProps> = ({
  open,
  onClose,
  type,
  group,
  onOk,
  CardCode,
  WarehouseCode,
  Currency,
  multipleSelect,
  priceList,
  U_ti_revenue,
}) => {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [filterKey, setFilterKey] = React.useState("key-id");

  const itemsGroupCodes = [100, 101, 102];

  const groupCondition =
    group == undefined ? `(ItemsGroupCode eq 100 or ItemsGroupCode eq 101 or ItemsGroupCode eq 102)`: `ItemsGroupCode eq ${group}`;
  const { data, isFetching }: any = useQuery({
    queryKey: ["items", group],
    queryFn: () =>
      new itemRepository().getSaleItem(
        `&$filter=ItemType eq 'itItems' and SalesItem eq 'tYES' and ${groupCondition} &$orderby=ItemCode asc`
      ),
      
   
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
      data.find((ele: any) => ele?.ItemCode === e)
    );

    const uomGroups: any = await new UnitOfMeasurementGroupRepository().get();
    const uoms = await new UnitOfMeasurementRepository().get();
    const warehouse = await new WarehouseRepository().get();
    const wareBinLocation = await new WareBinLocationRepository().get();
    async function getPriceListNum(CardCode: any) {
      try {
        const result = await new BusinessPartnerRepository().find(CardCode);
        return result?.PriceListNum;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
    const globalPriceListNum = priceList ?? (await getPriceListNum(CardCode));
    selectItems = selectItems.map((e: any) => {
      const defaultPrice = e?.ItemPrices?.find(
        (row: any) => row?.PriceList === globalPriceListNum
      )?.Price;

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

      return {
        ItemCode: e?.ItemCode,
        LineVendor: CardCode,
        ItemName: e?.ItemName,
        ItemDescription: e?.ItemName,
        UomEntry: e?.UoMGroupEntry,
        ItemGroup: e?.ItemsGroupCode,
        SaleVatGroup: e?.SalesVATGroup,
        PurchaseVatGroup: e?.PurchaseVATGroup,
        VatGroup: e?.SalesVATGroup || e?.PurchaseVATGroup,
        VatRate: e?.SalesVATGroup === "VO10" ? 10 : 0,
        Quantity: defaultPrice !== null ? 1 : 0,
        // UnitPrice: defaultPrice ?? 0,
        DiscountPercent: 0,
        LineTotal: total,
        Total: total,
        TotalGross: 0,
        WarehouseCode: e?.WarehouseCode || WarehouseCode,

        BinAbsEntry:
          warebinList?.length > 0 ? warebinList[0]?.BinAbsEntry : null,
        BinCode: warebinList?.length > 0 ? warebinList[0]?.BinCode : null,
        LineOfBussiness: e?.U_tl_dim1,
        // ProductLine: item.ProductLine ?? "203004",
        UnitPrice:
          defaultPrice / (1 + (e?.SalesVATGroup === "VO10" ? 10 : 0) / 100) ??
          0,
        COGSCostingCode: e?.U_tl_dim1,
        COGSCostingCode2: U_ti_revenue,
        COGSCostingCode3: e?.U_tl_dim2,
        GrossPrice: defaultPrice,
        ItemPrices: e.ItemPrices,
        UomGroupAbsEntry: e?.UoMGroupEntry,
        UomGroupCode: uomGroup?.Code,
        UomAbsEntry: baseUOM?.AbsEntry,
        UomCode: baseUOM?.Code,
        UomName: baseUOM?.Name,
        UomLists: uomLists,
        SaleUOMLists: UoMEntryValues,
        Currency: Currency,
        UnitsOfMeasurement: uomGroup?.UoMGroupDefinitionCollection?.find(
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
                        isLoading: isFetching,
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

  onOpen(CardCode?: any, type?: any, WarehouseCode?: any, Currency?: any) {
    this.setState({
      isOpen: true,
      CardCode: CardCode,
      type: type ?? "sale",
      WarehouseCode: WarehouseCode,
      Currency: Currency,
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
        group={this.props.group}
        onOk={this.handlerOk}
        CardCode={this.state.CardCode}
        WarehouseCode={this.state.WarehouseCode}
        Currency={this.state.Currency}
        multipleSelect={this.props.multipleSelect}
        priceList={this.props.priceList}
        U_ti_revenue={this.props.U_ti_revenue}
      />
    );
  }
}
