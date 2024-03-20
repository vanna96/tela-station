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
import GLAccountRepository from "@/services/actions/GLAccountRepository";

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
      <div className="rounded-lg shadow-sm bg-white border p-6 px-8 h-[calc(100vh-200px)]">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-4">
          <h2>Information</h2>
        </div>
        <div className="grid grid-cols-12 ">
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Cash Account Type" className="text-gray-500 ">
                  Cash Account Type <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUISelect
                  items={[
                    { id: "Payment Method", name: "Payment Method" },
                    { id: "Cash Account", name: "Cash Account" },
                    { id: "Deposit", name: "Deposit" },
                  ]}
                  onChange={(e) =>
                    handlerChange("U_tl_cashtype", e.target.value)
                  }
                  value={data?.U_tl_cashtype}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="U_tl_cashtype"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Cash Code <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.Code}
                  name="Code"
                  onChange={(e) => handlerChange("Code", e.target.value)}
                  disabled={edit}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  G/L Account Code <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <CashACAutoComplete
                  onChange={(e) => handlerChange("U_tl_cashacct", e)}
                  value={data?.U_tl_cashacct}
                  dataFilter={ data?.U_tl_cashtype === 'Deposit' ? ['110497', '110498']:[]}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  G/L Account Name 
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={new GLAccountRepository().find(data?.U_tl_cashacct)?.Name ?? "N/A"}
                  name="U_tl_cashacct"
                  disabled={true}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Description
                </label>
              </div>
              <div className="col-span-3">
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  onChange={(e) => handlerChange("Name", e.target.value)}
                  rows={2}
                  value={data.Name}
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
                  onChange={(e) =>
                    handlerChange("U_tl_cashactive", e.target.value)
                  }
                  value={data?.U_tl_cashactive}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="U_tl_cashactive"
                />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
