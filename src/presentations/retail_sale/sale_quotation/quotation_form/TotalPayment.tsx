import { formatDate } from "@/helper/helper";
import request from "@/utilies/request";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AccountingContext } from "./context/AccountingFormContext";
import { AttachmentContext } from "./context/AttachmentFormContext";
import { ContactContext } from "./context/ContentFormContext";
import { GeneralContact } from "./context/GeneralFormContext";
import { LogisticContext } from "./context/LogisticsFormContext";
import toast, { Toaster } from "react-hot-toast";

type TotalPaymentProps = {
  Edit?: any;
};

export const TotalPayment = ({ Edit }: TotalPaymentProps) => {
  const route = useNavigate();
  const { id } = useParams();
  const { formContent, setFormContent }: any = useContext(ContactContext);
  const { formGeneral, salesPerson, employeesInfo }: any =
    useContext(GeneralContact);
  const { selectedFiles }: any = useContext(AttachmentContext);
  const { formLogistic }: any = useContext(LogisticContext);
  const { formAccounting }: any = useContext(AccountingContext);

  const [saving, setSaving] = useState(false);

  const items = formContent?.items;
  let totalDiscount = formContent?.totalDiscount || formAccounting?.totalDiscount || 0;
  let totalDiscountValue = formContent?.totalDiscountValue || 0;
  
  const totalBeforeDiscount = items?.reduce(
    (accumulator: any, object: any) => accumulator + object.total,
    0
  );

  const handleChangeDiscount = ({ type }: any, e: any) => {
    let val = e.target.value || 0;
    if (type === "percentage") {
      if (val > 100) val = 100;
      return setFormContent({
        ...formContent,
        totalDiscount: val,
        totalDiscountValue: (totalBeforeDiscount * val) / 100,
      });
    }

    setFormContent({
      ...formContent,
      totalDiscount: (val * 100) / totalBeforeDiscount,
      totalDiscountValue: val,
    });
  };

  let rate = formContent?.items?.reduce(
    (accumulator: any, object: any) => accumulator + object.rate,
    0
  );

  if (totalDiscount > 0) {
    rate = rate - rate * (totalDiscount / 100);
    totalDiscountValue = totalBeforeDiscount * (totalDiscount / 100);
  }

  const totalPaymentDue =
    (totalBeforeDiscount || 0) -
    (totalDiscountValue || 0) +
    (rate || 0) +
    parseFloat(formContent?.roundingValue || 0);

  const handleSubmitForm = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    const DocumentLines = formContent?.items?.map((item: any) => {
      return {
        ItemCode: item.ItemCode || null,
        ItemDescription: item.ItemName || item.Name || null,
        Quantity: item.qty || null,
        // Price: item.total,
        UnitPrice: item.unitPrice || item.total,
        DiscountPercent: item.discount,
        VatGroup: item.SalesVATGroup || item.taxCode || null,
        UoMCode: item.uomCode || null,
        UoMEntry: item.uoMEntry || null,
        AccountCode: item.Code || null,
      };
    });
    
    if (saving) return;

    if (!DocumentLines) {
      toast.error("Document lines(Item/Service) required!", {
        duration: 3000,
      });
      return setSaving(false);
    }

    // attachment
    let AttachmentEntry = null;
    const files = selectedFiles?.map((item: any) => item);

    if (files?.length > 0) {
      let data = new FormData();
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        const fileName = file.FileName || file.name;
        const blobFile = file?.file?.originFileObj || null;
        if (blobFile) {
          file = new File([blobFile], fileName, {
            type: blobFile.type,
            lastModified: blobFile.lastModifiedDate,
          });
        }
        data.append(`uploads[${i}]`, file, Date.now() + file.name);
      }

      const response: any = await request("POST", "/Attachments2", data);
      AttachmentEntry = response?.data?.AbsoluteEntry;
    }

    const payload = {
      // general
      DocNum: formGeneral?.series_value,
      DocDate: `${formatDate(formGeneral?.posDate)}"T00:00:00Z"`,
      DocDueDate: `${formatDate(formGeneral?.validUntil)}"T00:00:00Z"`,
      TaxDate: `${formatDate(formGeneral?.documentDate)}"T00:00:00Z"`,
      CardCode: formGeneral?.CardCode,
      CardName: formGeneral?.CardName,
      NumAtCard: formGeneral?.customerRefNo || null,
      DocCurrency:
        formGeneral?.localCurrency === "B" ? formGeneral?.Currency : "",
      Reference1: formGeneral?.series_value,
      ContactPersonCode: formGeneral?.InternalCode || null,
      DocumentStatus: `bost_${formGeneral?.status}`,

      // content
      DocType: `dDocument_${formContent.itemServiceType}`,
      Comments: formContent?.remark || null,
      RoundingDiffAmount: formContent?.roundingValue || 0,
      RoundingDiffAmountFC: 0.0,
      RoundingDiffAmountSC: formContent?.roundingValue || 0,
      SalesPersonCode: formContent?.SalesEmployee,
      Rounding: formContent?.isRounding ? "tYES" : "tNO",
      DocumentsOwner: formContent?.OwnerId || null,
      DiscountPercent: formContent?.totalDiscount,
      DocumentLines,

      // logistic
      ShipToCode: formLogistic?.shipTo || null,
      PayToCode: formLogistic?.payTo || null, //required
      PickRemark: formLogistic?.pickAndPackRemark || null,
      ShipFrom: formLogistic?.shipTo,
      Address: formLogistic?.payToValue,
      Address2: formLogistic?.shipToValue,
      TransportationCode: formLogistic?.shippingType ? "tYES" : "tNO",

      // accounting
      Indicator: formAccounting?.indicator || null,
      FederalTaxID: formAccounting?.federalTaxID || null,
      PaymentMethod: formAccounting?.paymentMethods || null, //required
      UseShpdGoodsAct: formAccounting?.useShippedGoodAccount ? "tYES" : "tNO",
      ExtraMonth: formAccounting?.months,
      ExtraDays: formAccounting?.days,
      CashDiscountDateOffset: formAccounting?.cashDiscount || 0,
      StartFrom: formAccounting?.dueDate,
      CreateQRCodeFrom: formAccounting?.createQRCodeFrom || null,
      PaymentGroupCode: formAccounting.paymentTerms || null,
      JournalMemo: formAccounting?.journalRemark,
      Project: formAccounting.bussinessPartnerProject || null,
      ImportFileNum: formAccounting?.orderNumber || null,

      // attachment
      AttachmentEntry,
    };

    const res: any = Edit
      ? await request("PATCH", `/Quotations(${id})`, payload).then(() => {
          toast.success("Quotation updated successfully!", {
            duration: 3000,
          });
          return { status: 200 };
        })
      : await request("POST", "/Quotations", payload)
          .then(() => {
            toast.success("Quotation created successfully!", {
              duration: 3000,
            });
            return { status: 200 };
          })
          .catch((err: any) =>
            toast.error(err?.message, {
              duration: 6000,
            })
          );

    setTimeout(() => {
      setSaving(false);
      if (res?.status) return route("/sale/sales-quotation");
    }, 2000);
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="grid grid-cols-2 lg:grid-cols-1">
        <div className="col-span-1">
          <div className="flex md:block px-3 mt-3">
            {labelForm("Sale Employee")}
            <Select
              label=""
              className="form-control h-[25px] w-[60%] lg:w-[100%]"
              onChange={(e) => {
                setFormContent({
                  ...formContent,
                  SalesEmployee: e.target.value,
                });
              }}
              value={formContent?.SalesEmployee || 0}
              sx={{ border: "0px solid black", padding: 0 }}
            >
              <MenuItem value="0">-No Sales Employee-</MenuItem>
              {salesPerson?.value?.map((e: any, index: number) => (
                <MenuItem key={index} value={`${e.SalesEmployeeCode}`}>
                  {e.SalesEmployeeName}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="flex md:block px-3 mt-3">
            {labelForm("Owner")}
            <Select
              className="form-control h-[25px] w-[60%] lg:w-[100%]"
              onChange={(e) => {
                setFormContent({
                  ...formContent,
                  OwnerId: e.target.value,
                });
              }}
              value={formContent?.OwnerId || "0"}
              sx={{ border: "0px solid black", padding: 0 }}
            >
              <MenuItem value="0">-No Owner-</MenuItem>
              {employeesInfo?.value?.map((e: any, index: number) => {
                return (
                  <MenuItem key={index} value={`${e.EmployeeID}`}>
                    {e.LastName} {e.FirstName}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
          <div className="flex md:block px-3 mt-3">
            {labelForm("Remark")}
            <textarea
              name=""
              rows={3}
              className="form-control w-[60%] lg:w-[100%]"
              value={formContent?.remark}
              onChange={(e: any) => {
                setFormContent({
                  ...formContent,
                  remark: e.target.value,
                });
              }}
            />
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex md:block px-3 mt-3">
            {labelForm("Total Before Discount")}
            {inputFormControl({
              name: "Total Before Discount",
              value: parseFloat(totalBeforeDiscount || 0)
                .toFixed(2)
                .toString(),
              readOnly: true,
              className: "h-[25px] w-[60%] lg:w-[100%]",
            })}
          </div>
          <div className="px-3 mt-3 grid grid-cols-4">
            <div className="col-span-1">{labelForm("Discount")}</div>
            <div className="col-span-1 flex space-x-2">
              {inputFormControl({
                inputType: "number",
                value: parseFloat(totalDiscount || 0)
                  .toFixed(2)
                  .toString(),
                onChange: (e: any) =>
                  handleChangeDiscount({ type: "percentage" }, e),
                className: "h-[25px] w-[50%]",
              })}
              <span>%</span>
            </div>
            <div className="col-span-2">
              {inputFormControl({
                inputType: "number",
                value: parseFloat(totalDiscountValue || 0)
                  .toFixed(2)
                  .toString(),
                onChange: (e: any) =>
                  handleChangeDiscount({ type: "price" }, e),
                className: "h-[25px] w-[80%] lg:w-[100%]",
              })}
            </div>
          </div>
          <div className="flex md:block px-3 mt-3">
            {labelForm("Freight")}
            {inputFormControl({
              className: "h-[25px] w-[60%] lg:w-[100%]",
              value: "",
              readOnly: true,
            })}
          </div>
          <div className="flex md:block px-3 mt-3">
            <FormControlLabel
              label="Rounding"
              className="text-gray-400 text-sm font-medium w-[30%]"
              control={
                <Checkbox
                  checked={formContent?.isRounding}
                  disabled={Edit ? true : false}
                  size="small"
                  onChange={(e: any) => {
                    setFormContent({
                      ...formContent,
                      isRounding: !formContent?.isRounding,
                      roundingValue: formContent?.isRounding
                        ? 0
                        : formContent?.roundingValue,
                    });
                  }}
                />
              }
            />
            {inputFormControl({
              className: "h-[25px] w-[60%] lg:w-[100%] ml-[-5px]",
              inputType: "number",
              value: formContent?.roundingValue,
              readOnly: !formContent?.isRounding,
              onChange: (e: any) =>
                setFormContent({
                  ...formContent,
                  roundingValue: e.target.value,
                }),
            })}
          </div>
          <div className="flex md:block px-3 mt-3">
            {labelForm("Tax")}
            {inputFormControl({
              name: "Tax",
              className: "h-[25px] w-[60%] lg:w-[100%]",
              value: parseFloat(rate || 0)
                .toFixed(2)
                .toString(),
              readOnly: true,
            })}
          </div>
          <div className="flex md:block px-3 mt-3">
            {labelForm("Total Payment Due")}
            {inputFormControl({
              name: "Total Payment Due",
              className: "h-[25px] w-[60%] lg:w-[100%]",
              value: parseFloat(totalPaymentDue || 0)
                .toFixed(2)
                .toString(),
              readOnly: true,
            })}
          </div>
        </div>
      </div>
      <div className="mt-10 space-x-2 text-right">
        <LoadingButton
          loading={saving}
          variant="outlined"
          onClick={handleSubmitForm}
          size="small"
        >
          {Edit ? <span>Update</span> : <span>Add & New</span>}
        </LoadingButton>
        <Button
          size="small"
          variant="outlined"
          color="error"
          disabled={saving}
          onClick={() => route("/sale/sales-quotation")}
        >
          Cancel
        </Button>
      </div>
    </>
  );
};

const labelForm = (name: string) => (
  <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
    {name}
  </label>
);

type inputFormControlProps = {
  name?: string;
  inputType?: string;
  className?: string;
  readOnly?: boolean;
  value?: string;
  onChange?: (e: any) => void;
};

const inputFormControl = ({
  name,
  inputType,
  className,
  readOnly = false,
  value,
  onChange,
}: inputFormControlProps) => {
  return (
    <input
      name={name}
      type={inputType}
      readOnly={readOnly}
      value={value}
      onChange={onChange ? onChange : () => {}}
      className={`form-control ${className}`}
    />
  );
};
