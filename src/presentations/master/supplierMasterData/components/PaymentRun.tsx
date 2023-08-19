import FormCard from "@/components/card/FormCard";
import MUITextField from "@/components/input/MUITextField";
import BankChargesAllocationCodesSelect from "@/components/selectbox/BankChargesAllocationCodes";
import CountrySelect from "@/components/selectbox/Country";
import HouseBankAccounts from "@/components/selectbox/HouseBankAccount";
import PaymentBlockSelect from "@/components/selectbox/PaymentBlock";
import BankSelect from "@/components/selectbox/bank";
import { Checkbox } from "@mui/material";

export interface IPaymentRunProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
}

export default function PaymentRun({
  data,
  edit,
  handlerChange,
}: IPaymentRunProps) {
  return (
    <>
      <FormCard title="PaymentRun">
        <div className="flex flex-col gap-2 mt-2">
          <label htmlFor="Code" className="text-black text-[18px]">
            House Bank
          </label>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Country/Region
              </label>
              <CountrySelect
                value={data?.houseBankCountry}
                name="HouseBankCountry"
                onChange={(e: any) =>
                  handlerChange("houseBankCountry", e.target.value)
                }
              />
            </div>
            <div>
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Bank
              </label>
              <BankSelect
                value={data?.houseBank}
                name="HouseBank"
                onChange={(e: any) =>
                  handlerChange("houseBank", e.target.value)
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Account
              </label>
              <HouseBankAccounts
                value={data?.houseBankAccount}
                name="HouseBankAccount"
                onChange={(e: any) =>
                  handlerChange("houseBankAccount", e.target.value)
                }
              />
            </div>
            <MUITextField
              label="Branch"
              value={data?.houseBankBranch}
              disabled
              name="HouseBankBranch"
              onChange={(e: any) =>
                handlerChange("houseBankBranch", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <MUITextField
              label="IBAN"
              value={data?.houseBankIBAN}
              name="HouseBankIBAN"
              onChange={(e: any) =>
                handlerChange("houseBankIBAN", e.target.value)
              }
            />
            <MUITextField
              label="BIC/SWIFT Code"
              value={data?.bICSwiftCode}
              disabled
              name="BICSwiftCode"
              onChange={(e: any) =>
                handlerChange("bICSwiftCode", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <MUITextField
              label="Control No."
              value={data?.controlKey}
              disabled
              name="ControlKey"
              onChange={(e: any) => handlerChange("controlKey", e.target.value)}
            />
            <MUITextField
              label="DME identification"
              value={data?.dME}
              name="DME"
              onChange={(e: any) =>
                handlerChange("dME", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <MUITextField
              label="Instruction key"
              value={data?.instructionKey}
              name="InstructionKey"
              onChange={(e: any) => handlerChange("instructionKey", e.target.value)}
            />
            <MUITextField
              label="Reference Details"
              value={data?.referenceDetails}
              name="ReferenceDetails"
              onChange={(e: any) =>
                handlerChange("referenceDetails", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="flex items-center text-sm pt-3 -ml-3">
              <Checkbox />
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Payment Block
              </label>
            </div>
            <div>
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Bank
              </label>
              <PaymentBlockSelect
                value={data?.paymentBlockDescription}
                name="PaymentBlockDescription"
                onChange={(e: any) =>
                  handlerChange("paymentBlockDescription", e.target.value)
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center text-sm pt-3 -ml-3">
              <Checkbox />
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Single Payment
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center text-sm pt-3 -ml-3">
              <Checkbox />
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Collection Authorization
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Bank Charges Allowcation Code
              </label>
              <BankChargesAllocationCodesSelect
                value={data?.bankChargesAllocationCode}
                name="BankChargesAllocationCode"
                onChange={(e: any) =>
                  handlerChange("bankChargesAllocationCode", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </FormCard>
    </>
  );
}
