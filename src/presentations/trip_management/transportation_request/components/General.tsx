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
import BaseStationAutoComplete from "@/components/input/BaseStationAutoComplete";
import { useCookies } from "react-cookie";
import SeriesSelect from "./Series";
import { TextField } from "@mui/material";
import ShipToAutoComplete from "@/components/input/ShipToAutoComplete";

const General = ({
  register,
  control,
  defaultValues,
  setValue,
  setBranchAss,
  header,
  setHeader,
  detail,
  data,
  serie,
}: UseFormProps) => {
  const [staticSelect, setStaticSelect] = useState({
    requestDate: null,
    status: null,
    expiredDate: null,
    branchASS: null,
    emp: null,
    serie: 7916,
  });
  const [number, setNumber] = useState(null);
  useEffect(() => {
    if (defaultValues) {
      defaultValues?.EmployeeBranchAssignment?.forEach((e: any) =>
        setStaticSelect({ ...staticSelect, branchASS: e?.BPLID })
      );
    }
  }, [defaultValues]);
  const [cookies] = useCookies(["user"]);
  const [selectedSeries, setSelectedSeries] = useState("");
  const nextNumber = serie?.find(
    (e: any) => e?.Series === staticSelect?.serie
  )?.NextNumber;

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
                      <ManagerAutoComplete
                        disabled={detail}
                        {...field}
                        value={defaultValues?.U_Requester}
                        onChange={(e: any) => {
                          setValue("U_Requester", e);
                          setHeader({ ...header, U_Requester: e });
                          console.log(e);
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
                  Branch Assignment{" "}
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
                        disabled={detail}
                        onChange={(e: any) => {
                          setValue("U_Branch", e?.BPLID);
                          setBranchAss([e]);
                          setHeader({ ...header, U_Branch: e?.BPLName });
                        }}
                        value={
                          staticSelect?.branchASS || defaultValues?.U_Branch
                        }
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Terminal
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
                      <WarehouseAttendTo
                        U_tl_attn_ter={true}
                        disabled={detail}
                        {...field}
                        value={defaultValues?.U_Terminal}
                        onChange={(e: any) => {
                          setValue("U_Terminal", e);
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
                  Ship To
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
                      <ShipToAutoComplete
                        disabled={detail}
                        {...field}
                        value={defaultValues?.U_Terminal}
                        onChange={(e: any) => {
                          setValue("U_Terminal", e);
                        }}
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
                            disabled={detail}
                            value={staticSelect.serie || defaultValues?.serie}
                            aliasvalue="Series"
                            aliaslabel="Name"
                            name="Series"
                            onChange={(e: any) => {
                              console.log(e);
                              setValue("Series", e?.target?.value);
                              setStaticSelect({
                                ...staticSelect,
                                serie: e?.target?.value,
                              });
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
                        disabled={detail}
                        {...field}
                        defaultValue={
                          defaultValues?.U_RequestDate ||
                          staticSelect.requestDate
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
                          setValue("U_ExpiredDate", `${val == "" ? "" : val}`);
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
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Extra Remarks
                </label>
              </div>
              <div className="col-span-3">
                <TextField
                  disabled={detail}
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
