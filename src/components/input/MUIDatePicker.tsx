import React, { useMemo } from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme, OutlinedInputProps } from "@mui/material";
import dayjs from "dayjs";
import { ThemeContext } from "@/contexts";

interface MUIDatePickerProps extends Omit<OutlinedInputProps, "onChange"> {
  // error?: boolean,
  value?: any | null;
  // name?: string | undefined,
  onChange: (value: string | null) => void;
  // disabled?: boolean,
  addOnDay?: number;
  label?: string;
  helpertext?: string;
}

const MUIDatePicker: React.FC<MUIDatePickerProps> = (
  props: MUIDatePickerProps
) => {
  const { error, value, name, onChange, disabled, addOnDay, label } = props;
  const { theme } = React.useContext(ThemeContext);

  const dateVal = React.useMemo(() => {
    if (value === null || value === '' || value === undefined) return '';

    if (addOnDay) {
      const today = dayjs();
      return today.add(addOnDay, "day");
    }

    return value;
  }, [value, addOnDay]);

  const onChangeInput = (event: any) => {
    if (!onChange) return;

    if (dayjs(props.value).format("DD-MM-YYYY") === event.target.value) return;

    if (event.target.value === "") {
      props?.onChange('');
      return;
    }

    onChange(dayjs(event.target.value).format("DD-MM-YYYY"));
  };

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={props.label}
        className={` text-[14px] xl:text-[13px] ${props.error ? "text-red-500" : "text-[#656565]"
          } `}
      >
        {props.label}{" "}
        {props.required && <span className="text-red-500 font-bold">*</span>}
      </label>
      <div className={`date-picker ${error ? "date-picker-error" : ""} `}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            PopperProps={{
              style: {
                color: theme === "light" ? "" : "#FFFFFF",
              },
            }}
            inputFormat="DD-MM-YYYY"
            value={dateVal}
            disabled={disabled}
            className={`${disabled ? "bg-gray-100" : ""}`}
            onChange={(e: any, inputVal: any) =>
              onChange(dayjs(e).format("YYYY-MM-DD"))
            }
            renderInput={(params) => (
              <TextField
                inputProps={{ ...props.inputProps }}
                sx={{
                  "& .MuiFormhelpertext-root": {
                    color: "#ef4444",
                    marginLeft: "8px",
                  },
                  ...props.sx,
                }}
                {...params}
                name={name}
                autoComplete="off"
                onBlur={onChangeInput}
                error={(!dayjs(value).isValid()) || props.error}
                helperText={
                  props.helpertext ??
                  (!dayjs(value).isValid() && (value || value !== "")
                    ? "invalid date format"
                    : "")
                }
              />
            )}
          />
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default MUIDatePicker;
