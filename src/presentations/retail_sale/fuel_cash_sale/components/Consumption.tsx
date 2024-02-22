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
        <div className="font-medium text-xl flex items-center border-b my-6 gap-16">
          <h2>Allocation</h2>{" "}
          <Button
            type="button"
            size="small"
            variant="outlined"
            onClick={handleGenerateAllocation}
          >
            Generate Allocation
          </Button>
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
