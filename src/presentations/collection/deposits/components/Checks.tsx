import MUITextField from "@/components/input/MUITextField";
import { UseFormProps } from "../form";
import { useEffect, useState } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import { Controller, useWatch } from "react-hook-form";
import BranchAssignmentAuto from "@/components/input/BranchAssignment";
import AccountCodeAutoComplete from "@/components/input/AccountCodeAutoComplete";
import CashACAutoComplete from "@/components/input/CashAccountAutoComplete";
import GLAccountRepository from "@/services/actions/GLAccountRepository";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import TableCheck from "./TableChecks";
import DepositCheckAutoComplete from "./DepositCheckAutoComplete";

const Checks = ({
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

  const [depositcheck, setDepositcheck] = useState()

  useEffect(() => {
    if (defaultValues) {
      defaultValues?.EmployeeBranchAssignment?.forEach((e: any) =>
        setStaticSelect({ ...staticSelect, branchASS: e?.BPLID })
      );
    }
  }, [defaultValues]);

  return (
    <>
      <div className="rounded-lg shadow-sm border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
          <h2>Checks</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-[10rem] md:gap-0 ">
          <div className="">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Deposit Check
                </label>
              </div>
              <div className="col-span-3">
                <DepositCheckAutoComplete
                  onChange={(e) => setDepositcheck(e.AccountCode)}
                  value={depositcheck}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Find Check No.
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail}
                  inputProps={{
                    // ...register("Find"),
                  }}
                />
              </div>
            </div>
          </div>

          <div className="">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-3">
                {/* <FormControlLabel
                  control={
                    <Radio
                      disabled={detail}

                    />
                  }
                  label={<span className="text-gray-500">Cash Checks</span>}
                /> */}
                <FormControl className="w-full">
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                    style={{ alignSelf: 'flex-start' }}
                  >
                    <FormControlLabel value="Cash Checks" className="flex justify-start" control={<Radio />} label={<span>Cash Checks</span>}
                    />
                    <FormControlLabel value="Postdated Checks" control={<Radio />} label="Postdated Checks" />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </div>
        </div>
        <div>
          <TableCheck data={data} control={control} setValue={setValue} watch={watch} depositcheck={depositcheck} />
        </div>
      </div>
    </>
  );
};

export default Checks;
