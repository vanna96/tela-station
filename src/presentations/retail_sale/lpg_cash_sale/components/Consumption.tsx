import React from "react";
import { useQuery } from "react-query";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import VendorByBranch from "@/components/input/VendorByBranch";
import DispenserAutoComplete from "@/components/input/DispenserAutoComplete";
import request from "@/utilies/request";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import NozzleData from "./NozzleDataTable";
import AllocationTable from "./AllocationTable";
import FormCard from "@/components/card/FormCard";

export interface ConsumptionProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
}

export default function Consumption({
  data,
  handlerChange,
  edit,
}: ConsumptionProps) {
  // You c
  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-8 px-14 md:px-6 xl:px-8 h-screen">
        <div className="font-medium text-xl flex items-center border-b my-6 gap-16">
          <h2>Nozzle Data</h2>{" "}
        </div>
        <NozzleData data={data} onChange={handlerChange} />
      </div>
    </>
  );
}
