import MUITextField from "@/components/input/MUITextField";
import { useEffect, useMemo, useState } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import { Controller, useWatch } from "react-hook-form";
import MUISelect from "@/components/selectbox/MUISelect";
import AttentionTerminalAutoComplete from "../components/AttentionTerminalAutoComplete";
import ToWarehouseAutoComplete from "../components/ToWarehouseAutoComplete";
import { useGetITRSeriesHook } from "../hook/useGetITRSeriesHook";
import BinAllocationAutoComplete from "../../components/BinLocationAutoComplete";
import WarehouseAutoComplete from "../../components/WarehouseAutoComplete";
const BasicInformationDetail = (props: any) => {
  //
  const { series, defaultSerie } = useGetITRSeriesHook();

  useEffect(() => {

  }, []);


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
                  value={props?.watch("FromWarehouse")}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Attention Terminal" className="text-gray-500 ">
                  Attention Terminal
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
                        disabled={true}
                        {...field}
                        value={field.value}
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
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={true}
                  inputProps={{ ...props.register("BPLName") }}
                />
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="To Warehouse Code" className="text-gray-500 ">
                  To Warehouse Code
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="ToWarehouse"
                  control={props.control}
                  render={({ field }) => {
                    return (
                      <WarehouseAutoComplete
                        branchId={0}
                        disabled={true}
                        value={field.value}
                        onChange={(e) => props.setValue('ToWarehouse', e.WarehouseCode)}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="To Bin Code" className="text-gray-500">
                  To Bin Code {props?.watch("ToWarehouse")}
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_tl_toBinId"
                  control={props.control}
                  render={({ field }) => {
                    return (
                      <BinAllocationAutoComplete
                        warehouse={props?.watch("ToWarehouse")}
                        disabled={true}
                        {...field}
                        value={field.value}
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
                  Series
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
                          disabled
                          items={series.data ?? []}
                          aliaslabel="Name"
                          aliasvalue="Series"

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
                  disabled
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

                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  disabled
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
                        disabled
                        items={[
                          { value: "bost_Open", label: "Open" },
                          { value: "bost_Close", label: "Closed" },
                        ]}

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
export default BasicInformationDetail;
