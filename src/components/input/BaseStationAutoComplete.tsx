import React, { useState, useEffect } from "react";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { BsDot } from "react-icons/bs";
import { useQuery } from "react-query";
import SalePersonRepository from "@/services/actions/salePersonRepository";
import PositionRepository from "@/services/actions/positionRepository";
import DepartmentRepository from "@/services/actions/departmentRepository";
import WarehouseRepository from "@/services/warehouseRepository";

interface Type {
  WarehouseCode: string;
  WarehouseName: string;
}

export default function BaseStationAutoComplete(props: {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  name?: any;
  disabled?: any;
}) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["warehouse"],
    queryFn: () => new WarehouseRepository().get(),
    staleTime: Infinity,
  });

  useEffect(() => {
    // Ensure that the selected value is set when the component is mounted
    if (props.value) {
      const selected = data?.find((e: Type) => e.WarehouseCode === props.value);
      if (selected) {
        setSelectedValue(selected);
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
      const selected = newValue ? newValue?.WarehouseCode : null;
      props.onChange(selected);
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
        loading={isLoading}
        getOptionLabel={(option: Type) => option.WarehouseCode}
        renderOption={(props, option: Type) => (
          <Box component="li" {...props}>
            {option.WarehouseCode}
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
