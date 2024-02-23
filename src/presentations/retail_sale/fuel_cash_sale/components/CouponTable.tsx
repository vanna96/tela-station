import React from "react";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { AiOutlineSetting } from "react-icons/ai";
import FormattedInputs from "@/components/input/NumberFormatField";
import { Button, Grid, IconButton } from "@mui/material";
import { GridAddIcon, GridDeleteIcon } from "@mui/x-data-grid";
import CurrencySelect from "@/components/selectbox/Currency";
import CashACAutoComplete from "@/components/input/CashAccountAutoComplete";
import MUITextField from "@/components/input/MUITextField";
export default function CouponTable(props: any) {
  const { data, onChange }: any = props;
  const [rowSelection, setRowSelection] = React.useState<any>({});

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
      {data.couponData.map((item: any, index: number) => (
        <div key={index} className="grid grid-cols-12 gap-4 mb-8">
          <div className="col-span-5 mb-2">
            <div className="grid grid-cols-12">
              <div className="col-span-4 mt-2">{"Coupon Account Name"}</div>
              <div className="col-span-8 mt-1">
                <CashACAutoComplete
                  value={item.U_tl_acccoupon}
                  disabled={data.edit}
                  onChange={(value: any) =>
                    handlerChangeItem(index, "U_tl_acccoupon", value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="col-span-3 mt-1 col-start-6">
            <CurrencySelect
              value={item.U_tl_paycur}
              name="U_tl_paycur"
              disabled
            />
            {/* <MUITextField
              disabled
              name="U_tl_paycur"
              value={item.U_tl_paycur || "USD"}
            /> */}
          </div>
          <div className="col-span-4 col-start-9 ml-16">
            <FormattedInputs
              placeholder="0.000"
              disabled={data.edit}
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
      ))}
    </>
  );
}
