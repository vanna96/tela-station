import FormCard from "@/components/card/FormCard";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { useState } from "react";
import SalePersonAutoComplete from "@/components/input/SalesPersonAutoComplete";
import { Autocomplete, TextField } from "@mui/material";
import PumpAttendantAutoComplete from "@/components/input/PumpAttendantAutoComplete";

export interface IGeneralFormProps {
  data: any;
  handlerChange: (key: string, value: any) => void;
  edit?: boolean;
  ref?: React.RefObject<FormCard>;
  handlerChangeObject: (obj: any) => void;
}

export default function GeneralForm({
  data,
  handlerChange,
  edit,
  ref,
  handlerChangeObject,
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
                  Dispenser Code <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  size="small"
                  value={data?.DispenserCode}
                  placeholder="Dispenser Code"
                  onChange={(e) =>
                    handlerChange("DispenserCode", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Dispenser Name <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  size="small"
                  value={data?.DispenserName}
                  placeholder="Dispenser Name"
                  onChange={(e) =>
                    handlerChange("DispenserName", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500">
                  Number of Pump <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  size="small"
                  type="number"
                  value={data?.NumOfPump}
                  placeholder="Number of Pump"
                  onChange={(e) => {
                    const PumpData = [];
                    for (
                      let index = 0;
                      index < parseInt(e.target.value ?? 0);
                      index++
                    ) {
                      PumpData.push({
                        pumpCode: `${data?.DispenserCode || ""}p${index + 1}`,
                        itemCode: "",
                        itemName: "",
                        uom: "",
                        registerMeeting: "",
                        updateMetering: "",
                        status: "",
                      });
                    }
                    handlerChangeObject({
                      PumpData,
                      NumOfPump: e.target.value,
                    });
                  }}
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
                <SalePersonAutoComplete
                  value={data.SalesPersonCode}
                  onChange={(e) => handlerChange("SalesPersonCode", e)}
                />
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Pump Attendant 1
                </label>
              </div>
              <div className="col-span-3">
                <PumpAttendantAutoComplete
                  value={data.Attendant2}
                  onChange={(e) => handlerChange("Attendant1", e)}
                />
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Pump Attendant 2
                </label>
              </div>
              <div className="col-span-3">
                <PumpAttendantAutoComplete
                  value={data.Attendant2}
                  onChange={(e) => handlerChange("Attendant2", e)}
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
                    { id: "", name: "Type" },
                    { id: "Oil", name: "Oil" },
                    { id: "Lube", name: "Lube" },
                    { id: "LPG", name: "LPG" },
                  ]}
                  onChange={(e) =>
                    handlerChange("lineofBusiness", e.target.value)
                  }
                  value={data?.lineofBusiness}
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
                    { id: "New", name: "New" },
                    { id: "Initialized", name: "Initialized" },
                    { id: "OutOfOrder", name: "Out Of Order" },
                    { id: "Inactive", name: "Inactive" },
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
