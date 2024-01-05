import React, { useState, useEffect } from "react";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { BsDot } from "react-icons/bs";
import { useQuery } from "react-query";
import SalePersonRepository from "@/services/actions/salePersonRepository";
import PumpAttendantRepository from "@/services/actions/pumpAttendantRepository";

interface SalePerson {
  Code: string;
  U_tl_lname: string;
  U_tl_fname: string;
}

export default function PumpAttendantAutoComplete(props: {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  name?: any;
  disabled?: any;
}) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["pump_attendant"],
    queryFn: () => new PumpAttendantRepository().get(),
 
  });
  useEffect(() => {
    // Ensure that the selected value is set when the component is mounted
    if (props.value) {
      const selectedSalePerson = data?.find(
        (salePerson: any) => salePerson.Code === props.value
      );
      if (selectedSalePerson) {
        setSelectedValue(selectedSalePerson);
      }
    }
  }, [props.value, data]);

  // Use local state to store the selected value
  const [selectedValue, setSelectedValue] = useState(null);

  const handleAutocompleteChange = (event: any, newValue: any) => {
    // Update the local state
    setSelectedValue(newValue);

    if (props.onChange) {
      // Notify the parent component with the selected value
      const selectedCode = newValue ? newValue.Code : null;
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
        options={data ?? []}
        autoHighlight
        value={selectedValue}
        onChange={handleAutocompleteChange}
        loading={isLoading}
        getOptionLabel={(e: SalePerson) =>
          e.Code + " - " + e.U_tl_fname + " " + e.U_tl_lname
        }
        renderOption={(props, e: SalePerson) => (
          <Box component="li" {...props}>
            {e.Code + " - " + e.U_tl_fname + " " + e.U_tl_lname}
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
