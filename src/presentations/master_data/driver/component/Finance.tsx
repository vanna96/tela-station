import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { TextField } from "@mui/material";
import React, { useState } from "react";
import { UseFormProps } from "../form";
import { Controller } from "react-hook-form";
import BankAutoComplete from "@/components/input/BankAutoComplete";

const Finance = ({
  register,
  control,
  defaultValues,
  setValue,
  detail,
  watch,
}: UseFormProps) => {
  const [staticSelect, setStaticSelect] = useState({
    salaryUnit: "",
  });

  return (
    <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
      <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
        <h2>Finance</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-[6rem] md:gap-0 ">
        <div className="">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Salary
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField
                disabled={detail}
                inputProps={{
                  ...register("Salary"),
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Salary Unit
              </label>
            </div>
            <div className="col-span-3">
              <Controller
                name="SalaryUnit"
                control={control}
                render={({ field }) => {
                  return (
                    <MUISelect
                      disabled={detail}
                      items={[
                        { label: "Biweekly", value: "B" },
                        { label: "Day", value: "D" },
                        { label: "Hour", value: "H" },
                        { label: "Month", value: "scu_Month" },
                        { label: "Semimonthly", value: "S" },
                        { label: "Week", value: "W" },
                        { label: "Year", value: "Y" },
                      ]}
                      onChange={(e: any) => {
                        setValue("SalaryUnit", e.target.value);
                      }}
                      value={watch("SalaryUnit") || defaultValues?.SalaryUnit}
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
                Bank
              </label>
            </div>
            <div className="col-span-3">
              <Controller
                name="BankCode"
                control={control}
                render={({ field }) => {
                  return (
                    <BankAutoComplete
                      disabled={detail}
                      {...field}
                      value={watch('BankCode') || defaultValues?.BankCode}
                      onChange={(e: any) => {
                        setValue("BankCode", e);
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
                Account No.
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField
                disabled={detail}
                inputProps={{
                  ...register("BankAccount"),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;
