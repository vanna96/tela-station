import { Autocomplete, MenuItem, Select } from "@mui/material";
import { useContext } from "react";
import { FormOrderContext } from "../context/FormOrderContext";

export default function General() {
  let { form, setForm, customers, documentNumber, Edit }: any =
    useContext(FormOrderContext);

  const data = customers?.value?.map((option: any) => {
    return {
      value: option.CardCode,
      name: option.CardName,
      currency: option.DefaultCurrency,
      label: `${option.CardCode} - ${option.CardName}`,
    };
  });

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
      <div className="grid grid-cols-2 lg:grid-cols-1">
        <section>
          <div className="flex md:block items-center px-3 mt-3 relative">
            {formLabel("Customer")}
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
              disabled: Edit ? true : false,
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
          <div className="flex md:block items-center px-3 mt-3">
            {formLabel("Contact Person")}
            <Select
              className="form-control h-[25px] w-[60%] lg:w-[100%]"
              onChange={(e) => {
                setForm({
                  ...form,
                  internalCode: e.target.value,
                });
              }}
              value={form?.internalCode || 0}
              sx={{ border: "0px solid black", padding: 0 }}
            >
              {customers?.value
                ?.find((e: any) => e.CardCode === form?.cardCode)
                ?.ContactEmployees?.map((e: any, index: number) => {
                  return (
                    <MenuItem key={index} value={e.InternalCode}>
                      {e.Name}
                    </MenuItem>
                  );
                })}
            </Select>
          </div>
          <div className="flex md:block items-center px-3 mt-3">
            {formLabel("Customer Ref.No")}
            {inputFormControl({
              className: "h-[25px] w-[60%] lg:w-[100%]",
              value: form?.customerRefNo || "",
              onChange: (e) =>
                setForm({
                  ...form,
                  customerRefNo: e.target.value,
                }),
            })}
          </div>
          <div className="flex md:block items-center px-3 mt-3">
            <div className="flex flex-row space-x-4 w-[90%] lg:w-[100%]">
              <Select
                readOnly={form?.cardCode ? false : true}
                className="form-control h-[25px] w-[70%]"
                onChange={(e) =>
                  setForm({
                    ...form,
                    localCurrency: e.target.value,
                  })
                }
                value={form?.localCurrency || "L"}
                sx={{ border: "0px solid black", padding: 0 }}
              >
                <MenuItem value="L">Local Currency</MenuItem>
                <MenuItem value="S">System Currency</MenuItem>
                <MenuItem value="B">BP Currency</MenuItem>
              </Select>
              {inputFormControl({
                className: "h-[25px] w-[40%]",
                value: form?.localCurrency === "B" ? form?.currency : "",
                readOnly: true,
              })}
            </div>
          </div>
        </section>
        <section>
          <div className="flex md:block items-center px-3 mt-3">
            {formLabel("No.")}
            <div className="flex space-x-4 w-[60%] lg:w-[100%]">
              <Select
                readOnly={Edit ? true : false}
                className="form-control h-[25px] w-[60%] lg:w-[100%]"
                onChange={(e: any) => {
                  const docNum = documentNumber?.find((d: any) => d.Name === e);
                  setForm({
                    ...form,
                    series_type: e,
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
                value: form?.series_value || "",
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
            {formLabel("Status")}
            {inputFormControl({
              className: "h-[25px] w-[60%] lg:w-[100%]",
              value: form?.status,
              readOnly: true,
            })}
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
            {formLabel("Valid Until")}
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
