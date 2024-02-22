import MUITextField from "@/components/input/MUITextField";
import PositionSelect from "@/components/selectbox/Position";
import DepartmentSelect from "@/components/selectbox/Department";
import ManagerSelect from "@/components/selectbox/Manager";
import PositionAutoComplete from "@/components/input/PositionAutoComplete";
import DepartmentAutoComplete from "@/components/input/DepartmentAutoComplete";
import ManagerAutoComplete from "@/components/input/ManagerAutoComplete";
import MUISelect from "@/components/selectbox/MUISelect";
import { useEffect, useState } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import { Controller } from "react-hook-form";
import { formatDate } from "@/helper/helper";
import VendorModal from "@/components/modal/VendorModal";
import BranchAssignmentAuto from "@/components/input/BranchAssignment";
import ReasonAutoComplete from "@/components/input/ReasonAutoComplete";
import BaseStationAutoComplete from "@/components/input/BaseStationAutoComplete";
import { UseFormProps } from "../form/TransportationOrderForm";
import RoutAutoComplete from "@/components/input/RouteAutoComplete";
import VehicleAutoComplete from "@/components/input/VehicleAutoComplete";

const General = ({
  register,
  control,
  defaultValues,
  setValue,
  header,
  setHeader,
  detail,
  watch,
  serie,
  getValues,
  compartment,
  transDetail,
}: UseFormProps) => {
  const [staticSelect, setStaticSelect] = useState({
    startDate: null,
    status: "",
    termination: null,
    branchASS: null,
  });

  useEffect(() => {
    setValue("Series", 7916);
    if (defaultValues) {
      defaultValues?.EmployeeBranchAssignment?.forEach((e: any) =>
        setStaticSelect({ ...staticSelect, branchASS: e?.BPLID })
      );
    }
  }, [defaultValues]);
  const nextNumber = serie?.find(
    (e: any) => e?.Series === getValues("Series")
  )?.NextNumber;
  return (
    <>
      <div className="rounded-lg shadow-sm border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
          <h2>Information</h2>
        </div>
        <div className="  flex gap-[100px]">
          <div className="col-span-5  w-[50%]">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Route{" "}
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_Route"
                  control={control}
                  render={({ field }) => {
                    return (
                      <RoutAutoComplete
                        disabled={detail}
                        {...field}
                        value={watch("U_Route") || defaultValues?.U_Route}
                        onChange={(e: any) => {
                          setValue("U_Route", e?.Code);
                          setValue("TL_TO_ORDERCollection", [
                            ...transDetail,
                            ...e?.TL_RM_SEQUENCECollection?.map((row: any) => ({
                              U_Type: "S",
                              ...row,
                              U_Order: 0,
                              U_StopCode: row.U_Code,
                              U_Description: row.U_Description,
                            })),
                          ]);
                          setHeader({
                            ...header,
                            Route: e?.Code,
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
                <label htmlFor="Code" className="text-gray-500 ">
                  Base Station{" "}
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_BaseStation"
                  control={control}
                  render={({ field }) => {
                    return (
                      <BaseStationAutoComplete
                        disabled={detail}
                        {...field}
                        value={
                          watch("U_BaseStation") || defaultValues?.U_BaseStation
                        }
                        onChange={(e: any) => {
                          setValue("U_BaseStation", e);

                          setHeader({ ...header, BaseStation: e });
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
                  Vehicle Code
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_VehicleCode"
                  control={control}
                  render={({ field }) => {
                    return (
                      <VehicleAutoComplete
                        disabled={detail}
                        {...field}
                        value={
                          defaultValues?.U_BaseStation || watch("U_VehicleCode")
                        }
                        onChange={(e: any) => {
                          setValue("U_VehicleCode", e?.Code);
                          setValue("U_VehicleName", e?.Name);
                          setValue("TL_TO_COMPARTMENTCollection", [
                            ...e?.TL_VH_COMPARTMENTCollection,
                          ]);
                          setHeader({ ...header, Vehicle: e?.Code });
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
                  Vehicle Name{" "}
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={true}
                  inputProps={{
                    ...register("U_VehicleName"),
                  }}
                  defaultValue={defaultValues?.U_VehicleName}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Driver{" "}
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_Driver"
                  control={control}
                  render={({ field }) => {
                    return (
                      <ManagerAutoComplete
                        disabled={detail}
                        {...field}
                        value={watch("U_Driver") || defaultValues?.U_Driver}
                        onChange={(e: any) => {
                          setValue("U_CheckList", e?.U_CheckList);
                          setValue("U_Driver", e?.EmployeeID);
                          setHeader({
                            ...header,
                            Driver: e?.FirstName + " " + e?.LastName,
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
                <label htmlFor="Code" className="text-gray-500 ">
                  Check List
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={true}
                  inputProps={{
                    ...register("U_CheckList"),
                  }}
                  defaultValue={defaultValues?.U_CheckList}
                />
              </div>
            </div>
          </div>

          <div className="col-span-5 w-[50%]">
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
                          items={serie}
                          disabled={detail || defaultValues?.U_Status === "C"}
                          value={watch("Series") || defaultValues?.serie}
                          aliasvalue="Series"
                          aliaslabel="Name"
                          name="Series"
                          onChange={(e: any) => {
                            setValue("Series", e?.target?.value);
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
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Document Number
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={true}
                  inputProps={{
                    ...register("MobilePhone"),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Document Date
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="DocumentDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        disabled={detail}
                        {...field}
                        defaultValue={
                          defaultValues?.DocumentDate || staticSelect.startDate
                        }
                        key={`start_date_${staticSelect.startDate}`}
                        onChange={(e: any) => {
                          const val =
                            e.toLowerCase() ===
                            "Invalid Date".toLocaleLowerCase()
                              ? ""
                              : e;
                          setValue("DocumentDate", `${val == "" ? "" : val}`);
                          setStaticSelect({
                            ...staticSelect,
                            startDate: e,
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
                <label htmlFor="Code" className="text-gray-500 ">
                  Status
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={true}
                  inputProps={{
                    ...register("eMail"),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Dispatch Date{" "}
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="StartDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        disabled={detail}
                        {...field}
                        defaultValue={
                          defaultValues?.StartDate || staticSelect.startDate
                        }
                        key={`start_date_${staticSelect.startDate}`}
                        onChange={(e: any) => {
                          const val =
                            e.toLowerCase() ===
                            "Invalid Date".toLocaleLowerCase()
                              ? ""
                              : e;
                          setValue("StartDate", `${val == "" ? "" : val}`);
                          setStaticSelect({
                            ...staticSelect,
                            startDate: e,
                          });
                          setHeader({ ...header, DispatchDate: e });
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
                  Completed Date
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="CompleteDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        disabled={detail}
                        {...field}
                        defaultValue={
                          defaultValues?.CompleteDate || staticSelect.startDate
                        }
                        key={`start_date_${staticSelect.startDate}`}
                        onChange={(e: any) => {
                          const val =
                            e.toLowerCase() ===
                            "Invalid Date".toLocaleLowerCase()
                              ? ""
                              : e;
                          setValue("CompleteDate", `${val == "" ? "" : val}`);
                          setStaticSelect({
                            ...staticSelect,
                            startDate: e,
                          });
                          setHeader({ ...header, CompletedDate: e });
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1"></div>
          </div>
        </div>
      </div>
      {/* <VendorModal open={true} /> */}
    </>
  );
};

export default General;
