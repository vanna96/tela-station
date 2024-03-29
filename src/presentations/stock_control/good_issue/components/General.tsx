import MUITextField from "@/components/input/MUITextField";
import PositionAutoComplete from "@/components/input/PositionAutoComplete";
import MUISelect from "@/components/selectbox/MUISelect";
import { useCallback, useEffect, useMemo } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import { Controller } from "react-hook-form";
import BranchAssignmentAuto from "@/components/input/BranchAssignment";
import { useParams } from "react-router-dom";
import DistributionRulesAutoComplete from "@/components/input/DistributionRulesAutoComplete";
import EmployeeAutoComplete from "@/components/input/EmployeeAutoComplete";
import WareHAutoComplete from "@/components/input/WareHAutoComplete";
import GoodIssueTypeAutoComplete from "@/components/input/GoodIssueTypeAutoComplete";
import { useQuery } from "react-query";
import request, { url } from "@/utilies/request";
import { useGetIssueSeriesHook } from "../hook/UseGetIssueSeriesHooks";
import GetBranchAutoComplete from "../../components/GetBranchAutoComplete";
import WarehouseAutoComplete from "../../components/WarehouseAutoComplete";

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
  reset,
  getValues,
}: any) => {
  const { series, defaultSerie } = useGetIssueSeriesHook();
  const { id }: any = useParams();
  useEffect(() => {
    if (id) return;
    if (!defaultSerie.data) return;
    if (!watch("Series")) {
      setValue("Series", defaultSerie?.data?.Series);
      setValue("DocNum", defaultSerie.data?.NextNumber);
    }
  }, [watch("Series")]);

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

  const seriesList = useMemo(() => {
    return series?.data?.filter(
      (e: any) => e?.BPLID === watch("BPL_IDAssignedToInvoice")
    );
  }, [watch("BPL_IDAssignedToInvoice")]);
  const onChangeBranch = (value: any) => {
    const period = new Date().getFullYear();
    const serie = series?.data?.find(
      (e: any) =>
        e?.PeriodIndicator === period.toString() && e?.BPLID === value?.BPLID
    );

    if (!serie) return;
    setValue("BPL_IDAssignedToInvoice", value?.BPLID);
    setValue("Series", serie?.Series);
    setValue("DocNum", serie?.NextNumber);
  };

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
                      <GetBranchAutoComplete
                        disabled={id}
                        {...field}
                        value={field?.value}
                        onChange={(e: any) => {
                          onChangeBranch(e);
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
                      <WarehouseAutoComplete
                        branchId={watch("BPL_IDAssignedToInvoice")}
                        disabled={id}
                        {...field}
                        value={field?.value}
                        key={`${field?.value}_${watch("BPL_IDAssignedToInvoice")}`}
                        onChange={(e: any) => {
                          setValue("U_tl_whsdesc", e?.WarehouseCode);
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
                  name="U_tl_grempl"
                  control={control}
                  render={({ field }) => {
                    return (
                      <EmployeeAutoComplete
                        disabled={id}
                        {...field}
                        value={field?.value}
                        onChange={(e: any) => {
                          setValue("U_tl_grempl", e);
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
                    ...register("U_tl_grtrano"),
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
                    ...register("U_tl_grtruno"),
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
                      <DistributionRulesAutoComplete
                        disabled={detail}
                        {...field}
                        value={field?.value}
                        onChange={(e: any) => {
                          console.log(e);

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
                <Controller
                  name="U_tl_branc"
                  control={control}
                  render={({ field }) => {
                    return (
                      <WareHAutoComplete
                        disabled={detail}
                        {...field}
                        value={field?.value}
                        onChange={(e: any) => {
                          setValue("U_tl_branc", e?.WarehouseCode);
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
                        {...field}
                        value={watch("Series")}
                        disabled={id}
                        items={
                          watch("BPL_IDAssignedToInvoice") === undefined
                            ? series?.data
                            : seriesList ?? []
                        }
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
                  disabled={true}
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
                  name="DocDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        disabled={id}
                        {...field}
                        value={watch("DocDate")}
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
                        disabled={id}
                        {...field}
                        value={watch("TaxDate")}
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
                      <GoodIssueTypeAutoComplete
                        disabled={detail}
                        {...field}
                        value={field?.value}
                        onChange={(e: any) => {
                          setValue("U_tl_gitype", e?.Code);
                          setValue("AccountCode", e?.U_ActCode);
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
                  name="U_tl_stype"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        disabled={detail}
                        items={[
                          { label: "T01 - PertnerShip", value: "T01" },
                          { label: "T02 - TelaCard", value: "T02" },
                          { label: "T03 - Government", value: "T03" },
                        ]}
                        onChange={(e: any) => {
                          setValue("U_tl_stype", e.target.value);
                        }}
                        value={field.value}
                        aliasvalue="value"
                        aliaslabel="label"
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
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  SA Number
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail}
                  inputProps={{
                    ...register("U_tl_sarn"),
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
