import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useContext } from "react";
import { FormOrderContext } from "../context/FormOrderContext";

type AccountingProps = {
  Edit?: any;
};

export default function Accounting({ Edit }: AccountingProps) {
  const {
    form,
    setForm,
    customers,
    PaymentTermsTypes,
    Indicators,
    Projects,
  }: any = useContext(FormOrderContext);

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
              value={form?.journalRemark || ""}
              onChange={(e: any) =>
                setForm({
                  ...form,
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
                setForm({
                  ...form,
                  paymentTerms: e.target.value,
                  months: groupNumber?.NumberOfAdditionalMonths,
                  days: groupNumber?.NumberOfAdditionalDays,
                  dueDate: groupNumber?.StartFrom,
                  totalDiscount: groupNumber?.GeneralDiscount || 0,
                });
              }}
              value={form?.paymentTerms || ""}
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
                setForm({
                  ...form,
                  paymentMethods: e.target.value,
                })
              }
              value={form?.paymentMethods || ""}
            >
              <MenuItem value=""> - Payment Method - </MenuItem>
              {customers?.value
                ?.find((e: any) => e.CardCode === form?.cardCode)
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
                  setForm({
                    ...form,
                    dueDate: e.target.value,
                  })
                }
                value={form?.dueDate || ""}
              >
                <MenuItem value="pdt_None"></MenuItem>
                <MenuItem value="pdt_MonthEnd">Month End</MenuItem>
                <MenuItem value="pdt_HalfMonth">Half Month</MenuItem>
                <MenuItem value="pdt_MonthStart">Month Start</MenuItem>
              </Select>
              <input
                value={form?.months}
                disabled={Edit ? true : false}
                onChange={(e) =>
                  setForm({
                    ...form,
                    months: e.target.value,
                  })
                }
                className="form-control h-[30px] w-[10%]"
              />
              <span>Months +</span>
              <input
                value={form?.days}
                disabled={Edit ? true : false}
                onChange={(e) => setForm({ ...form, days: e.target.value })}
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
              value={form?.cashDiscount}
              onChange={(e: any) =>
                setForm({
                  ...form,
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
                  checked={form?.useShippedGoodAccount}
                  size="small"
                  onChange={() =>
                    setForm({
                      ...form,
                      useShippedGoodAccount: !form?.useShippedGoodAccount,
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
                setForm({
                  ...form,
                  bussinessPartnerProject: e.target.value,
                })
              }
              value={form?.bussinessPartnerProject || ""}
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
              value={form?.createQRCodeFrom}
              rows={3}
              onChange={(e: any) => {
                setForm({
                  ...form,
                  createQRCodeFrom: e.target.value,
                });
              }}
              className="form-control w-[60%] lg:w-[100%]"
            />
          </div>
          <div className="flex md:block px-3 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
              Cancellation Date
            </label>
            <input
              type="date"
              className="form-control h-[30px] w-[60%] lg:w-[100%]"
              value={form?.cancellationDate || ""}
              onChange={(e: any) =>
                setForm({
                  ...form,
                  cancellationDate: e.target.value,
                })
              }
            />
          </div>
          <div className="flex md:block px-3 mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
              Required Date
            </label>
            <input
              type="date"
              className="form-control h-[30px] w-[60%] lg:w-[100%]"
              value={form?.requiredDate || ""}
              onChange={(e: any) =>
                setForm({
                  ...form,
                  requiredDate: e.target.value,
                })
              }
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
                setForm({
                  ...form,
                  indicator: e.target.value,
                })
              }
              value={form?.indicator || ""}
            >
              <MenuItem value=""></MenuItem>
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
              value={form?.federalTaxID || ""}
              onChange={(e: any) =>
                setForm({
                  ...form,
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
              value={form?.orderNumber || ""}
              onChange={(e: any) =>
                setForm({
                  ...form,
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
