import React, { useState, useEffect, forwardRef } from "react";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { useQuery } from "react-query";
import request, { url } from "@/utilies/request";

interface WarehouseProps {
  WarehouseCode: string;
  WarehouseName: string;
}

const AttentionTerminalAutoComplete = forwardRef<
  HTMLInputElement,
  {
    label?: any;
    value?: any;
    onChange?: (value: any) => void;
    name?: any;
    disabled?: any;
  }
>((props, ref) => {
  const { data, isLoading } = useQuery({
    queryKey: ["ATT_WHS"],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `/Warehouses?$select=BusinessPlaceID,WarehouseName,WarehouseCode & $filter=U_tl_attn_ter eq 'Y'`
      )
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    staleTime: 0,
  });

  useEffect(() => {
    // Ensure that the selected value is set when the component is mounted
    if (props.value && data) {
      const selected = data.find((e: WarehouseProps) => e.WarehouseCode === props.value);
      if (selected) {
        setSelectedValue(selected);
      }
    }
  }, [props.value, data]);

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
        options={data ?? []}
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

export default AttentionTerminalAutoComplete;
