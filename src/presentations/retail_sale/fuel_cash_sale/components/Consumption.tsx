import React from "react";
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
  const [showAllocationTable, setShowAllocationTable] = React.useState(false);

  const handleGenerateAllocation = () => {
    setShowAllocationTable(!showAllocationTable);
  };

  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-screen">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
          <h2>Nozzle Data</h2>{" "}
        </div>
        <NozzleData data={data} onChange={handlerChange} edit={edit} />

        <div className="font-medium text-xl flex items-center border-b my-6 gap-16">
          <h2>Allocation</h2>{" "}
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
            <Button
              type="button"
              sx={{ height: "30px", textTransform: "none" }}
              className="bg-white"
              size="small"
              variant="outlined"
              disableElevation
              onClick={() => setShowAllocationTable(!showAllocationTable)}
            >
              <span className="px-6 text-[13px] py-4 ">
                Generate Allocation
              </span>
            </Button>
            <div className="mb-6" />
            {showAllocationTable && (
              <AllocationTable
                handlerChangeObject={handlerChangeObject}
                data={data}
                onChange={handlerChange}
                edit={edit}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
