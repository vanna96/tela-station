import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { BsDot } from "react-icons/bs";
import { useQuery } from "react-query";

export default function BranchAutoComplete(props: {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  BPdata?: any;
  disabled?: any;
  name?: any;
}) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["branchBPL"],
    queryFn: () => new BranchBPLRepository().get(),
  });

  const uniqueBPLIDs = [...new Set(props?.BPdata?.map((e: any) => e.BPLID))];

  const filteredBranch = data?.filter((e: any) =>
    uniqueBPLIDs.includes(e.BPLID)
  );

  useEffect(() => {
    if (props.value) {
      let selectedValue: number | null = null;

      if (typeof props.value === "string") {
        const numericValue = parseFloat(props.value);

        if (!isNaN(numericValue)) {
          selectedValue = numericValue;
        }
      } else {
        selectedValue = props.value;
      }
      const selectedBranch = filteredBranch?.find(
        (branch: any) => branch?.BPLID === props.value
      );
      if (selectedBranch) {
        setSelectedValue(selectedBranch);
      }
    }
  }, [props.value, filteredBranch]);

  const [selectedValue, setSelectedValue] = useState(null);

  const handleAutocompleteChange = (event: any, newValue: any) => {
    // Update the local state
    setSelectedValue(newValue);

    if (props.onChange) {
      // Notify the parent component with the selected value
      const selectedId = newValue ? newValue.BPLID : null;
      props.onChange(selectedId);
    }
  };
  const disabled = props.disabled;

  return (
    <div className="block text-[14px] xl:text-[13px] ">
      <label
        htmlFor=""
        className={`text-[14px] xl:text-[13px] text-[#656565] mt-1`}
      >
        {props?.label}
      </label>

      <Autocomplete
        disabled={disabled}
        options={props.BPdata ? filteredBranch : data}
        autoHighlight
        value={selectedValue}
        onChange={handleAutocompleteChange}
        loading={isLoading}
        getOptionLabel={(option: any) => option.BPLName}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <BsDot />
            {option.BPLName}
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
