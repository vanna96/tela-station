
import React, { useState, useEffect } from "react";
import { Autocomplete, Box, TextField } from "@mui/material";

export default function YearsAutoComplete(props: {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  name?: any;
  disabled?: any;
}) {
  const currentYear = new Date().getFullYear();
  const startYear = 1900;

  const data: any = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => currentYear - index // Reverse the order
  );

  // Use local state to store the selected value
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    // Ensure that the selected value is set when the component is mounted
    if (props.value !== undefined && props.value !== null) {
      setSelectedValue(props.value);
    }
  }, [props.value]);

  const handleAutocompleteChange = (event: any, newValue: any) => {
    // Update the local state
    setSelectedValue(newValue);

    if (props.onChange) {
      // Notify the parent component with the selected value
      const selected = newValue ? newValue : null;
      props.onChange(selected);
    }
  };

  const disabled = props.disabled;

  return (
    <div className="block text-[14px] xl:text-[13px]">
      <label
        htmlFor=""
        className={`text-[14px] xl:text-[13px] text-[#656565] mt-1`}
      >
        {props?.label}
      </label>

      <Autocomplete
        disabled={props?.disabled}
        options={data ?? []}
        autoHighlight
        value={selectedValue}
        onChange={handleAutocompleteChange}
        getOptionLabel={(option: any) => option.toString()} // Convert to string
        renderOption={(props, option: any) => (
          <Box component="li" {...props}>
            {option}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            className={`w-full text-field text-xs ${
              disabled ? "bg-gray-100" : ""
            }`}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
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
