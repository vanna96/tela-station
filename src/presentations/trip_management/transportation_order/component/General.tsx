import MUITextField from "@/components/input/MUITextField";
import ManagerAutoComplete from "@/components/input/ManagerAutoComplete";
import MUISelect from "@/components/selectbox/MUISelect";
import { useCallback, useEffect } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import { Controller } from "react-hook-form";
import BaseStationAutoComplete from "@/components/input/BaseStationAutoComplete";
import RoutAutoComplete from "@/components/input/RouteAutoComplete";
import VehicleAutoComplete from "@/presentations/trip_management/component/VehicleAutoComplete";
import { useQueryURL } from "@/lib/utils";

const General = ({
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

  const onChangeSerie = useCallback(
    (event: any) => {
      const serie = series?.data?.find(
        (e: any) => e?.Series === event?.target?.value
      );
      if (!serie) return;

      setValue("Series", event?.target?.value);
      setValue("DocNum", serie?.NextNumber);
    },
    [series]
  );


  const onChangeRoute = useCallback((event: any) => {
    setValue("U_Route", event?.Code);
    const expense = event?.TL_RM_EXPENSCollection?.map((e: any) => ({
      U_Amount: e?.U_Amount,
      U_Code: e?.U_Code,
      U_Description: e?.U_Description
    }))

    const stops = event?.TL_RM_SEQUENCECollection?.map((e: any) => ({
      U_StopCode: e?.U_Code,
      U_Type: "S",
      U_Description: e?.U_Code,
      TL_TO_DETAIL_ROWCollection: [
        {
          U_DocType: "S",
          U_ShipToCode: e?.U_Code,
          U_ShipToAddress: e?.U_Code,
          U_Order: 0,
        }
      ]
    }))

    let collections = [...watch('TL_TO_ORDERCollection')];
    // remove all source type stops when route is changed
    collections = collections.filter((e) => e?.U_Type !== 'S')
    collections.push(...stops)

    setValue("TL_TO_EXPENSECollection", expense);
    setValue("TL_TO_ORDERCollection", collections);
  }, [watch('TL_TO_ORDERCollection'), watch('U_Route')])

  const onChangeVehicle = useCallback((event: any) => {
    setValue("U_Vehicle", event?.Code);
    setValue("U_VehicleName", event?.Name);

    const compartments = event?.TL_VH_COMPARTMENTCollection?.map(
      (e: any, rowIndex: number) => {
        const length = (e?.U_TOP_HATCH ?? 0) + (e?.U_BOTTOM_HATCH ?? 0);
        const children = [];
        for (let index = 0; index < length; index++) {
          children.push({
            U_SealNumber: index + 1,
            U_SealReference: null,
            U_ParentEntry: rowIndex
          })
        }
        return {
          U_Volume: e?.U_VOLUME,
          U_BottomHatch: e?.U_BOTTOM_HATCH,
          U_TopHatch: e?.U_TOP_HATCH,
          U_Children: children,
        };
      }
    );

    setValue("TL_TO_COMPARTMENTCollection", compartments);
  }, [watch('U_Vehicle'), watch('TL_TO_COMPARTMENTCollection')]);


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
                  render={({ field }) => <RoutAutoComplete {...field} value={field.value} onChange={onChangeRoute} />}
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
                  render={({ field }) => <BaseStationAutoComplete disabled={id} value={field.value} onChange={(e: any) => setValue("U_BaseStation", e)} />}
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
                      <VehicleAutoComplete value={field.value} onChange={onChangeVehicle} />
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
                        onChange={(e: any) => {
                          setValue("U_CheckList", e?.U_CheckList);
                          setValue("U_Driver", e?.EmployeeID);
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
                <MUITextField disabled={true} inputProps={{ ...register("U_CheckList"), }} />
              </div>
            </div>
          </div>

          <div className="col-span-5 w-[50%]">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Series {edit}
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
                          disabled={edit || id}
                          items={series?.data}
                          value={field.value}
                          aliasvalue="Series"
                          aliaslabel="Name"
                          name="Series"
                          onChange={onChangeSerie}
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
                        onChange={(e: any) => {
                          const val =
                            e.toLowerCase() ===
                              "Invalid Date".toLocaleLowerCase()
                              ? ""
                              : e;
                          setValue("U_DocDate", `${val == "" ? "" : val}`);
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
                <div className="hidden">
                </div>
                <Controller
                  name="U_Status"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        {...field}
                        disabled={true}
                        items={allStatus}
                        onChange={(e: any) => {
                          // setValue("U_Status", e.target.value);
                        }}
                        value={field.value || "I"}
                        aliasvalue="value"
                        aliaslabel="label"
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
                        onChange={(e: any) => {
                          const val = e.toLowerCase() === "Invalid Date".toLocaleLowerCase() ? "" : e;
                          setValue("U_DispatchDate", `${val == "" ? "" : val}`);
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
                  name="U_CompletedDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        // disabled={(id as any) || detail}
                        {...field}
                        value={field.value}
                        onChange={(e: any) => {
                          const val = e.toLowerCase() === "Invalid Date".toLocaleLowerCase() ? "" : e;
                          setValue("U_CompletedDate", `${val == "" ? "" : val}`);
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
    </>
  );
};

export default General;
