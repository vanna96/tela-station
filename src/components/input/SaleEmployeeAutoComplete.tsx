import React, { useState, useEffect } from "react";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { useQuery } from "react-query";
import request from "@/utilies/request";

interface Type {
  SalesEmployeeCode: number;
  SalesEmployeeName: string;
}

export default function SaleEmployeeAutoComplete(props: {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  name?: any;
  disabled?: any;
  cardCode?: any;
}) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["SalesPersons"],
    queryFn: async () => {
      const response: any = await request("GET", `/SalesPersons`)
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    // Ensure that the selected value is set when the component is mounted
    if (props.value) {
      const selected = data?.find(
        (e: Type) => e.SalesEmployeeCode === props.value
      );
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
      const selectedCode = newValue ? newValue : null;
      props.onChange(selectedCode);
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
        getOptionLabel={(option: Type) => option.SalesEmployeeName}
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
