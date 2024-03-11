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
import { TextField } from "@mui/material";

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
  const [staticSelect, setStaticSelect] = useState({
    branchASS: null,
  });

  useEffect(() => {
    if (defaultValues) {
      defaultValues?.EmployeeBranchAssignment?.forEach((e: any) =>
        setStaticSelect({ ...staticSelect, branchASS: e?.BPLID })
      );
    }
  }, [defaultValues]);

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
                  rules={{ required: "Position is required" }}
                  name="Position"
                  control={control}
                  render={({ field }) => {
                    return (
                      <PositionAutoComplete
                        disabled={detail}
                        {...field}
                        value={watch("Position") || defaultValues?.Position}
                        onChange={(e: any) => {
                          setValue("Position", e);

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
                  Warehouse{" "}
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "Position is required" }}
                  name="Position"
                  control={control}
                  render={({ field }) => {
                    return (
                      <PositionAutoComplete
                        disabled={detail}
                        {...field}
                        value={watch("Position") || defaultValues?.Position}
                        onChange={(e: any) => {
                          setValue("Position", e);

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
                  Employee{" "}
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "Position is required" }}
                  name="Position"
                  control={control}
                  render={({ field }) => {
                    return (
                      <PositionAutoComplete
                        disabled={detail}
                        {...field}
                        value={watch("Position") || defaultValues?.Position}
                        onChange={(e: any) => {
                          setValue("Position", e);

                          // setHeader({ ...header, data5: e?.Name })
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
                    ...register("EmployeeCode", {
                      required: "Employee Code is required",
                    }),
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
                    ...register("EmployeeCode", {
                      required: "Employee Code is required",
                    }),
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
                  rules={{ required: "Position is required" }}
                  name="Position"
                  control={control}
                  render={({ field }) => {
                    return (
                      <PositionAutoComplete
                        disabled={detail}
                        {...field}
                        value={watch("Position") || defaultValues?.Position}
                        onChange={(e: any) => {
                          setValue("Position", e);

                          // setHeader({ ...header, data5: e?.Name })
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
                  inputProps={{ ...register("Remarks") }}
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
                  rules={{ required: "Terminal is required" }}
                  name="U_tl_terminal"
                  control={control}
                  render={({ field }) => {
                    return (
                      <BaseStationAutoComplete
                        disabled={detail}
                        {...field}
                        value={
                          watch("U_tl_terminal") || defaultValues?.U_tl_terminal
                        }
                        onChange={(e: any) => {
                          setValue("U_tl_terminal", e);
                        }}
                      />
                    );
                  }}
                />
              </div>
              <div className="col-span-2 -mt-1 ml-5">
                <MUITextField
                  disabled={detail}
                  inputProps={{
                    ...register("EmployeeCode", {
                      required: "Employee Code is required",
                    }),
                  }}
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
                  name="U_RequestDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        disabled={detail || defaultValues?.U_Status === "C"}
                        {...field}
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
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Document Date{" "}
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
                        disabled={detail || defaultValues?.U_Status === "C"}
                        {...field}
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
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Good Issue Type{" "}
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{ required: "Position is required" }}
                  name="Position"
                  control={control}
                  render={({ field }) => {
                    return (
                      <PositionAutoComplete
                        disabled={detail}
                        {...field}
                        value={watch("Position") || defaultValues?.Position}
                        onChange={(e: any) => {
                          setValue("Position", e);

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
                  name="Position"
                  control={control}
                  render={({ field }) => {
                    return (
                      <PositionAutoComplete
                        disabled={detail}
                        {...field}
                        value={watch("Position") || defaultValues?.Position}
                        onChange={(e: any) => {
                          setValue("Position", e);

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
                    ...register("EmployeeCode", {
                      required: "Employee Code is required",
                    }),
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
