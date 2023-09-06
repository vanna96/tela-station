import FormCard from "@/components/card/FormCard";
import MUITextField from "@/components/input/MUITextField";
import BPAddress from "@/components/selectbox/BPAddress";
import BPProject from "@/components/selectbox/BPProject";
import MUISelect from "@/components/selectbox/MUISelect";
import Owner from "@/components/selectbox/Owner";
import PaymentMethod from "@/components/selectbox/PaymentMethod";
import PaymentTerm from "@/components/selectbox/PaymentTerm";
import ShippingType from "@/components/selectbox/ShippingType";
import WarehouseByBranch from "@/components/selectbox/WarehouseByBranch";
import { agreementMethodLists, documentStatusList } from "@/constants";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";

export interface ILogisticFormProps {
  data: any;
  handlerChange: (key: string, value: any) => void;
  edit?: boolean;
  ref?: React.RefObject<FormCard>;
}

export default function LogisticForm({
  data,
  handlerChange,
  edit,
  ref,
}: ILogisticFormProps) {
  return (
    <FormCard title="Logistics" ref={ref}>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 text-sm">
            <label
              htmlFor="PayTermsGrpCode"
              className="text-gray-500 text-[14px]"
            >
              Ship-From Address
            </label>
            <div className="">
              {/* <MUISelect
                items={data?.BPAddressList
                  ?.filter((e: BPAddress) => e.addressType === "bo_ShipTo")
                  .map((e: BPAddress) => ({
                    value: e.addressName,
                    name: e.addressName
                  }))
                }
                aliaslabel="name"
                aliasvalue="value"
                value={data?.ShipToCode}
                // onChange={(event) => handlerChange("ShipToCode", event.target.value)}
                onChange={(event) => {
                  handlerChange("ShipToCode", event.target.value);
                  const selectedShipToAddress = data?.BPAddressList?.find((e: BPAddress) => e.addressName === event.target.value);
                  if (selectedShipToAddress) {
                    handlerChange("Address2", selectedShipToAddress.street || '');
                  }
                }}
              /> */}
              {/* <BPAddress
                name="ShippingTo"
                type="bo_ShipTo"
                disabled={data?.isStatusClose || false}
                data={data}
                value={data.ShippingTo}
                onChange={(e) => handlerChange("ShippingTo", e.target.value)}
              /> */}
              <WarehouseByBranch
                Branch={data.Branch}
                value={data.ShippingTo}
                onChange={(e) => handlerChange("ShippingTo", e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <label
              htmlFor="PayTermsGrpCode"
              className="text-gray-500 text-[14px]"
            >
              Ship-To Address
            </label>
            <BPAddress
              name="BillTo"
              type="bo_BillTo"
              disabled={data?.isStatusClose || false}
              data={data}
              value={data.BillTo}
              onChange={(e) => handlerChange("BillTo", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Shipping Type
            </label>
            <div className="">
              <ShippingType
                name="ShippingType"
                value={data.ShippingType}
                onChange={(e) => handlerChange("ShippingType", e.target.value)}
              />
            </div>
          </div>
          {/* <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Ship-From Address
            </label>

            <div className="">
              <TextField
                size="small"
                multiline
                rows={2}
                fullWidth
                name="Address2"
                value={data.Address2}
                className="w-full "
                onChange={(e) => handlerChange("Address2", e.target.value)}
              />
            </div>
          </div> */}

          {/* <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Bill-To Address
            </label>
            <div className="">
              <MUISelect
            items={data?.BPAddressList?.filter(
              (e: BPAddress) => e.addressType === "bo_BillTo"
            ).map((e: BPAddress) => ({
              value: e.addressName,
              name: e.addressName,
            }))}
            aliaslabel="name"
            aliasvalue="value"
            value={data?.PayToCode}
            // onChange={(event) => handlerChange("PayToCode", event.target.value)
            onChange={(event) => {
              handlerChange("PayToCode", event.target.value);
              const selectedShipToAddress = data?.BPAddressList?.find(
                (e: BPAddress) => e.addressName === event.target.value
              );
              if (selectedShipToAddress) {
                handlerChange("Address", selectedShipToAddress.street || "");
              }
            }}
          /> */}
          {/* <BPAddress
                name="BillingTo"
                type="bo_BillTo"
                data={data}
                value={data.BillingTo}
                disabled={data?.isStatusClose || false}
                onChange={(e) => handlerChange("BillingTo", e.target.value)}
              /> */}
          {/* </div>
          </div> */}
        </div>

        {/* <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Ship Address Summary
            </label>

            <div className="">
              <TextField
                size="small"
                multiline
                rows={2}
                fullWidth
                name="Address2"
                value={data.Address2}
                className="w-full "
                onChange={(e) => handlerChange("Address2", e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Bill Address Summary
            </label>
            <div className="">
              <TextField
                size="small"
                multiline
                rows={2}
                fullWidth
                name="Address"
                className="w-full "
                value={data.Address}
                onChange={(e) => handlerChange("Address", e.target.value)}
              />
            </div>
          </div>
        </div> */}
        <div className="grid grid-cols-2 gap-3">
          {/* <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Shipping Type
            </label>
            <div className="">
              <ShippingType
                name="ShippingType"
                value={data.ShippingType}
                onChange={(e) => handlerChange("ShippingType", e.target.value)}
              />
            </div>
          </div> */}
          {/* <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="StampNumber" className="text-gray-500 text-[14px]">
              Stamp No.
            </label>
            <div className="">
              <TextField
                size="small"
                defaultValue={data?.StampNumber ?? ""}
                fullWidth
                className="w-full text-field"
                name="StampNumber"
                onBlur={(e) => handlerChange("StampNumber", e.target.value)}
              />
            </div>
          </div> */}
        </div>
      </div>
      {/* <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 text-sm">
          <label htmlFor="Code" className="text-gray-500 text-[14px]">
            Ship Address Summary
          </label>

          <div className="">
            <TextField
              size="small"
              multiline
              rows={2}
              fullWidth
              name="Address2"
              value={data.Address2}
              className="w-full "
              onChange={(e) => handlerChange("Address2", e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <label htmlFor="Code" className="text-gray-500 text-[14px]">
            Bill Address Summary
          </label>
          <div className="">
            <TextField
              size="small"
              multiline
              rows={2}
              fullWidth
              name="Address"
              className="w-full "
              value={data.Address}
              onChange={(e) => handlerChange("Address", e.target.value)}
            />
          </div>
        </div>
      </div> */}
    </FormCard>
  );
}
