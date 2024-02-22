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
  const [showAllocationTable, setShowAllocationTable] = useState(
    localStorage.getItem("showAllocationTable") === "true"
  );

  useEffect(() => {
    // Update localStorage whenever showAllocationTable changes
    localStorage.setItem("showAllocationTable", showAllocationTable.toString());
  }, [showAllocationTable]);

  const handleGenerateAllocation = () => {
    setShowAllocationTable(!showAllocationTable);
  };
  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-screen">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
          <h2>Nozzle Data</h2>
        </div>
        <NozzleData data={data} onChange={handlerChange} edit={edit} />
        <div
          className="flex items-center my-6 gap-16"
          onClick={handleGenerateAllocation}
        >
          <div className="border border-gray-400 rounded cursor-pointer">
            <h4 className="border-b-1 border-gray-400 py-1 px-4">
              Generate Allocation
            </h4>
          </div>
          {/* <Button
            type="button"
            size="small"
            variant="outlined"

            style={{ textDecoration: "none", textTransform: "none" , color: "black" , border: "black" }}
            onClick={handleGenerateAllocation}
          >
            Generate Allocation
          </Button> */}
        </div>
        {edit ? (
          <AllocationTable
            data={data}
            onChange={handlerChange}
            edit={edit}
            handlerChangeObject={handlerChangeObject}
          />
        ) : (
          <div>
            {showAllocationTable && (
              <AllocationTable
                data={data}
                onChange={handlerChange}
                edit={edit}
                handlerChangeObject={handlerChangeObject}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
