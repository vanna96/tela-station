import MUITextField from "@/components/input/MUITextField";
import { UseFormProps } from "../form";
import { useEffect, useState } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import { Controller } from "react-hook-form";
import BranchAssignmentAuto from "@/components/input/BranchAssignment";
import CashACAutoComplete from "@/components/input/CashAccountAutoComplete";
import GLAccountRepository from "@/services/actions/GLAccountRepository";
import CurrencyAutoComplete from "@/components/input/CurencyAutoComplete";
import LineofBusinessAutoComplete from "@/components/input/LineofBusineesAutoComplete";
import MUISelect from "@/components/selectbox/MUISelect";
import React from "react";

const BasicInformation = ({
  register,
  control,
  defaultValues,
  setValue,
  setBranchAss,
  branchAss,
  detail,
  data,
  watch,
  serie,
  edit,
}: UseFormProps) => {
  const [staticSelect, setStaticSelect] = useState({
    depositDate: null,
    branchASS: null,
    serie: 7855,
  });

  useEffect(() => {
    if (defaultValues) {
      defaultValues?.EmployeeBranchAssignment?.forEach((e: any) =>
        setStaticSelect({ ...staticSelect, branchASS: e?.BPLID })
      );
    }
  }, [defaultValues]);
  const nextNumber = serie?.find(
    (e: any) => e?.Series === staticSelect?.serie
  )?.NextNumber;

  const dataSeries = React.useMemo(() => {
    return serie?.filter(
      (e: any) => e.PeriodIndicator === new Date().getFullYear().toString()
    );
  }, [serie]);

  return (
    <>
      <div className="rounded-lg shadow-sm border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
          <h2>Information</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-[6rem] md:gap-0 ">
          <div className="">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Deposit No." className="text-gray-500 ">
                  Deposit No.
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail || true}
                  value={nextNumber || defaultValues?.nextNumber}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Series" className="text-gray-500 ">
                  Series
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="Series"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        {...field}
                        items={dataSeries}
                        value={staticSelect?.serie || defaultValues?.serie}
                        aliasvalue="Series"
                        aliaslabel="Name"
                        name="Series"
                        onChange={(e: any) => {
                          setValue("Series", e?.target?.value);
                          setStaticSelect({
                            ...staticSelect,
                            serie: e?.target?.value,
                          });
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Deposit Currency" className="text-gray-500 ">
                  Deposit Currency
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="DepositCurrency"
                  control={control}
                  render={({ field }) => {
                    return (
                      <CurrencyAutoComplete
                        {...field}
                        value={field?.value}
                        onChange={(e: any) => {
                          setValue("DepositCurrency", e?.Code);
                          setValue('CheckLines', [])
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Branch" className="text-gray-500 ">
                  Branch
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "Branch is required" }}
                  name="BPLID"
                  control={control}
                  render={({ field }) => {
                    return (
                      <BranchAssignmentAuto
                        {...field}
                        // disabled={detail || defaultValues?.U_Status === "C"}
                        onChange={(e: any) => {
                          setValue("BPLID", e?.BPLID);
                          setValue('CheckLines', [])
                        }}
                        value={field?.value}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="G/L Account Code" className="text-gray-500 ">
                  G/L Account Code
                </label>
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "G/L Account Code is required" }}
                  name="DepositAccount"
                  control={control}
                  disabled={detail}
                  render={({ field }) => {
                    return (
                      <CashACAutoComplete
                        {...field}
                        value={field?.value}
                        onChange={(e: any) => {
                          setValue("DepositAccount", e);
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="G/L Account Name" className="text-gray-500 ">
                  G/L Account Name
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  // disabled={detail || true}
                  value={
                    new GLAccountRepository().find(watch("DepositAccount"))
                      ?.Name
                  }
                />
              </div>
            </div>
          </div>

          <div className="">
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Deposit Date" className="text-gray-500 ">
                  Deposit Date
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="DepositDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        // disabled={detail}
                        {...field}
                        defaultValue={
                          defaultValues?.DepositDate || staticSelect.depositDate
                        }
                        key={`deposit_date_${staticSelect.depositDate}`}
                        onChange={(e: any) => {
                          const val =
                            e.toLowerCase() ===
                            "Invalid Date".toLocaleLowerCase()
                              ? ""
                              : e;
                          setValue("DepositDate", `${val == "" ? "" : val}`);
                          setStaticSelect({
                            ...staticSelect,
                            depositDate: e,
                          });
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Bank" className="text-gray-500 ">
                  Bank
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail || edit}
                  inputProps={{
                    ...register("Bank"),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Account" className="text-gray-500 ">
                  Account
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                // disabled={detail}
                inputProps={{
                  ...register("BankAccountNum"),
                }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Bank Reference" className="text-gray-500 ">
                  Bank Reference
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  // disabled={detail}
                  inputProps={{
                    ...register("BankReference"),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Payer" className="text-gray-500 ">
                  Payer
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  // disabled={detail}
                  inputProps={{
                    ...register("DepositorName"),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Line of Busiiness" className="text-gray-500 ">
                  Line of Busiiness
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_tl_busi"
                  control={control}
                  render={({ field }) => {
                    return (
                      <LineofBusinessAutoComplete
                        // disabled={detail}
                        {...field}
                        value={field?.value}
                        onChange={(e: any) => {
                          setValue("U_tl_busi", e?.FactorCode);
                        }}
                      />
                    );
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
export default BasicInformation;
