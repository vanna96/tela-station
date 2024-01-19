import FormCard from "@/components/card/FormCard";
import WarehouseAutoComplete from "@/components/input/WarehouseAutoComplete";
import BPAddress from "@/components/selectbox/BPAddress";
import MUISelect from "@/components/selectbox/MUISelect";
import WarehouseSelect from "@/components/selectbox/Warehouse";
import WarehouseAttendTo from "@/components/selectbox/WarehouseAttention";
import WarehouseByBranch from "@/components/selectbox/WarehouseByBranch";
import { getShippingAddress } from "@/models/BusinessParter";
import { TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useState } from "react";
import CashBankTable from "./CashBankTable";
import CheckNumberTable from "./CheckNumberTable";

export interface IncomingPaymentProps {
  data: any;
  handlerChange: (key: string, value: any) => void;
  edit?: boolean;
  ref?: React.RefObject<FormCard>;
}

export default function IncomingPaymentForm({
  data,
  handlerChange,
  edit,
  ref,
}: IncomingPaymentProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e: any) => {
    setIsChecked(e.target.checked);
  };

  return (
    <>
      {/* <div className=" rounded-lg shadow-sm bg-white border p-6 px-8">
        <div className="mt-6">
          <div>
            <CashBankTable data={data} onChange={handlerChange} />
          </div>

          <fieldset className="border border-solid border-gray-300 p-3 mb-6 shadow-md">
            <legend className="text-md px-2 font-bold">
              Payment Means - Check
            </legend>

            <div className="grid grid-cols-12 py-2 ">
              <div className="col-span-2 col-start-2">
                <label htmlFor="Code" className="text-gray-500 text-[14px]">
                  Cash Account
                </label>
              </div>
              <div className="col-span-5 col-start-4"></div>
            </div>
            <CheckNumberTable data={data} onChange={handlerChange} />
          </fieldset>
        </div>
      </div> */}
      <div className="rounded-lg shadow-sm bg-white border p-8 px-14 md:px-6 xl:px-8 h-screen">
        <CashBankTable data={data} onChange={handlerChange} />

        <div className="font-medium text-xl flex items-center border-b my-6 gap-16">
          <h2>Allocation</h2>{" "}
          <h3 className="font-thin text-base border-x-2 border-y-2 px-8 border-gray-500">
            Generate Allocation
          </h3>
        </div>
        <CheckNumberTable data={data} onChange={handlerChange} />
      </div>
    </>
  );
}
