import FormCard from "@/components/card/FormCard";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import BranchSelect from "../../../../components/selectbox/Branch";
import Checkbox from "@mui/material/Checkbox";
import ItemGroupSelect from "@/components/selectbox/ItemGroup";
import UOMSelect from "@/components/selectbox/UnitofMeasurment";
import PriceListSelect from "@/components/selectbox/PriceList";
import { useRef, useState } from "react";

export interface IHeadingFormProps {
  handlerChange: (key: string, value: any) => void;
  edit?: boolean;
  data: any;
  name: string
}

export default function HeadingForm({
  handlerChange,
  edit,
  data, name
}: IHeadingFormProps) {


  const [isCheckedInventory, setIsCheckedInventory] = useState<boolean>(false);
  const [isCheckedPurchase, setIsCheckedPurchase] = useState<boolean>(false);
  const [isCheckedSales, setIsCheckedSales] = useState<boolean>(false);
 

  console.log(data);
  return (
    <>
      <FormCard title="Information">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Item
              </label>
              <div className="">
                <MUISelect
                  items={[
                    { name: "Manual", value: 12 },
                    { name: "Employee", value: 171 },
                  ]}
                  onChange={(e) => handlerChange("reqType", e.target.value)}
                  value={data?.reqType}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="ReqType"
                />
              </div>
            </div>
            <MUITextField
              label=" No."
              value={data?.itemCode}
              name="ItemCode"
              onChange={(e) => handlerChange("itemCode", e.target.value)}

            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Description
              </label>
              <div className="">
                <MUITextField name="itemName" value={data.itemName} onChange={(e) => handlerChange("itemName", e.target.value)} />
              </div>
            </div>

            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Foreign Name
              </label>
              <div className="mt-1">
                <MUITextField
                  name="ForeignName"
                  value={data.foreignName}
                  onChange={(e) => handlerChange("foreignName", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Item Type
              </label>
              <div className="">
                <MUISelect
                  items={[
                    { name: "Items", value: "itItems" },
                    { name: "Labor", value: "itLabor" },
                    { name: "Travel", value: "itTravel" },
                    { name: "Fixed Assets", value: "itFixedAssets" },
                  ]}
                  onChange={(e) => handlerChange("itemType", e.target.value)}
                  name="itemType"
                  value={data?.itemType}
                  aliasvalue="id"
                  aliaslabel="name"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Item Group
              </label>
              <div className="">
                <ItemGroupSelect
                  name="itemsGroupCode"
                  value={data.itemsGroupCode}
                  onChange={(e) => handlerChange("itemsGroupCode", e.target.value)}
                />
              </div>
            </div>
          </div>

        </div>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                UoM Group
              </label>
              <div className="">
                <UOMSelect
                  name="uomGroupEntry"
                  value={data.uomGroupEntry}
                  onChange={(e) => handlerChange("uomGroupEntry", e.target.value)}
                />

              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Price Lists
              </label>
              <div className="">
                <PriceListSelect
                  name="PriceList"
                  value={data.priceList}
                  onChange={(e) => handlerChange("priceList", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Bar Code

              </label>
              <div className="">
                <MUITextField
                  name="Barcode"
                  value={data.barCode}
                  onChange={(e) => handlerChange("barCode", e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Unit Price
              </label>
              <div className="">
                <MUITextField
                  name="inventoryUOM"
                  value={data.inventoryUOM}
                  onChange={(e) => handlerChange("inventoryUOM", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">

            <div className="grid grid-cols- gap-3">
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center gap-1 text-sm">

                  <input type="checkbox" name='inventoryItem'
                  checked={edit ? data?.inventoryItem : isCheckedInventory}
                    onChange={(e) => {
                      const { checked } = e.target;
                      const value = checked ? true : false;
                      setIsCheckedInventory(value);
                      handlerChange("inventoryItem", value);
                    }} />
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Inventory Item
                  </label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols- gap-3">
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center gap-1 text-sm">

                  <input type="checkbox" name='salesItem' 
                    checked={edit ? data?.salesItem : isCheckedSales}
                    onChange={(e) => {
                      const { checked } = e.target;
                      const value = checked ? true : false;
                      setIsCheckedSales(value);
                      handlerChange("salesItem", value);
                    }} />
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Sales Item
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid grid-cols- gap-3">
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    name="purchaseItem"
                    checked={edit ? data?.purchaseItem : isCheckedPurchase}
                    onChange={(e) => {
                      const { checked } = e.target;
                      const value = checked ? true : false;
                      setIsCheckedPurchase(value);
                      handlerChange("purchaseItem", value);
                    }} />

                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Purchasing Item
                  </label>
                </div>
              </div>
            </div>

          </div>
        </div>
      </FormCard>
    </>
  );
}
