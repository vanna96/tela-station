import FormCard from "@/components/card/FormCard";
import MUITextField from "@/components/input/MUITextField";
import WarehouseAutoComplete from "@/components/input/WarehouseAutoComplete";
import BPAddress from "@/components/selectbox/BPAddress";
import MUISelect from "@/components/selectbox/MUISelect";
import WarehouseSelect from "@/components/selectbox/Warehouse";
import WarehouseAttendTo from "@/components/selectbox/WarehouseAttention";
import WarehouseByBranch from "@/components/selectbox/WarehouseByBranch";
import { getShippingAddress } from "@/models/BusinessParter";
import { TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";
import NewContentForm from "./NewContentForm";

export interface IIncomingPaymentProps {
  data: any;
  handlerChange: (key: string, value: any) => void;
  edit?: boolean;
  ref?: React.RefObject<FormCard>;
}

export default function IncomingPayment({
  data,
  handlerChange,
  edit,
  ref,
}: IIncomingPaymentProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e: any) => {
    setIsChecked(e.target.checked);
  };

  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-6 px-8 h-[calc(100vh-200px)]">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-4">
          <h2>Information</h2>
        </div>

        <fieldset className="border border-solid border-gray-300 p-3 mb-6 shadow-md">
          <legend className="text-md px-2 font-bold">Cash</legend>
          <NewContentForm data={data} onChange={handlerChange} />
        </fieldset>
        <div className="grid grid-cols-12 ">
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Bank
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField value={data?.Bank} disabled={edit} name="Bank" />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Credit
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.Credit}
                  disabled={edit}
                  name="Credit"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Tela Card
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.TelaCard}
                  disabled={edit}
                  name="TelaCard"
                />
              </div>
            </div>
          </div>

          <div className="col-span-2"></div>
          <div className="col-span-5"> </div>
        </div>
      </div>
    </>
  );
}
