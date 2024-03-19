import React from "react";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import StopsSelect from "@/components/selectbox/StopsSelect";
import { DurationPicker } from "./duration-picker";
import BaseStationAutoComplete from "@/components/input/BaseStationAutoComplete";

export interface IGeneralFormProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
  setData?: any;
  detail?: boolean;
}

export default function GeneralForm({
  data,
  handlerChange,
  edit,
  setData,
  detail,
}: IGeneralFormProps) {
  return (
    <div className="rounded-lg shadow-sm bg-white border p-6 px-8 h-[calc(100vh-200px)]">
      <div className="font-medium text-xl flex justify-between items-center border-b mb-4">
        <h2>Information</h2>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-5 md:col-span-12">
          <FormField
            label="Base Station"
            required
            inputComponent={
              <BaseStationAutoComplete
                value={data?.U_BaseStation}
                onChange={(e: any) => handlerChange("U_BaseStation", e)}
                onBlur={(e: any) => setData({ ...data, U_BaseStation: e })}
              />
            }
          />
          <FormField
            label="Destination"
            required
            inputComponent={
              <StopsSelect
                value={data?.U_Destination}
                onHandlerChange={(val) =>
                  handlerChange("U_Destination", val?.Code)
                }
              />
            }
          />
          <FormField
            label="Route Code"
            required
            inputComponent={
              <MUITextField
                value={data?.Code}
                name="Code"
                onChange={(e) => handlerChange("Code", e.target.value)}
                disabled={edit || detail}
              />
            }
          />
          <FormField
            label="Route Name"
            required
            inputComponent={
              <MUITextField
                value={data?.Name}
                name="Name"
                onChange={(e) => handlerChange("Name", e.target.value)}
              />
            }
          />

          {/* <FormField
            label="Driver Incentive"
            inputComponent={
              <MUITextField
                value={data?.U_Incentive}
                name="U_Incentive"
                type="number"
                onChange={(e) => handlerChange("U_Incentive", e.target.value)}
              />
            }
          /> */}
        </div>
        <div className="col-span-2 md:col-span-2"></div>
        <div className="col-span-5 md:col-span-12">
          <FormField
            label="Status"
            inputComponent={
              <MUISelect
                items={[
                  { id: "Y", name: "Active" },
                  { id: "N", name: "Inactive" },
                ]}
                onChange={(e) => handlerChange("U_Status", e.target.value)}
                value={data?.U_Status || "Y"}
                aliasvalue="id"
                aliaslabel="name"
                name="U_Status"
              />
            }
          />

          <FormField
            label="Distance (KM)"
            inputComponent={
              <MUITextField
                value={data?.U_Distance}
                name="U_Distance"
                type="number"
                onChange={(e) => handlerChange("U_Distance", e.target.value)}
              />
            }
          />

          <FormField
            label="Travel Hour"
            inputComponent={
              <DurationPicker
                value={data?.U_Duration}
                onChange={(e) => handlerChange("U_Duration", e)}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  inputComponent: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  inputComponent,
}) => (
  <div className="grid grid-cols-5 py-2">
    <div className="col-span-2">
      <label htmlFor={label} className="text-gray-500">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
    </div>
    <div className="col-span-3">{inputComponent}</div>
  </div>
);
