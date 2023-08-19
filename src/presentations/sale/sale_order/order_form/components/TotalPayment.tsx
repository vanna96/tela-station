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
import toast, { Toaster } from "react-hot-toast";
import { FormOrderContext } from "../context/FormOrderContext";

export const TotalPayment = () => {
  const route = useNavigate();
  const { id } = useParams();
  const { form, setForm, salesPerson, employeesInfo, Edit }: any =
    useContext(FormOrderContext);

  const [saving, setSaving] = useState(false);

  const items = form?.items;
  let totalDiscount = form?.totalDiscount || 0;
  let totalDiscountValue = form?.totalDiscountValue || 0;
  const totalBeforeDiscount = items?.reduce(
    (accumulator: any, object: any) => accumulator + parseFloat(object.total),
    0
  );

  const handleChangeDiscount = ({ type }: any, e: any) => {
    let val = e.target.value || 0;
    if (type === "percentage") {
      if (val > 100) val = 100;
      return setForm({
        ...form,
        totalDiscount: val,
        totalDiscountValue: (totalBeforeDiscount * val) / 100,
      });
    }

    setForm({
      ...form,
      totalDiscount: (val * 100) / totalBeforeDiscount,
      totalDiscountValue: val,
    });
  };

  let rate = form?.items?.reduce(
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
    parseFloat(form?.roundingValue || 0);

  const handleSubmitForm = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    if (saving) return;

    // items
    const DocumentLines = getItem(form?.items || []);
    if (!(DocumentLines.length > 0)) {
      toast.error("Document lines(Item/Service) required!", {
        duration: 3000,
      });
      return setSaving(false);
    }

    // attachment
    let AttachmentEntry = null;
    const files = form?.documentLines?.map((item: any) => item);
    if (files?.length > 0) AttachmentEntry = await getAttachment(files);

    const payload = {
      // general
      DocNum: form?.series_value,
      DocDate: `${formatDate(form?.posDate)}"T00:00:00Z"`,
      DocDueDate: `${formatDate(form?.validUntil || new Date())}"T00:00:00Z"`,
      TaxDate: `${formatDate(form?.documentDate)}"T00:00:00Z"`,
      CardCode: form?.cardCode,
      CardName: form?.cardName,
      NumAtCard: form?.customerRefNo || null,
      DocCurrency: form?.localCurrency === "B" ? form?.Currency : "",
      Reference1: form?.series_value,
      ContactPersonCode: form?.internalCode || null,
      DocumentStatus: `bost_${form?.status}`,

      // content
      DocType: `dDocument_${form?.itemServiceType}`,
      Comments: form?.remark || null,
      RoundingDiffAmount: form?.roundingValue || 0,
      RoundingDiffAmountFC: 0.0,
      RoundingDiffAmountSC: form?.roundingValue || 0,
      SalesPersonCode: form?.SalesEmployee,
      Rounding: form?.isRounding ? "tYES" : "tNO",
      DocumentsOwner: form?.OwnerId || null,
      DiscountPercent: form?.totalDiscount,
      DocumentLines,

      // logistic
      ShipToCode: form?.shipTo || null,
      PayToCode: form?.payTo || null,
      PickRemark: form?.pickAndPackRemark || null,
      ShipFrom: form?.shipTo,
      Address: form?.payToValue,
      Address2: form?.shipToValue,
      Confirmed: form?.approved ? "tYES" : "tNO",
      PartialSupply: form?.allowPartialDelivery ? "tYES" : "tNO",
      Pick: form?.printPickingSheet ? "tYES" : "tNO",
      TransportationCode: form?.shippingType ? "tYES" : "tNO",

      // accounting
      Indicator: form?.indicator || null,
      FederalTaxID: form?.federalTaxID || null,
      PaymentMethod: form?.paymentMethods || null,
      UseShpdGoodsAct: form?.useShippedGoodAccount ? "tYES" : "tNO",
      ExtraMonth: form?.months,
      ExtraDays: form?.days,
      CashDiscountDateOffset: form?.cashDiscount || 0,
      StartFrom: form?.dueDate,
      CreateQRCodeFrom: form?.createQRCodeFrom || null,
      PaymentGroupCode: form?.paymentTerms || null,
      JournalMemo: form?.journalRemark,
      Project: form?.bussinessPartnerProject || null,
      ImportFileNum: form?.orderNumber || null,
      CancelDate: `${formatDate(
        form?.cancellationDate || new Date()
      )}"T00:00:00Z"`,
      RequriedDate: `${formatDate(
        form?.requiredDate || new Date()
      )}"T00:00:00Z"`,

      // attachment
      AttachmentEntry,
    };

    const res: any = Edit
      ? await request("PATCH", `/Orders(${id})`, payload).then((res: any) => {
          toast.success("Order updated successfully!", {
            duration: 3000,
          });
          return { status: 200 };
        })
      : await request("POST", "/Orders", payload)
          .then(() => {
            toast.success("Order created successfully!", {
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
      if (res?.status) return route("/sale/sales-order");
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
                setForm({
                  ...form,
                  SalesEmployee: e.target.value,
                });
              }}
              value={form?.SalesEmployee || 0}
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
                setForm({
                  ...form,
                  OwnerId: e.target.value,
                });
              }}
              value={form?.OwnerId || "0"}
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
              rows={3}
              className="form-control w-[60%] lg:w-[100%]"
              value={form?.remark || ""}
              onChange={(e: any) => {
                setForm({
                  ...form,
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
                  checked={form?.isRounding || false}
                  disabled={Edit ? true : false}
                  size="small"
                  onChange={(e: any) => {
                    setForm({
                      ...form,
                      isRounding: !form?.isRounding,
                      roundingValue: form?.isRounding ? 0 : form?.roundingValue,
                    });
                  }}
                />
              }
            />
            {inputFormControl({
              className: "h-[25px] w-[60%] lg:w-[100%] ml-[-5px]",
              inputType: "number",
              value: form?.roundingValue,
              readOnly: !form?.isRounding,
              onChange: (e: any) =>
                setForm({
                  ...form,
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

const getItem = (items: any) =>
  items?.map((item: any) => {
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

const getAttachment = async (files: any) => {
  let data = new FormData();
  files.map((file: any, index: number) => {
    const fileName = file.FileName || file.name;
    const blobFile = file?.file?.originFileObj || null;
    if (blobFile) {
      file = new File([blobFile], fileName, {
        type: blobFile.type,
        lastModified: blobFile.lastModifiedDate,
      });
    }
    data.append(`uploads[${index}]`, file, Date.now() + file.name);
  });

  const res: any = await request("POST", "/Attachments2", data);
  return res?.data?.AbsoluteEntry;
};
