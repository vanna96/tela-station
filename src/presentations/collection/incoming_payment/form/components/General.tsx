import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { useContext } from "react";
import { FormOrderContext } from "../context/FormOrderContext";

export default function General() {
  let {
    form,
    setForm,
    customers,
    documentNumber,
    Edit,
    bussinessPartner,
    Vendor,
    currency,
  }: any = useContext(FormOrderContext);
  const type = form?.useType || "Customer";
  
  const data = (type === "Supplier" ? Vendor : customers)?.map(
    (option: any) => {
      return {
        value: option.CardCode,
        name: option.CardName,
        currency: option.Currency,
        label: `${option.CardCode} - ${option.CardName}`,
      };
    }
  );

  if ((documentNumber || []).length > 0) {
    documentNumber = [
      ...documentNumber,
      {
        Name: "Manual",
        Series: -1,
      },
    ];
  }

  return (
    <>
      <div className="grid grid-cols-4 lg:grid-cols-1">
        <section className="col-span-2">
          <div className="flex md:block items-center px-3 mt-3 relative">
            {formLabel("Code")}
            {autoComplete({
              value: form?.cardCode || null,
              data,
              onChange: (e: any) =>
                setForm({
                  ...form,
                  cardCode: e?.value,
                  cardName: e?.name,
                  localCurrency: "B",
                  currency: e.currency,
                }),
              loading: data === undefined,
              disabled: Edit
                ? true
                : null || (form?.useType || "Customer") === "Account",
            })}
          </div>
          <div className="flex md:block items-center px-3 mt-3">
            {formLabel("Name")}
            {inputFormControl({
              className: "h-[25px] w-[60%] lg:w-[100%]",
              value: form?.cardName || "",
              readOnly: true,
            })}
          </div>
        
          {(form?.useType || "Customer") === "Account" ? (
            <div className="flex md:block items-center px-3 mt-3">
              {formLabel("Currency")}
              <div className="flex space-x-4 w-[60%] lg:w-[100%]">
                <Select
                  readOnly={Edit ? true : false}
                  className="form-control h-[25px]"
                  onChange={(e: any) => {
                    const rate =
                      currency?.find(
                        ({ Currency }: any) => Currency === e.target.value
                      )?.Rate || 0;

                    setForm({
                      ...form,
                      paymenyMeansCurrency: e.target.value,
                      paymenyMeansExchangeRate: rate,
                    });
                  }}
                  value={
                    Edit?.DocCurrency ||
                    form?.paymenyMeansCurrency ||
                    bussinessPartner?.DefaultCurrency ||
                    form?.currency ||
                    "AUD"
                  }
                  sx={{ border: "0px solid black", padding: 0 }}
                >
                  {["AUD", "EUR", "GBP", "JPY", "KHR", "NZD", "SGD", "USD"].map(
                    (currency: any, index: any) => (
                      <MenuItem key={index} value={currency}>
                        {currency}
                      </MenuItem>
                    )
                  )}
                </Select>
                {(form?.paymenyMeansCurrency ||
                  bussinessPartner?.DefaultCurrency ||
                  form?.currency ||
                  "AUD") !== "AUD" ? (
                  <input
                    type="number"
                    value={parseFloat(
                      form?.paymenyMeansExchangeRate || 0
                    ).toFixed(2)}
                    // onChange={({ target }: any) =>
                    //   setForm({
                    //     ...form,
                    //     paymenyMeansExchangeRate: target.value,
                    //   })
                    // }
                    className="form-control h-[25px] w-full"
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            <div className="flex md:block items-center px-3 mt-3">
              {formLabel("Currency")}
              <div className="flex space-x-4 w-[60%] lg:w-[100%]">
                {bussinessPartner?.BPCurrenciesCollection?.length > 0 ? (
                  <Select
                    readOnly={Edit ? true : false}
                    className="form-control h-[25px]"
                    onChange={(e: any) => {
                      const rate =
                        currency?.find(
                          ({ Currency }: any) => Currency === e.target.value
                        )?.Rate || 0;

                      setForm({
                        ...form,
                        paymenyMeansCurrency: e.target.value,
                        paymenyMeansExchangeRate: rate,
                      });
                    }}
                    value={
                      Edit?.DocCurrency ||
                      form?.paymenyMeansCurrency ||
                      bussinessPartner?.DefaultCurrency ||
                      form?.currency
                    }
                    sx={{ border: "0px solid black", padding: 0 }}
                  >
                    {bussinessPartner?.BPCurrenciesCollection?.filter(
                      ({ Include }: any) => Include === "tYES"
                    )?.map((e: any, index: any) => (
                      <MenuItem key={index} value={e.CurrencyCode}>
                        {e.CurrencyCode}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <input
                    readOnly
                    defaultValue={
                      Edit?.DocCurrency ||
                      form?.paymenyMeansCurrency ||
                      bussinessPartner?.DefaultCurrency ||
                      form?.currency || "AUD"
                    }
                    className="form-control h-[25px] mb-4 w-[100%]"
                  />
                )}
                {(Edit?.DocCurrency ||
                  form?.paymenyMeansCurrency ||
                  bussinessPartner?.DefaultCurrency ||
                  form?.currency ||
                  "AUD") !== "AUD" ? (
                  <input
                    type="number"
                    value={parseFloat(
                      Edit?.DocRate || form?.paymenyMeansExchangeRate || 0
                    ).toFixed(2)}
                    onChange={({ target }: any) =>
                      setForm({
                        ...form,
                        paymenyMeansExchangeRate: target.value,
                      })
                    }
                    className="form-control h-[25px] w-full"
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          )}
        </section>
        <section className="col-span-1">
          <FormControl>
            <RadioGroup
              value={form?.useType || "Customer"}
              name="radio-buttons-group"
              onChange={(e: any) =>
                setForm({
                  ...form,
                  cardCode: "",
                  cardName: "",
                  localCurrency: "",
                  currency: "",
                  payTo: "",
                  payToValue: "",
                  useType: e.target.value,
                  items: [],
                  paymentMeans: null,
                })
              }
            >
              <FormControlLabel
                value="Customer"
                control={<Radio />}
                label="Customer"
                disabled={Edit || false}
              />
              <FormControlLabel
                value="Supplier"
                control={<Radio />}
                label="Supplier"
                disabled={Edit || false}
              />
              <FormControlLabel
                value="Account"
                control={<Radio />}
                label="Account"
                disabled={Edit || false}
              />
            </RadioGroup>
          </FormControl>
        </section>
        <section className="col-span-1">
          <div className="flex md:block items-center px-3 mt-3">
            {formLabel("No.")}
            <div className="flex space-x-4 w-[60%] lg:w-[100%]">
              <Select
                readOnly={Edit ? true : false}
                className="form-control h-[25px] w-[60%] lg:w-[100%]"
                onChange={(e: any) => {
                  const docNum = documentNumber?.find(
                    (d: any) => d.Series === e.target.value
                  );

                  setForm({
                    ...form,
                    series_type: e.target.value,
                    series_value: docNum?.NextNumber,
                  });
                }}
                value={form?.series_type || null}
                sx={{ border: "0px solid black", padding: 0 }}
              >
                {documentNumber?.map((e: any, index: any) => (
                  <MenuItem key={index} value={e.Series}>
                    {e.Name}
                  </MenuItem>
                ))}
              </Select>
              {inputFormControl({
                className: "h-[25px] w-full",
                value:
                  form?.series_value ||
                  documentNumber?.find((e: any) => e.Name === "Primary")
                    ?.NextNumber ||
                  "",
                onChange: (e: any) =>
                  setForm({
                    ...form,
                    series_value: e.target.value,
                  }),
                readOnly: Edit
                  ? true
                  : form?.series_type === "Manual"
                  ? false
                  : true,
              })}
            </div>
          </div>
          <div className="flex md:block items-center px-3 mt-3">
            {formLabel("Posting Date")}
            {inputFormControl({
              className: "h-[25px] w-[60%] lg:w-[100%]",
              inputType: "date",
              value: form?.posDate || "",
              onChange: (e) => setForm({ ...form, posDate: e.target.value }),
            })}
          </div>
          <div className="flex md:block items-center px-3 mt-3">
            {formLabel("Due Date")}
            {inputFormControl({
              className: "h-[25px] w-[60%] lg:w-[100%]",
              inputType: "date",
              value: form?.validUntil || "",
              onChange: (e) =>
                setForm({
                  ...form,
                  validUntil: e.target.value,
                }),
            })}
          </div>
          <div className="flex md:block items-center px-3 mt-3">
            {formLabel("Document Date")}
            {inputFormControl({
              inputType: "Date",
              className: "h-[25px] w-[60%] lg:w-[100%]",
              value: form?.documentDate || "",
              onChange: (e) =>
                setForm({
                  ...form,
                  documentDate: e.target.value,
                }),
            })}
          </div>
          <div className="flex md:block items-center px-3 mt-3">
            {formLabel("Reference")}
            {inputFormControl({
              className: "h-[25px] w-[60%] lg:w-[100%]",
              value: form?.reference,
              onChange: (e: any) =>
                setForm({ ...form, reference: e.target.value }),
            })}
          </div>
          {/* <div className="flex md:block items-center px-3 mt-3">
            {formLabel("Transaction No.")}
            {inputFormControl({
              className: "h-[25px] w-[60%] lg:w-[100%]",
              readOnly: true,
            })}
          </div> */}
        </section>
      </div>
    </>
  );
}

const formLabel = (label: string) => (
  <label className="block mb-2 text-sm font-medium text-gray-400 dark:text-white w-[30%] text-left">
    {label}
  </label>
);

type inputFormControlProps = {
  name?: string;
  inputType?: string;
  className?: string;
  readOnly?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (e: any) => void;
};

const inputFormControl = ({
  name,
  inputType,
  className,
  readOnly = false,
  value,
  onChange,
  defaultValue,
}: inputFormControlProps) => {
  return (
    <input
      name={name}
      type={inputType}
      readOnly={readOnly}
      value={value}
      onChange={onChange}
      defaultValue={defaultValue}
      className={`form-control ${className}`}
    />
  );
};

type autoCompleteProps = {
  value?: string;
  data?: [];
  onChange?: any;
  disabled?: any;
  loading?: boolean;
};

const autoComplete = ({
  value,
  data = [],
  onChange = null,
  disabled = false,
  loading = false,
}: autoCompleteProps) => {
  return (
    <Autocomplete
      value={value}
      disabled={disabled}
      loading={loading}
      className="w-[60%] lg:w-[100%]"
      sx={{
        display: "inline-block",
        "& input": {
          bgcolor: "background.paper",
          borderRadius: 1,
          color: (theme) =>
            theme.palette.getContrastText(theme.palette.background.paper),
        },
      }}
      options={data}
      onChange={(event: any, newValue: string | null) => {
        return onChange === null ? "" : onChange(newValue);
      }}
      renderInput={(params) => (
        <div ref={params.InputProps.ref}>
          <input type="text" {...params.inputProps} />
        </div>
      )}
    />
  );
};
