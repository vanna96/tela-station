import React from "react";
import NumberFormat, {
  NumericFormat,
  NumericFormatProps,
} from "react-number-format";
import TextField from "@mui/material/TextField";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
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
            value: values.value,
          },
        });
      }}
      thousandSeparator
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
  value: string;
  label?: string;
}

export default function FormattedInputs(props: FormattedInputsProps) {
  const { value, onChange, name , onBlur} = props;

  return (
    <div className="flex flex-col gap-1 text-sm">
      <label className="text-[#656565] text-[14px] xl:text-[13px]">
        {props.label}
      </label>

      <TextField
        value={value}
        onChange={onChange}
        name={name}
        fullWidth
        onBlur={onBlur}
        className="w-full  text-field "
        id="formatted-numberformat-input"
        InputProps={{
          inputComponent: NumberFormatCustom as any,
        }}
        variant="outlined"
      />
    </div>
  );
}
