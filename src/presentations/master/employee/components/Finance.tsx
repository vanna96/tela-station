import FormCard from "@/components/card/FormCard";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import BuyerSelect from "@/components/selectbox/buyer";
import MUISelect from "@/components/selectbox/MUISelect";
import { ContactEmployee } from "@/models/BusinessParter";
import TextField from "@mui/material/TextField";

export interface IFinanceProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
}

export default function Finance({ data, edit, handlerChange }: IFinanceProps) {
  return (
    <>
      <FormCard title="Finance">
        <div className="flex flex-col gap-2 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Salary"
              value={data?.salary}
              name="Salary"
              onChange={(e) => handlerChange("salary", e.target.value)}
            />
            <div>
              <label htmlFor="Month" className="text-gray-500 text-[14px]">
                Month
              </label>

              <MUISelect
                items={[
                  { name: "Biweekly", value: "B" },
                  { name: "Day", value: "D" },
                  { name: "Hour", value: "H" },
                  { name: "Month", value: "scu_Month" },
                  { name: "Semimonthly", value: "S" },
                  { name: "Week", value: "W" },
                  { name: "Year", value: "Y" },
                  // { name: "Male", value: "gt_Male" },
                ]}
                aliaslabel="name"
                aliasvalue="value"
                name="SalaryUnit"
                value={data?.salaryUnit}
                onChange={(e) => handlerChange("salaryUnit", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Employee Costs"
              value={data?.employeeCosts}
              name="EmployeeCosts"
              onChange={(e) => handlerChange("employeeCosts", e.target.value)}

            />
            <div>
              <label htmlFor="Month" className="text-gray-500 text-[14px]">
                Month
              </label>

              <MUISelect
                items={[
                  { name: "Day", value: "D" },
                  { name: "Hour", value: "H" },
                  { name: "Month", value: "scu_Month" },
                  { name: "Week", value: "W" },
                  { name: "Year", value: "Y" },
                ]}
                aliaslabel="name"
                aliasvalue="value"
                name="SalaryUnit"
                value={data?.salaryUnit}
                onChange={(e) => handlerChange("salaryUnit", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Bank
            </label>
            <BuyerSelect
              value={data?.bankCode}
              onChange={(e) => handlerChange("bankCode", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Account NO"
              value={data?.bankAccount}
              name="BankAccount"
            />
            <MUITextField
              label="Branch"
              value={data?.bankBranch}
              name="BankBranch"
            />
          </div>
        </div>
      </FormCard>
    </>
  );
}
