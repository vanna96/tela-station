import MUITextField from "@/components/input/MUITextField";
import { useCallback, useEffect, useState } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import { Controller } from "react-hook-form";
import MUISelect from "@/components/selectbox/MUISelect";
import AttentionTerminalAutoComplete from "./AttentionTerminalAutoComplete";
import request from "@/utilies/request";
import ToWarehouseAutoComplete from "./ToWarehouseAutoComplete";
import { useGetITRSeriesHook } from "../hook/useGetITRSeriesHook";
import { useInfiniteQuery } from "react-query";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { useGetWhsTerminalAssignHook } from "@/hook/useGetWhsTerminalAssignHook";
import { delay } from "@/lib/utils";
import BinAllocationAutoComplete from "../../components/BinLocationAutoComplete";
import WarehouseAutoComplete from "../../components/WarehouseAutoComplete";
const BasicInformation = (props: any) => {
  //
  const { series, defaultSerie } = useGetITRSeriesHook();

  useEffect(() => {
    if (props?.edit) return;

    defaultSerie.refetch();
    if (!defaultSerie.data) return;

    props?.setValue("Series", defaultSerie?.data?.Series);
    props?.setValue("DocNum", defaultSerie?.data?.NextNumber);
  }, [defaultSerie.data]);

  const onChangeSerie = useCallback(
    (event: any) => {
      const serie = series.data?.find(
        (e: any) => e?.Series === event?.target?.value
      );

      if (!serie) return;

      props?.setValue("Series", event?.target?.value);
      props?.setValue("DocNum", serie?.NextNumber);
    },
    [series?.data]
  );

  const branch: any = useInfiniteQuery({
    queryKey: ["branchAss"],
    queryFn: () => new BranchBPLRepository().get(),
    staleTime: Infinity,
  });

  const { data } = useGetWhsTerminalAssignHook(false);


  const onChangeBranch = (value: any) => {
    const period = new Date().getFullYear();
    const serie = series?.data?.find((e: any) => e?.PeriodIndicator === period.toString() && e?.BPLID === value?.BPLID);

    props?.setValue("Series", serie?.Series);
    props?.setValue("DocNum", serie?.NextNumber);
    props?.setValue('BPLID', value?.BPLID)
  }

  const onChangeToWarehouse = async (e: any) => {
    props.setValue("ToWarehouse", e.WarehouseCode);
  }

  return (
    <>
      <div className="rounded-lg shadow-sm border p-6 m-3-full mt-3">
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
                  disabled={props.detail || true}
                  value={props?.watch('FromWarehouse')}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Attention Terminal" className="text-gray-500 ">
                  Attention Terminal
                  <span className="text-red-500 ml-1">{props.detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "Attention Terminal is required" }}
                  name="U_tl_attn_ter"
                  control={props.control}
                  render={({ field }) => {
                    return (
                      <AttentionTerminalAutoComplete
                        disabled={props.detail}
                        {...field}
                        value={field.value}
                        onChange={(e: any) => {
                          onChangeBranch({ BPLID: e.BusinessPlaceID })
                          props.setValue("U_tl_attn_ter", e.WarehouseCode);
                          const git = data?.find((whs: any) => whs?.U_tl_git_whs === 'Y' && whs?.BusinessPlaceID === e.BusinessPlaceID)
                          props.setValue("FromWarehouse", git?.WarehouseCode);
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 ">
              <div className="col-span-2">
                <label
                  htmlFor="Branch"
                  className="text-gray-500 inline-block mt-1"
                >
                  Branch
                  <span className="text-red-500 ml-1">{props.detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={true}
                  value={branch?.data?.pages[0]?.find((e: any) => e?.BPLID === props?.watch("BPLID"))?.BPLName}
                  inputProps={{ ...props.register("BPLID") }}
                />
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="To Warehouse Code" className="text-gray-500 ">
                  To Warehouse Code
                  <span className="text-red-500 ml-1">{props.detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "To Warehouse Code is required" }}
                  name="ToWarehouse"
                  control={props.control}
                  render={({ field }) => {
                    return (
                      <WarehouseAutoComplete
                        branchId={props?.watch('BPLID')}
                        disabled={props.detail}
                        {...field}
                        value={field.value}
                        onChange={onChangeToWarehouse}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="To Bin Code" className="text-gray-500">
                  To Bin Code
                </label>
                <span className="text-red-500 ml-1">{props.detail ? "" : "*"}</span>
              </div>
              <div className="col-span-3">
                {/* {isLoading} */}
                {/* <MUITextField value={props.watch("U_tl_sobincode")} disabled /> */}
                <Controller
                  rules={{ required: "To Bin Code is required" }}
                  name="U_tl_sobincode"
                  control={props.control}
                  render={({ field }) => {
                    return (
                      <BinAllocationAutoComplete
                        warehouse={props?.watch('ToWarehouse')}
                        disabled={props.detail}
                        {...field}
                        value={field.value}
                        onChange={(value) => props?.setValue('U_tl_sobincode', value?.BinCode)}
                      />
                    );
                  }}
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
                    control={props?.control}
                    render={({ field }) => {
                      return (
                        <MUISelect
                          value={field.value}
                          disabled={props?.edit}
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
                      key={props?.watch("DocNum")}
                      value={props?.watch("DocNum")}
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
                  control={props.control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        {...field}
                        defaultValue={props.docdate} // Use the watch value as the defaultValue
                        onChange={(e) => {
                          const val =
                            e?.toLowerCase() ===
                              "invalid date".toLocaleLowerCase()
                              ? ""
                              : e;
                          props.setValue("DocDate", val);
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
                  <span className="text-red-500 ml-1">{props.detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="TaxDate"
                  control={props.control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        {...field}
                        defaultValue={props.taxdate} // Use the watch value as the defaultValue
                        onChange={(e) => {
                          const val =
                            e?.toLowerCase() ===
                              "invalid date".toLocaleLowerCase()
                              ? ""
                              : e;
                          props.setValue("TaxDate", val);
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
                {props.getValues("DocumentStatus") === undefined && (
                  <div className="hidden">
                    <MUITextField
                      inputProps={{
                        ...props.register("DocumentStatus"),
                      }}
                      value={"bost_Open"}
                    />
                  </div>
                )}

                <Controller
                  name="DocumentStatus"
                  control={props.control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        disabled={props.detail || props.defaultValues?.U_Status === "C"}
                        items={[
                          { value: "bost_Open", label: "Open" },
                          { value: "bost_Closed", label: "Closed" },
                        ]}
                        onChange={(e: any) => {
                          props.setValue("DocumentStatus", e.target.value);
                        }}
                        value={props.watch("DocumentStatus") ?? "bost_Open"}
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
