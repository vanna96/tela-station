import MUITextField from "@/components/input/MUITextField";
import PositionSelect from "@/components/selectbox/Position";
import DepartmentSelect from "@/components/selectbox/Department";
import ManagerSelect from "@/components/selectbox/Manager";
import PositionAutoComplete from "@/components/input/PositionAutoComplete";
import DepartmentAutoComplete from "@/components/input/DepartmentAutoComplete";
import ManagerAutoComplete from "@/components/input/ManagerAutoComplete";
import MUISelect from "@/components/selectbox/MUISelect";
import { useCallback, useEffect, useState } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import { Controller } from "react-hook-form";
import { formatDate } from "@/helper/helper";
import VendorModal from "@/components/modal/VendorModal";
import BranchAssignmentAuto from "@/components/input/BranchAssignment";
import ReasonAutoComplete from "@/components/input/ReasonAutoComplete";
import BaseStationAutoComplete from "@/components/input/BaseStationAutoComplete";
import { TextField } from "@mui/material";
import BinLocationAutoComplete from "@/components/input/BinLocationAutoComplete";
import SaleEmployeeAutoComplete from "@/components/input/SaleEmployeeAutoComplete";
import { useGetFuelLevelSeriesHook } from "../../fuel_level/hook/useGetFuelLevelSeriesHook";
import { useParams } from "react-router-dom";
import { useGetIssueSeriesHook } from "../hook/useGetIssueSeriesHook";

const General = ({
  register,
  control,
  defaultValues,
  setValue,
  setBranchAss,
  branchAss,
  header,
  setHeader,
  detail,
  watch,
  getValues,
}: any) => {
  const { series, defaultSerie } = useGetIssueSeriesHook();
  const { id }: any = useParams();
  useEffect(() => {
    if (id) return;
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

  useEffect(() => {
   console.log(getValues("DocDate"),getValues("TaxDate"));
   
  },[watch("DocDate"),watch("TaxDate")]);

  return (
    <>
      <div className="rounded-lg shadow-sm border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
          <h2>Information</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-[6rem] md:gap-0">
          <div className="">
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Branch{" "}
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "Branch is required" }}
                  name="BPL_IDAssignedToInvoice"
                  control={control}
                  render={({ field }) => {
                    return (
                      <BranchAssignmentAuto
                        disabled={detail}
                        value={field?.value}
                        onChange={(e: any) => {
                          setValue("BPL_IDAssignedToInvoice", e?.BPLID);
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Warehouse{" "}
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "Warehouse is required" }}
                  name="U_tl_whsdesc"
                  control={control}
                  render={({ field }) => {
                    return (
                      <BaseStationAutoComplete
                        disabled={detail}
                        {...field}
                        value={field?.value}
                        onChange={(e: any) => {
                          setValue("U_tl_whsdesc", e);
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Employee{" "}
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="SalesPersonCode"
                  control={control}
                  render={({ field }) => {
                    return (
                      <SaleEmployeeAutoComplete
                        disabled={detail}
                        {...field}
                        value={field?.value}
                        onChange={(e: any) => {
                          setValue("SalesPersonCode", e?.SalesEmployeeCode);
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
                  Transportation No.{" "}
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail}
                  inputProps={{
                    ...register("U_tl_trano"),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Truck No.{" "}
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail}
                  inputProps={{
                    ...register("U_tl_truno"),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Revenue Line{" "}
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_ti_revenue"
                  control={control}
                  render={({ field }) => {
                    return (
                      <PositionAutoComplete
                        disabled={detail}
                        {...field}
                        value={field?.value}
                        onChange={(e: any) => {
                          setValue("U_ti_revenue", e);
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
                  Ship To{" "}
                </label>
              </div>
              <div className="col-span-3">
                <TextField
                  disabled={detail}
                  size="small"
                  fullWidth
                  multiline
                  rows={3}
                  name="Comments"
                  className="w-full "
                  inputProps={{ ...register("ShipToCode") }}
                />
              </div>
            </div>
          </div>

          <div className="">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Series{" "}
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-1">
                <Controller
                  name="Series"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        value={field.value}
                        disabled={id}
                        items={series.data ?? []}
                        aliaslabel="Name"
                        aliasvalue="Series"
                        onChange={onChangeSerie}
                      />
                    );
                  }}
                />
              </div>
              <div className="col-span-2 -mt-1 ml-5">
                <MUITextField
                  disabled={detail}
                  key={watch("DocNum")}
                  value={watch("DocNum")}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Posting Date
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "Request Date is required" }}
                  name="DocDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        disabled={detail}
                        {...field}

                        value={watch("DocDate") || new Date()}
                        onChange={(e: any) => {
                          const val =
                            e.toLowerCase() ===
                            "Invalid Date".toLocaleLowerCase()
                              ? ""
                              : e;
                          setValue("DocDate", `${val == "" ? "" : val}`);
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
                  Document Date{" "}
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "Document Date is required" }}
                  name="TaxDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        disabled={detail || defaultValues?.U_Status === "C"}
                        {...field}
                        value={watch("TaxDate") || new Date()}
                        onChange={(e: any) => {
                          const val =
                            e.toLowerCase() ===
                            "Invalid Date".toLocaleLowerCase()
                              ? ""
                              : e;
                          setValue("TaxDate", `${val == "" ? "" : val}`);
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
                  Good Issue Type{" "}
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "Good Issue Type Date is required" }}
                  name="U_tl_gitype"
                  control={control}
                  render={({ field }) => {
                    return (
                      <PositionAutoComplete
                        disabled={detail}
                        {...field}
                        value={field?.value}
                        onChange={(e: any) => {
                          setValue("U_tl_gitype", e);

                          // setHeader({ ...header, data5: e?.Name })
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Sale Type{" "}
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "Position is required" }}
                  name="U_tl_stype"
                  control={control}
                  render={({ field }) => {
                    return (
                      <PositionAutoComplete
                        disabled={detail}
                        {...field}
                        value={field.value}
                        onChange={(e: any) => {
                          setValue("U_tl_stype", e);

                          // setHeader({ ...header, data5: e?.Name })
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Ref No
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail}
                  inputProps={{
                    ...register("Reference2"),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <VendorModal open={true} /> */}
    </>
  );
};

export default General;
