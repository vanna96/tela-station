import { formatDate } from "@/helper/helper";
import request from "@/utilies/request";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FormOrderContext } from "../context/FormOrderContext";
import { ModalPaymentMeans } from "./ModalPaymentMeans";
import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";

export const TotalPayment = () => {
  const route = useNavigate();
  const { id } = useParams();
  const { form, setForm, Edit, bussinessPartner }: any =
    useContext(FormOrderContext);
  const [saving, setSaving] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const items = form?.items;
  const totalBeforeDiscount = items?.reduce(
    (accumulator: any, object: any) =>
      accumulator + parseFloat(object.total || 0),
    0
  );

  let rate = form?.items?.reduce(
    (accumulator: any, object: any) => accumulator + (object.rate || 0),
    0
  );

  const paymentMeansTotalAUD = form?.paymentMeans?.reduce(
    (accumulator: any, object: any) => {
      return accumulator + parseFloat(object.amount);
    },
    0
  );

  const currency =
    Edit?.DocCurrency ||
    form?.paymenyMeansCurrency ||
    bussinessPartner?.DefaultCurrency ||
    form?.currency ||
    "AUD";

  const handleSubmitForm = async () => {
    setSaving(true);
    if (saving) return;

    // attachment
    let AttachmentEntry = null;
    const files = form?.documentLines?.map((item: any) => item);
    if (files?.length > 0) AttachmentEntry = await getAttachment(files);

    if (Edit) {
      const payload = {
        PayToCode: form?.payTo || null,
        Address: form?.payToValue,
        JournalRemarks: form?.journalRemark,
        Remarks: form?.remark,
        ContactPersonCode: form?.internalCode || null,
        CounterReference: form?.reference || null,
        AttachmentEntry,
        TaxDate: `${formatDate(form?.documentDate)}"T00:00:00Z"`,
      };

      const res: any = await request(
        "PATCH",
        `/IncomingPayments(${id})`,
        payload
      ).then((res: any) => {
        toast.success("IncomingPayment updated successfully!", {
          duration: 3000,
        });
        return { status: 200 };
      });

      return setTimeout(() => {
        setSaving(false);
        if (res?.status) return route("/banking/incoming-payments");
      }, 2000);
    }

    // cash
    const cash = form?.paymentMeans?.find(
      ({ type, amount }: any) => type === "Cash" && parseFloat(amount) > 0
    );
    // bank transfer
    const transfer = form?.paymentMeans?.find(
      ({ type, amount }: any) =>
        type === "Bank Transfer" && parseFloat(amount) > 0
    );

    // check
    const check = form?.paymentMeans?.filter(
      ({ type, amount }: any) => type === "Check" && parseFloat(amount) > 0
    );

    // PaymentChecks
    const PaymentChecks = check?.map((check: any) => {
      return {
        CheckSum: check.amount,
        Currency: currency,
        CheckAccount: check.account.split(" - ")[0] || "",
      };
    });

    // items
    const PaymentInvoices =
      form?.useType !== "Account"
        ? getItem(
            form?.items?.filter(
              ({ TotalPayment, DocTotal }: any) =>
                parseFloat(TotalPayment || 0) > 0 ||
                (DocTotal < 0 && parseFloat(TotalPayment || 0) !== 0)
            ) || []
          )
        : [];

    // account
    const PaymentAccounts =
      form?.useType === "Account" ? getAccount(form?.items || []) : [];

    if (
      form?.useType === "Account"
        ? !(PaymentAccounts.length > 0)
        : !(PaymentInvoices.length > 0)
    ) {
      toast.error("Invoice lines is required!", { duration: 3000 });
      return setSaving(false);
    }

    const payload = {
      // general
      DocNum: form?.series_value,
      DocTypte: `r${form?.useType || "Customer"}`,
      DocDate: `${formatDate(form?.posDate)}"T00:00:00Z"`,
      TaxDate: `${formatDate(form?.documentDate)}"T00:00:00Z"`,
      CardCode: form?.cardCode,
      CardName: form?.cardName,

      DocCurrency: currency,
      DocRate: parseFloat(form?.paymenyMeansExchangeRate || 0),
      CheckAccount: check?.[0]?.account?.split(" - ")[0] || "",
      CashAccount: cash?.account?.split(" - ")[0] || "",
      CashSum: cash?.amount || 0,
      // CashSumFC: cash?.amount * exchangeRate,
      // CashSumSys: cash?.amount / exchangeRate || 0,
      TransferAccount: transfer?.account?.split(" - ")[0] || "",
      TransferSum: transfer?.amount || 0,
      PaymentChecks,

      ContactPersonCode: form?.internalCode || null,
      Series: form?.series_type || null,
      CounterReference: form?.reference || null,
      Remarks: form?.remark || null,
      PaymentInvoices,
      PaymentAccounts,
      PayToCode: form?.payTo || null,
      Address: form?.payToValue,
      JournalRemarks: form?.journalRemark,
      ProjectCode: form?.bussinessPartnerProject || null,

      // attachment
      AttachmentEntry,
    };

    const res: any = await request("POST", "/IncomingPayments", payload)
      .then(() => {
        toast.success("IncomingPayment created successfully!", {
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
      if (res?.status) return route("/banking/incoming-payments");
    }, 2000);
  };

  useEffect(() => {
    if (currency !== "AUD" && form?.paymenyMeansExchangeRate <= 0) {
      toast.error("Please update exchange rate!", {
        duration: 3000,
      });
    }
  }, [currency]);

  return (
    <>
      <ModalPaymentMeans openModal={openModal} setOpenModal={setOpenModal} />
      <Toaster position="top-right" reverseOrder={false} />
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

        {(form?.useType || "Customer") === "Account" ? (
          <div className="col-span-1">
            <div className="flex md:block px-3 mt-3">
              {labelForm("Net Total")}
              {inputFormControl({
                className: "h-[25px] w-[60%] lg:w-[100%]",
                value: parseFloat(totalBeforeDiscount || 0)
                  .toFixed(2)
                  .toString(),
                readOnly: true,
              })}
            </div>
            <div className="flex md:block px-3 mt-3">
              {labelForm("Total Tax")}
              {inputFormControl({
                className: "h-[25px] w-[60%] lg:w-[100%]",
                value: parseFloat(rate || 0)
                  .toFixed(2)
                  .toString(),
                readOnly: true,
              })}
            </div>
            <div className="flex md:block px-3 mt-3 relative">
              {labelForm("Total Amount Due")}
              {inputFormControl({
                className: "h-[25px] w-[60%] lg:w-[100%]",
                value: ` ${currency} ${paymentMeansTotalAUD || "0.00"}`,
                readOnly: true,
              })}
              <div className="absolute right-10 lg:right-[-11px] md:top-[50px]">
                <BarChartIcon
                  className="cursor-pointer"
                  onClick={() => setOpenModal(true)}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="col-span-1">
            <div className="flex md:block px-3 mt-3 relative">
              {labelForm("Total Amount Due")}
              {inputFormControl({
                className: "h-[25px] w-[60%] lg:w-[100%]",
                value: ` ${currency || ""} ${parseFloat(
                  paymentMeansTotalAUD || 0
                )
                  .toFixed(2)
                  .toString()}`,
                readOnly: true,
              })}
              <div className="absolute right-10 lg:right-[-11px] md:top-[50px]">
                <BarChartIcon
                  className="cursor-pointer"
                  onClick={() => setOpenModal(true)}
                />
              </div>
            </div>
            <div className="flex md:block px-3 mt-3 relative">
              {/* {labelForm("Open Balance")} */}
              {/* {inputFormControl({
                className: "h-[25px] w-[60%] lg:w-[100%]",
                value: ` ${currency || ""} ${parseFloat(
                  paymentMeansTotalAUD || 0
                )
                  .toFixed(2)
                  .toString()}`,
                readOnly: true,
              })} */}
            </div>
          </div>
        )}
      </div>
      <div className="mt-10 space-x-2 text-right">
        {currency !== "AUD" && form?.paymenyMeansExchangeRate <= 0 ? (
          ""
        ) : (
          <LoadingButton
            loading={saving}
            variant="outlined"
            onClick={handleSubmitForm}
            size="small"
          >
            {Edit ? <span>Update</span> : <span>Add & New</span>}
          </LoadingButton>
        )}
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
      DocEntry: item.DocEntry,
      DocNum: item.DocNum,
      SumApplied:
        item?.DocCurrency === "AUD"
          ? parseFloat(item.TotalPayment).toFixed(2) || 0
          : 0,
      AppliedSys:
        item?.DocCurrency === "AUD"
          ? parseFloat(item.TotalPayment).toFixed(2) || 0
          : 0,
      AppliedFC:
        item?.DocCurrency !== "AUD"
          ? parseFloat(Math.abs(item.TotalPayment).toString()).toFixed(2)
          : 0,
      DiscountPercent: item?.DiscountPercent || 0,
      InvoiceType: item?.InvoiceType,
    };
  });

const getAccount = (items: any) =>
  items?.map((item: any) => {
    return {
      AccountCode: item.Code,
      VatGroup: item.taxCode || null,
      AccountName: item.Name || null,
      SumPaid: item.total || 0,
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
