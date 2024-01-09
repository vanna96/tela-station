import { Autocomplete, MenuItem, Select } from "@mui/material";
import { useContext, useState } from "react";
import { GeneralContact } from "../context/GeneralFormContext";
import { ModalBusinessPartner } from "./ModalBusinessPartner";

export default function General() {
  let { Edit, customers, formGeneral, setFormGeneral, documentNumber }: any =
    useContext(GeneralContact);

  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => setOpenModal(false);
  const handleOpenModal = () => setOpenModal(true);

  const data = customers?.value?.map((option: any) => option.CardCode);
  const handleSetCustomer = (CardCode: any) => {
    const customer = customers?.value?.find(
      (e: any) => e.CardCode === CardCode
    );

    setFormGeneral({
      ...formGeneral,
      contactPerson: "",
      CardCode: customer?.CardCode,
      CardName: customer?.CardName,
      Currency: customer?.DefaultCurrency,
      ContactEmployees: customer?.ContactEmployees,
      PayTermsGrpCode: customer?.PayTermsGrpCode,
      PeymentMethodCode: customer?.PeymentMethodCode,
      FederalTaxID: customer?.FederalTaxID,
      Indicator: customer?.Indicator,
      PriceListNum: customer?.PriceListNum,
      BPPaymentMethods: customer?.BPPaymentMethods,
      localCurrency: "B",
    });
  };

  if (documentNumber || [].length > 0) {
    documentNumber = [
      ...documentNumber,
      {
        Name: "Manual",
      },
    ];
  }

  return (
    <>
      <ModalBusinessPartner
        openModal={openModal}
        handleClose={handleClose}
        customers={customers}
        setCustomer={handleSetCustomer}
      />
      <div className="grid grid-cols-2 lg:grid-cols-1">
        <section>
          <div className="flex md:block items-center px-3 mt-3 relative">
            {formLabel("Customer")}
            {autoComplete({
              value: formGeneral?.CardCode || null,
              data,
              onChange: handleSetCustomer,
              disabled: Edit ? true : false,
            })}
            <div className="absolute right-[11.5%] lg:right-[2.5%] md:right-[3%] md:top-[55%]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                onClick={handleOpenModal}
                className="w-5 text-blue-400 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                />
              </svg>
            </div>
          </div>
          <div className="flex md:block items-center px-3 mt-3">
            {formLabel("Name")}
            {inputFormControl({
              name: "Name",
              className: "h-[25px] w-[60%] lg:w-[100%]",
              value: formGeneral?.CardName || "",
              readOnly: true,
            })}
          </div>
          <div className="flex md:block items-center px-3 mt-3">
            {formLabel("Contact Person")}
            <Select
              className="form-control h-[25px] w-[60%] lg:w-[100%]"
              onChange={(e) => {
                setFormGeneral({
                  ...formGeneral,
                  InternalCode: e.target.value,
                });
              }}
              value={formGeneral?.InternalCode || 0}
              sx={{ border: "0px solid black", padding: 0 }}
            >
              {customers?.value
                ?.find((e: any) => e.CardCode === formGeneral?.CardCode)
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
              value: formGeneral?.customerRefNo || "",
              onChange: (e) =>
                setFormGeneral({
                  ...formGeneral,
                  customerRefNo: e.target.value,
                }),
            })}
          </div>
          <div className="flex md:block items-center px-3 mt-3">
            <div className="flex flex-row space-x-4 w-[90%] lg:w-[100%]">
              <Select
                readOnly={formGeneral?.CardCode ? false : true}
                label=""
                className="form-control h-[25px] w-[70%]"
                onChange={(e) =>
                  setFormGeneral({
                    ...formGeneral,
                    localCurrency: e.target.value,
                  })
                }
                value={formGeneral?.localCurrency || "L"}
                sx={{ border: "0px solid black", padding: 0 }}
              >
                <MenuItem value="L">Local Currency</MenuItem>
                <MenuItem value="S">System Currency</MenuItem>
                <MenuItem value="B">BP Currency</MenuItem>
              </Select>
              {inputFormControl({
                name: "Currency Type",
                className: "h-[25px] w-[40%]",
                value:
                  formGeneral?.localCurrency === "B"
                    ? formGeneral?.Currency
                    : "",
                readOnly: true,
              })}
            </div>
          </div>
        </section>
        <section>
          <div className="flex md:block items-center px-3 mt-3">
            {formLabel("No.")}
            <div className="flex space-x-4 w-[60%] lg:w-[100%]">
              {autoComplete({
                value: formGeneral?.series_type || null,
                data: documentNumber?.map((e: any) => e.Name) || [],
                onChange: (e: any) => {
                  const docNum = documentNumber?.find((d: any) => d.Name === e);
                  setFormGeneral({
                    ...formGeneral,
                    series_type: e,
                    series_value: docNum?.NextNumber,
                  });
                },
              })}
              {inputFormControl({
                className: "h-[25px] w-full",
                value: formGeneral?.series_value || "",
                onChange: (e: any) =>
                  setFormGeneral({
                    ...formGeneral,
                    series_value: e.target.value,
                  }),
                readOnly: formGeneral?.series_type === "Manual" ? false : true,
              })}
            </div>
          </div>
          <div className="flex md:block items-center px-3 mt-3">
            {formLabel("Status")}
            {inputFormControl({
              className: "h-[25px] w-[60%] lg:w-[100%]",
              value: formGeneral?.status,
              readOnly: true,
            })}
          </div>
          <div className="flex md:block items-center px-3 mt-3">
            {formLabel("Posting Date")}
            {inputFormControl({
              className: "h-[25px] w-[60%] lg:w-[100%]",
              inputType: "date",
              value: formGeneral?.posDate || "",
              onChange: (e) =>
                setFormGeneral({ ...formGeneral, posDate: e.target.value }),
            })}
          </div>
          <div className="flex md:block items-center px-3 mt-3">
            {formLabel("Valid Until")}
            {inputFormControl({
              className: "h-[25px] w-[60%] lg:w-[100%]",
              inputType: "date",
              value: formGeneral?.validUntil || "",
              onChange: (e) =>
                setFormGeneral({
                  ...formGeneral,
                  validUntil: e.target.value,
                }),
            })}
          </div>
          <div className="flex md:block items-center px-3 mt-3">
            {formLabel("Document Date")}
            {inputFormControl({
              inputType: "Date",
              className: "h-[25px] w-[60%] lg:w-[100%]",
              value: formGeneral?.documentDate || "",
              onChange: (e) =>
                setFormGeneral({
                  ...formGeneral,
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
};

const autoComplete = ({
  value,
  data = [],
  onChange = null,
  disabled = false,
}: autoCompleteProps) => {
  return (
    <Autocomplete
      autoSelect={true}
      value={value}
      disabled={disabled}
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
      id="custom-input-demo"
      options={data}
      onChange={(event: any, newValue: string | null) =>
        onChange === null ? "" : onChange(newValue)
      }
      renderInput={(params) => (
        <div ref={params.InputProps.ref}>
          <input type="text" {...params.inputProps} />
        </div>
      )}
    />
  );
};
