import MUITextField from "@/components/input/MUITextField";
import { TextField } from "@mui/material";
import React, { useState } from "react";
import { UseFormProps } from "../form/VehicleForm";
import YearDropdown from "./YearsDropDown";
import YearsAutoComplete from "./YearsDropDown";
import { Controller } from "react-hook-form";


const SpecDetail = ({ register, setHeader, header, detail, setValue, defaultValues, control }: UseFormProps) => {


  return (
    <div>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
          <h2>Spec Detail</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-[6rem] md:gap-0">
          <div className="">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Brand{" "}
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail}
                  inputProps={{
                    ...register("U_Brand", {
                      required: "Brand is required",
                    }),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Model{" "}
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail}
                  inputProps={{
                    ...register("U_Model", {
                      required: "Model is required",
                    }),
                    onBlur: (e) =>
                      setHeader({ ...header, model: e.target.value }),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Year
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_Year"
                  control={control}
                  render={({ field }) => {
                    return (
                      <YearsAutoComplete
                        disabled={detail}
                        {...field}
                        value={defaultValues?.U_Year}
                        onChange={(e: any) => {

                          setValue("U_Year", e);
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Color
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail}
                  inputProps={{ ...register("U_COLOR") }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Engine Number
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail}
                  inputProps={{ ...register("U_EngineNumber") }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  VIN Number
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail}
                  inputProps={{ ...register("U_VIN") }}
                />
              </div>
            </div>
          </div>

          <div className="">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Length / M
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  type="number"
                  disabled={detail}
                  inputProps={{ ...register("U_Length") }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Width / M
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  type="number"
                  disabled={detail}
                  inputProps={{ ...register("U_Width") }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Height / M
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  type="number"
                  disabled={detail}
                  inputProps={{ ...register("U_Height") }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Weigth / TON
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  type="number"
                  disabled={detail}
                  inputProps={{ ...register("U_Weight") }}
                />
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Volume (Cbm)
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  type="number"
                  disabled={detail}
                  inputProps={{ ...register("U_Volumn") }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecDetail;
