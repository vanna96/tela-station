import React from "react";
import CurrencySelect from "@/components/selectbox/Currency";
import CashACAutoComplete from "@/components/input/CashAccountAutoComplete";
import { NumericFormat } from "react-number-format";
import MUIRightTextField from "@/components/input/MUIRightTextField";
export default function CouponTable(props: any) {
  const { data, onChange }: any = props;

  const handlerRemoveCheck = (key: number) => {
    const newData = (data?.couponData || []).filter(
      (item: any, index: number) => index !== key
    );
    if (newData.length < 1) return;
    onChange("couponData", newData);
  };
  const handleRemove = (index: number) => {
    const newData = data.couponData.filter(
      (_: any, idx: number) => idx !== index
    );
    onChange("couponData", newData);
  };

  const handlerChangeItem = (index: number, name: string, value: any) => {
    const newData = [...data.couponData];
    newData[index] = { ...newData[index], [name]: value };
    onChange("couponData", newData);
  };

  return (
    <>
      {data.couponData?.map((item: any, index: number) => (
        <div key={index}>
          <div className="col-span-5 mb-4">
            <div className="grid grid-cols-2 gap-4 ">
              <div className="grid grid-cols-12">
                <div className="col-span-4 mt-1 text-gray-700   ">
                  Coupon Account{" "}
                </div>
                <div className="col-span-4 ">
                  <CashACAutoComplete
                    value={item.U_tl_acccoupon}
                    disabled={data.edit}
                    onChange={(value: any) =>
                      handlerChangeItem(index, "U_tl_acccoupon", value)
                    }
                  />
                </div>
                <div className="col-span-4 ml-2">
                  <CurrencySelect
                    value={item.U_tl_paycur}
                    name="U_tl_paycur"
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 ">
                <div className="col-span-4  col-start-5 text-gray-700 ">
                  Coupon Amount
                </div>
                {/* <div className=" col-span-4  col-start-9"> */}
                <div className=" col-span-4 ">
                  <NumericFormat
                    placeholder="0.000"
                    disabled={data.edit}
                    customInput={MUIRightTextField}
                    defaultValue={item.U_tl_amtcoupon}
                    onBlur={(e: any) =>
                      handlerChangeItem(
                        index,
                        "U_tl_amtcoupon",
                        parseFloat(e.target.value.replace(/,/g, ""))
                      )
                    }
                    name="U_tl_amtcoupon"
                    value={item.U_tl_amtcoupon}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
