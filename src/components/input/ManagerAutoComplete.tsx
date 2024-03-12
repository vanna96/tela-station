import React, { useState, useEffect, forwardRef } from "react";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { useQuery } from "react-query";
import ManagerRepository from "@/services/actions/ManagerRepository";
import request, { url } from "@/utilies/request";

interface Type {
  EmployeeID: number;
  FirstName: string;
  LastName: string;
}

const ManagerAutoComplete = forwardRef<
  HTMLInputElement,
  {
    label?: string;
    value?: any;
    onChange?: (value: any) => void;
    name?: string;
    disabled?: boolean;
  }
>((props, ref) => {
  const { data, isLoading } = useQuery<Type[], Error>({
    queryKey: ["u_dv"],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/EmployeesInfo?$filter=U_tl_driver eq 'Y'`
      )
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    staleTime: Infinity,
    cacheTime: 0,
  });

  useEffect(() => {
    // Ensure that the selected value is set when the component is mounted
    if (props.value) {
      const selected = data?.find((e: Type) => e.EmployeeID === props.value);
      if (selected) {
        setSelectedValue(selected);
      }
    }
  }, [props.value, data]);

  // Use local state to store the selected value
  const [selectedValue, setSelectedValue] = useState<Type | null>(null);

  const handleAutocompleteChange = (event: any, newValue: any) => {
    // Update the local state
    setSelectedValue(newValue);

    if (props.onChange) {
      // Notify the parent component with the selected value
      const selectedCode = newValue ? newValue : null;
      props.onChange(selectedCode);
    }
  };

  const disabled = props.disabled ?? false;

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
        options={data ?? []}
        autoHighlight
        value={selectedValue}
        onChange={handleAutocompleteChange}
        loading={isLoading}
        getOptionLabel={(option: Type) =>
          `${option.FirstName} ${option.LastName}`
        }
        renderOption={(props, option: Type) => (
          <Box component="li" {...props}>
            {`${option.FirstName} ${option.LastName}`}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            id={props.name}
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
            inputRef={ref}
          />
        )}
      />
    </div>
  );
});

export default ManagerAutoComplete;
