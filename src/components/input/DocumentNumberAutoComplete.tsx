import React, { useState, useEffect } from "react";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { BsDot } from "react-icons/bs";
import { useQuery } from "react-query";
import SalePersonRepository from "@/services/actions/salePersonRepository";
import PositionRepository from "@/services/actions/positionRepository";

interface Type {
  U_DocNum: number;
  U_Terminal:string;
}

export default function DocumentNumberAutoComplete(props: {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  name?: any;
  disabled?: any;
  document:any
}) {
const [data, setData]=useState<any>([])

  useEffect(() => {
    setData(props?.document);
    // Ensure that the selected value is set when the component is mounted
    if (props.value) {
      const selectedPosition = data?.find(
        (e: Type) => e.U_DocNum === props.value
      );
      if (selectedPosition) {
        setSelectedValue(selectedPosition);
      }
    }
  }, [props.value, data, props?.document]);

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
        getOptionLabel={(option: Type) => option.U_DocNum.toString()}
        renderOption={(props, option: Type) => (
          <Box component="li" {...props}>
            {option.U_DocNum}
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
