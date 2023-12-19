import FormCard from "@/components/card/FormCard";
import { useState } from "react";
import PaymentTable from "./PaymentTable";

export interface IPumpDataProps {
  data: any;
  handlerChange: (key: string, value: any) => void;
  edit?: boolean;
  ref?: React.RefObject<FormCard>;
  handlerAddItem: (e: any) => void;
}

export default function PumpData({
  data,
  handlerChange,
  edit,
  ref,
  handlerAddItem,
}: IPumpDataProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e: any) => {
    setIsChecked(e.target.checked);
  };

  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-6 px-8 h-[calc(100vh-200px)]">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-4">
          <h2>Pump Data</h2>
        </div>
        <PaymentTable
          data={data}
          onChange={handlerChange}
          handlerAddItem={handlerAddItem}
          edit={edit}
        />
      </div>
    </>
  );
}
