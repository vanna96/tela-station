import React, { useState, useEffect, forwardRef, useMemo } from "react";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { useQuery } from "react-query";
import request, { url } from "@/utilies/request";

interface Type {
  Code: string;
  Name: string;
}

const ExpenseCodeAutoComplete = forwardRef<
  HTMLInputElement,
  {
    label?: any;
    value?: any;
    onChange?: (value: any) => void;
    name?: any;
    disabled?: any;
    excludes?: any[]
  }
>((props, ref) => {
  const expenseQuery = useQuery<Type[], Error>({
    queryKey: ["TL_ExpDic"],
    queryFn: async () => {
      const response: any = await request("GET", `${url}/TL_ExpDic`)
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
  });


  const data = useMemo(() => {
    if (!expenseQuery?.data) return [];

    if (props.excludes && props.excludes.length > 0) {
      const state = expenseQuery.data?.filter((e) => !props.excludes?.includes(e.Code))
      const element = expenseQuery.data?.find((e) => e?.Code === props?.value)
      return !element ? state : [element, ...state] as Type[];
    }

    return expenseQuery.data;
  }, [expenseQuery.data])


  useEffect(() => {
    // Ensure that the selected value is set when the component is mounted
    if (props.value && data) {
      const selected = data?.find((e: Type) => e.Code === props.value);
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
        options={data ?? []}
        autoHighlight
        value={selectedValue}
        onChange={handleAutocompleteChange}
        loading={expenseQuery.isLoading}
        getOptionLabel={(option: Type) => option?.Code + " - " + option?.Name}
        renderOption={(props, option: Type) => (
          <Box component="li" {...props}>
            {option?.Code + " - " + option?.Name}
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
                  {expenseQuery.isLoading ? (
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

export default ExpenseCodeAutoComplete;
