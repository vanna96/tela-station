import React, { useEffect, useState } from "react";
import NozzleData from "./NozzleDataTable";
import AllocationTable from "../../fuel_cash_sale/components/AllocationTable";
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
        <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
          <h2>Allocation Data</h2>
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
