import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { TextField } from "@mui/material";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { UseFormProps } from "../form/VehicleForm";

const Tyres = ({
  register,
  control,
  defaultValues,
  setValue,
  detail,
}: UseFormProps) => {
  const [staticSelect, setStaticSelect] = useState({
    salaryUnit: "",
  });

  return (
    <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
      <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
        <h2>Tyres</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-[6rem] md:gap-0">
        <div className="">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                No. Of Axles
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField
                type="number"
                disabled={detail}
                inputProps={{ ...register("U_AxlesNo") }}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                No. Of Tyres
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField
                type="number"
                disabled={detail}
                inputProps={{ ...register("U_TyresNo") }}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Size (Rear Tyres)
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField
                type="number"
                disabled={detail}
                inputProps={{ ...register("U_TyreRearSize") }}
              />
            </div>
          </div>
        </div>

        <div className="">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Size (Front Tyres)
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField
                type="number"
                disabled={detail}
                inputProps={{
                  ...register("U_TyreFrontSize"),
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Pressure (Rear Tyre) kPa
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField
                type="number"
                disabled={detail}
                inputProps={{ ...register("U_RearPresssure") }}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Pressure (Front Type) kPa
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField
                type="number"
                disabled={detail}
                inputProps={{ ...register("U_FrontPressure") }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tyres;
