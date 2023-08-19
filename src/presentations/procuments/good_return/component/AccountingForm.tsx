import FormCard from "@/components/card/FormCard";
import MUISelect from "@/components/selectbox/MUISelect";
import Owner from "@/components/selectbox/Owner";
import PaymentMethod from "@/components/selectbox/PaymentMethod";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import * as React from "react";
import ShippingType from "@/components/selectbox/ShippingType";
import MUITextField from "@/components/input/MUITextField";
import PaymentTerm from "@/components/selectbox/PaymentTerm";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import IndicatorSelect from "@/components/selectbox/Indicator";

export interface IAccountingFormProps {
  data: any;
  handlerChange: (key: string, value: any) => void;
  handlerOpenProject?: () => void;
  edit: boolean;
}

export default function AccountingForm({
  data,
  handlerChange,
  handlerOpenProject,
  edit,
}: IAccountingFormProps) {
  return (
    <FormCard title="ACCOUNTING">
      <div className="flex flex-col gap-3 mt-2">
        <div>
        <MUITextField
          label="Journal Remarks"
          key={data?.CardCode + "_remark"}
          defaultValue={`Good Return Request - ${data?.CardCode ?? ""}`}
          onBlur={(e) => handlerChange("JournalMemo", e.target.value)}
        />
        </div>
        {data?.documentStatus === "bost_Open" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="Code" className="text-gray-500 text-[14px]">
                  Payment Term
                </label>
                <PaymentTerm
                  onChange={(e) =>
                    handlerChange("PaymentGroupCode", e.target.value)
                  }
                  value={data?.PaymentGroupCode}
                  name="PaymentGroupCode"
                />
              </div>
              <div>
                <label htmlFor="Code" className="text-gray-500 text-[14px]">
                  Payment Method
                </label>
                <div className="">
                  <PaymentMethod
                    type="outgoing"
                    name="PaymentMethod"
                    value={data.PaymentMethod}
                    onChange={(e) =>
                      handlerChange("PaymentMethod", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MUITextField
                label="Central Bank Indicator"
                onChange={(e) =>
                  handlerChange("CentralBankIndicator", e.target.value)
                }
                value={data?.CentralBankIndicator}
                name="CentralBankIndicator"
              />

              <MUITextField
                label="Installments"
                name="numberOfInstallments"
                value={data?.NumberOfInstallments}
                onChange={(e) =>
                  handlerChange("NumberOfInstallments", e.target.value)
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="AgreementMethod"
                  className="text-gray-500 text-[14px]"
                >
                  Manually Recalculate Due Date
                </label>

                <MUISelect
                  items={[
                    { value: "E", name: "Month End" },
                    { value: "H", name: "Half Month" },
                    { value: "Y", name: "Month Start" },
                  ]}
                  aliaslabel="name"
                  aliasvalue="pdt_None"
                  name="StartFrom"
                  value={data.StartFrom}
                  onChange={(e) => handlerChange("StartFrom", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <MUITextField
                  label="Month +"
                  onChange={(e) => handlerChange("ExtraMonth", e.target.value)}
                  value={data.extraMonth}
                  name="ExtraMonth"
                />
                <MUITextField
                  label="Days"
                  onChange={(e) => handlerChange("ExtraDays", e.target.value)}
                  value={data.ExtraDays}
                  name="ExtraDays"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <MUITextField
                label="Cash Discount Date Offset"

                onChange={(e) =>
                  handlerChange("CashDiscountDateOffset", e.target.value)
                }
                value={data.CashDiscountDateOffset}
                name="CashDiscountDateOffset"
              />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="Code" className="text-gray-500 text-[14px]">
                  Payment Term
                </label>
                <PaymentTerm
                  disabled={data?.DocumentStatus === "bost_Close" ?? false}

                  onChange={(e) =>
                    handlerChange("PaymentGroupCode", e.target.value)
                  }
                  value={data?.PaymentGroupCode}
                  name="PaymentGroupCode"
                />
              </div>
              <div>
                <label htmlFor="Code" className="text-gray-500 text-[14px]">
                  Payment Method
                </label>
                <div className="">
                  <PaymentMethod
                    disabled={data?.DocumentStatus === "bost_Close" ?? false}

                    type="outgoing"
                    name="PaymentMethod"
                    value={data.PaymentMethod}
                    onChange={(e) =>
                      handlerChange("PaymentMethod", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="Code" className="text-gray-500 text-[14px]">
                  Central Bank Ind.
                </label>
                <MUITextField
                  disabled={edit}
                  onChange={(e) =>
                    handlerChange("CentralBankIndicator", e.target.value)
                  }
                  value={data?.CentralBankIndicator}
                  name="CentralBankIndicator"
                />
              </div>
              <div>
                <label htmlFor="Code" className="text-gray-500 text-[14px]">
                  Installments
                </label>
                <div className="">
                  <MUITextField
                    value={data.NumberOfInstallments}
                    onChange={(e) =>
                      handlerChange("NumberOfInstallments", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="AgreementMethod"
                  className="text-gray-500 text-[14px]"
                >
                  Manually Recalculate Due Date
                </label>

                <MUISelect
                  items={[
                    { value: "E", name: "Month End" },
                    { value: "H", name: "Half Month" },
                    { value: "Y", name: "Month Start" },
                    { value: "pdt_None", name: "None" },
                  ]}
                  aliaslabel="name"
                  aliasvalue="value"
                  name="StartFrom"
                  disabled={edit}
                  value={data.StartFrom}
                  onChange={(e) =>
                    handlerChange("StartFrom", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <MUITextField
                  disabled={edit}
                  label="Month +"
                  onChange={(e) => handlerChange("ExtraMonth", e.target.value)}
                  value={data.ExtraMonth}
                  name="ExtraMonth"
                />
                <MUITextField
                  disabled={edit}
                  label="Days"
                  onChange={(e) => handlerChange("ExtraDays", e.target.value)}
                  value={data.ExtraDays}
                  name="ExtraDays"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <MUITextField

                label="Cash Discount Date Offset"
                value={data?.CashDiscountDateOffSet}
                name="CashDiscountDateOffset"
              />
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col gap-3 mt-2">
        <div className="grid grid-cols-1">
          <div>
            <MUITextField
              label="Project"
              onChange={(e) => handlerChange("Project", e.target.value)}
              name="Project"
              value={data.Project}
              endAdornment={true}
              onClick={handlerOpenProject}
            />
          </div>
          <div>
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Create QR Code From:
            </label>
            <div className="">
              <TextField
                size="small"
                multiline
                rows={2}
                fullWidth
                name="CreateQRCodeFrom"
                className="w-full "
                value={data?.CreateQRCodeFrom}
                onChange={(e) =>
                  handlerChange("CreateQRCodeFrom", e.target.value)
                }
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Cancellation Date
            </label>
            <div className="">
              <MUIDatePicker
                value={data.CancelDate}
                name="CancelDate"
                onChange={(e: any) => handlerChange("CancelDate", e)}
              />
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
          <div>
            <MUITextField
              label="Federal Tax ID"
              value={data.FederalTaxID}
              name="FederalTaxID"
              onChange={(e) => handlerChange("FederalTaxID", e.target.value)}
            />
          </div>
          <div>
            <MUITextField
              label="Order Number:"
              value={data?.ImportFileNum}
              name="ImportFileNum"
              onChange={(e) => handlerChange("ImportFileNum", e.target.value)}
            />
          </div>
        </div>
      </div>
    </FormCard>
  );
}
