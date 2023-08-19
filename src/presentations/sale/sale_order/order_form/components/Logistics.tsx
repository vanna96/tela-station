import { Checkbox, FormControlLabel, MenuItem, Select } from "@mui/material";
import { useContext, useState } from "react";
import { FormOrderContext } from "../context/FormOrderContext";

type LogisticsProps = {
  Edit?: any;
};

export default function Logistics({ Edit }: LogisticsProps) {
  const { bussinessPartner, shippingType, form, setForm }: any =
    useContext(FormOrderContext);

  const shipTo = bussinessPartner?.BPAddresses?.filter(
    (ship: any) => ship.AddressType === "bo_ShipTo"
  );
  const payTo = bussinessPartner?.BPAddresses?.filter(
    (pay: any) => pay.AddressType === "bo_BillTo"
  );

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-1">
        <div className="col-span-1">
          <div className="grid md:grid-cols-1 grid-cols-2 px-3 mt-3">
            <div className="p-2 md:px-0">
              <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white  w-full text-left">
                Ship To
              </label>
              <Select
                className="form-control h-[25px] w-full"
                sx={{ border: "0px solid black", padding: 0 }}
                onChange={(e) => {
                  setForm({
                    ...form,
                    shipTo: e.target.value,
                    shipToValue: shipTo?.find(
                      (to: any) => to.AddressName === e.target.value
                    )?.Street,
                  });
                }}
                value={form?.shipTo || ""}
              >
                <MenuItem value="">&nbsp;</MenuItem>
                {shipTo?.map((e: any, index: number) => (
                  <MenuItem key={index} value={e.AddressName}>
                    {e.AddressName}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <textarea
              rows={3}
              value={form?.shipToValue || ""}
              className="form-control w-[80%] lg:w-[100%]"
              onChange={(e: any) =>
                setForm({
                  ...form,
                  shipToValue: e.target.value,
                })
              }
            />
          </div>
          <div className="grid md:grid-cols-1 grid-cols-2 px-3 mt-3">
            <div className="p-2 md:px-0">
              <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white  w-full text-left">
                Bill To
              </label>
              <Select
                className="form-control h-[25px] w-full"
                sx={{ border: "0px solid black", padding: 0 }}
                onChange={(e) =>
                  setForm({
                    ...form,
                    payTo: e.target.value,
                    payToValue: payTo?.find(
                      (to: any) => to.AddressName === e.target.value
                    )?.Street,
                  })
                }
                value={form?.payTo || ""}
              >
                <MenuItem value="">&nbsp;</MenuItem>
                {payTo?.map((e: any, index: number) => (
                  <MenuItem key={index} value={`${e.AddressName}`}>
                    {e.AddressName}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <textarea
              rows={3}
              className="form-control w-[80%] lg:w-[100%]"
              value={form?.payToValue || ""}
              onChange={(e: any) =>
                setForm({ ...form, payToValue: e.target.value })
              }
            />
          </div>
          <div className="flex md:block px-3 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
              Shipping Type
            </label>
            <Select
              className="form-control h-[25px] w-[60%] lg:w-[100%]"
              sx={{ border: "0px solid black", padding: 0 }}
              onChange={(e) =>
                setForm({
                  ...form,
                  shippingType: e.target.value,
                })
              }
              value={form?.shippingType}
            >
              {shippingType?.value?.map((e: any, index: number) => (
                <MenuItem key={index} value={e.Code}>
                  {e.Name}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="col-span-1">
          <div className="grid grid-cols-1 mx-3">
            <FormControlLabel
              label="Print Picking Sheet"
              className="text-gray-400 text-sm font-medium"
              control={
                <Checkbox
                  checked={form?.printPickingSheet || false}
                  size="small"
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      printPickingSheet: !form?.printPickingSheet,
                    })
                  }
                />
              }
            />
            <FormControlLabel
              label="Approved"
              className="text-gray-400 text-sm font-medium"
              control={
                <Checkbox
                  checked={form?.approved || false}
                  size="small"
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      approved: !form?.approved,
                    })
                  }
                />
              }
            />
            <FormControlLabel
              label="Allow Partial Delivery"
              className="text-gray-400 text-sm font-medium"
              control={
                <Checkbox
                  checked={form?.allowPartialDelivery || false}
                  size="small"
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      allowPartialDelivery: !form?.allowPartialDelivery,
                    })
                  }
                />
              }
            />
            {Edit ? (
              ""
            ) : (
              <div className="flex md:block pr-3 mt-3">
                <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
                  Pick and Pack Remarks
                </label>
                <textarea
                  rows={3}
                  className="form-control w-[60%] lg:w-[100%]"
                  value={form?.pickAndPackRemark || ""}
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      pickAndPackRemark: e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
