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
}) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["branchBPL"],
    queryFn: () => new BranchBPLRepository().get(),
    staleTime: Infinity,
  });

  const uniqueBPLIDs = [...new Set(props?.BPdata?.map((e: any) => e.BPLID))];

  const filteredBranch = data?.filter((e: any) =>
    uniqueBPLIDs.includes(e.BPLID)
  );

  useEffect(() => {
    // Ensure that the selected value is set when the component is mounted
    if (props.value) {
      const selectedBranch = filteredBranch?.find(
        (branch:any) => branch?.BPLID === props.value
      );
      if (selectedBranch) {
        setSelectedValue(selectedBranch);
      }
    }
  }, [props.value, filteredBranch]);

  // Use local state to store the selected value
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

  return (
    <div className="block text-[14px] xl:text-[13px] ">
      <label
        htmlFor=""
        className={`text-[14px] xl:text-[13px] text-[#656565] mt-1`}
      >
        {props?.label}
      </label>

      <Autocomplete
        options={filteredBranch ?? data}
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
            className="w-full text-xs text-field bg-white"
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
