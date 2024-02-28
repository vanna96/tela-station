import MUITextField from "@/components/input/MUITextField";
import { UseFormProps } from "../form";
import { useEffect, useState } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import { Controller, useWatch } from "react-hook-form";
import BranchAssignmentAuto from "@/components/input/BranchAssignment";
import AccountCodeAutoComplete from "@/components/input/AccountCodeAutoComplete";
import CashACAutoComplete from "@/components/input/CashAccountAutoComplete";
import GLAccountRepository from "@/services/actions/GLAccountRepository";
import { FormControlLabel, Radio } from "@mui/material";
import TableCheck from "./TableChecks";

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
                <label htmlFor="Code" className="text-gray-500">
                  G/L Account Code
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "G/L Account Code is required" }}
                  name="AllocationAccount"
                  control={control}
                  render={({ field }) => {
                    return (
                      <CashACAutoComplete
                        value={data?.AllocationAccount}
                        onChange={(e: any) => {
                          console.log(e);
                          setValue(
                            "AllocationAccount",
                            new GLAccountRepository().find(e)?.Name,
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
                <label htmlFor="Code" className="text-gray-500">
                  G/L Account Name
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail || true}
                  inputProps={{
                    ...register("AllocationAccount"),
                  }}
                  name="AllocationAccount"
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
                startAdornment={'USD'}
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
