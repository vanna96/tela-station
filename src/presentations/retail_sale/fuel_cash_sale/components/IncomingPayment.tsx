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
import CouponTable from "./CouponTable";
import { NumericFormat } from "react-number-format";

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
      <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-screen">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
          <h2>Cash Sale</h2>{" "}
        </div>
        <CashBankTable data={data} onChange={handlerChange} />
        <CheckNumberTable data={data} onChange={handlerChange} />

        <CouponTable data={data} onChange={handlerChange} />

        <div className="grid grid-cols-2 gap-4 ">
          <div className="grid grid-cols-12">
            <div className="col-span-4 col-start-1">Over / Shortage</div>
            <div className="col-span-7 col-start-5">
              <NumericFormat
                key={"OverShortage"}
                thousandSeparator
                placeholder="0.000"
                decimalScale={2}
                fixedDecimalScale
                customInput={MUITextField}
                defaultValue={data.OverShortage}
              />
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-4 col-start-2">Total /KHR</div>
            <div className=" col-span-7 col-start-6 ">
              <NumericFormat
                key={"total"}
                thousandSeparator
                placeholder="0.000"
                decimalScale={2}
                fixedDecimalScale
                customInput={MUITextField}
                defaultValue={data.TotalKHR}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="grid grid-cols-12"></div>
          <div className="grid grid-cols-12">
            <div className="col-span-4 col-start-2">Total /USD</div>
            <div className=" col-span-7 col-start-6 ">
              <NumericFormat
                key={"totalUSD"}
                thousandSeparator
                placeholder="0.000"
                decimalScale={2}
                fixedDecimalScale
                customInput={MUITextField}
                defaultValue={data.TotalUSD}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
