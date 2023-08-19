import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FormControl } from "@mui/material";
import { OutlinedInput, TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from '@mui/material/CircularProgress';
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import shortid from 'shortid'
import { ThemeContext } from "@/contexts";

interface MUISelectProps<T = unknown> {
  error?: boolean,
  items: any[],
  // bPAddresses: any[],
  disabled?: boolean,
  loading?: boolean,
  value?: any,
  defaultValue?: any,
  className?: string,
  aliasvalue?: string | undefined,
  aliaslabel?: string | undefined,
  onChange?: SelectInputProps<T>['onChange'],
  name?: string | undefined,
  label?: string;
}



const MUISelect: React.FC<MUISelectProps> = ({ error, items, disabled, loading, value, defaultValue, className, aliasvalue, aliaslabel, onChange, name, label }: MUISelectProps) => {

  // const { theme } = React.useContext(ThemeContext);

  if (loading)
    return <div className="text-field">
      <OutlinedInput
        fullWidth
        className={`w-full text-field pr-2 ${disabled ? 'bg-gray-100' : ''}`}
        endAdornment={
          <InputAdornment position="start">
            <CircularProgress
              size={14}
              thickness={4}
              value={100}
            />
          </InputAdornment>
        }
      />
    </div>;

  return (
    <FormControl error={error} fullWidth>
      <div className="w-full mui-select bg-inherit flex flex-col gap-2">
        {label && <label htmlFor={label} className={`text-inherit text-[14px] xl:text-[13px] ${error ? 'text-red-700' : 'text-[#656565]'} `}>
          {label}
        </label>}
        <Select
          value={value === -1 ? '-1' : (value ?? '')}
          defaultValue={defaultValue ?? ''}
          className={`w-full ${className} ${disabled ? 'bg-gray-100' : ''} `}
          name={name}
          onChange={onChange}
          disabled={disabled}
          // MenuProps={{
          //   MenuListProps: {
          //     style: {
          //       backgroundColor: theme === 'light' ? '' : '#475569',
          //       color: theme === 'light' ? '' : '#fff',
          //     }
          //   }
          // }}
        >
          {items?.length > 0 ? (
            items?.map((e) => {
              return (
                <MenuItem
                  key={shortid.generate()}
                  value={e?.value ?? e?.[aliasvalue ?? '']}
                >
                  {e?.label ?? e?.[aliaslabel ?? '']}
                </MenuItem>
              );
            })
          ) : (
            <MenuItem value="">No Item</MenuItem>
          )}
        </Select>
      </div>
    </FormControl >
  );
}

export default MUISelect;
