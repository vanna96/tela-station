import CountryAutoComplete from "@/components/input/CountryAutoComplete";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { TextField } from "@mui/material";
import React, { useState } from "react";
import { UseFormProps } from "../form";
import { Controller } from "react-hook-form";
import { formatDate } from "@/helper/helper";

const Personal = ({
  register,
  control,
  defaultValues,
  setValue,
}: UseFormProps) => {
  const [staticSelect, setStaticSelect] = useState({
    gender: "",
    status: "",
    checkList:"",
    dateOfbirth: null,
    passportExpirationDate: null,
    passportIssuedDate: null,
  });

  return (
    <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
      <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
        <h2>Personal</h2>
      </div>
      <div className="  flex gap-[100px]">
        <div className="col-span-5  w-[50%]">
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
                      items={[
                        { label: "Female", value: "gt_Female" },
                        { label: "Male", value: "gt_Male" },
                      ]}
                      onChange={(e: any) => {
                        setValue("Gender", e.target.value);
                        setStaticSelect({
                          ...staticSelect,
                          gender: e.target.value,
                        });
                      }}
                      value={staticSelect.gender || defaultValues?.Gender}
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
                      {...field}
                      defaultValue={
                        defaultValues?.DateOfBirth || staticSelect.dateOfbirth
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
              <MUITextField inputProps={{ ...register("IdNumber") }} />
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
                      items={[
                        { label: "Divorced", value: "D" },
                        { label: "Married", value: "mts_Married" },
                        { label: "Not Specified", value: "N" },
                        { label: "Single", value: "mts_Single" },
                        { label: "Widowed", value: "w" },
                      ]}
                      onChange={(e: any) => {
                        setValue("MartialStatus", e.target.value);

                        setStaticSelect({
                          ...staticSelect,
                          status: e.target.value,
                        });
                      }}
                      value={
                        staticSelect.status || defaultValues?.MartialStatus
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
                Blood Type
              </label>
            </div>
            <div className="col-span-3">
              <Controller
                name="U_CheckList"
                control={control}
                render={({ field }) => {
                  return (
                    <MUISelect
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
                        setStaticSelect({
                          ...staticSelect,
                          checkList: e.target.value,
                        });
                      }}
                      value={
                        staticSelect.checkList || defaultValues?.U_CheckList
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

        <div className="col-span-5  w-[50%]">
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
              <MUITextField inputProps={{ ...register("PassportNumber") }} />
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
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Passport Issuer
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField inputProps={{ ...register("PassportIssuer") }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personal;
