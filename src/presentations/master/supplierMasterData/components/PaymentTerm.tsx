import FormCard from "@/components/card/FormCard";
import MUITextField from "@/components/input/MUITextField";
import CountrySelect from "@/components/selectbox/Country";
import HolidaySelect from "@/components/selectbox/Holidays";
import MUISelect from "@/components/selectbox/MUISelect";
import PaymentTerm from "@/components/selectbox/PaymentTerm";
import PriceListSelect from "@/components/selectbox/PriceList";
import PrioritySelect from "@/components/selectbox/Priority";
import BankSelect from "@/components/selectbox/bank";
import Country from "@/models/Country";
import { currencyFormat } from "@/utilies";

export interface IPaymentTermProps {
  //   handlerOpenVendor: () => void;
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
}

export default function PaymentTerms({
  data,
  edit,
  handlerChange,
}: IPaymentTermProps) {
  return (
    <>
      <FormCard title="PaymentTerm">
        <div className="flex flex-col gap-2 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Payment Terms
              </label>
              <PaymentTerm
                name="PayTermsGrpCode"
                value={data?.payTermsGrpCode}
                onChange={(e) =>
                  handlerChange("payTermsGrpCode", e.target.value)
                }
              />
            </div>
            <MUITextField
              label="Interest On Arieas %"
              value={currencyFormat(data?.intrestRatePercent)}
              name="IntrestRatePercent"
              onChange={(e: any) =>
                handlerChange("intrestRatePercent", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Price List
              </label>
              <div className="">
                <PriceListSelect
                  value={data?.priceListNum}
                  onChange={(e) =>
                    handlerChange("priceListNum", e.target.value)
                  }
                />
              </div>
            </div>
            <MUITextField
              label="Total Discount %"
              value={currencyFormat(data?.discountPercent)}
              name="DiscountPercent"
              onChange={(e: any) =>
                handlerChange("discountPercent", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Credit Limit"
              value={currencyFormat(data?.creditLimit)}
              name="CreditLimit"
              onChange={(e: any) =>
                handlerChange("creditLimit", e.target.value)
              }
            />
            <MUITextField
              label="Commitment Limit"
              value={currencyFormat(data?.maxCommitment)}
              name="MaxCommitment"
              onChange={(e: any) =>
                handlerChange("maxCommitment", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-[14px]">
                Effective Discount Groups
              </label>
              <MUISelect
                items={[
                  { name: "Average", value: "dgrAverageDiscount" },
                  { name: "Highest Discount", value: "dgrHighestDiscount" },
                  { name: "Lowest Discount", value: "dgrLowestDiscount" },
                  { name: "Discount Multiples", value: "dgrMultipliedDiscount" },
                  { name: "Total", value: "dgrDiscountTotals" },
                ]}
                aliaslabel="name"
                aliasvalue="value"
                name="EffectiveDiscount"
                value={data?.effectiveDiscount ?? "L"}
                onChange={(e) =>
                  handlerChange("effectiveDiscount", e.target.value)
                }
              />
            </div>

            <div>
              <label className="text-gray-500 text-[14px]">
                Effective Price
              </label>
              <MUISelect
                items={[
                  { name: "Default Priority", value: "epDefaultPriority" },
                  { name: "Highest Price", value: "epHighestPrice" },
                  { name: "Lowest Price", value: "epLowestPrice" },
                ]}
                aliaslabel="name"
                aliasvalue="value"
                name="EffectivePrice"
                value={data?.effectivePrice}
                onChange={(e) =>
                  handlerChange("effectivePrice", e.target.value)
                }
              />
            </div>
          </div>
          <label htmlFor="Code" className=" text-black text-[18px] py-3">
            Business Partner Bank
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="Code" className=" text-gray-500 text-[14px]">
                Bank Country/Region
              </label>
              <CountrySelect
                value={data?.bankCountry}
                disabled
                name="BankCountry"
                onChange={(e: any) =>
                  handlerChange("bankCountry", e.target.value)
                }
              />
            </div>
            <div>
              <label htmlFor="Code" className=" text-gray-500 text-[14px]">
                Bank Name
              </label>
              <BankSelect
                value={data?.defaultBankCode}
                name="BankName"
                onChange={(e: any) => handlerChange("defaultBankCode", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Bank Code"
              value={data?.defaultBankCode}
              name="DefaultBankCode"
              onChange={(e: any) => handlerChange("defaultBankCode", e.target.value)}
            />
            <MUITextField
              label="Account"
              value={data?.accountNo}
              name="AccountNo"
              onChange={(e: any) => handlerChange("accountNo", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="BIC/SWIFT Code"
              value={data?.bICSwiftCode}
              name="BICSwiftCode"
              onChange={(e: any) =>
                handlerChange("bICSwiftCode", e.target.value)
              }
            />
            <MUITextField
              label="Bank Account Name"
              value={data?.addressName2}
              name="AddressName2"
              onChange={(e: any) =>
                handlerChange("addressName2", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Branch"
              value={data?.defaultBranch}
              name="DefaultBranch"
              onChange={(e: any) =>
                handlerChange("defaultBranch", e.target.value)
              }
            />
            <MUITextField
              label="Ctrl Int ID"
              value={data?.addressName2}
              name="AddressName2"
              onChange={(e: any) =>
                handlerChange("addressName2", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="IBAN"
              value={data?.iBAN}
              name="IBAN"
              onChange={(e: any) => handlerChange("iBAN", e.target.value)}
            />
            <MUITextField
              label="Man Date ID"
              value={data?.mandateID}
              name="MandateID"
              onChange={(e: any) => handlerChange("mandateID", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Date Of signature"
              value={data?.signatureDate}
              name="SignatureDate"
              onChange={(e: any) =>
                handlerChange("signatureDate", e.target.value)
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Average Delay"
              value={data?.avarageLate}
              name="AvarageLate"
              onChange={(e: any) =>
                handlerChange("avarageLate", e.target.value)
              }
            />
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Priority
              </label>
              <div className="">
                <PrioritySelect
                  value={data?.priority}
                  onChange={(e) => handlerChange("priority", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Default IBAN"
              value={data?.iBAN}
              name="IBAN"
              onChange={(e: any) => handlerChange("iBAN", e.target.value)}
            />
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Holiday
              </label>
              <div className="">
                <HolidaySelect
                  value={data?.priority}
                  onChange={(e) => handlerChange("priority", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </FormCard>
    </>
  );
}
