import React, { useContext, useState } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import BPLBranchSelect from "@/components/selectbox/BranchBPL";
import MUISelect from "@/components/selectbox/MUISelect";
// import { useExchangeRate } from "../hook/useExchangeRate";
import { useCookies } from "react-cookie";
import CashAccount from "@/components/selectbox/CashAccount";
import { APIContext } from "../../context/APIContext";
import BranchAutoComplete from "@/components/input/BranchAutoComplete";
import CashACAutoComplete from "@/components/input/CashAccountAutoComplete";
import { TextField } from "@mui/material";
import WarehouseAutoComplete from "@/components/input/WarehouseAutoComplete";
import WarehouseAttendTo from "@/components/selectbox/WarehouseAttention";

export interface IGeneralFormProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
}

export default function GeneralForm({
  data,
  handlerChange,
  edit,
}: IGeneralFormProps) {
  const [cookies, setCookie] = useCookies(["user"]);
  const branchId =
    data?.Branch || cookies?.user?.Branch || (cookies?.user?.Branch < 0 && 1);


    console.log(data.U_BaseStation)
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
                  Base Station
                </label>
              </div>
              <div className="col-span-3">
                <div className="col-span-3">
                <WarehouseAttendTo
                  value={data?.U_BaseStation}
                  onChange={(e) => {
                    handlerChange("U_BaseStation", e);
                  }}
                />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Destination
                </label>
              </div>
              <div className="col-span-3">
                <WarehouseAttendTo
                  value={data?.U_Destination}
                  onChange={(e) => {
                    handlerChange("U_Destination", e);
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Route Code
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={edit}
                  value={data?.Code}
                  name="Code"
                  onChange={(e) => handlerChange("Code", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Route Name
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.Name}
                  name="Name"
                  onChange={(e) => handlerChange("Name", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Driver Incentive
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.U_Incentive}
                  name="U_Incentive"
                  onChange={(e) => handlerChange("U_Incentive", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="col-span-2"></div>
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Status
                </label>
              </div>
              <div className="col-span-3">
                <MUISelect
                  items={[
                    { id: "Y", name: "Active" },
                    { id: "N", name: "Inactive" },
                  ]}
                  onChange={(e) => handlerChange("U_Status", e.target.value)}
                  value={data?.U_Status}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="U_Status"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Latitude" className="text-gray-500 ">
                  Distance
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.U_Distance}
                  name="U_Distance"
                  onChange={(e) =>
                    handlerChange("U_Distance", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Latitude" className="text-gray-500 ">
                  Travel Hour
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.U_Duration}
                  name="U_Duration"
                  onChange={(e) =>
                    handlerChange("U_Duration", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Extra Remarks
                </label>
              </div>
              <div className="col-span-3">
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  onChange={(e) => handlerChange("U_Remark", e.target.value)}
                  rows={2}
                  value={data.U_Remark}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
