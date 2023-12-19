import FormCard from "@/components/card/FormCard";
import { useState } from "react";
import PaymentTable from "./PaymentTable";

export interface IPumpDataProps {
  data: any;
  handlerChange: (key: string, value: any) => void;
  edit?: boolean;
  ref?: React.RefObject<FormCard>;
}

export default function PumpData({
  data,
  handlerChange,
  edit,
  ref,
}: IPumpDataProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e: any) => {
    setIsChecked(e.target.checked);
  };

  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border px-14 py-4 overflow-y-auto h-[calc(90vh-100px)]">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
          <h2>Pump Data</h2>
        </div>
        <PaymentTable data={data} onChange={handlerChange} />
      </div>
    </>
  );
}
