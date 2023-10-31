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
import EmployeeForm from "@/presentations/master/employee/page/EmployeeForm";

export interface IGeneralFormProps {
  data: any;
  handlerChange: (key: string, value: any) => void;
  edit?: boolean;
  ref?: React.RefObject<FormCard>;
}

export default function GeneralForm({
  data,
  handlerChange,
  edit,
  ref,
}: IGeneralFormProps) {
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
                  Dispenser Code
                </label>
              </div>
              <div className="col-span-3">
                <MUISelect
                  items={[
                    { id: 1, name: "DS-001" },
                    { id: 2, name: "DS-002" },
                    { id: 3, name: "DS-003" },
                  ]}
                  onChange={(e) => handlerChange("Dispenser", e.target.value)}
                  value={data?.Dispenser}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="Dispenser"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Dispenser Name
                </label>
              </div>
              <div className="col-span-3">
                <MUISelect
                  items={[
                    { id: 1, name: "DS-001" },
                    { id: 2, name: "DS-002" },
                    { id: 3, name: "DS-003" },
                  ]}
                  onChange={(e) =>
                    handlerChange("DispenserName", e.target.value)
                  }
                  value={data?.DispenserName}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="DispenserName"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Employee
                </label>
              </div>
              <div className="col-span-3">
                <MUISelect
                  items={[
                    { id: 1, name: "DS-001" },
                    { id: 2, name: "DS-002" },
                    { id: 3, name: "DS-003" },
                  ]}
                  onChange={(e) => handlerChange("Employee", e.target.value)}
                  value={data?.Employee}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="Employee"
                />
              </div>
            </div>
          </div>

          <div className="col-span-2"></div>
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Type
                </label>
              </div>
              <div className="col-span-3">
                <MUISelect
                  items={[
                    { id: 1, name: "DS-001" },
                    { id: 2, name: "DS-002" },
                    { id: 3, name: "DS-003" },
                  ]}
                  onChange={(e) => handlerChange("Type", e.target.value)}
                  value={data?.Type}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="Type"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Status
                </label>
              </div>
              <div className="col-span-3">
                <MUISelect
                  items={[
                    { id: 1, name: "DS-001" },
                    { id: 2, name: "DS-002" },
                    { id: 3, name: "DS-003" },
                  ]}
                  onChange={(e) => handlerChange("Status", e.target.value)}
                  value={data?.Status}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="Status"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
