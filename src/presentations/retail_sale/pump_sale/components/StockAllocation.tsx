import FormCard from "@/components/card/FormCard";
import { useState } from "react";
import StockTable from "./StockTable";

export interface IStockAllocationProps {
  data: any;
  handlerChange: (key: string, value: any) => void;
  edit?: boolean;
  ref?: React.RefObject<FormCard>;
}

export default function StockAllocation({
  data,
  handlerChange,
  edit,
  ref,
}: IStockAllocationProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e: any) => {
    setIsChecked(e.target.checked);
  };

  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-6 px-8 h-[calc(100vh-200px)]">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-4">
          <h2>Stock Allocations</h2>
        </div>
          <StockTable data={data} onChange={handlerChange} />
      </div>
    </>
  );
}
