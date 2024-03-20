import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { BsDot } from "react-icons/bs";
import { useQuery } from "react-query";
import WarehouseRepository from "@/services/warehouseRepository";

interface Warehouse {
  WarehouseCode: number;
  WarehouseName: string;
}

export default function SaleWarehouse(props: {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  Branch?: any;
  Warehouse?: Warehouse[];
  disabled?: boolean;
}) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["warehouse"],
    queryFn: () => new WarehouseRepository().get(),
  });

  let filteredWarehouses = data?.filter(
    (warehouse: any) => warehouse.BusinessPlaceID === props?.Branch
  );

  // Apply additional filter unconditionally
  filteredWarehouses = filteredWarehouses?.filter(
    (U_tl_whsclear: any) => U_tl_whsclear.U_tl_whsclear === "Y" 
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

      const selectedWarehouse = filteredWarehouses?.find(
        (warehouse: any) => warehouse.WarehouseCode === props.value
      );
      if (selectedWarehouse) {
        setSelectedValue(selectedWarehouse);
      }
    }
  }, [props.value, filteredWarehouses]);

  const [selectedValue, setSelectedValue] = useState(null);

  const handleAutocompleteChange = (event: any, newValue: any) => {
    // Update the local state
    setSelectedValue(newValue);

    if (props.onChange) {
      // Notify the parent component with the selected value
      const selectedCode = newValue ? newValue.WarehouseCode : null;
      props.onChange(selectedCode);
    }
  };

  return (
    <div className="block text-[14px] xl:text-[13px] ">
      <label
        htmlFor=""
        className={` text-[14px] xl:text-[13px] text-[#656565] mt-1`}
      >
        {props?.label}
      </label>

      <Autocomplete
        options={filteredWarehouses ?? data}
        autoHighlight
        disabled={props.disabled}
        value={selectedValue}
        onChange={handleAutocompleteChange}
        loading={isLoading}
        getOptionLabel={(option: Warehouse) => option.WarehouseName}
        renderOption={(props, option: Warehouse) => (
          <Box component="li" {...props}>
            <BsDot />
            {option.WarehouseName}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            className={`w-full ${props.disabled ? "bg-gray-100 text-xs text-field" : "text-xs text-field bg-white"}`}
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
            disabled={props.disabled}
          />
        )}
      />
    </div>
  );
}
