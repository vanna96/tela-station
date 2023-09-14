import FormCard from "@/components/card/FormCard";
import BPAddress from "@/components/selectbox/BPAddress";
import WarehouseSelect from "@/components/selectbox/Warehouse";
import WarehouseByBranch from "@/components/selectbox/WarehouseByBranch";
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
        <div className="grid grid-cols-2">
          <div className="pl-4 pr-20">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Ship-From Address
                </label>
              </div>
              <div className="col-span-3">
                <WarehouseSelect
                  // Branch={data?.BPL_IDAssignedToInvoice}
                  value={data.U_tl_dnsuppo}
                  onChange={(e) => handlerChange("U_tl_dnsuppo", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="pl-20">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Ship-To Address
                </label>
              </div>
              <div className="col-span-3">
                <BPAddress
                  name="BillTo"
                  type="bo_BillTo"
                  disabled={data?.isStatusClose || false}
                  data={data}
                  value={data.BillTo}
                  onChange={(e) => handlerChange("BillTo", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        <div className="grid grid-cols-2">
          <div className="pl-4 pr-20">
            <div className="grid grid-cols-12 py-2">
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
              <div className="col-span-7">
                <div className="grid grid-cols-1 ">
                  <div className="-mt-1">
                    <WarehouseSelect
                      name="AttenTerminal"
                      value={data.U_tl_grsuppo}
                      onChange={(e) =>
                        handlerChange("U_tl_grsuppo", e.target.value)
                      }
                      disabled={!isChecked}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
