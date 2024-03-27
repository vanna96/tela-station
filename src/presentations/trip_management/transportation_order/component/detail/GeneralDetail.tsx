import MUITextField from "@/components/input/MUITextField";
import ManagerAutoComplete from "@/components/input/ManagerAutoComplete";
import MUISelect from "@/components/selectbox/MUISelect";
import { useCallback } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import { Controller } from "react-hook-form";
import BaseStationAutoComplete from "@/components/input/BaseStationAutoComplete";
import RoutAutoComplete from "@/components/input/RouteAutoComplete";
import VehicleAutoComplete from "@/presentations/trip_management/component/VehicleAutoComplete";

const GeneralDetail = ({
  register,
  control,
  setValue,
  header,
  setHeader,
  detail,
  watch,
  series,
  id,
  edit,
  allStatus
}: any) => {

  return (
    <>
      <div className="rounded-lg shadow-sm border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
          <h2 className="">Information</h2>
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
                  render={({ field }) => <RoutAutoComplete {...field} value={field.value} disabled={true} />}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Base Station
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_BaseStation"
                  control={control}
                  render={({ field }) => <BaseStationAutoComplete disabled={true} value={field.value} onChange={(e: any) => setValue("U_BaseStation", e)} />}
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
                  name="U_Vehicle"
                  control={control}
                  render={({ field }) => {
                    return (
                      <VehicleAutoComplete value={field.value} disabled={true} />
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
                <MUITextField disabled={true} inputProps={{ ...register("U_VehicleName"), }} />
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
                        value={field.value}
                        disabled={true}
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
                <MUITextField disabled={true} inputProps={{ ...register("U_CheckList"), }} />
              </div>
            </div>
          </div>

          <div className="col-span-5 w-[50%]">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Series
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
                          items={series?.data ?? []}
                          value={field.value}
                          aliasvalue="Series"
                          aliaslabel="Name"
                          name="Series"
                          disabled={true}
                        // onChange={(e: any) => onChangeSerie(e)}
                        />
                      );
                    }}
                  />

                  <div className="-mt-1">
                    <MUITextField
                      disabled={true}
                      key={watch("DocNum")}
                      value={watch("DocNum")}
                    />
                  </div>
                </div>
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
                  name="U_DocDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        {...field}
                        value={field.value}
                        disabled={true}
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
                <div className="hidden">

                </div>
                <Controller
                  name="U_Status"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        {...field}
                        items={allStatus}
                        onChange={(e: any) => {
                          // setValue("U_Status", e.target.value);
                        }}
                        value={field.value || "I"}
                        aliasvalue="value"
                        aliaslabel="label"
                        disabled={true}
                      />
                    );
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
                  name="U_DispatchDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        // disabled={(id as any) || detail}
                        {...field}
                        value={field.value}
                        disabled={true}
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
                  name="U_CompletedDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        // disabled={(id as any) || detail}
                        {...field}
                        value={field.value}
                        disabled={true}
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
    </>
  );
};

export default GeneralDetail;
