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
  const { CurrencyAPI, sysInfo }: any = useContext(APIContext);
  const [cookies, setCookie] = useCookies(["user"]);
  const branchId =
    data?.Branch || cookies?.user?.Branch || (cookies?.user?.Branch < 0 && 1);

  useExchangeRate(data?.Currency, handlerChange);

  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-6 px-8 h-full">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-4">
          <h2>Pump Attendant</h2>
        </div>
        <div className="grid grid-cols-12 mt-8">
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  PA Code <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.Code}
                  name="Code"
                  onChange={(e) => handlerChange("Code", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  First Name <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.U_tl_fname}
                  name="U_tl_fname"
                  onChange={(e) => handlerChange("U_tl_fname", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Last Name <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.U_tl_lname}
                  name="U_tl_lname"
                  onChange={(e) => handlerChange("U_tl_lname", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Gender
                </label>
              </div>
              <div className="col-span-3">
                <MUISelect
                  items={[
                    { id: "Male", name: "Male" },
                    { id: "Female", name: "Female" },
                  ]}
                  onChange={(e) => handlerChange("U_tl_gender", e.target.value)}
                  value={data?.U_tl_gender}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="U_tl_gender"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Date of Birth
                </label>
              </div>
              <div className="col-span-3">
                <MUIDatePicker
                  value={data?.U_tl_dob}
                  name="U_tl_dob"
                  onChange={(e: any) => handlerChange("U_tl_dob", e)}
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
                    { id: "y", name: "Active" },
                    { id: "n", name: "Inactive" },
                  ]}
                  onChange={(e) =>
                    handlerChange("U_tl_status", e.target.value)
                  }
                  value={data?.U_tl_status}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="U_tl_status"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Branch <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <BranchAutoComplete
                  onChange={(e) => handlerChange("U_tl_bplid", e)}
                  value={parseInt(data?.U_tl_bplid ?? 0)}
                  BPdata={cookies?.user?.UserBranchAssignment}
                />
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  No. ID Card <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.U_tl_numid}
                  name="U_tl_numid"
                  onChange={(e) => handlerChange("U_tl_numid", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 mt-4">
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Mobile 1 <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.U_tl_tel1}
                  name="U_tl_tel1"
                  onChange={(e) => handlerChange("U_tl_tel1", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Mobile 2
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.U_tl_tel2}
                  name="U_tl_tel2"
                  onChange={(e) => handlerChange("U_tl_tel2", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Residential Address
                </label>
              </div>
              <div className="col-span-3">
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  onChange={(e) => handlerChange("U_tl_address", e.target.value)}
                  rows={2}
                  value={data.U_tl_address}
                />
              </div>
            </div>
          </div>

          <div className="col-span-2"></div>
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Joined Date
                </label>
              </div>
              <div className="col-span-3">
                <MUIDatePicker
                  value={data?.U_tl_sdate}
                  name="U_tl_sdate"
                  onChange={(e) => handlerChange("U_tl_sdate", e)}
                />
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
               Terminate Date 
                </label>
              </div>
              <div className="col-span-3">
                <MUIDatePicker
                  value={data?.U_tl_edate}
                  name="U_tl_edate"
                  onChange={(e) => handlerChange("U_tl_edate", e)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
