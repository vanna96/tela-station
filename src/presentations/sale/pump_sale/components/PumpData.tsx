import FormCard from "@/components/card/FormCard";
import { useState } from "react";
import PaymentTable from "./PaymentTable";

export interface IPumpDataProps {
  handlerAddItem: () => void;
  handlerChangeItem: (record: any) => void;
  handlerRemoveItem: (record: any[]) => void;
  data: any;
  onChange: (key: any, value: any) => void;
  onChangeItemByCode: (record: any) => void;
  ContentLoading?: any;
}
export default function PumpData({ data, onChange }: IPumpDataProps) {
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
        <PaymentTable data={data} onChange={onChange} />
      </div>
    </>
  );
}
