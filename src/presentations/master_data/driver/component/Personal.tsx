import CountryAutoComplete from "@/components/input/CountryAutoComplete";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { UseFormProps } from "../form";
import { Controller } from "react-hook-form";
import { formatDate } from "@/helper/helper";

const Personal = ({
  register,
  control,
  defaultValues,
  setValue,
  header,
  setHeader,
  detail,
  watch,
}: UseFormProps) => {
  const [staticSelect, setStaticSelect] = useState({
    gender: "",
    status: "",
    checkList: "",
    dateOfbirth: null,
    passportExpirationDate: null,
    passportIssuedDate: null,
  });
  useEffect(() => {
    if (staticSelect) {
      setHeader({ ...header, gender: staticSelect.gender });
    }
  }, [staticSelect]);

  return (
    <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
      <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
        <h2>Personal</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-[6rem] md:gap-0 ">
        <div className="">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Gender
              </label>
            </div>
            <div className="col-span-3">
              <Controller
                name="Gender"
                control={control}
                render={({ field }) => {
                  return (
                    <MUISelect
                      disabled={detail}
                      items={[
                        { label: "Female", value: "gt_Female" },
                        { label: "Male", value: "gt_Male" },
                      ]}
                      onChange={(e: any) => {
                        setValue("Gender", e.target.value);
                        //  setHeader({ ...header, branch: e?.e.target.label });
                      }}
                      value={watch("Gender") || defaultValues?.Gender}
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
                Date Of Birth
              </label>
            </div>
            <div className="col-span-3">
              <Controller
                name="DateOfBirth"
                control={control}
                render={({ field }) => {
                  return (
                    <MUIDatePicker
                      disabled={detail}
                      {...field}
                      defaultValue={
                        defaultValues?.DateOfBirth || watch("DateOfBirth")
                      }
                      key={`date_birth_${staticSelect.dateOfbirth}`}
                      onChange={(e: any) => {
                        const val =
                          e.toLowerCase() === "Invalid Date".toLocaleLowerCase()
                            ? ""
                            : e;
                        setValue("DateOfBirth", `   ${val == "" ? "" : val}`);
                        setStaticSelect({ ...staticSelect, dateOfbirth: e });
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
                ID No.
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField
                inputProps={{ ...register("IdNumber") }}
                disabled={detail}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Marital Status
              </label>
            </div>
            <div className="col-span-3">
              <Controller
                name="MartialStatus"
                control={control}
                render={({ field }) => {
                  return (
                    <MUISelect
                      disabled={detail}
                      items={[
                        { label: "Married", value: "mts_Married" },
                        { label: "Single", value: "mts_Single" },
                      ]}
                      onChange={(e: any) => {
                        setValue("MartialStatus", e.target.value);
                      }}
                      value={
                        watch("MartialStatus") || defaultValues?.MartialStatus
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
                Blood Type <span className="text-red-500 ml-1">*</span>
              </label>
            </div>
            <div className="col-span-3">
              <Controller
                rules={{ required: "Blood Type is required" }}
                name="U_CheckList"
                control={control}
                render={({ field }) => {
                  return (
                    <MUISelect
                      disabled={detail}
                      items={[
                        { label: "A+", value: "A+" },
                        { label: "A-", value: "A-" },
                        { label: "B+", value: "B+" },
                        { label: "B-", value: "B-" },
                        { label: "AB+", value: "AB+" },
                        { label: "AB-", value: "AB-" },
                        { label: "O+", value: "O+" },
                        { label: "O-", value: "O-" },
                      ]}
                      onChange={(e: any) => {
                        setValue("U_CheckList", e.target.value);
                      }}
                      value={watch("U_CheckList") || defaultValues?.U_CheckList}
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
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Citizenship
              </label>
            </div>
            <div className="col-span-3">
              {defaultValues == undefined && (
                <div className="hidden">
                  <MUITextField
                    disabled={detail}
                    inputProps={{ ...register("CitizenshipCountryCode") }}
                    value={"KH"}
                  />
                </div>
              )}
              <Controller
                name="CitizenshipCountryCode"
                control={control}
                render={({ field }) => {
                  return (
                    <CountryAutoComplete
                      disabled={detail}
                      {...field}
                      value={defaultValues?.CitizenshipCountryCode || "KH"}
                      onChange={(e: any) => {
                        setValue("CitizenshipCountryCode", e);

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
                Passport No.
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField
                disabled={detail}
                inputProps={{ ...register("PassportNumber") }}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Passport Expiration Date
              </label>
            </div>
            <div className="col-span-3">
              <Controller
                name="PassportExpirationDate"
                control={control}
                render={({ field }) => {
                  return (
                    <MUIDatePicker
                      disabled={detail}
                      {...field}
                      defaultValue={
                        defaultValues?.PassportExpirationDate ||
                        staticSelect.passportExpirationDate
                      }
                      key={`passport_ex_${staticSelect.passportExpirationDate}`}
                      onChange={(e: any) => {
                        if (e) {
                          const val =
                            e.toLowerCase() ===
                            "Invalid Date".toLocaleLowerCase()
                              ? ""
                              : e;
                          setValue(
                            "PassportExpirationDate",
                            `  ${val == "" ? "" : val}`
                          );
                          setStaticSelect({
                            ...staticSelect,
                            passportExpirationDate: e,
                          });
                        }
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
                Passport Issued Date
              </label>
            </div>
            <div className="col-span-3">
              <Controller
                name="PassportIssueDate"
                control={control}
                render={({ field }) => {
                  return (
                    <MUIDatePicker
                      disabled={detail}
                      {...field}
                      defaultValue={
                        defaultValues?.PassportIssueDate ||
                        staticSelect.passportIssuedDate
                      }
                      key={`passport_${staticSelect.passportIssuedDate}`}
                      onChange={(e: any) => {
                        if (e) {
                          const val =
                            e.toLowerCase() ===
                            "Invalid Date".toLocaleLowerCase()
                              ? ""
                              : e;
                          setValue(
                            "PassportIssueDate",
                            ` ${val == "" ? "" : val}`
                          );
                          setStaticSelect({
                            ...staticSelect,
                            passportIssuedDate: e,
                          });
                        }
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
  );
};

export default Personal;
