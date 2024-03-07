import MUITextField from "@/components/input/MUITextField";
import { UseFormProps } from "../form";
import { useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import DepositCashAccountAutoComplete from "./DepositCashAccountAutoComplete";
import MUISelect from "@/components/selectbox/MUISelect";

const Cash = ({
  register,
  control,
  defaultValues,
  setValue,
  setBranchAss,
  branchAss,
  detail,
  data,
  watch,
  getValues,
}: UseFormProps) => {
  const [staticSelect, setStaticSelect] = useState({
    depositDate: null,
    status: "",
    U_tl_cash_des: "",
  });

  return (
    <>
      <div className="rounded-lg shadow-sm border p-6 m-3 px-8">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
          <h2>Cash</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className=" md:col-span-12">
          <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Fuel Type
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_tl_cash_des"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        disabled={detail}
                        items={[
                          { label: "111102 - Cash balance - station(USD)", value: "111102" },
                          { label: "111103 - Cash balance - station(KHR)", value: "111103" },
                        ]}
                        onChange={(e: any) => {
                          setValue("U_tl_cash_des", e.target.value);

                          setStaticSelect({
                            ...staticSelect,
                            U_tl_cash_des: e.target.value,
                          });
                        }}
                        value={field.value}
                        // value={
                        //   staticSelect.U_FuelType || defaultValues?.U_FuelType
                        // }
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
                <label htmlFor="Cash Balance Station" className="text-gray-500">
                Cash Balance Station
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail || true}
                  value={useWatch({ control, name: "U_tl_cash_des" })}
                  name="U_tl_cash_des"
                />
              </div>
            </div>
            <div className="grid grid-cols-5">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Amount
                </label>
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </div>
              <div className="col-span-3">
                <MUITextField
                  startAdornment={watch("DepositCurrency") ?? "USD"}
                  disabled={detail}
                  inputProps={{
                    ...register("TotalLC"),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cash;
