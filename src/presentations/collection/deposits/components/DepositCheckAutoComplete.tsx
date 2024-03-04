import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import { BsDot } from "react-icons/bs";
import { useQuery } from "react-query";
import request from "@/utilies/request";
import { CheckIcon } from "lucide-react";

export default function DepositCheckAutoComplete(props: {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  BPdata?: any;
  disabled?: any;
  name?: any;
}) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["deposit_check"],
    queryFn: () => request('GET', `/sml.svc/GETDISPLAYDEPOSIT`).then((res: any) => res.data.value),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });


  // Use local state to store the selected value
  const [selectedValue, setSelectedValue] = useState({ AccountCode: 'All', AccountName: 'All' });

  const handleAutocompleteChange = (event: any, newValue: any) => {
    // Update the local state
    setSelectedValue(newValue);
    if (props.onChange) {
      // Notify the parent component with the selected value
      const selectedId = newValue ? newValue.AccountCode : null;
      props.onChange(newValue);
    }
  };

  const disabled = props.disabled;

  const lists = useMemo(() => data ?? [], [data])

  useEffect(() => {
    // Ensure that the selected value is set when the component is mounted
    if (props.value) {
      const selectedBranch = lists?.find(
        (branch: any) => branch?.AccountCode === props.value
      );
      if (selectedBranch) {
        setSelectedValue(selectedBranch);
      }
    }
  }, [props.value, lists]);


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
        options={[{ AccountCode: 'All', AccountName: 'All' }, ...lists]}
        autoHighlight
        value={selectedValue}
        onChange={handleAutocompleteChange}
        loading={isLoading}

        getOptionLabel={(option: any) => option.AccountCode}
        renderOption={(props, option) => (
          <Box component="li" {...props} >
            {/* <BsDot /> */}
            {/* {selectedValue === option.AccountCode ? <CheckIcon /> : null} */}
            {option?.AccountCode?.toLowerCase() === 'all' ? 'All' : `${option.AccountCode} - ${option.AccountName}`}

          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
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
