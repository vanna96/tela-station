import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useContext, useState } from "react";
import { AccountingContext } from "../context/AccountingFormContext";
import { ContactContext } from "../context/ContentFormContext";
import { GeneralContact } from "../context/GeneralFormContext";

type AccountingProps = {
  Edit?: any;
};

export default function Accounting({ Edit }: AccountingProps) {
  const {
    formAccounting,
    setFormAccounting,
    Projects,
    PaymentTermsTypes,
    Indicators,
  }: any = useContext(AccountingContext);
  const { formGeneral, customers }: any = useContext(GeneralContact);
  const { formContent, setFormContent }: any = useContext(ContactContext);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-1">
        <div className="col-span-1">
          <div className="flex md:block px-3 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
              Journal Remarks
            </label>
            <textarea
              rows={3}
              value={formAccounting?.journalRemark}
              onChange={(e: any) =>
                setFormAccounting({
                  ...formAccounting,
                  journalRemark: e.target.value,
                })
              }
              className="form-control w-[60%] lg:w-[100%]"
            />
          </div>
          <div className="flex md:block px-3 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
              Payment Terms
            </label>
            <Select
              className="form-control h-[30px] w-[60%] lg:w-[100%]"
              sx={{ border: "0px solid black", padding: 0 }}
              onChange={(e) => {
                const groupNumber = PaymentTermsTypes?.find(
                  (num: any) => num.GroupNumber === e.target.value
                );

                setFormContent({
                  ...formContent,
                  totalDiscount: groupNumber?.GeneralDiscount || 0,
                });

                setFormAccounting({
                  ...formAccounting,
                  paymentTerms: e.target.value,
                  months: groupNumber?.NumberOfAdditionalMonths,
                  days: groupNumber?.NumberOfAdditionalDays,
                  dueDate: groupNumber?.StartFrom,
                });
              }}
              value={formAccounting?.paymentTerms || ""}
            >
              {PaymentTermsTypes?.map((e: any, index: number) => (
                <MenuItem key={index} value={e.GroupNumber}>
                  {e.PaymentTermsGroupName}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="flex md:block px-3 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
              Payment Methods
            </label>
            <Select
              className="form-control h-[30px] w-[60%] lg:w-[100%]"
              sx={{ border: "0px solid black", padding: 0 }}
              onChange={(e) =>
                setFormAccounting({
                  ...formAccounting,
                  paymentMethods: e.target.value,
                })
              }
              value={formAccounting?.paymentMethods || ""}
            >
              <MenuItem value=""> - </MenuItem>
              {customers?.value
                ?.find((e: any) => e.CardCode === formGeneral?.CardCode)
                ?.BPPaymentMethods?.map((e: any, index: number) => (
                  <MenuItem key={index} value={e.PaymentMethodCode}>
                    {e.PaymentMethodCode}
                  </MenuItem>
                ))}
            </Select>
          </div>
          <div className="block px-3 mt-3 items-center">
            <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[100%] text-left">
              Manually Rcalculate Due Date
            </label>
            <div className="flex space-x-3">
              <Select
                className="form-control h-[30px] w-[35%] mr-3"
                sx={{ border: "0px solid black", padding: 0 }}
                disabled={Edit ? true : false}
                onChange={(e) =>
                  setFormAccounting({
                    ...formAccounting,
                    dueDate: e.target.value,
                  })
                }
                value={formAccounting?.dueDate || ""}
              >
                <MenuItem value="pdt_None">&nbsp;</MenuItem>
                <MenuItem value="pdt_MonthEnd">Month End</MenuItem>
                <MenuItem value="pdt_HalfMonth">Half Month</MenuItem>
                <MenuItem value="pdt_MonthStart">Month Start</MenuItem>
              </Select>
              <input
                value={formAccounting?.months}
                disabled={Edit ? true : false}
                onChange={(e) =>
                  setFormAccounting({
                    ...formAccounting,
                    months: e.target.value,
                  })
                }
                className="form-control h-[30px] w-[10%]"
              />
              <span>Months +</span>
              <input
                value={formAccounting?.days}
                // disabled={Edit ? true : false}
                onChange={(e) =>
                  setFormAccounting({ ...formAccounting, days: e.target.value })
                }
                className="form-control h-[30px] w-[10%]"
              />
              <span>Days</span>
            </div>
          </div>
          <div className="flex md:block px-3 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
              Cash Discount Date Offset
            </label>
            <input
              value={formAccounting.cashDiscount}
              onChange={(e: any) =>
                setFormAccounting({
                  ...formAccounting,
                  cashDiscount: e.target.value,
                })
              }
              className="form-control h-[30px] w-[60%] lg:w-[100%]"
            />
          </div>
          <div className="ml-3">
            <FormControlLabel
              label="Use Shipped Good Account"
              className="text-gray-400 text-sm font-medium"
              control={
                <Checkbox
                  checked={formAccounting?.useShippedGoodAccount}
                  size="small"
                  onChange={() =>
                    setFormAccounting({
                      ...formAccounting,
                      useShippedGoodAccount:
                        !formAccounting?.useShippedGoodAccount,
                    })
                  }
                />
              }
            />
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex md:block px-3 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
              Bussiness Partner Project
            </label>
            <Select
              className="form-control h-[30px] w-[60%] lg:w-[100%]"
              sx={{ border: "0px solid black", padding: 0 }}
              onChange={(e) =>
                setFormAccounting({
                  ...formAccounting,
                  bussinessPartnerProject: e.target.value,
                })
              }
              value={formAccounting?.bussinessPartnerProject || ""}
            >
              <MenuItem value="">- Bussiness Partner Project -</MenuItem>
              {Projects?.map((e: any, index: number) => (
                <MenuItem key={index} value={e.Code}>
                  {e.Code}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="flex md:block px-3 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
              Create QR Code From
            </label>
            <textarea
              value={formAccounting?.createQRCodeFrom}
              rows={3}
              onChange={(e: any) => {
                setFormAccounting({
                  ...formAccounting,
                  createQRCodeFrom: e.target.value,
                });
              }}
              className="form-control w-[60%] lg:w-[100%]"
            />
          </div>
          <div className="flex md:block px-3 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
              Indicator
            </label>
            <Select
              className="form-control h-[30px] w-[60%] lg:w-[100%]"
              sx={{ border: "0px solid black", padding: 0 }}
              onChange={(e) =>
                setFormAccounting({
                  ...formAccounting,
                  indicator: e.target.value,
                })
              }
              value={formAccounting?.indicator || ""}
            >
              <MenuItem value="">&nbsp;</MenuItem>
              {Indicators?.map((e: any, index: number) => (
                <MenuItem key={index} value={e.IndicatorCode}>
                  {e.IndicatorName}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="flex md:block px-3 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
              RFederal Tax ID
            </label>
            <input
              className="form-control h-[30px] w-[60%] lg:w-[100%]"
              value={formAccounting.federalTaxID}
              onChange={(e: any) =>
                setFormAccounting({
                  ...formAccounting,
                  federalTaxID: e.target.value,
                })
              }
            />
          </div>
          <div className="flex md:block px-3 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
              Order Number
            </label>
            <input
              className="form-control h-[30px] w-[60%] lg:w-[100%]"
              value={formAccounting.orderNumber}
              onChange={(e: any) =>
                setFormAccounting({
                  ...formAccounting,
                  orderNumber: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
