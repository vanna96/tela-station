import MUITextField from "@/components/input/MUITextField";
import { UseFormProps } from "../form";
import { useCallback, useEffect, useState } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import { Controller } from "react-hook-form";
import BranchAssignmentAuto from "@/components/input/BranchAssignment";
import CashACAutoComplete from "@/components/input/CashAccountAutoComplete";
import GLAccountRepository from "@/services/actions/GLAccountRepository";
import CurrencyAutoComplete from "@/components/input/CurencyAutoComplete";
import LineofBusinessAutoComplete from "@/components/input/LineofBusineesAutoComplete";
import MUISelect from "@/components/selectbox/MUISelect";
import React from "react";
import BaseStationAutoComplete from "@/components/input/BaseStationAutoComplete";
import AttentionTerminalAutoComplete from "./AttentionTerminalAutoComplete";
import request from "@/utilies/request";
import { CircularProgress } from "@mui/material";
import { loadavg } from "os";
import ToWarehouseAutoComplete from "./ToWarehouseAutoComplete";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { useQuery } from "react-query";
import { useGetITRSeriesHook } from "../hook/useGetITRSeriesHook";
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
  getValues,
}: UseFormProps) => {
  const [staticSelect, setStaticSelect] = useState({
    branchASS: null,
    serie: 7838,
  });

  const branch: any = useQuery({
    queryKey: ["branchAss"],
    queryFn: () => new BranchBPLRepository().get(),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (defaultValues) {
      defaultValues?.EmployeeBranchAssignment?.forEach((e: any) =>
        setStaticSelect({ ...staticSelect, branchASS: e?.BPLID })
      );
    }
  }, [defaultValues]);

  const docdate = watch("DocDate");
  const taxdate = watch("TaxDate");

  useEffect(() => {
    const defaultDate = new Date();
    setValue("DocDate", defaultDate);
    setValue("TaxDate", defaultDate);

  }, [setValue]);

  const { series, defaultSerie } = useGetITRSeriesHook();
  useEffect(() => {
    if (edit) return;

    if (!defaultSerie.data) return;
    setValue("DocNum", defaultSerie.data);
  }, [defaultSerie.data]);

  const onChangeSerie = useCallback(
    (event: any) => {
      const serie = series.data?.find(
        (e: any) => e?.Series === event?.target?.value
      );
      if (!serie) return;

      setValue("Series", event?.target?.value);
      setValue("DocNum", serie?.NextNumber);
    },
    [series?.data]
  );

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
                  value={defaultValues?.nextNumber}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Attention Terminal" className="text-gray-500 ">
                  Attention Terminal
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "Attention Terminal is required" }}
                  name="FromWarehouse"
                  control={control}
                  render={({ field }) => {
                    return (
                      <AttentionTerminalAutoComplete
                        disabled={detail}
                        {...field}
                        value={field.value}
                        onChange={(e: any) => {
                          setValue("BPLID", e.BusinessPlaceID);
                          setValue("FromWarehouse", e.WarehouseCode);
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 ">
              <div className="col-span-2">
                <label htmlFor="Branch" className="text-gray-500 inline-block mt-1">
                  Branch
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={true}
                  value={
                    branch?.data?.find((e: any) => e?.BPLID === watch("BPLID"))
                      ?.BPLName
                  }
                  inputProps={{ ...register("BPLID") }}
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
                      <ToWarehouseAutoComplete
                        disabled={detail}
                        {...field}
                        value={field.value}
                        onChange={async (e: any) => {
                          // console.log(e.DefaultBin);
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
                  disabled
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
                    name="Series"
                    control={control}
                    render={({ field }) => {
                      return (
                        <MUISelect
                          value={field.value}
                          disabled={edit}
                          items={series.data ?? []}
                          aliaslabel="Name"
                          aliasvalue="Series"
                          onChange={onChangeSerie}
                        />
                      );
                    }}
                  />

                  <div className="-mt-1">
                    <MUITextField
                      key={watch("DocNum")}
                      value={watch("DocNum")}
                      disabled={true}
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
                  name="TaxDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        {...field}
                        defaultValue={taxdate} // Use the watch value as the defaultValue
                        onChange={(e) => {
                          const val =
                            e?.toLowerCase() ===
                            "invalid date".toLocaleLowerCase()
                              ? ""
                              : e;
                          setValue("TaxDate", val);
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
export default BasicInformation;
