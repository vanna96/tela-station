import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { BsDot } from "react-icons/bs";
import { useQuery } from "react-query";
import WareBinLocationRepository from "@/services/whBinLocationRepository";

interface WareBinLocation {
  ItemCode: string;
  ItemName: string;
  WhsCode: string;
  OnHandQty: number;
  BinCode: string;
  BinID: number;
  id__: number;
}

export default function BinLocationToAsEntry(props: {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  Warehouse?: any;
  disabled?: boolean;
  WareBinLocation?: WareBinLocation[];
}) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["ware-BinLocation"],
    queryFn: () => new WareBinLocationRepository().get(),
    staleTime: Infinity,
  });

  const filteredWarehouses = data?.filter(
    (warebin: any) => warebin.WhsCode === props?.Warehouse
  );

  const uniqueBinCodes = new Set<string>();
  const uniqueWarehouses = filteredWarehouses?.filter((warebin: any) => {
    if (!uniqueBinCodes.has(warebin.BinCode)) {
      uniqueBinCodes.add(warebin.BinCode);
      return true;
    }
    return false;
  });
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

      const selectedBinLocation = uniqueWarehouses?.find(
        (warebin: any) => warebin.BinID === selectedValue
      );

      setSelectedValue(selectedBinLocation);
    }
  }, [props.value, uniqueWarehouses]);

  const [selectedValue, setSelectedValue] = useState(null);

  const handleAutocompleteChange = (event: any, newValue: any) => {
    setSelectedValue(newValue);

    if (props.onChange) {
      const selectedCode = newValue ? newValue.BinID : null;
      props.onChange(selectedCode);
    }
  };

  return (
    <div className="block  ">
      <label htmlFor="" className={`  text-[#656565] mt-1`}>
        {props?.label}
      </label>

      <Autocomplete
        disabled={props.disabled}
        options={uniqueWarehouses ?? data}
        autoHighlight
        value={selectedValue}
        onChange={handleAutocompleteChange}
        loading={isLoading}
        getOptionLabel={(option: WareBinLocation) => option.BinCode}
        renderOption={(props, option: WareBinLocation) => (
          <Box component="li" {...props} key={option.BinID}>
            <BsDot />
            {option.BinCode}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            className={
              props.disabled
                ? " w-full text-xs text-field bg-gray-100"
                : "w-full text-xs text-field bg-white"
            }
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
