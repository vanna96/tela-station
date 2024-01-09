import FormCard from "@/components/card/FormCard";
import MUITextField from "@/components/input/MUITextField";
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

export interface IConsumptionAllocationProps {
  data: any;
  handlerChange: (key: string, value: any) => void;
  edit?: boolean;
  ref?: React.RefObject<FormCard>;
}

export default function ConsumptionAllocation({
  data,
  handlerChange,
  edit,
  ref,
}: IConsumptionAllocationProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e: any) => {
    setIsChecked(e.target.checked);
  };

  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-6 px-8 h-[calc(100vh-200px)]">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-4">
          <h2>Information</h2>
        </div>
        <div className="grid grid-cols-12 ">
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Cash Sales
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.CashSales}
                  disabled={edit}
                  name="CashSales"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Partnership Sales
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.PartnershipSales}
                  disabled={edit}
                  name="PartnershipSales"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Tela Card Sales
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.TelaCardSales}
                  disabled={edit}
                  name="TelaCardSales"
                />
              </div>
            </div>
          </div>

          <div className="col-span-2"></div>
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Pump Test
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.PumpTest}
                  disabled={edit}
                  name="PumpTest"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Stock Transfer
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.StockTransfer}
                  disabled={edit}
                  name="StockTransfer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
