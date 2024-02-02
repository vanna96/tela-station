import MUITextField from "@/components/input/MUITextField";
import { UseFormProps } from "../form";
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
import WarehouseAttendTo from "@/components/selectbox/WarehouseAttention";

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
    requestDate: null,
    status: "",
    expiredDate: null,
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
        <div className="  flex gap-[100px]">
          <div className="col-span-5  w-[50%]">
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Requester
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_Requester"
                  control={control}
                  render={({ field }) => {
                    return (
                      <ManagerAutoComplete
                        disabled={detail}
                        {...field}
                        value={defaultValues?.U_Requester}
                        onChange={(e: any) => {
                          setValue("U_Requester", e);
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
                <BranchAssignmentAuto
                  disabled={detail}
                  onChange={(e: any) => {
                    setBranchAss([e]);
                    setHeader({ ...header, U_Branch: e?.BPLName });
                  }}
                  value={staticSelect?.branchASS}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Destination
                  <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <WarehouseAttendTo
                  onChange={(e: any) => {
                    setBranchAss([e]);
                    setHeader({ ...header, U_Terminal: e?.BPLName });
                  }}
                  value={staticSelect?.branchASS}
                />
              </div>
            </div>
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
                  disabled={detail}
                  inputProps={{
                    ...register("MobilePhone"),
                  }}
                />
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
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Request Date
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_RequestDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        disabled={detail}
                        {...field}
                        defaultValue={
                          defaultValues?.U_RequestDate || staticSelect.requestDate
                        }
                        key={`request_date_${staticSelect.requestDate}`}
                        onChange={(e: any) => {
                          const val =
                            e.toLowerCase() ===
                            "Invalid Date".toLocaleLowerCase()
                              ? ""
                              : e;
                          setValue("U_RequestDate", `${val == "" ? "" : val}`);
                          setStaticSelect({
                            ...staticSelect,
                            requestDate: e,
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
                        disabled={detail}
                        {...field}
                        defaultValue={
                          defaultValues?.U_ExpiredDate ||
                          staticSelect.expiredDate
                        }
                        key={`termination_date_${staticSelect.expiredDate}`}
                        onChange={(e: any) => {
                          const val =
                            e.toLowerCase() ===
                            "Invalid Date".toLocaleLowerCase()
                              ? ""
                              : e;
                          setValue(
                            "U_ExpiredDate",
                            `${val == "" ? "" : val}`
                          );
                          setStaticSelect({
                            ...staticSelect,
                            expiredDate: e,
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
                {staticSelect?.status === "" && (
                  <div className="hidden">
                    <MUITextField
                      inputProps={{
                        ...register("Status"),
                      }}
                      value={"O"}
                    />
                  </div>
                )}
                <Controller
                  name="Status"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        disabled={detail}
                        items={[
                          { value: "O", label: "Active" },
                          { value: "Y", label: "Inactive" },
                        ]}
                        onChange={(e: any) => {
                          setValue("Status", e.target.value);
                          setStaticSelect({
                            ...staticSelect,
                            status: e.target.value,
                          });
                        }}
                        value={
                          staticSelect.status || defaultValues?.Status || "O"
                        }
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
      {/* <VendorModal open={true} /> */}
    </>
  );
};

export default General;
