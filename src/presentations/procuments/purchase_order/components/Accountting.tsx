import FormCard from "@/components/card/FormCard";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import IndicatorSelect from "@/components/selectbox/Indicator";
import MUISelect from "@/components/selectbox/MUISelect";
import PaymentMethod from "@/components/selectbox/PaymentMethod";
import PaymentTerm from "@/components/selectbox/PaymentTerm";
import TextField from "@mui/material/TextField";

export interface IAccounttingProps {
  data: any;
  handlerChange: (key: string, value: any) => void;
  handlerOpenProject?: () => void;
  edit: boolean;
}

export default function AccounttingForm({
  data,
  edit,
  handlerChange,
  handlerOpenProject,
}: IAccounttingProps) {
  return (
    <FormCard title="ACCOUNTTING">
      <div className="mt-2">
        <MUITextField
          label="Journal Remarks"
          key={data?.CardCode + "_remark"}
          defaultValue={`Purchase Order - ${data?.CardCode ?? ""}`}
          onBlur={(e) => handlerChange("JournalMemo", e.target.value)}
        />
        <div className="flex gap-3 mt-3">
          <div className="w-[48%]">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Payment Terms
            </label>
            <PaymentTerm
              name="PaymentGroupCode"
              value={data.PaymentGroupCode}
              onChange={(e) =>
                handlerChange("PaymentGroupCode", e.target.value)
              }
              disabled={data.DocumentStatus === "bost_Close" ? true : false}

            />
          </div>
          <div className="w-[50%]">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Payment Method
            </label>
            <div className="">
              <PaymentMethod
                type="outgoing"
                name="PaymentMethod"
                value={data.PaymentMethod}
                onChange={(e) => handlerChange("PaymentMethod", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <label
            htmlFor="AgreementMethod"
            className="text-gray-500 text-[14px]"
          >
            Manually Rcalculate Due Date
          </label>
          <div className="flex gap-3">
            <div className="w-[48%]">
              <MUISelect
                items={[
                  { name: "Month End", value: "E" },
                  { name: "Half Month", value: "H" },
                  { name: "Month Start", value: "Y" },
                ]}
                aliaslabel="name"
                aliasvalue="value"
                name="AgreementMethod"
                disabled={edit}
                value={data.agreementMethod}
                onChange={(e) =>
                  handlerChange("agreementMethod", e.target.value)
                }
              />
            </div>
            <div className="w-[24%] -mt-6">
              <MUITextField
                label="Month+"
                disabled={edit}
                value={data?.ExtraMonth}
                name="ExtraMonth"
              />
            </div>
            <div className="w-[24%] -mt-6">
              <MUITextField
                disabled={edit}
                label="Days+"
                value={data?.ExtraDays}
                name="ExtraDays"
              />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <MUITextField
            label="Cash Discount Date Offset"
            value={data?.CashDiscountDateOffset}
            name="CashDiscountDateOffset"
            onChange={(e) =>
              handlerChange("CashDiscountDateOffset", e.target.value)
            }
            disabled={data.DocumentStatus === "bost_Close" ? true : false}

          />
        </div>
      </div>
      <div className="mt-2">
        <div>
          <MUITextField
            label="Project"
            name="Project"
            value={data.Project}
            endAdornment={true}
            onClick={handlerOpenProject}
          />
        </div>
        <div className="mt-3">
          <label htmlFor="Code" className="text-gray-500 text-[14px]">
            Create QR Code From
          </label>
          <div className="">
            <TextField
              size="small"
              multiline
              rows={4}
              fullWidth
              name="CreateQRCodeFrom"
              value={data?.CreateQRCodeFrom}
            />
          </div>
        </div>
        <div className="flex gap-5">
          <div className="w-[48%]">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Cancellation Date
            </label>
            <div className="">
              <MUIDatePicker
                value={data.CancelDate ?? null}
                name="CancelDate"
                onChange={(e: any) => handlerChange("CancelDate", e)}
              />
            </div>
          </div>
          <div className="w-[48%]">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Required Date
            </label>
            <div className="">
              <MUIDatePicker
                value={data.RequiredDate ?? null}
                name="RequiredDate"
                onChange={(e: any) => handlerChange("RequiredDate", e)}
              />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="Code" className="text-gray-500 text-[14px]">
            Indicator
          </label>
          <IndicatorSelect
            onChange={(e) => handlerChange("Indicator", e.target.value)}
            value={data?.Indicator}
            name="Indicator"
          />
        </div>
        <div className="flex gap-5 mt-2">
          <div className="w-[48%]">
            <div className="">
              <MUITextField
                label="Federal Tax ID"
                value={data?.FederalTaxID}
                name="FederalTaxID"
                onChange={(e: any) =>
                  handlerChange("FederalTaxID", e.target.value)
                }
              />
            </div>
          </div>
          <div className="w-[48%]">
            <div className="">
              <MUITextField
                label="Order Number"
                value={data?.ImportFileNum}
                name="ImportFileNum"
                onChange={(e: any) =>
                  handlerChange("ImportFileNum", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </FormCard>
  );
}
