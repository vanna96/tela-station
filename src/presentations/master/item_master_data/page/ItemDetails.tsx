import { withRouter } from "@/routes/withRouter";
import React, { Component, useEffect } from "react";
import { useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import {
  HiOutlineEye,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineDocumentAdd,
  HiOutlineChevronDown,
} from "react-icons/hi";
import Taps from "@/components/button/Taps";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { currencyFormat, fileToBase64 } from "@/utilies";
import { AttachmentLine } from "@/models/Attachment";
import Modal from "@/components/modal/Modal";
import { CircularProgress } from "@mui/material";
import BackButton from "@/components/button/BackButton";
import PreviewAttachment from "@/components/attachment/PreviewAttachment";
import Department from "../../../../models/Department";
import { DocumentLine } from "../../../../models/interface/index";
import Formular from "../../../../utilies/formular";
import DocumentHeaderComponent from "../../../../components/DocumenHeaderComponent";
import OwnerRepository from "@/services/actions/ownerRepository";
import DepartmentRepository from "@/services/actions/departmentRepository";
import { dateFormat } from "../../../../utilies/index";
import BranchRepository from "../../../../services/actions/branchRepository";
import ItemMaster from "@/models/ItemMasterData";
import ItemMasterDataRepository from "@/services/actions/itemMasterDataRepository";
import ShippingTypeRepository from "@/services/actions/shippingTypeRepository";
import ItemGroupRepository from "@/services/actions/itemGroupRepository";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import ManufacturerRepository from "@/services/actions/manufacturerRepository";
import CustomsGroupRepository from "@/services/actions/customsGroupRepository";
import VatGroupRepository from "@/services/actions/VatGroupRepository";
import WarehouseRepository from "@/services/warehouseRepository";

class ItemMasterDataDetails extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      isError: false,
      message: "",
    };

    this.initData = this.initData.bind(this);
  }

  componentDidMount(): void {
    this.initData();
  }

  initData() {
    const { id } = this.props.match.params;
    const data = this.props.location.state as ItemMaster;

    if (data) {
      setTimeout(() => this.setState({ ...data, loading: false }), 500);
    } else {
      new ItemMasterDataRepository()
        .find(id)
        .then((res: any) => {
          this.setState({ ...res, loading: false });
        })
        .catch((e: Error) => {
          this.setState({ isError: true, message: e.message });
        });
    }
    console.log(data);
  }

  render() {
    return (
      <div className="w-full h-full flex flex-col p-4 gap-4">
        <DocumentHeaderComponent data={this.state} />

        <Modal
          open={this.state.isError}
          title="Oop"
          onClose={() => {}}
          onOk={() => console.log(this.props.history.goBack())}
        >
          <span>{this.state?.message}</span>
        </Modal>

        {this.state.loading ? (
          <div className="grow flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <>
            <div className="min-h-[10rem] grid grid-cols-2 gap-2 w-full shadow-sm rounded-lg bg-white text-[12px] p-6">
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500 ">Item Code</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.itemCode ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Item Description</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.itemName ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Foreign Name</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.foreignName ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Item Type</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.itemType.substring(2) ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Item Group</span>
                  <span className="w-8/12 font-medium">
                    :{" "}
                    {new ItemGroupRepository().find(this.state.itemsGroupCode)
                      ?.GroupName ?? "N/A"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">UoM Group</span>
                  <span className="w-8/12 font-medium">
                    :{" "}
                    {new UnitOfMeasurementRepository().find(
                      this.state.uomGroupEntry
                    )?.Name ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Price Lists</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.priceLists ?? "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Barcode</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.barCode ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Unit Price</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.unitPrice ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Pricing Unit</span>
                  <span className="w-8/12 font-medium">
                    : {this.state.inventoryUOM ?? "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Inventory Item </span>
                  <span className="w-8/12 font-medium">
                    :{" "}
                    <input
                      type="checkbox"
                      checked={this.state.inventoryItem === "tYES"}
                      onChange={() => {}}
                    />
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Sales Item </span>
                  <span className="w-8/12 font-medium">
                    :{" "}
                    <input
                      type="checkbox"
                      checked={this.state.salesItem === "tYES"}
                      onChange={() => {}}
                    />
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-4/12 text-gray-500">Purchasing Item </span>
                  <span className="w-8/12 font-medium">
                    :{" "}
                    <input
                      type="checkbox"
                      checked={this.state.purchaseItem === "tYES"}
                      onChange={() => {}}
                    />
                  </span>
                </div>
              </div>
            </div>
            <div className="grow flex flex-col gap-3 p-6 shadow-sm rounded-lg bg-white">
              <Taps
                items={[
                  "General",
                  "Purchasing",
                  "Sales",
                  "Inventory",
                  "Attachment",
                ]}
              >
                {/* <GeneralItem data={this.state} /> */}
                <GeneralItem data={this.state} />
                <Purchasing data={this.state} />
                <Sales data={this.state} />
                <Inventory data={this.state} />
                <PreviewAttachment
                  attachmentEntry={this.state.attachmentEntry}
                />
              </Taps>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default withRouter(ItemMasterDataDetails);

function GeneralItem(props: any) {
  const { data } = props;

  let inventoryManagementType: string = "";
  let sriAndBatchManageMethod: string | undefined =
    data?.sriAndBatchManageMethod;
  if (data?.sriAndBatchManageMethod === "bomm_OnEveryTransaction") {
    sriAndBatchManageMethod = "On Every Transaction";
  } else if (data?.sriAndBatchManageMethod === "bomm_OnReleaseOnly") {
    sriAndBatchManageMethod = "On Release Only";
  }

  if (
    data?.manageBatchNumbers === "tYES" &&
    data?.manageSerialNumbers === "tNO"
  ) {
    inventoryManagementType = "Batches";
  } else if (
    data?.manageSerialNumbers === "tYES" &&
    data?.manageBatchNumbers === "tNO"
  ) {
    inventoryManagementType = "Serial Numbers";
  } else if (
    data?.manageSerialNumbers === "tNO" &&
    data?.manageBatchNumbers === "tNO"
  ) {
    inventoryManagementType = "None";
  }

  let status: string = "";

  if (data?.valid === "tYES" && data?.frozen === "tNO") {
    status = "Active";
  } else if (data?.valid === "tNO" && data?.frozen === "tYES") {
    status = "Inactive";
  } else if (data?.valid === "tYES" && data?.frozen === "tYES") {
    status = "Advanced";
  } else {
    status = "N/A";
  }

  interface IData {
    ValidFrom: string | null;
    ValidTo: string | null;
    ValidRemarks: string | null;
    FrozenFrom: string | null;
    FrozenTo: string | null;
    FrozenRemarks: string | null;
  }

  interface ILabelFieldProps {
    label: string;
    children: React.ReactNode;
  }

  const LabelField = ({ label, children }: ILabelFieldProps) => {
    return (
      <div>
        <label>{label}</label>
        <span>{children}</span>
      </div>
    );
  };

  return (
    <div className="grow w-full grid grid-cols-2 sm:grid-cols-1 gap-2 text-[12px] py-2">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500"> Withhlding Tax Liable</span>{" "}
          <span className="col-span-2 font-medium">
            {" "}
            :<input type="checkbox" checked={data?.wtLiable === "tYES"} />
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Do Not Apply Discount Group</span>{" "}
          <span className="col-span-2 font-medium">
            :<input type="checkbox" checked={data?.noDiscounts === "tYES"} />
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Manufacturer</span>{" "}
          <span className="col-span-2 font-medium">
            {" "}
            :{" "}
            {
              new ManufacturerRepository().find(data?.manufacturer)
                ?.ManufacturerName
            }
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Additional Identifier</span>{" "}
          <span className="col-span-2 font-medium">: {data?.sWW ?? "N/A"}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Shipping Type</span>{" "}
          <span className="col-span-2 font-medium">
            : {new ShippingTypeRepository().find(data?.shipType)?.Name}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Manage Item by</span>{" "}
          <span className="col-span-2 font-medium">
            : {inventoryManagementType ?? "N/A"}
          </span>
        </div>
        {data?.manageBatchNumbers === "tYES" ||
        data?.manageSerialNumbers === "tYES" ? (
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Management Method</span>{" "}
            <span className="col-span-2 font-medium">
              : {sriAndBatchManageMethod ?? "N/A"}
            </span>
          </div>
        ) : null}
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Status</span>{" "}
          <span className="col-span-2 font-medium">: {status ?? "N/A"}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Standard Item Identification</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.stdItemIdentificaiton ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Commodity Classification</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.commodityclassificaiton ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Remarks </span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.user_Text ?? "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}

function Purchasing(props: any) {
  const { data } = props;

  return (
    <div className="grow w-full grid grid-cols-2 sm:grid-cols-1 gap-2 text-[12px] py-2">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Prefered Vendor</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.itemPreferredVendors[0]?.BPCode ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Mfr Catalog No.</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.supplierCatalogNo ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Purchasing UoM Name</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.purchaseUnit ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Items Per Purchasing Unit</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.purchaseItemsPerUnit ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Packaging UoM Name</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.purchaseUnit ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Quantity per Package</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.purchaseQtyPerPackUnit ?? "N/A"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Length</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.purchaseUnitLength ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Width</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.purchaseUnitWidth ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Height</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.purchaseUnitHeight ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Volume</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.purchaseUnitVolume ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Weight</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.purchaseUnitWeight ?? "N/A"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Factor 1</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.purchaseFactor1 ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Factor 2</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.purchaseFactor1 ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Factor 3</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.purchaseFactor1 ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Factor 4</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.purchaseFactor1 ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Customs Group</span>{" "}
          <span className="col-span-2 font-medium">
            :{" "}
            {new CustomsGroupRepository().find(data.customsGroupCode)?.Name ??
              "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Tax Group</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.purchaseVATGroup ?? "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}

function Sales(props: any) {
  const { data } = props;

  return (
    <div className="grow w-full grid grid-cols-2 sm:grid-cols-1 gap-2 text-[12px] py-2">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Tax Group</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.salesVATGroup ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Sales UoM Name</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.salesUnit ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Items Per Sales Unit</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.salesItemsPerUnit ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Packaging UoM Name</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.salesPackagingUnit ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Quantity per Package</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.salesQtyPerPackUnit ?? "N/A"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Length</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.salesUnitWidth ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Width</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.salesUnitWidth ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Height</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.salesUnitHeight ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Volume</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.salesUnitVolume ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Weight</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.salesUnitWeight ?? "N/A"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Factor 1</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.salesFactor1 ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Factor 2</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.salesFactor2 ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Factor 3</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.salesFactor3 ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Factor 4</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.salesFactor4 ?? "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-500">Create QR Code From</span>{" "}
          <span className="col-span-2 font-medium">
            : {data?.createQRCodeFrom ?? "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}

function Inventory(props: any) {
  const { data } = props;

  const itemColumn = useMemo(
    () => [
      {
        accessorKey: "WarehouseCode",
        header: "Warehouse Code", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 88,
      },

      {
        accessorKey: "WarehouseCode",
        header: "Warehouse Name",
        Cell: ({ cell }: any) =>
          new WarehouseRepository().find(cell.getValue())?.WarehouseName ??
          "N/A",
      },

      {
        accessorKey: "Locked",
        header: "Locked",
        Cell: ({ cell }: any) => (
          <input
            type="checkbox"
            disabled
            checked={cell.getValue() === "tYES"}
          />
        ),
      },
      // <input type="checkbox" checked={this.state.purchaseItem === 'tYES'} onChange={() => { }} />
      {
        accessorKey: "InStock",
        header: "In Stock",
        Cell: ({ cell }: any) => currencyFormat(cell.getValue()),
      },
      {
        accessorKey: "Committed",
        header: "Committed",
        Cell: ({ cell }: any) => currencyFormat(cell.getValue()),
      },
      {
        accessorKey: "Ordered",
        header: "Ordered",
        Cell: ({ cell }: any) => currencyFormat(cell.getValue()),
      },
      {
        accessorKey: "Available",
        header: "Available",
        Cell: ({ cell }: any) => currencyFormat(cell.getValue()),
      },

      {
        accessorKey: "MinimalStock",
        header: "Min. Inventory",
        Cell: ({ cell }: any) => currencyFormat(cell.getValue()),
      },
      {
        accessorKey: "MaximalStock",
        header: "Max. Inventory",
        Cell: ({ cell }: any) => currencyFormat(cell.getValue()),
      },
      {
        accessorKey: "MinimalOrder",
        header: "Req. Inv. Level",
        Cell: ({ cell }: any) => currencyFormat(cell.getValue()),
      },
    ],
    [data]
  );

  return (
    <div>
      <div className="grow w-full grid grid-cols-2 sm:grid-cols-1 gap-2 text-[12px] py-2">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Set G/L Account by</span>{" "}
            <span className="col-span-2 font-medium">
              :{" "}
              {data?.glMethod === "glm_WH"
                ? "Warehouse"
                : data?.glMethod === "glm_ItemClass"
                ? "Item Class"
                : data?.glMethod === "glm_ItemLevel"
                ? "Item Level"
                : data?.glMethod ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500"> UoM Name</span>{" "}
            <span className="col-span-2 font-medium">
              : {data?.inventoryUOM ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Weight</span>{" "}
            <span className="col-span-2 font-medium">
              : {data?.inventoryWeight ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Manage Inventory by Warehouse</span>{" "}
            <span className="col-span-2 font-medium">
              :{" "}
              <input
                type="checkbox"
                checked={data?.manageStockByWarehouse === "tYES"}
                onChange={() => {}}
              />
            </span>
          </div>
          {/*  */}
        </div>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Required (Purchasing UoM)</span>{" "}
            <span className="col-span-2 font-medium">
              : {data?.desiredInventory ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Minimum</span>{" "}
            <span className="col-span-2 font-medium">
              : {data?.minInventory ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Maximum</span>{" "}
            <span className="col-span-2 font-medium">
              : {data?.maxInventory ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Valuation Method</span>{" "}
            <span className="col-span-2 font-medium">
              :{" "}
              {data?.costAccountingMethod === "bis_MovingAverage"
                ? "Moving Average"
                : data?.costAccountingMethod === "bis_Standard"
                ? "Standard"
                : data?.costAccountingMethod === "bis_FIFO"
                ? "FIFO"
                : data?.costAccountingMethod === "bis_SNB"
                ? "SNB"
                : data?.costAccountingMethod ?? "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Item Cost </span>{" "}
            <span className="col-span-2 font-medium">
              : {data?.countingItemsPerUnit ?? "N/A"}
            </span>
          </div>
        </div>
      </div>
      <div>
        <MaterialReactTable
          columns={itemColumn}
          data={data?.itemWarehouseInfoCollection ?? []}
          enableHiding={true}
          initialState={{ density: "compact" }}
          enableDensityToggle={false}
          enableColumnResizing
          enableStickyHeader={true}
          enableStickyFooter={true}
          enableTableHead={true}
          enableTopToolbar={false}
          enableColumnActions={false}
          enableGlobalFilter={false}
          enableFilters={false}
          enableFullScreenToggle={false}
          enablePagination={false}
          getRowId={(row: any) => row.DocEntry}
          state={
            {
              // isLoading: true,
            }
          }
        />
      </div>
    </div>
  );

  // </div>
}
