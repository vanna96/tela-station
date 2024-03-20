import MUITextField from "@/components/input/MUITextField";
import { useCallback, useEffect, useState } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import { Controller } from "react-hook-form";
import MUISelect from "@/components/selectbox/MUISelect";
import AttentionTerminalAutoComplete from "./AttentionTerminalAutoComplete";
import request from "@/utilies/request";
import { useInfiniteQuery } from "react-query";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { useGetWhsTerminalAssignHook } from "@/hook/useGetWhsTerminalAssignHook";
import { useGetStockTransferSeriesHook } from "../hook/useGetStockTransferSeriesHook";
import GetBranchAutoComplete from "../../components/GetBranchAutoComplete";
import WarehouseAutoComplete from "../../components/WarehouseAutoComplete";
import { TransferType } from "../hook/useStockTransferHook";
import BinAllocationAutoComplete from "../../components/BinLocationAutoComplete";
import GITWarehouseAutoComplete from "../../components/GITWarehouseAutoComplete";

const BasicInformation = (props: any) => {
  //
  const { series, defaultSerie } = useGetStockTransferSeriesHook();

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

  const { data } = useGetWhsTerminalAssignHook(false);


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
                <label htmlFor="Attention Terminal" className="text-gray-500 ">
                  Transfer Type
                  <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "Attention Terminal is required" }}
                  name="U_tl_transType"
                  control={props.control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        value={field.value}
                        disabled={props?.edit}
                        onChange={(e) => {
                          props.setValue('U_tl_transType', e.target.value)
                          props.setValue('FromWarehouse', undefined)
                        }}
                        items={[
                          { value: 'Internal', label: 'Internal Transfer' },
                          { value: 'External', label: 'Transfer Cross Branch' },
                        ]}
                      />
                    );
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="GIT Warehouse" className="text-gray-500 ">
                  GIT Warehouse
                </label>
              </div>
              <div className="col-span-3">
                {props?.watch('U_tl_transType') as TransferType === 'External' ? <Controller
                  rules={{ required: "From Warehouse Code is required" }}
                  name="FromWarehouse"
                  control={props.control}
                  render={({ field }) => {
                    return (
                      <GITWarehouseAutoComplete
                        branchId={props.watch('BPLID')}
                        disabled={props.detail || props.detail || props?.queryParams?.get('type') === 'external'}
                        {...field}
                        value={field.value}
                        onChange={async (e: any) => {
                          props.setValue("FromWarehouse", e?.WarehouseCode);
                          if (!e?.DefaultBin) return;

                          props?.setLoading(true);
                          const res: any = await request("GET", `BinLocations(${e?.DefaultBin})`);

                          props?.setLoading(false);
                          props.setValue("U_tl_uobincode", res.data.BinCode);
                          props.setValue("U_tl_fromBinId", undefined);
                        }}
                      />
                    );
                  }}
                /> : <MUITextField disabled />}
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Attention Terminal" className="text-gray-500 ">
                  Attention Terminal
                  <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                {props?.watch('U_tl_transType') as TransferType === 'External' ? <Controller
                  rules={{ required: "Attention Terminal is required" }}
                  name="U_tl_attn_ter"
                  disabled={props.detail || props.detail}
                  control={props.control}
                  render={({ field }) => {
                    return (
                      <AttentionTerminalAutoComplete
                        branchId={props?.watch('BPLID')}
                        disabled={props.detail || props?.queryParams?.get('type') === 'external'}
                        {...field}
                        value={field.value}
                        onChange={(e: any) => {
                          props.setValue("U_tl_attn_ter", e?.WarehouseCode);

                        }}
                      />
                    );
                  }}
                /> : <MUITextField disabled />}

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
                <Controller
                  rules={{ required: "Branch is required" }}
                  name="BPLID"
                  control={props.control}
                  render={({ field }) => {
                    return (
                      <GetBranchAutoComplete
                        disabled={props?.edit}
                        {...field}
                        value={field.value}
                        onChange={(e: any) => props?.onChangeBranch(series, e)}
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
                        key={`${props.watch('BPLID')}_to_whs`}
                        branchId={props.watch('BPLID')}
                        disabled={props?.edit}
                        {...field}
                        value={field.value}
                        onChange={async (e: any) => {
                          props.setValue("ToWarehouse", e?.WarehouseCode);

                          if (!e?.DefaultBin) return;

                          props?.setLoading(true);
                          const res: any = await request(
                            "GET",
                            `BinLocations(${e?.DefaultBin})`
                          );
                          props?.setLoading(false);
                          props.setValue("U_tl_sobincode", res.data.BinCode);
                          props.setValue("U_tl_toBinId", e?.DefaultBin);
                        }}
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
                <Controller
                  key={`${props.watch('BPLID')}_to_whs_${props.watch('ToWarehouse')}`}
                  rules={{ required: "To Bin Code is required" }}
                  name="U_tl_toBinId"
                  control={props.control}
                  render={({ field }) => {
                    return (
                      <BinAllocationAutoComplete
                        warehouse={props?.watch('ToWarehouse')}
                        disabled={props.detail}
                        {...field}
                        value={field.value}
                        onChange={(value) => {
                          props?.setValue('U_tl_sobincode', value?.BinCode)
                          props?.setValue('U_tl_toBinId', value?.AbsEntry)
                        }}
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

            <div className="grid grid-cols-5 py-2 ">
              <div className="col-span-2">
                <label
                  htmlFor="Branch"
                  className="text-gray-500 inline-block mt-1"
                >
                  Status
                  <span className="text-red-500 ml-1">{props.detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={true}
                  value={'Open'}

                />
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
                        disabled={props?.edit}
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
                  disabled={props?.detail}
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
                <label htmlFor="To Warehouse Code" className="text-gray-500 ">
                  From Warehouse Code
                  <span className="text-red-500 ml-1">{props.detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                {props?.watch('U_tl_transType') as TransferType === 'Internal' ? <Controller
                  rules={{ required: "From Warehouse Code is required" }}
                  name="FromWarehouse"
                  control={props.control}
                  render={({ field }) => {
                    return (
                      <WarehouseAutoComplete
                        key={`${props.watch('BPLID')}_from_whs`}
                        branchId={props.watch('BPLID')}
                        disabled={props.detail || props.detail || props?.queryParams?.get('type') === 'external'}
                        {...field}

                        value={field.value}
                        onChange={async (e: any) => {
                          props.setValue("FromWarehouse", e?.WarehouseCode);

                          if (!e?.DefaultBin) return;

                          props?.setLoading(true);
                          const res: any = await request(
                            "GET",
                            `BinLocations(${e?.DefaultBin})`
                          );

                          props?.setLoading(false);
                          props.setValue("U_tl_uobincode", res.data.BinCode);
                          // props.setValue("U_tl_fromBinId", e?.DefaultBin);
                          props.setValue("U_tl_fromBinId", e?.DefaultBin);
                        }}
                      />
                    );
                  }}
                /> : <MUITextField disabled />}

              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="To Bin Code" className="text-gray-500">
                  From Bin Code
                </label>
                <span className="text-red-500 ml-1">{props.detail ? "" : "*"}</span>
              </div>
              <div className="col-span-3">
                {props?.watch('U_tl_transType') as TransferType === 'Internal' ? <Controller
                  rules={{ required: "From Bin Code is required" }}
                  name="U_tl_fromBinId"
                  control={props.control}
                  render={({ field }) => {
                    return (
                      <BinAllocationAutoComplete
                        key={`${props.watch('BPLID')}_from_whs_${props.watch('FromWarehouse')}`}
                        warehouse={props?.watch('FromWarehouse')}
                        disabled={props.detail}
                        {...field}
                        value={field.value}
                        onChange={(value) => {
                          props?.setValue('U_tl_uobincode', value?.BinCode)
                          props?.setValue('U_tl_fromBinId', value?.AbsEntry)
                        }}
                      />
                    );
                  }}
                /> : <MUITextField disabled />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default BasicInformation;
