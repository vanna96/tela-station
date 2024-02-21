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
import { useQuery } from "react-query";
import GLAccountAutoComplete from "@/components/input/GLAccountAutoComplete";
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
  const branchId =
    data?.Branch || cookies?.user?.Branch || (cookies?.user?.Branch < 0 && 1);

  useExchangeRate(data?.Currency, handlerChange);

  const { data:gl6, isLoading }: any = useQuery({
    queryKey: ["gl_account_6"],
    queryFn: async () => await request("GET", "ChartOfAccounts?$filter=startswith(Code, '6') and ActiveAccount eq 'tYES' &$select=Code,Name,ActiveAccount,CashAccount&$orderby=Code asc").then((res:any) => res.data?.value),
  });

  console.log(data?.U_tl_expacct)

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
                  Expense Code <span className="text-red-500">*</span>
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
                <label htmlFor="Type" className="text-gray-500 ">
                  Expense Type <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
              <MUISelect
                  items={[
                    { id: "Expense", name: "Expense" },
                    { id: "Revenue", name: "Revenue" },
                  ]}
                  onChange={(e) =>
                    handlerChange("Type", e.target.value)
                  }
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
                  G/L Account Code <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <GLAccountAutoComplete
                  onChange={(e) =>
                    handlerChange("U_tl_expacct", e)
                  }
                  value={data?.U_tl_expacct}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  GL Account Name
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={gl6?.find((e:any) => data?.U_tl_expacct === e.Code)?.Name ?? "N/A"}
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
                    handlerChange("U_tl_expactive", e.target.value)
                  }
                  value={data?.U_tl_expactive}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="U_tl_expactive"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
