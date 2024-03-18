import MUITextField from "@/components/input/MUITextField";
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
import request from "@/utilies/request";
import { CircularProgress } from "@mui/material";
import { loadavg } from "os";
import AttentionTerminalAutoComplete from "../components/AttentionTerminalAutoComplete";
import WarehouseAutoComplete from "../../components/WarehouseAutoComplete";

const BasicInformationDetail = ({
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
  getValues,
}: any) => {
  const [staticSelect, setStaticSelect] = useState({
    branchASS: null,
    serie: 7838,
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
    const targetYear = "2024";
    return serie?.filter((e: any) => {
      const itemYear = new Date(e.PeriodIndicator).getFullYear().toString();
      return itemYear === targetYear;
    });
  }, [serie]);

  const docdate = watch("DocDate");

  useEffect(() => {
    const defaultDate = new Date();
    setValue("DocDate", defaultDate);
  }, [setValue]);



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
                <label htmlFor="GIT Warehouse" className="text-gray-500 ">
                  GIT Warehouse
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
                <label htmlFor="Attention Termianl" className="text-gray-500 ">
                  Attention Termianl
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "Attention Termianl is required" }}
                  name="FromWarehouse"
                  control={control}
                  render={({ field }) => {
                    return (
                      <AttentionTerminalAutoComplete
                        disabled={detail}
                        {...field}
                        value={field.value}
                        onChange={(e: any) => {
                          setValue("FromWarehouse", e);
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
                        disabled={detail || defaultValues?.U_Status === "C"}
                        onChange={(e: any) => {
                          setValue("BPLID", e?.BPLID);
                        }}
                        value={field?.value}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="To Warehouse Code" className="text-gray-500 ">
                  To Warehouse Code
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "To Warehouse Code is required" }}
                  name="ToWarehouse"
                  control={control}
                  render={({ field }) => {
                    return (
                      <WarehouseAutoComplete
                        branchId={watch('BPLID')}
                        disabled={detail}
                        {...field}
                        value={field.value}
                        onChange={async (e: any) => {
                          console.log(e.DefaultBin);
                          setValue("ToWarehouse", e.WarehouseCode);

                          if (!e.DefaultBin) return;

                          const res: any = await request(
                            "GET",
                            `BinLocations(${e.DefaultBin})`
                          );
                          setValue("U_tl_sobincode", res.data.BinCode);
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="To Bin Code" className="text-gray-500 ">
                  To Bin Code
                </label>
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </div>
              <div className="col-span-3">
                {/* {isLoading} */}
                <MUITextField
                  value={watch("U_tl_sobincode")}
                />
              </div>
            </div>
          </div>

          <div className="">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Series <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <div className="grid grid-cols-2 gap-3">
                  <Controller
                    // rules={{ required: "Terminal is required" }}
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

                  <div className="-mt-1">
                    <MUITextField
                      size="small"
                      name="DocNum"
                      value={nextNumber || defaultValues?.nextNumber}
                      disabled
                      placeholder="Document No"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Posting Date" className="text-gray-500 ">
                  Posting Date
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="DocDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        {...field}
                        defaultValue={docdate} // Use the watch value as the defaultValue
                        onChange={(e) => {
                          const val =
                            e?.toLowerCase() ===
                              "invalid date".toLocaleLowerCase()
                              ? ""
                              : e;
                          setValue("DocDate", val);
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Document Date" className="text-gray-500 ">
                  Document Date
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="DueDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        {...field}
                        defaultValue={docdate} // Use the watch value as the defaultValue
                        onChange={(e) => {
                          const val =
                            e?.toLowerCase() ===
                              "invalid date".toLocaleLowerCase()
                              ? ""
                              : e;
                          setValue("DueDate", val);
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
                  Status
                </label>
              </div>
              <div className="col-span-3">
                {getValues("DocumentStatus") === undefined && (
                  <div className="hidden">
                    <MUITextField
                      inputProps={{
                        ...register("DocumentStatus"),
                      }}
                      value={"bost_Open"}
                    />
                  </div>
                )}

                <Controller
                  name="DocumentStatus"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        disabled={detail || defaultValues?.U_Status === "C"}
                        items={[
                          { value: "bost_Open", label: "Open" },
                          { value: "bost_Closed", label: "Closed" },
                        ]}
                        onChange={(e: any) => {
                          setValue("DocumentStatus", e.target.value);
                        }}
                        value={watch("DocumentStatus") ?? "bost_Open"}
                        aliasvalue="value"
                        aliaslabel="label"
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
export default BasicInformationDetail;
