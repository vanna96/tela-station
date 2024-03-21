import React, { useState, useEffect, forwardRef, useMemo } from "react";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { useGetWhsTerminalAssignHook } from "@/hook/useGetWhsTerminalAssignHook";

interface WarehouseProps {
  WarehouseCode: string;
  WarehouseName: string;
}

export type WarehouseAutoCompleteProp = {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  name?: any;
  disabled?: any;
  branchId: number | undefined
}

const WarehouseAutoComplete = (props: WarehouseAutoCompleteProp) => {
  const { data, isLoading } = useGetWhsTerminalAssignHook(false)


  const warehoueses = useMemo(() => {
    return data?.filter((e: any) => e.U_tl_whsclear === 'N' && e.U_tl_git_whs === 'N')
  }, [props.branchId, data])


  useEffect(() => {
    if (props.value && warehoueses) {
      const selected = warehoueses.find((e: WarehouseProps) => e.WarehouseCode === props.value);
      if (selected) {
        setSelectedValue(selected);
      }
    }
  }, [props.value, warehoueses]);

  // Use local state to store the selected value
  const [selectedValue, setSelectedValue] = useState<WarehouseProps | null>(null);

  const handleAutocompleteChange = (event: any, newValue: any) => {
    // Update the local state
    setSelectedValue(newValue);

    if (props.onChange) {
      // Notify the parent component with the selected value
      props.onChange(newValue);
    }
  };
  const disabled = props.disabled;

  return (
    <div className="block text-[14px] xl:text-[13px]">
      <label
        htmlFor={props.name}
        className={`text-[14px] xl:text-[13px] text-[#656565] mt-1`}
      >
        {props?.label}
      </label>
      <Autocomplete
        disabled={disabled}
        options={warehoueses ?? []}
        autoHighlight
        value={selectedValue}
        onChange={handleAutocompleteChange}
        loading={isLoading}
        getOptionLabel={(option: WarehouseProps) =>
          option.WarehouseCode + " - " + option.WarehouseName
        }
        renderOption={(props, option: WarehouseProps) => (
          <Box component="li" {...props}>
            {option.WarehouseCode + " - " + option.WarehouseName}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            id={props.name}
            className={`w-full text-field text-xs ${disabled ? "bg-gray-100" : ""
              }`}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </div>
  );
}

export default WarehouseAutoComplete;
