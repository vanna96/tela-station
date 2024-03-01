import MUITextField from "@/components/input/MUITextField";
import PositionSelect from "@/components/selectbox/Position";
import DepartmentSelect from "@/components/selectbox/Department";
import ManagerSelect from "@/components/selectbox/Manager";
import PositionAutoComplete from "@/components/input/PositionAutoComplete";
import DepartmentAutoComplete from "@/components/input/DepartmentAutoComplete";
import ManagerAutoComplete from "@/components/input/ManagerAutoComplete";
import MUISelect from "@/components/selectbox/MUISelect";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { UseFormProps } from "../form/VehicleForm";
import BaseStationAutoComplete from "@/components/input/BaseStationAutoComplete";
import YearDropdown from "./YearsDropDown";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useWatch } from "react-hook-form";

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
}: UseFormProps) => {
  const [staticSelect, setStaticSelect] = useState({
    U_Type: "",
    U_Owner: "",
    U_FuelType: "",
    U_Status: "",
  });

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
                <label htmlFor="Code" className="text-gray-500 ">
                  Vehicle Code{" "}
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail}
                  inputProps={{
                    ...register("Code", {
                      required: " Vehicle Code is required",
                    }),
                    onBlur: (e) =>
                      setHeader({ ...header, code: e.target.value }),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Vehicle Name{" "}
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail}
                  inputProps={{
                    ...register("Name", {
                      required: " Vehicle Name is required",
                    }),
                    onBlur: (e) =>
                      setHeader({ ...header, name: e.target.value }),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Vehicle Type{" "}
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{
                    required: " Vehicle Type is required",
                  }}
                  name="U_Type"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        disabled={detail}
                        items={[
                          { label: "Truck", value: "Truck" },
                          { label: "Train", value: "Train" },
                          { label: "Van", value: "Van" },
                        ]}
                        onChange={(e: any) => {
                          setValue("U_Type", e.target.value);

                          setStaticSelect({
                            ...staticSelect,
                            U_Type: e.target.value,
                          });
                        }}
                        value={field.value}
                        // value={staticSelect.U_Type || defaultValues?.U_Type}
                        aliasvalue="value"
                        aliaslabel="label"
                      />
                    );
                  }}
                />
              </div>
            </div>
            {/* <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Driver
                </label>
              </div>
              <div className="grid grid-cols-5 py-2">
                <div className="col-span-3">
                  <MUITextField
                    disabled={detail}
                    inputProps={{
                      ...register("U_Number", {
                        required: "Vehicle Number is required",
                      }),
                    }}
                  />
                </div>
              </div>
            </div> */}
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Vehicle Number{" "}
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  type="number"
                  disabled={detail}
                  inputProps={{
                    ...register("U_VH_NO", {
                      required: "Vehicle Number is required",
                    }),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Driver
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
                        // value={defaultValues?.U_Driver}

                        value={field.value}
                        onChange={(e: any) => {
                          setValue("U_Driver", e?.EmployeeID);
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
                  Fuel Type
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{
                    required: "Fuel Type is required",
                  }}
                  name="U_FuelType"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        disabled={detail}
                        items={[
                          { label: "Petro", value: "Petro" },
                          { label: "Diesel", value: "Diesel" },
                          { label: "Electric", value: "Electric" },
                        ]}
                        onChange={(e: any) => {
                          setValue("U_FuelType", e.target.value);

                          setStaticSelect({
                            ...staticSelect,
                            U_FuelType: e.target.value,
                          });
                        }}
                        value={field.value}
                        // value={
                        //   staticSelect.U_FuelType || defaultValues?.U_FuelType
                        // }
                        aliasvalue="value"
                        aliaslabel="label"
                      />
                    );
                  }}
                />
              </div>
            </div>
          </div>

          <div className="">
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Base Station
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
                        // value={defaultValues?.U_BaseStation}
                        value={field.value}
                        onChange={(e: any) => {
                          setValue("U_BaseStation", e);
                          setHeader({ ...header, base: e });
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
                  Plate Number{" "}
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail}
                  inputProps={{
                    ...register("U_PlateNumber", {
                      required: "Plat Number is required",
                    }),
                    onBlur: (e) =>
                      setHeader({ ...header, number: e.target.value }),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Ownership{" "}
                  <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  rules={{
                    required: "Ownership is required",
                  }}
                  name="U_Owner"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        disabled={detail}
                        items={[
                          { label: "Own", value: "Own" },
                          { label: "Rent", value: "Rent" },
                        ]}
                        onChange={(e: any) => {
                          setValue("U_Owner", e.target.value);
                          setHeader({ ...header, owner: e?.target?.value });
                          setStaticSelect({
                            ...staticSelect,
                            U_Owner: e.target.value,
                          });
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
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Inittialize Odometer KM
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={detail}
                  type="number"
                  inputProps={{
                    ...register("U_InitializeOdometer"),
                    onChange: (val) => {
                      if (isNaN(Number(val))) return "1";
                    },
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
                {staticSelect?.U_Status === "" && (
                  <div className="hidden">
                    <MUITextField
                      inputProps={{
                        ...register("U_Status"),
                      }}
                      value={"Active"}
                    />
                  </div>
                )}
                <Controller
                  name="U_Status"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        disabled={detail}
                        items={[
                          { value: "Active", label: "Active" },
                          { value: "Inactive", label: "Inactive" },
                        ]}
                        onChange={(e: any) => {
                          setValue("U_Status", e.target.value);
                          setStaticSelect({
                            ...staticSelect,
                            U_Status: e.target.value,
                          });
                          setHeader({ ...header, status: e?.target?.value });
                        }}
                        value={field.value}
                        // value={
                        //   staticSelect.U_Status ||
                        //   defaultValues?.U_Status ||
                        //   "Active"
                        // }
                        aliasvalue="value"
                        aliaslabel="label"
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2"></div>
              <div className="col-span-3">
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={detail}
                      checked={
                        useWatch({
                          control: control,
                          name: "U_UnderMaintenance",
                        }) === "YES"
                      } // Use checked prop for a controlled Checkbox
                      onChange={(e) =>
                        setValue(
                          "U_UnderMaintenance",
                          e.target.checked === true ? "YES" : "No"
                        )
                      }
                    />
                  }
                  label={
                    <span className="text-gray-500">Under Maintenance</span>
                  }
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
