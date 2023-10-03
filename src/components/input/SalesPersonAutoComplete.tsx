import React, { useState, useEffect } from "react";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { BsDot } from "react-icons/bs";
import { useQuery } from "react-query";
import SalePersonRepository from "@/services/actions/salePersonRepository";

interface SalePerson {
  code: number;
  name: string;
}

export default function SalePersonAutoComplete(props: {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
}) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["sale_persons"],
    queryFn: () => new SalePersonRepository().get(),
    staleTime: Infinity,
  });

  useEffect(() => {
    // Ensure that the selected value is set when the component is mounted
    if (props.value) {
      const selectedSalePerson = data?.find(
        (salePerson: SalePerson) => salePerson.code === props.value
      );
      if (selectedSalePerson) {
        setSelectedValue(selectedSalePerson);
      }
    }
  }, [props.value, data]);

  // Use local state to store the selected value
  const [selectedValue, setSelectedValue] = useState(null);

  const handleAutocompleteChange = (event:any, newValue:any) => {
    // Update the local state
    setSelectedValue(newValue);
    
    if (props.onChange) {
      // Notify the parent component with the selected value
      const selectedCode = newValue ? newValue.code : null;
      props.onChange(selectedCode);
    }
  };

  return (
    <div className="block text-[14px] xl:text-[13px]">
      <label
        htmlFor=""
        className={`text-[14px] xl:text-[13px] text-[#656565] mt-1`}
      >
        {props?.label}
      </label>

      <Autocomplete
        options={data ?? []}
        autoHighlight
        value={selectedValue}
        onChange={handleAutocompleteChange}
        loading={isLoading}
        getOptionLabel={(option: SalePerson) => option.name}
        renderOption={(props, option: SalePerson) => (
          <Box component="li" {...props}>
            <BsDot />
            {option.name}
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
