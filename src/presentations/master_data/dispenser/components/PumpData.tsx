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
      <PaymentTable
        data={data}
        onChange={handlerChange}
        handlerAddItem={handlerAddItem}
        edit={edit}
      />
    </>
  );
}
