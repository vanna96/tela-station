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
  setHeader,
  detail
}: UseFormProps) => {
  const [staticSelect, setStaticSelect] = useState({
    U_HeadlampType: "",
    U_BatteryType: "",
    U_SparkPlugType: "",
    U_TransmissionType: "",
  });

  return (
    <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
      <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
        <h2>Engine / Transmission</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-[6rem] md:gap-0">
        <div className="">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Engine Size HP
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField
                type="number"
                disabled={detail}
                inputProps={{ ...register("U_EngineSize") }}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                No. Of Cylinders
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField
                disabled={detail}
                inputProps={{ ...register("U_CylinderNo") }}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Battery VOL
              </label>
            </div>
            <div className="col-span-3">
              <Controller
                name="U_BatteryType"
                control={control}
                render={({ field }) => {
                  return (
                    <MUISelect
                      disabled={detail}
                      items={[
                        { label: "12V", value: "12V" },
                        { label: "24V", value: "24V" },
                      ]}
                      onChange={(e: any) => {
                        setValue("U_BatteryType", e.target.value);

                        setStaticSelect({
                          ...staticSelect,
                          U_BatteryType: e.target.value,
                        });
                      }}
                      // value={
                      //   staticSelect.U_BatteryType ||
                      //   defaultValues?.U_BatteryType
                      // }
                      value={field.value}
                      aliasvalue="value"
                      aliaslabel="label"
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>

        <div className="">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Transmission Type
              </label>
            </div>
            <div className="col-span-3">
              <Controller
                name="U_TransmissionType"
                control={control}
                render={({ field }) => {
                  return (
                    <MUISelect
                      disabled={detail}
                      items={[
                        { label: "Manual", value: "MANUAL" },
                        { label: "Auto", value: "AUTO" },
                      ]}
                      onChange={(e: any) => {
                        setValue("U_TransmissionType", e.target.value);

                        setStaticSelect({
                          ...staticSelect,
                          U_TransmissionType: e.target.value,
                        });
                      }}
                      // value={
                      //   staticSelect.U_TransmissionType ||
                      //   defaultValues?.U_TransmissionType
                      // }
                      value={field.value}
                      aliasvalue="value"
                      aliaslabel="label"
                    />
                  );
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
              <Controller
                name="U_Type"
                control={control}
                render={({ field }) => {
                  return (
                    <MUISelect
                      disabled={detail}
                      items={[
                        { label: "Copper", value: "Copper" },
                        { label: "Silver", value: "Silver" },
                        { label: "Platinum", value: "Platinum" },
                      ]}
                      onChange={(e: any) => {
                        setValue("U_SparkPlugType", e.target.value);

                        setStaticSelect({
                          ...staticSelect,
                          U_SparkPlugType: e.target.value,
                        });
                      }}
                      // value={
                      //   staticSelect.U_SparkPlugType ||
                      //   defaultValues?.U_SparkPlugType
                      // }
                      value={field.value}
                      aliasvalue="value"
                      aliaslabel="label"
                    />
                  );
                }}
              />
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
                      disabled={detail}
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
                      // value={
                      //   staticSelect.U_HeadlampType ||
                      //   defaultValues?.U_HeadlampType
                      // }
                      value={field.value}
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
