import CountryAutoComplete from "@/components/input/CountryAutoComplete";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { formatDate } from "@/helper/helper";
import { UseFormProps } from "../form/VehicleForm";

const Engine = ({
  register,
  control,
  defaultValues,
  setValue,
  header,
  setHeader
}: UseFormProps) => {
  const [staticSelect, setStaticSelect] = useState({
    U_HeadlampType: "",

  });
  
  return (
    <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
      <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
        <h2>Engine / Transmission</h2>
      </div>
      <div className="  flex gap-[100px]">
        <div className="col-span-5  w-[50%]">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Engine Size
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField inputProps={{ ...register("U_EngineSize") }} />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                No. Of Cylinders
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField inputProps={{ ...register("U_CylinderNo") }} />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Battery VOL
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField inputProps={{ ...register("U_BatteryType") }} />
            </div>
          </div>
        </div>

        <div className="col-span-5  w-[50%]">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Transmission Type
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField
                inputProps={{
                  ...register("U_TransmissionType"),
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Spark Plug Type
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField inputProps={{ ...register("U_SparkPlugType") }} />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Headlamp Type
              </label>
            </div>
            <div className="col-span-3">
              <Controller
                name="U_HeadlampType"
                control={control}
                render={({ field }) => {
                  return (
                    <MUISelect
                      items={[
                        { label: "LED", value: "LED" },
                        { label: "HID", value: "HID" },
                      ]}
                      onChange={(e: any) => {
                        setValue("U_HeadlampType", e.target.value);

                        setStaticSelect({
                          ...staticSelect,
                          U_HeadlampType: e.target.value,
                        });
                      }}
                      value={
                        staticSelect.U_HeadlampType || defaultValues?.U_Type
                      }
                      aliasvalue="value"
                      aliaslabel="label"
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Engine;
