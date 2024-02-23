import React, { FC, useContext } from "react";
import { FormControl, OutlinedInput, OutlinedInputProps } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { FiCopy } from "react-icons/fi";

export interface MUIRightTextFieldProps extends OutlinedInputProps {
  label?: string;
  readonly?: boolean;
  endIcon?: React.ReactNode;
  helpertext?: string;
  onClick?: () => void;
}

const MUIRightTextField: FC<MUIRightTextFieldProps> = (props) => {
  const onPress = () => {
    if (props.endAdornment || props.disabled) return;

    if (props.onClick) {
      props.onClick();
    }
  };

  return (
    <FormControl fullWidth error={props.error}>
      <div className="flex flex-col gap-1 text-sm">
        <label
          htmlFor={props.label}
          className={` text-[14px] xl:text-[13px] ${
            props.error ? "text-red-500" : "text-[#656565]"
          } `}
        >
          {props.label}{" "}
          {props.required && <span className="text-red-500 font-bold">*</span>}
        </label>
        <div className="text-field">
          <OutlinedInput
            {...props}
            onKeyDown={props.onKeyDown}
            value={props.value === null ? undefined : props.value}
            label={undefined}
            onClick={onPress}
            autoComplete={"off"}
            fullWidth
            inputProps={{
              // ...props.inputProps,
              style: {
                textAlign: "right",
                // ...props.inputProps?.style,
              },
            }}
            className={`w-full text-xs text-field ${
              props.disabled ? "bg-gray-100" : ""
            } ${props.className ?? ""}`}
            startAdornment={
              props.startAdornment ? (
                <span
                  className={`text-[14px] px-2 pr-4 mr-3   overflow-hidden border-r `}
                >
                  {props.startAdornment}
                </span>
              ) : null
            }
          />
        </div>

        <span className="text-xs px-2 text-red-500 capitalize">
          {props.helpertext}
        </span>
      </div>
    </FormControl>
  );
};

export default MUIRightTextField;
