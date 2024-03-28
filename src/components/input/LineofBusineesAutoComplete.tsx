import React, { useState, useEffect } from "react";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { useQuery } from "react-query";
import DepartmentRepository from "@/services/actions/departmentRepository";
import CurrencyRepository from "@/services/actions/currencyRepository";
import LineofBusinessRepository from "@/services/actions/lineofBusinessRepository";

interface Type {
  FactorCode: number;
  FactorDescription: string;
}

export default function LineofBusinessAutoComplete(props: {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  name?: any;
  disabled?: any;
}) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["lineofbusiness"],
    queryFn: () => new LineofBusinessRepository().get(),
    staleTime: Infinity,
  });

  useEffect(() => {
    // Ensure that the selected value is set when the component is mounted
    if (props.value) {
      const selected = data?.find((e: Type) => e.FactorDescription === props.value);
      if (selected) {
        setSelectedValue(selected);
      }
    }
  }, [props.value, data]);

  // Use local state to store the selected value
  const [selectedValue, setSelectedValue] = useState(null);

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
        loading={isLoading}
        getOptionLabel={(option: Type) => option.FactorDescription}
        renderOption={(props, option: Type) => (
          <Box component="li" {...props}>
            {option.FactorDescription}
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
