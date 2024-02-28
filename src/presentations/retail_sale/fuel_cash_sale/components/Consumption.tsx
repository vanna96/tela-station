import React, { useEffect, useState } from "react";
import NozzleData from "./NozzleDataTable";
import AllocationTable from "./AllocationTable";
import { Button } from "@mui/material";

export interface ConsumptionProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  handlerChangeObject: (obj: any) => void;
  edit?: boolean;
}

export default function Consumption({
  data,
  handlerChange,
  edit,
  handlerChangeObject,
}: ConsumptionProps) {
  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-screen">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
          <h2>Nozzle Data</h2>
        </div>
        <NozzleData data={data} onChange={handlerChange} edit={edit} />
        <div className="flex items-center my-6 gap-16 ">
          <div
            className="border border-gray-400 rounded cursor-pointer "
            // onClick={generateAllocation}
          >
            <h4 className="border-b-1 border-gray-400 py-1 px-4 select-none">
              Generate Allocation
            </h4>
          </div>
        </div>

        <AllocationTable
          data={data}
          onChange={handlerChange}
          edit={edit}
          handlerChangeObject={handlerChangeObject}
        />
      </div>
    </>
  );
}
