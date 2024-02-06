import React from "react";
import StockAllocationTable from "./StockAllocationTable";

export interface StockAllocationFormProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
}

export default function StockAllocationForm({
  data,
  handlerChange,
  edit,
}: StockAllocationFormProps) {
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
        <StockAllocationTable
          data={data}
          onChange={handlerChange}
          edit={edit}
        />
      </div>
    </>
  );
}
