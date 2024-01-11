import { Checkbox, FormControlLabel, MenuItem, Select } from "@mui/material";
import { useContext, useState } from "react";
import { GeneralContact } from "../context/GeneralFormContext";
import { LogisticContext } from "../context/LogisticsFormContext";

type LogisticsProps = {
  Edit?: any;
};

export default function Logistics({ Edit }: LogisticsProps) {
  const { bussinessPartner, shippingType }: any = useContext(GeneralContact);
  const { formLogistic, setFormLogistic }: any = useContext(LogisticContext);

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
                  setFormLogistic({
                    ...formLogistic,
                    shipTo: e.target.value,
                    shipToValue: shipTo?.find(
                      (to: any) => to.AddressName === e.target.value
                    )?.Street,
                  });
                }}
                value={formLogistic?.shipTo || ""}
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
              value={formLogistic?.shipToValue}
              className="form-control w-[80%] lg:w-[100%]"
              onChange={(e: any) =>
                setFormLogistic({
                  ...formLogistic,
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
                  setFormLogistic({
                    ...formLogistic,
                    payTo: e.target.value,
                    payToValue: payTo?.find(
                      (to: any) => to.AddressName === e.target.value
                    )?.Street,
                  })
                }
                value={formLogistic?.payTo || ""}
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
              value={formLogistic?.payToValue || ""}
              onChange={(e: any) =>
                setFormLogistic({ ...formLogistic, payToValue: e.target.value })
              }
            />
          </div>
          <div className="flex md:block px-3 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
              Shipping Type
            </label>
            <Select
              label=""
              className="form-control h-[25px] w-[60%] lg:w-[100%]"
              sx={{ border: "0px solid black", padding: 0 }}
              onChange={(e) =>
                setFormLogistic({
                  ...formLogistic,
                  shippingType: e.target.value,
                })
              }
              value={formLogistic?.shippingType || "1"}
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
            {/* <FormControlLabel
              label="Print Picking Sheet"
              className="text-gray-400 text-sm font-medium"
              control={
                <Checkbox
                  checked={formLogistic?.printPickingSheet || false}
                  size="small"
                  onChange={(e: any) =>
                    setFormLogistic({
                      ...formLogistic,
                      printPickingSheet: !formLogistic?.printPickingSheet,
                    })
                  }
                />
              }
            /> */}
            <FormControlLabel
              label="Procure Non Drop-Ship Items"
              className="text-gray-400 text-sm font-medium"
              control={
                <Checkbox
                  checked={formLogistic?.procureNonDropShipItem || false}
                  size="small"
                  onChange={(e: any) =>
                    setFormLogistic({
                      ...formLogistic,
                      procureNonDropShipItem:
                        !formLogistic?.procureNonDropShipItem,
                    })
                  }
                />
              }
            />
            {/* <FormControlLabel
              label="Approved"
              className="text-gray-400 text-sm font-medium"
              control={
                <Checkbox
                  checked={formLogistic?.approved || false}
                  size="small"
                  onChange={(e: any) =>
                    setFormLogistic({
                      ...formLogistic,
                      approved: !formLogistic?.approved,
                    })
                  }
                />
              }
            /> */}
            <FormControlLabel
              label="Procure Drop-Ship Items"
              className="text-gray-400 text-sm font-medium"
              control={
                <Checkbox
                  checked={formLogistic?.procureDropShipItem || false}
                  size="small"
                  onChange={(e: any) =>
                    setFormLogistic({
                      ...formLogistic,
                      procureDropShipItem: !formLogistic?.procureDropShipItem,
                    })
                  }
                />
              }
            />
            {/* <FormControlLabel
              label="Allow Partial Delivery"
              className="text-gray-400 text-sm font-medium"
              control={
                <Checkbox
                  checked={formLogistic?.allowPartialDelivery || false}
                  size="small"
                  onChange={(e: any) =>
                    setFormLogistic({
                      ...formLogistic,
                      allowPartialDelivery: !formLogistic?.allowPartialDelivery,
                    })
                  }
                />
              }
            /> */}
            {Edit ? (
              ""
            ) : (
              <div className="flex md:block pr-3 mt-3">
                <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
                  Pick and Pack Remarks
                </label>
                <textarea
                  name=""
                  rows={3}
                  className="form-control w-[60%] lg:w-[100%]"
                  value={formLogistic?.pickAndPackRemark}
                  onChange={(e: any) =>
                    setFormLogistic({
                      ...formLogistic,
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
