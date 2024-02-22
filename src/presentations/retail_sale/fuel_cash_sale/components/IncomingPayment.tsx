import FormCard from "@/components/card/FormCard";
import React, { useState } from "react";
import CashBankTable from "./CashBankTable";
import CheckNumberTable from "./CheckNumberTable";
import MUITextField from "@/components/input/MUITextField";
import CouponTable from "./CouponTable";
import { NumericFormat } from "react-number-format";
import Formular from "@/utilies/formular";

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

  const totalCashSale: number = React.useMemo(() => {
    const total = data?.allocationData?.reduce((prevTotal: any, item: any) => {
      const lineTotal = Formular.findLineTotal(
        (item.U_tl_cashallow || 0)?.toString(),
        item.ItemPrice || 0,
        "0"
      );
      console.log(item.U_tl_cashallow);
      return prevTotal + lineTotal;
    }, 0);
    return total;
  }, [data.allocationData]);

  const parseAmount = (amount: any) => {
    return (
      Number(typeof amount === "string" ? amount.replace(/,/g, "") : amount) ||
      0
    );
  };
  console.log([
    ...data?.checkNumberData,
    ...data?.cashBankData,
    ...data?.couponData,
  ]);
  const calculateTotalByCurrency = (data: any, currency: any) => {
    let total = 0;

    // Aggregate CashBankData
    total += data.cashBankData.reduce((acc: any, item: any) => {
      if (item.U_tl_paycur === currency) {
        const cashAmount = parseAmount(item.U_tl_amtcash) || 0;
        const bankAmount = parseAmount(item.U_tl_amtbank) || 0;
        return acc + cashAmount + bankAmount;
      }
      return acc;
    }, 0);

    // Aggregate CheckNumberData
    total += data.checkNumberData.reduce((acc: any, item: any) => {
      if (item.U_tl_paycur === currency) {
        const checkAmount = parseAmount(item.U_tl_amtcheck) || 0;
        return acc + checkAmount;
      }
      return acc;
    }, 0);

    // Aggregate CouponData
    total += data.couponData.reduce((acc: any, item: any) => {
      if (item.U_tl_paycur === currency) {
        const couponAmount = parseAmount(item.U_tl_amtcoupon) || 0;
        return acc + couponAmount;
      }
      return acc;
    }, 0);

    return total;
  };

  let exchangeRate = data?.ExchangeRate || 4100;
  console.log(exchangeRate);
  const totalKHR = React.useMemo(
    () => calculateTotalByCurrency(data, "KHR"),
    [data]
  );
  const TotalKHRtoUSD: number = React.useMemo(() => {
    const convertedKHRToUSD =
      exchangeRate > 0 ? parseAmount(totalKHR) / exchangeRate : 0;
    return convertedKHRToUSD;
  }, [totalKHR, exchangeRate]);

  const totalUSD = React.useMemo(
    () => calculateTotalByCurrency(data, "USD"),
    [data]
  );

  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-screen">
        <div className="font-medium text-xl flex justify-start items-center border-b mb-6">
          <h2>Cash Sale - </h2>
          <div className="ml-2">
            <NumericFormat
              thousandSeparator
              placeholder="0.000"
              disabled
              className="bg-white"
              decimalScale={2}
              // customInput={MUITextField}
              value={totalCashSale}
            />
          </div>
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
                disabled
                placeholder="0.000"
                className="bg-white"
                decimalScale={2}
                customInput={MUITextField}
                value={totalCashSale - totalUSD - TotalKHRtoUSD}
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
                disabled
                className="bg-white"
                customInput={MUITextField}
                value={totalKHR}
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
                disabled
                className="bg-white"
                placeholder="0.000"
                decimalScale={2}
                customInput={MUITextField}
                value={totalUSD}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
