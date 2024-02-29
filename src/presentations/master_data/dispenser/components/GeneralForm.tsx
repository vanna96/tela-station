import FormCard from "@/components/card/FormCard";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { useState } from "react";
import SalePersonAutoComplete from "@/components/input/SalesPersonAutoComplete";
import { Autocomplete, TextField } from "@mui/material";
import PumpAttendantAutoComplete from "@/components/input/PumpAttendantAutoComplete";
import BranchAutoComplete from "@/components/input/BranchAutoComplete";
import { useCookies } from "react-cookie";
import WarehouseAutoComplete from "@/components/input/WarehouseAutoComplete";

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
  const [cookies] = useCookies(["user"]);
  const handleCheckboxChange = (e: any) => {
    setIsChecked(e.target.checked);
  };

  const userData = cookies.user;

  const BPL = data?.U_tl_bplid || (cookies.user?.Branch <= 0 && 1) || 1;

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
                  Branch <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <BranchAutoComplete
                  BPdata={userData?.UserBranchAssignment}
                  onChange={(e) => handlerChange("U_tl_bplid", e)}
                  value={parseInt(BPL)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Warehouse<span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <WarehouseAutoComplete
                  Branch={parseInt(BPL)}
                  value={data?.U_tl_whs}
                  onChange={(e) => handlerChange("U_tl_whs", e)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Pump Code <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  size="small"
                  value={data?.PumpCode}
                  placeholder="Pump  Code"
                  onChange={(e) => handlerChange("PumpCode", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Pump Description <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  size="small"
                  value={data?.PumpName}
                  placeholder="Pump Name"
                  onChange={(e) => handlerChange("PumpName", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500">
                  No. of Nozzle <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  size="small"
                  type="number"
                  value={data?.NumOfPump}
                  placeholder="Number of Pump"
                  onChange={(e) => {
                    let no_pump:string = ((parseInt(e.target.value) <= 10 ? (parseInt(e.target.value) <= 0 ? 0:parseInt(e.target.value)) : 10) ?? 0).toString();
                    const PumpData = [];
                    for (
                      let index = 0;
                      index < parseInt(no_pump);
                      index++
                    ) {
                      const formattedIndex = `${index + 1}`.padStart(3, "0");
                      PumpData.push({
                        pumpCode: `${data?.PumpCode || ""} - N${formattedIndex}`,
                        itemCode: "",
                        itemName: "",
                        uom: "",
                        registerMeeting: "",
                        updateMetering: "",
                        status: "New",
                        binCode: "",
                      });
                    }
                    handlerChangeObject({
                      PumpData,
                      NumOfPump: no_pump,
                    });
                  }}
                />
              </div>
            </div>
            {/* <div className="grid grid-cols-5 py-2">
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
                  value={data.Attendant1}
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
            </div> */}
          </div>

          <div className="col-span-2"></div>
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Type <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUISelect
                  items={[
                    { id: "Oil", name: "Fuel" },
                    // { id: "Lube", name: "Lube" },
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
                    { id: "Active", name: "Active" },
                    { id: "Inactive", name: "Inactive" },
                  ]}
                  onChange={(e) => handlerChange("Status", e.target.value)}
                  value={data?.Status ?? "New"}
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
