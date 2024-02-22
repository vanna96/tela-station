import MUITextField from "@/components/input/MUITextField";
import { TextField } from "@mui/material";
import React from "react";
import { UseFormProps } from "../form";

const Address = ({ register, detail }: UseFormProps) => {
  console.log(detail);
  
  return (
    <div>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
          <h2>Work Address</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-[6rem] md:gap-0 ">
          <div className="">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Street
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  inputProps={{ ...register("WorkStreet") }}
                  disabled={detail}
                />
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
                  disabled={detail}
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
                <MUITextField
                  inputProps={{ ...register("WorkCity") }}
                  disabled={detail}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
          <h2>Home Address</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-[6rem] md:gap-0 ">
          <div className="">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Street
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail}
                  inputProps={{ ...register("HomeStreet") }}
                />
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
                  disabled={detail}
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
                <MUITextField
                  inputProps={{ ...register("HomeCity") }}
                  disabled={detail}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;
