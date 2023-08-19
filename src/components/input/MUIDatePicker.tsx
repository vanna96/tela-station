import React, { useMemo } from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme, OutlinedInputProps } from '@mui/material';
import dayjs from "dayjs";
import { ThemeContext } from "@/contexts";

interface MUIDatePickerProps extends Omit<OutlinedInputProps, 'onChange'> {
  // error?: boolean,
  value?: any | null,
  // name?: string | undefined,
  onChange: (value: string | null) => void,
  // disabled?: boolean,
  addOnDay?: number;
  label?: string;
  helpertext?: string;
}


const MUIDatePicker: React.FC<MUIDatePickerProps> = (props: MUIDatePickerProps) => {
  const { error, value, name, onChange, disabled, addOnDay, label } = props;
  const { theme } = React.useContext(ThemeContext);

  const dateVal = React.useMemo(() => {
    if (value === null) return null;

    if (addOnDay) {
      const today = dayjs();
      return today.add(addOnDay, 'day');
    }

    return value;
  }, [value, addOnDay]);

  const theme1 = React.useMemo(() => createTheme({
    typography: {
      allVariants: {
        color: theme === 'light' ? '' : 'white'
      },
    },
    palette: {
      background: {
        paper: theme === 'light' ? '#FFFFFF' : '#475569'
      }
    },
  }), [theme]);


  const onChangeInput = (event: any) => {
    if (!onChange) return;

    if (dayjs(props.value).format('DD-MM-YYYY') === event.target.value) return;

    if (event.target.value === '') {
      props?.onChange(null);
      return;
    }
    onChange(dayjs(event.target.value).format('DD-MM-YYYY'))
  }



  return (
    <div className="flex flex-col gap-1">
      {
        label && <label htmlFor={label} className={`text-inherit text-[14px] xl:text-[13px] ${error ? 'text-red-500' : 'text-[#656565]'} `}>
          {label} {props.required ? <span className="text-red-500">*</span> : null}
        </label>
      }
      <div className={`date-picker ${error ? 'date-picker-error' : ''} `}>
        <ThemeProvider theme={theme1}>
          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DesktopDatePicker
              PopperProps={{
                style: {
                  color: theme === 'light' ? '' : '#FFFFFF',
                }
              }}
              inputFormat="DD-MM-YYYY"
              value={dateVal}
              disabled={disabled}
              className={` ${disabled ? 'bg-gray-100' : ''}`}
              onChange={(e: any, inputVal: any) => onChange(dayjs(e).format('YYYY-MM-DD'))}
              renderInput={(params) => <TextField sx={{
                '& .MuiFormhelpertext-root': {
                  color: '#ef4444',
                  marginLeft: '8px'
                },
                ...props.sx
              }} {...params} name={name} autoComplete="off" onBlur={onChangeInput} error={(!dayjs(value).isValid() && value === '') || props.error} helperText={props.helpertext ?? (!dayjs(value).isValid() && (value || value === '') ? "invalid date format" : "")} />}
            />
          </LocalizationProvider>
        </ThemeProvider>
      </div>
    </div>
  );
}

export default MUIDatePicker;