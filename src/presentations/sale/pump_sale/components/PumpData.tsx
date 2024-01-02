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
      <PaymentTable data={data} onChange={onChange} />
    </>
  );
}
