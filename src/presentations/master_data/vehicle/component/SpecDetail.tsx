import MUITextField from "@/components/input/MUITextField";
import { TextField } from "@mui/material";
import React from "react";
import { UseFormProps } from "../form/VehicleForm";


const SpecDetail = ({ register }: UseFormProps) => {
  return (
    <div>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
          <h2>Spac Detail</h2>
        </div>
        <div className="  flex gap-[100px]">
          <div className="col-span-5  w-[50%]">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Brand
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField inputProps={{ ...register("U_Brand") }} />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Model
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField inputProps={{ ...register("U_Model") }} />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Year
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField inputProps={{ ...register("U_Year") }} />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Color
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField inputProps={{ ...register("WorkStreet") }} />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Engine Number
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField inputProps={{ ...register("U_EngineNumber") }} />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  VIN Number
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField inputProps={{ ...register("WorkCity") }} />
              </div>
            </div>
          </div>

          <div className="col-span-5  w-[50%]">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Length / M
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField inputProps={{ ...register("U_Length") }} />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Width / M
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField inputProps={{ ...register("U_Width") }} />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Height / M
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField inputProps={{ ...register("U_Height") }} />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Weigth / TON
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField inputProps={{ ...register("U_Weight") }} />
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Volume (Cbm)
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField inputProps={{ ...register("U_Volumn") }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecDetail;
