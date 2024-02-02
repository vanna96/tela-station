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
import { Button } from "@mui/material";

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
  const [showAllocationTable, setShowAllocationTable] = React.useState(false);

  const handleGenerateAllocation = () => {
    setShowAllocationTable(!showAllocationTable);
  };

  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-8 px-14 md:px-6 xl:px-8 h-screen">
        <div className="font-medium text-xl flex items-center border-b my-6 gap-16">
          <h2>Nozzle Data</h2>{" "}
        </div>
        <NozzleData data={data} onChange={handlerChange} />

        <div className="font-medium text-xl flex items-center border-b my-6 gap-16">
          <h2>Allocation</h2>{" "}
          {/* <div
            className="button cursor-pointer"
            onClick={handleGenerateAllocation}
          >
            <h3 className="font-thin text-base border-x-2 border-y-2 px-8 border-gray-500 select-none">
              Generate Allocation
            </h3>
          </div> */}
          <Button
            type="button"
            sx={{ height: "30px", textTransform: "none" }}
            className="bg-white"
            size="small"
            variant="outlined"
            disableElevation
            onClick={handleGenerateAllocation}
          >
            <span className="px-6 text-[13px] py-4 ">Generate Allocation</span>
          </Button>
        </div>
        {showAllocationTable && (
          <AllocationTable data={data} onChange={handlerChange} />
        )}
      </div>
    </>
  );
}
const handleGenerateAllocation = () => {
  // Add your logic here for generating allocation
  console.log("Generate Allocation button clicked!");
};
