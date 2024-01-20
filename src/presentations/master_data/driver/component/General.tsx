import MUITextField from "@/components/input/MUITextField";
import { UseFormProps } from "../form";
import PositionSelect from "@/components/selectbox/Position";
import DepartmentSelect from "@/components/selectbox/Department";
import ManagerSelect from "@/components/selectbox/Manager";
import PositionAutoComplete from "@/components/input/PositionAutoComplete";
import DepartmentAutoComplete from "@/components/input/DepartmentAutoComplete";
import ManagerAutoComplete from "@/components/input/ManagerAutoComplete";
import MUISelect from "@/components/selectbox/MUISelect";
import { useState } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import { Controller } from "react-hook-form";
import { formatDate } from "@/helper/helper";
import VendorModal from "@/components/modal/VendorModal";
import BranchAssignmentAuto from "@/components/input/BranchAssignment";
import ReasonAutoComplete from "@/components/input/ReasonAutoComplete";
import BranchAssignmentCheck from "./../../../../components/input/BranchAssignmentCheck";

const General = ({
  register,
  control,
  defaultValues,
  setValue,
  setBranchAss,
  branchAss,
}: UseFormProps) => {
  const [staticSelect, setStaticSelect] = useState({
    startDate: null,
    status: "",
    termination: null,
  });

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
                  First Name
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  inputProps={{
                    ...register("FirstName"),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Last Name
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  inputProps={{
                    ...register("LastName"),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Middle Name
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  inputProps={{
                    ...register("MiddleName"),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Employees Code
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  inputProps={{
                    ...register("EmployeeCode"),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Position
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="Position"
                  control={control}
                  render={({ field }) => {
                    return (
                      <PositionAutoComplete
                        {...field}
                        value={defaultValues?.Position}
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
                  Department
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="Department"
                  control={control}
                  render={({ field }) => {
                    return (
                      <DepartmentAutoComplete
                        {...field}
                        value={defaultValues?.Department}
                        onChange={(e: any) => {
                          setValue("Department", e);

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
                  Manager
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="Manager"
                  control={control}
                  render={({ field }) => {
                    return (
                      <ManagerAutoComplete
                        {...field}
                        value={defaultValues?.Manager}
                        onChange={(e: any) => {
                          setValue("Manager", e);

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
                  Branch Assignment
                </label>
              </div>
              <div className="col-span-3">
                {/* <BranchAssignmentAuto
                  value={branchAss}
                  onChange={(e) => setBranchAss([e])}
                /> */}
                <BranchAssignmentCheck
                  branchAss={branchAss}
                  setBranchAss={setBranchAss}
                />
              </div>
            </div>
            {/* <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Terminal
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField
                inputProps={{
                  ...register("FirstName"),
                }}
              />
            </div>
          </div> */}
          </div>

          <div className="col-span-5 w-[50%]">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Mobile Phone
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  inputProps={{
                    ...register("MobilePhone"),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Home Phone
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  inputProps={{
                    ...register("HomePhone"),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Email
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  inputProps={{
                    ...register("eMail"),
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Start Date
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="StartDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        {...field}
                        value={defaultValues?.StartDate || staticSelect.startDate}
                        onChange={(e: any) => {
                            setValue(
                              "StartDate",
                              ` ${formatDate(e)}"T00:00:00Z"`
                            );
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
                  Active
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="MartialStatus"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        items={[
                          { value: "tYES", label: "Yes" },
                          { value: "tNO", label: "No" },
                        ]}
                        onChange={(e: any) => {
                          setValue("MartialStatus", e.target.value);
                          setStaticSelect({
                            ...staticSelect,
                            status: e.target.value,
                          });
                        }}
                        value={staticSelect.status || defaultValues?.Active}
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
                  Termination
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="TerminationDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        {...field}
                        value={
                          defaultValues?.TerminationDate ||
                          staticSelect?.termination
                        }
                        onChange={(e: any) => {
                          setValue(
                            "TerminationDate",
                            ` ${formatDate(e)}"T00:00:00Z"`
                          );
                          setStaticSelect({ ...staticSelect, termination: e });
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
                  Termination Reason
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="TreminationReason"
                  control={control}
                  render={({ field }) => {
                    return (
                      <ReasonAutoComplete
                        {...field}
                        value={defaultValues?.TreminationReason}
                        onChange={(e: any) => {
                          setValue("TreminationReason", e);

                          // setHeader({ ...header, data5: e?.Name })
                        }}
                      />
                    );
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
