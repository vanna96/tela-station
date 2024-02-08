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
import AccountCodeAutoComplete from "@/components/input/AccountCodeAutoComplete";
import MUITextField from "@/components/input/MUITextField";
import CurrencySelect from "@/components/selectbox/Currency";

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
      <div className="rounded-lg shadow-sm bg-white border p-8 px-14 md:px-6 xl:px-8 h-screen">
        <div className="font-medium text-xl flex items-center border-b my-6 gap-16">
          <h2>Cash Sale</h2>{" "}
        </div>
        <CashBankTable data={data} onChange={handlerChange} />
        <div className="font-medium text-xl flex items-center border-b my-6 gap-16">
          <h2>Check Number</h2>{" "}
        </div>
        <CheckNumberTable data={data} onChange={handlerChange} />
        {/* <h1 className="mt-8"> Coupon Account Name</h1>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <AccountCodeAutoComplete
            onChange={(e: any) => handlerChange("GLCash", e)}
            value={data?.GLCash}
            disabled={data?.edit}
          />
          <CurrencySelect value={"USD"} />
          <TextField size="small" label="" className="text-field w-full" />
          <TextField
            size="small"
            placeholder="0.00"
            className="text-field w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="grid grid-cols-12">
            <div className="col-span-4">
              <h1 className="text-sm">Over / Shortage</h1>
            </div>
            <div className="col-span-7 col-start-5">
              <TextField size="small" className="text-field w-full" />
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-4 col-start-2">Total /KHR</div>
            <div className=" col-span-7 col-start-6 ">
              <TextField
                size="small"
                placeholder="0.00"
                className="text-field w-full"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="grid grid-cols-12"></div>
          <div className="grid grid-cols-12">
            <div className="col-span-4 col-start-2">Total /USD</div>
            <div className=" col-span-7 col-start-6 ">
              <TextField
                size="small"
                placeholder="0.00"
                className="text-field w-full"
              />
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}
