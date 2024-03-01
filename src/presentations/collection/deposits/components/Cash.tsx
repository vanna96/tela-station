import MUITextField from "@/components/input/MUITextField";
import { UseFormProps } from "../form";
import { useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import DepositCashAccountAutoComplete from "./DepositCashAccountAutoComplete";

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
}: UseFormProps) => {
  const [staticSelect, setStaticSelect] = useState({
    depositDate: null,
    status: "",
    termination: null,
    branchASS: null,
  });

  useEffect(() => {
    if (defaultValues) {
      defaultValues?.EmployeeBranchAssignment?.forEach((e: any) =>
        setStaticSelect({ ...staticSelect, branchASS: e?.BPLID })
      );
    }
  }, [defaultValues]);

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
                <label htmlFor="Deposit Code" className="text-gray-500">
                  Deposit Code
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "G/L Account Code is required" }}
                  name="U_tl_cash_acc"
                  control={control}
                  render={({ field }) => {
                    return (
                      <DepositCashAccountAutoComplete
                       disabled={detail}
                        value={field.value}
                        onChange={(e: any) => {
                          setValue(
                            "U_tl_cash_acc",
                            e?.Code,
                          );
                          setValue(
                            "U_tl_cash_des",
                            e?.Name,
                          );
                          setValue(
                            "AllocationAccount",
                            e?.U_tl_cashacct,
                          );
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Deposit Name" className="text-gray-500">
                  Deposit Name
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail || true}
                  value={useWatch({control, name: 'U_tl_cash_des' })}
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
                startAdornment={watch('DepositCurrency') ?? 'USD'}
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
