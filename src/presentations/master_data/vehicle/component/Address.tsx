import MUITextField from "@/components/input/MUITextField";
import { TextField } from "@mui/material";
import React from "react";
import { UseFormProps } from "../form/VehicleForm";


const Address = ({register}:UseFormProps) => {
  return (
    <div>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
          <h2>Work Address</h2>
        </div>
        <div className="  flex gap-[100px]">
          <div className="col-span-5  w-[50%]">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Street
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField inputProps={{ ...register("WorkStreet") }} />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Street No
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  inputProps={{ ...register("WorkStreetNumber") }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  City
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField inputProps={{ ...register("WorkCity") }} />
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
          <h2>Home Address</h2>
        </div>
        <div className="  flex gap-[100px]">
          <div className="col-span-5  w-[50%]">
           

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Street
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField inputProps={{ ...register("HomeStreet") }} />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Street No
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  inputProps={{ ...register("HomeStreetNumber") }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  City
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField inputProps={{ ...register("HomeCity") }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;
