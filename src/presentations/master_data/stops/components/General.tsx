import React, { useContext, useState } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import BPLBranchSelect from "@/components/selectbox/BranchBPL";
import MUISelect from "@/components/selectbox/MUISelect";
// import { useExchangeRate } from "../hook/useExchangeRate";
import { useCookies } from "react-cookie";
import CashAccount from "@/components/selectbox/CashAccount";
import { APIContext } from "../../context/APIContext";
import BranchAutoComplete from "@/components/input/BranchAutoComplete";
import CashACAutoComplete from "@/components/input/CashAccountAutoComplete";
import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { UseFormProps } from "../form";

export default function GeneralForm({
  control,
  register,
  defaultValues,
  setValue,
}: UseFormProps) {
  const [staticSelect, setStaticSelect] = useState({
    status: "",
  });
  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-6 px-8 h-[calc(100vh-200px)]">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-4">
          <h2>Information</h2>
        </div>
        <div className="grid grid-cols-12 ">
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Code
                  <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  inputProps={{
                    ...register("Code", { required: 'Code is required' })
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Description
                  <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  inputProps={{
                    ...register("Name", { required: 'Description is required' })
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Status
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_active"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        items={[
                          { value: "Y", label: "Active" },
                          { value: "N", label: "Inactive" },
                        ]}
                        onChange={(e: any) => {
                          setValue("U_active", e.target.value);
                          setStaticSelect({
                            ...staticSelect,
                            status: e.target.value,
                          });
                        }}
                        value={
                          staticSelect.status || defaultValues?.U_active || "Y"
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
          <div className="col-span-2"></div>
          <div className="col-span-5">
            <div className="col-span-5">
              <div className="grid grid-cols-5 py-2">
                <div className="col-span-2">
                  <label htmlFor="Latitude" className="text-gray-500 ">
                    Latitude
                    <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="col-span-3">
                  <MUITextField
                    inputProps={{
                      ...register("U_lat", { required: 'Latitude is required' })
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-5 py-2">
                <div className="col-span-2">
                  <label htmlFor="Latitude" className="text-gray-500 ">
                    Longitude
                    <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="col-span-3">
                  <MUITextField
                    inputProps={{
                      ...register("U_lng", { required: 'Longitude is required' })
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
