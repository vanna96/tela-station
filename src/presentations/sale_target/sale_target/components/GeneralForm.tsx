import React, { useContext } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import BPLBranchSelect from "@/components/selectbox/BranchBPL";
import MUISelect from "@/components/selectbox/MUISelect";
import { useExchangeRate } from "../hook/useExchangeRate";
import { useCookies } from "react-cookie";
import CashAccount from "@/components/selectbox/CashAccount";
import { APIContext } from "../../context/APIContext";
import BranchAutoComplete from "@/components/input/BranchAutoComplete";
import CashACAutoComplete from "@/components/input/CashAccountAutoComplete";
import { TextField } from "@mui/material";
import { useQuery } from "react-query";
import request from "@/utilies/request";

export interface IGeneralFormProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  handlerOpenProject?: () => void;
  edit?: boolean;
  hanndResetState?: any;
}

export default function GeneralForm({
  data,
  handlerChange,
  edit,
  hanndResetState,
}: IGeneralFormProps) {
  const [cookies, setCookie] = useCookies(["user"]);
  const userData = cookies.user;
  const BPL = data?.BPL_IDAssignedToInvoice || (cookies.user?.Branch <= 0 && 1);
  const { data:scenario } = useQuery({
    queryKey: "scenario",
    queryFn: async () => await request('GET', `TL_SALES_SCENARIO?$filter=U_tl_status ne 'N'`).then((res: any) => res.data.value)
  });

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
                <label htmlFor="Scenario" className="text-gray-500 ">
                  Scenario
                </label>
              </div>
              <div className="col-span-3">
                <MUISelect
                  items={scenario?.map((res:any) => {
                    return {
                      id: res.Code,
                      name: res.Name
                    }
                  })}
                  onChange={(e) => handlerChange("scenario_sale", e.target.value)}
                  value={data?.scenario_sale}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="Scenario"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Branch
                </label>
              </div>
              <div className="col-span-3">
                <BranchAutoComplete
                  BPdata={userData?.UserBranchAssignment}
                  onChange={(e) => handlerChange("BPL_IDAssignedToInvoice", e)}
                  value={BPL}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Sale Team" className="text-gray-500 ">
                  Sale Team
                </label>
              </div>
              <div className="col-span-3">
                <MUISelect
                  items={[
                    { id: "Wholesale", name: "Wholesale" },
                    { id: "retail", name: "Retail" },
                  ]}
                  onChange={(e) => handlerChange("sale_team", e.target.value)}
                  value={data?.sale_team ?? "Wholesale"}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="Sale Team"
                />
              </div>
            </div>
          </div>

          <div className="col-span-2"></div>
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Date" className="text-gray-500 ">
                  Date
                </label>
              </div>
              <div className="col-span-3">
                <MUIDatePicker
                  name="Date"
                  value={data?.date}
                  onChange={(e: any) => handlerChange("date", e)}
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
                      { id: "N", name: "No" },
                      { id: "Y", name: "Yes" },
                    ]}
                    onChange={(e) => handlerChange("status", e.target.value)}
                    value={data?.status ?? "Y"}
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
