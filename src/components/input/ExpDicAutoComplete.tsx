import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import { BsDot } from "react-icons/bs";
import { useQuery } from "react-query";
import ExpdicRepository from "@/services/actions/ExpDicRepository";
import request from "@/utilies/request";


export default function ExpDicAutoComplete(props: {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  BPdata?: any;
  disabled?: any;
  name?: any;
}) {
  const [selectedValue, setSelectedValue] = useState(null);

  const { data, isLoading }: any = useQuery({ queryKey: ["expdic"], queryFn: () => request('GET', '/TL_ExpDic?$select=Code, Name') });

  const getList = useMemo(() => {
    if (!data?.data?.value) return;

    return data?.data?.value ?? []
  }, [data])


  useEffect(() => {
    if (!props.value) return;

    const selectedBranch = getList?.find((expense: any) => expense?.Code === props.value);
    if (selectedBranch) setSelectedValue(selectedBranch);

  }, [props.value, getList]);

  // Use local state to store the selected value
  const handleAutocompleteChange = (event: any, newValue: any) => {
    // Update the local state
    setSelectedValue(newValue);

    if (props.onChange) {
      // Notify the parent component with the selected value
      props.onChange(newValue);
    }
  };




  const { disabled } = props;

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
        options={getList}
        autoHighlight
        value={selectedValue}
        onChange={handleAutocompleteChange}
        loading={isLoading}
        getOptionLabel={(option: any) => option?.Code}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <BsDot />
            {option?.Code} - {option?.Name}
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
