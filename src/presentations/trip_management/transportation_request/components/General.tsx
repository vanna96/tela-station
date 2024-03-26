import MUITextField from "@/components/input/MUITextField";
import { UseFormProps } from "../form";
import MUISelect from "@/components/selectbox/MUISelect";
import { useCallback } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import { Controller, useWatch } from "react-hook-form";
import BranchAssignmentAuto from "@/components/input/BranchAssignment";
import BaseStationAutoComplete from "@/components/input/BaseStationAutoComplete";
import { TextField } from "@mui/material";
import SaleEmployeeAutoComplete from "@/components/input/SaleEmployeeAutoComplete";
import { useParams } from "react-router-dom";

const General = ({
  register,
  control,
  setValue,
  detail,
  data,
  serie,
  getValues,
  watch,
}: UseFormProps) => {
  const { id }: any = useParams();

  const onChangeSerie = useCallback(
    (event: any) => {
      const series = serie?.find(
        (e: any) => e?.Series === event?.target?.value
      );
      if (!series) return;

      setValue("Series", event?.target?.value);
      setValue("DocNum", series?.NextNumber);
    },
    [serie]
  );

  return (
    <>
      <div className="rounded-lg shadow-sm border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
          <h2>Information</h2>
        </div>
        <div className="  flex gap-[100px]">
          <div className="col-span-5  w-[50%]">
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Requester
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{
                    required: "Requester is required",
                  }}
                  name="U_Requester"
                  control={control}
                  render={({ field }) => {
                    return (
                      <SaleEmployeeAutoComplete
                        setValue={setValue}
                        id={id}
                        disabled={detail || (id && watch("U_Status") === "C")}
                        {...field}
                        value={field.value}
                        onChange={(e: any) => {
                          setValue("U_Requester", e?.SalesEmployeeCode);
                          setValue("RequesterName", `${e?.SalesEmployeeName}`);
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
                  To Terminal
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "Terminal is required" }}
                  name="U_Terminal"
                  control={control}
                  render={({ field }) => {
                    return (
                      <BaseStationAutoComplete
                        disabled={detail || (id && watch("U_Status") === "C")}
                        {...field}
                        value={field.value}
                        onChange={(e: any) => {
                          setValue("U_Terminal", e);
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
                  Branch{" "}
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "Branch is required" }}
                  name="U_Branch"
                  control={control}
                  render={({ field }) => {
                    return (
                      <BranchAssignmentAuto
                        {...field}
                        setValue={setValue}
                        id={id}
                        disabled={detail || (id && watch("U_Status") === "C")}
                        onChange={(e: any) => {
                          setValue("U_Branch", e?.BPLID);
                          setValue("BranchName", `${e?.BPLName}`);
                        }}
                        value={field.value}
                      />
                    );
                  }}
                />
              </div>
            </div>
          </div>

          <div className="col-span-5 w-[50%]">
            <div className="col-span-3">
              <div className="grid grid-cols-5 py-2">
                <div className="col-span-2">
                  <label htmlFor="Code" className="text-gray-600 ">
                    Series{" "}
                    <span className={`${detail && "hidden"} text-red-500`}>
                      *
                    </span>
                  </label>
                </div>
                <div className="col-span-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Controller
                      rules={{ required: "Series is required" }}
                      name="Series"
                      control={control}
                      render={({ field }) => {
                        return (
                          <MUISelect
                            {...field}
                            items={serie}
                            disabled={
                              detail || (id && watch("U_Status") === "C")
                            }
                            value={field?.value}
                            aliasvalue="Series"
                            aliaslabel="Name"
                            name="Series"
                            onChange={(e: any) => onChangeSerie(e)}
                          />
                        );
                      }}
                    />

                    <div className="-mt-1">
                      <MUITextField
                        size="small"
                        name="DocNum"
                        key={watch("DocNum")}
                        value={watch("DocNum")}
                        disabled
                        placeholder="Document No"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Request Date
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "Request Date is required" }}
                  name="U_RequestDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        disabled={detail || (id && watch("U_Status") === "C")}
                        {...field}
                        value={field.value}
                        onChange={(e: any) => {
                          const val =
                            e.toLowerCase() ===
                            "Invalid Date".toLocaleLowerCase()
                              ? ""
                              : e;
                          setValue("U_RequestDate", `${val == "" ? "" : val}`);
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
                  Expired Date
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_ExpiredDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        disabled={detail || (id && watch("U_Status") === "C")}
                        {...field}
                        value={field.value}
                        onChange={(e: any) => {
                          const val =
                            e.toLowerCase() ===
                            "Invalid Date".toLocaleLowerCase()
                              ? ""
                              : e;
                          setValue("U_ExpiredDate", `${val == "" ? "" : val}`);
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
                {getValues("U_Status") === undefined && (
                  <div className="hidden">
                    <MUITextField
                      inputProps={{
                        ...register("U_Status"),
                      }}
                      value={"O"}
                    />
                  </div>
                )}

                <Controller
                  name="U_Status"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        disabled={detail || (id && field.value === "C")}
                        items={[
                          { value: "O", label: "Open" },
                          { value: "C", label: "Closed" },
                        ]}
                        onChange={(e: any) => {
                          setValue("U_Status", e.target.value);
                        }}
                        value={field.value ?? "O"}
                        aliasvalue="value"
                        aliaslabel="label"
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Remark
                </label>
              </div>
              <div className="col-span-3">
                <TextField
                  className={`${detail && "bg-gray-100"}`}
                  disabled={detail}
                  placeholder="Remarks"
                  size="small"
                  fullWidth
                  multiline
                  inputProps={{
                    ...register("U_Remark"),
                  }}
                  rows={2}
                  value={data?.U_Remark}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default General;
