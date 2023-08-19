import FormCard from "@/components/card/FormCard";
import AccountTextField from "@/components/input/AccountTextField";
import BusinessPartnerTextField from "@/components/input/BusinessPartnerTextField";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import VatGroup from "@/components/selectbox/VatGroup";
import { Checkbox } from "@mui/material";

export interface IAccouttingProps {
  handlerChange: (key: string, value: any) => void;
  handlerOpenVendor: () => void;
  handlerOpenVendor2: () => void;
  data: any;
  edit?: boolean;
  handlerOpenAccount: () => void;
}

export default function Accounting({
  data,
  edit,
  handlerChange,
  handlerOpenAccount,
  handlerOpenVendor,
  handlerOpenVendor2,
}: IAccouttingProps) {
  return (
    <>
      <FormCard title="Accounting">
        <div className="flex flex-col gap-2 mt-2">
          <label htmlFor="Code" className="text-black text-[18px]">
            General
          </label>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Consolidating Bussiness Partner
              </label>
              <BusinessPartnerTextField
                onChange={(e) => {
                  handlerChange("fatherCard", e.target.value?.cardCode);
                  console.log(e);
                }}
                value={data?.fatherCard}
                name="FatherCard"
                type="supplier"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center text-sm pt-3 -ml-3">
              <Checkbox />
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Payment Consolidating
              </label>
            </div>
            <div className="flex items-center text-sm pt-3 -ml-3">
              <Checkbox />
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Delivery Consolidating
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Accounts Payable
              </label>
              <AccountTextField
                name="AccountNo"
                value={data?.debitorAccount}
                onChange={(e) =>
                  handlerChange("debitorAccount", e.target.value?.code)
                }
              />
            </div>
            <div>
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Down Payment Clearing Account
              </label>
              <AccountTextField
                name="AccountNo"
                value={data?.downPaymentClearAct}
                onChange={(e) =>
                  handlerChange("downPaymentClearAct", e.target.value?.code)
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Down Payment Interim Account
              </label>
              <AccountTextField
                name="AccountNo"
                value={data?.downPaymentInterimAccount}
                onChange={(e) =>
                  handlerChange(
                    "downPaymentInterimAccount",
                    e.target.value?.code
                  )
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Connected Vendor
              </label>
              <BusinessPartnerTextField
                value={data?.linkedBusinessPartner}
                name="linkedBusinessPartner"
                onChange={(e) => {
                  handlerChange("linkedBusinessPartner", e.target.value?.cardCode);
                  console.log(e);
                }}
                type="customer"
              />
            </div>

            <MUITextField
              label="Planning Group"
              value={data?.planningGroup}
              name="PlanningGroup"
              onChange={(e: any) =>
                handlerChange("planningGroup", e.target.value)
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <label htmlFor="Code" className="text-black text-[18px]">
            Tax
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-[14px]">Tax Status</label>
              <MUISelect
                items={[
                  { name: "Liable", value: "vLiable" },
                  { name: "Exempted", value: "vExempted" },
                ]}
                aliaslabel="name"
                aliasvalue="value"
                name="VatLiable"
                value={data?.vatLiable ?? "L"}
                onChange={(e) => handlerChange("vatLiable", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Tax Group
              </label>
              <VatGroup
                value={data?.vatGroup}
                name="VatGroup"
                onChange={(e) => handlerChange("vatGroup", e.target.value)}
                category={"InputTax"}
              />
            </div>
            <MUITextField
              label="EORI Number"
              value={data?.eORINumber}
              name="EORINumber"
              onChange={(e: any) => handlerChange("eORINumber", e.target.value)}
            />
          </div>
          <div className="flex items-center text-sm pt-3 -ml-3">
            <Checkbox />
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Deferred Tax
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3"></div>
        </div>
      </FormCard>
    </>
  );
}
