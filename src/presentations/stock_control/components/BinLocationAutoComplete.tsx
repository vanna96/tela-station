import React, { useState, useEffect, forwardRef, useMemo } from "react";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { useQuery } from "react-query";
import request from "@/utilies/request";

interface BinProps {
  AbsEntry: number,
  BinCode: string;
  Warehouse: string;
}

type BinAllocationAutoCompleteProps = {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  name?: any;
  disabled?: any;
  warehouse: string | undefined
}

const getBinLists = async (warehouse: string | undefined) => {
  if (warehouse === '' || !warehouse) return []

  return request('GET', `BinLocations?$select=AbsEntry,Warehouse,BinCode`).then((res: any) => res?.data?.value)
}

const BinAllocationAutoComplete = forwardRef<
  HTMLInputElement, BinAllocationAutoCompleteProps
>((props, ref) => {
  const { data, isLoading } = useQuery({ queryKey: ['bin-allocation-list-' + props.warehouse], queryFn: () => getBinLists(props.warehouse) });

  const bins = useMemo(() => {
    return data?.filter((e: any) => e?.Warehouse === props.warehouse)
  }, [data, props.warehouse])


  useEffect(() => {
    const selected = bins?.find((e: BinProps) => e.AbsEntry === props.value);
    setSelectedValue(selected);
  }, [props.value, bins]);

  // Use local state to store the selected value
  const [selectedValue, setSelectedValue] = useState<BinProps | null>(null);

  const handleAutocompleteChange = (event: any, newValue: any) => {
    // Update the local state
    setSelectedValue(newValue);

    if (props.onChange) {
      // Notify the parent component with the selected value
      props.onChange(newValue);
    }
  };
  const disabled = props.disabled;


  console.log(props.value)

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
        options={bins ?? []}
        autoHighlight
        value={selectedValue}
        onChange={handleAutocompleteChange}
        loading={isLoading}
        getOptionLabel={(option: BinProps) => option.BinCode}
        renderOption={(props, option: BinProps) => (
          <Box component="li" {...props}>
            {option.BinCode}
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
            inputRef={ref}
          />
        )}
      />
    </div>
  );
});

export default BinAllocationAutoComplete;
