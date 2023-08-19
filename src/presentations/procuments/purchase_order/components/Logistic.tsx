import FormCard from "@/components/card/FormCard";
import MUISelect from "@/components/selectbox/MUISelect";
import Owner from "@/components/selectbox/Owner";
import PaymentMethod from "@/components/selectbox/PaymentMethod";
import PaymentTerm from "@/components/selectbox/PaymentTerm";
import ShippingType from "@/components/selectbox/ShippingType";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import * as React from "react";

export interface ILogisticFormProps {
  data: any;
  edit?: boolean;
  handlerChange: (key: string, value: any) => void;
}

export default function GeneralForm({
  data,

  handlerChange,
  edit
}: ILogisticFormProps) {
  return (
    <FormCard title="Logistic">
      <div className="col-span-2">
        <div className="w-[20rem]">
          <label htmlFor="Code" className="text-gray-500 text-[14px]">
            Shipping Type
          </label>
          <ShippingType
            name="TransportationCode"
            value={data?.TransportationCode}
            onChange={(e) => handlerChange("TransportationCode", e.target.value)}
          /></div>
      </div>
      <div className="mt-2">
        <label htmlFor="Code" className="text-gray-500 text-[14px]">
          Ship To
        </label>
        <div className="">
          <TextField
            size="small"
            multiline
            rows={4}
            fullWidth
            name="Address2"
            key={data?.Address2}
            onBlur={(e) => handlerChange("Address2", e.target.value)}
            defaultValue={data?.Address2}
            disabled={data.DocumentStatus === "bost_Close" ? true : false}
          />
        </div>
      </div>
      <div>
        <div className="mt-2">
          <label htmlFor="Code" className="text-gray-500 text-[14px]">
            Pay To
          </label>
          <div className="">
            <TextField
              size="small"
              multiline
              rows={4}
              fullWidth
              name="Address"
              defaultValue={data?.Address1}
              key={data?.Address1}
              disabled={data.DocumentStatus === "bost_Close" ? true : false}
            />
          </div>
        </div>
      </div>
    </FormCard>
  );
}
