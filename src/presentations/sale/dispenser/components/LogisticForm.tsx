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
import { useState } from "react";

export interface ILogisticFormProps {
  data: any;
  handlerChange: (key: string, value: any) => void;
  edit?: boolean;
  ref?: React.RefObject<FormCard>;
}

export default function LogisticForm({
  data,
  handlerChange,
  edit,
  ref,
}: ILogisticFormProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e: any) => {
    setIsChecked(e.target.checked);
  };

  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-6 px-8 h-screen">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-4">
          <h2>Information</h2>
        </div>
        <div className="grid grid-cols-12 ">
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Ship-From Address
                </label>
              </div>
              <div className="col-span-3">
                {!edit ? (
                  <WarehouseAutoComplete
                    Branch={data?.BPL_IDAssignedToInvoice ?? 1}
                    value={data?.U_tl_dnsuppo}
                    onChange={(e) => {
                      handlerChange("U_tl_dnsuppo", e);
                    }}
                  />
                ) : (
                  <WarehouseAttendTo
                    value={data.U_tl_dnsuppo}
                    onChange={(e) => handlerChange("U_tl_dnsuppo", e)}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <div className="grid grid-cols-5">
                  <div className="col-span-4">
                    <label htmlFor="Code" className="text-gray-500 ">
                      Attention Terminal
                    </label>
                  </div>
                  <div className="col-span-1">
                    <Checkbox
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                      value={data?.U_tl_attn_ter}
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-3">
                <div className="grid grid-cols-1 ">
                  <div className="-mt-1">
                    <WarehouseAttendTo
                      U_tl_attn_ter={true}
                      value={data.U_tl_grsuppo}
                      onChange={(e) => handlerChange("U_tl_grsuppo", e)}
                      disabled={!isChecked}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2"></div>
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Ship-To Address
                </label>
              </div>
              <div className="col-span-3">
                <MUISelect
                  value={data?.PayToCode}
                  aliaslabel="addressName"
                  aliasvalue="addressName"
                  items={data?.BPAddresses?.filter(
                    ({ addressType }: any) => addressType === "bo_BillTo"
                  )}
                  onChange={(e) => handlerChange("PayToCode", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Shipping Address
                </label>
              </div>
              <div className="col-span-3">
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                  value={
                    !edit
                      ? getShippingAddress(
                          data?.PayToCode,

                          data?.BPAddresses?.filter(
                            ({ addressType }: any) =>
                              addressType === "bo_BillTo"
                          )
                        )
                      : getShippingAddress(
                          data?.PayToCode,
                          data?.vendor.bpAddress?.filter(
                            ({ addressType }: any) =>
                              addressType === "bo_BillTo"
                          )
                        )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
