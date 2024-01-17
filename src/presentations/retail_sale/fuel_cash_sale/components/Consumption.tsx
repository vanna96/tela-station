import React from "react";
import { useQuery } from "react-query";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import VendorByBranch from "@/components/input/VendorByBranch";
import DispenserAutoComplete from "@/components/input/DispenserAutoComplete";
import request from "@/utilies/request";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";

export interface ConsumptionProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
}

const fetchDispenserData = async (pump: string) => {
  const res = await request("GET", `TL_Dispenser('${pump}')`);
  return res;
};

export default function Consumption({
  data,
  handlerChange,
  edit,
}: ConsumptionProps) {
  const {
    data: dispenserData,
    isLoading,
    isError,
  } = useQuery(["dispenser", data.Pump], () => fetchDispenserData(data.Pump), {
    enabled: !!data.Pump,
  });

  console.log(dispenserData);

  // Add error handling if needed
  if (isError) {
    console.error("Error fetching dispenser data");
  }

  // You c
  return (
    <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-screen">
      <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
        <h2>Basic Information</h2>
      </div>

      <div className="grid grid-cols-12 ">
        <div className="col-span-5 ">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Branch
              </label>
            </div>
            <div className="col-span-3"></div>
          </div>

          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Pump
              </label>
            </div>
            <div className="col-span-3">
              <DispenserAutoComplete
                value={data?.Pump}
                onChange={(e) => {
                  handlerChange("Pump", e);
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 py-1">
            <div className="col-span-2 text-gray-600 ">
              Customer <span className="text-red-500">*</span>
            </div>
            <div className="col-span-3 text-gray-900">
              <VendorByBranch
                branch={data?.BPL_IDAssignedToInvoice}
                vtype="customer"
                onChange={(vendor) => handlerChange("vendor", vendor)}
                key={data?.CardCode}
                error={"CardCode" in data?.error}
                helpertext={data?.error?.CardCode}
                autoComplete="off"
                defaultValue={data?.CardCode}
                name="BPCode"
                endAdornment={!edit}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Name
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField value={data?.CardName} disabled name="BPName" />
            </div>
          </div>

          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Shift Code
              </label>
            </div>
            <div className="col-span-3">
              <MUISelect
                value={data.ShiftCode}
                items={[{ value: "1", name: "Shift 1" }]}
                aliaslabel="name"
                aliasvalue="value"
                onChange={(e) => {
                  handlerChange("ShiftCode", e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-span-2 md:col-span-1"></div>
        <div className="col-span-5 ">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Document Date
              </label>
            </div>
            <div className="col-span-3">
              <MUIDatePicker
                disabled={edit && data?.Status?.includes("A")}
                value={data.DocumentDate}
                onChange={(e: any) => handlerChange("DocumentDate", e)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
