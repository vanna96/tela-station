import React from "react";
import NumberFormat, {
  NumericFormat,
  NumericFormatProps,
} from "react-number-format";
import TextField from "@mui/material/TextField";

interface CustomProps {
  onChange: (event: {
    target: { name: string; value: number | undefined };
  }) => void;
  name: string;
}

export const NumberFormatCustom = React.forwardRef<
  NumericFormatProps,
  CustomProps
>((props, ref) => {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.floatValue,
          },
        });
      }}
      thousandSeparator
      // prefix="$"
      decimalScale={2} // Set decimalScale to 2 to allow only two digits after the decimal point
      fixedDecimalScale // Ensures that the decimal point will always have two digits after it
      allowNegative={false} // Optional: To disallow negative numbers
    />
  );
});

interface FormattedInputsProps {
  onChange?: (event: { target: { name: string; value: string } }) => void;
  onBlur?: (event: { target: { name: string; value: string } }) => void;
  name: string;
  value?: string;
  defaultValue?: string;
  label?: string;
  startAdornment?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export default function FormattedInputs(props: FormattedInputsProps) {
  const {
    value,
    onChange,
    name,
    onBlur,
    startAdornment,
    defaultValue,
    readOnly,
    placeholder,
  } = props;
  const disabeld = props.disabled;

  return (
    <div className="flex flex-col gap-1 text-sm">
      <label className="text-[#656565] text-[14px] xl:text-[13px]">
        {props.label}
      </label>

      <TextField
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        fullWidth
        onBlur={onBlur}
        className={`w-full text-xs text-field pr-0 ${
          props.disabled ? "bg-gray-100" : ""
        }`}
        id="formatted-numberformat-input"
        InputProps={{
          inputComponent: NumberFormatCustom as any,
          readOnly: props.readOnly,
          startAdornment: props.startAdornment ? (
            <span
              className={`text-[14px] px-2 pr-4 mr-3   overflow-hidden border-r `}
            >
              {props.startAdornment}
            </span>
          ) : null,
        }}
        variant="outlined"
      />
    </div>
  );
}
