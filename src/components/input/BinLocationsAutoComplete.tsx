import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { BsDot } from "react-icons/bs";
import { useQuery } from "react-query";
import BinlocationRepository from "@/services/actions/BinlocationRepository";

interface WareBinLocation {
  WhsCode: string;
  BinCode: string;
  AbsEntry: number;
  id__: number;
}

export default function BinLocationsAutoComplete(props: {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  Warehouse?: any;
  WareBinLocation?: WareBinLocation[];
}) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["BinLocations"],
    queryFn: () => new BinlocationRepository().get(),
  });

  const filteredWarehouses = data?.filter(
    (warebin: any) => warebin?.Warehouse === props?.Warehouse
  );

  useEffect(() => {
    if (props.value) {
      const Bin = filteredWarehouses?.find(
        (warebin: any) => warebin?.AbsEntry === parseInt(props?.value)
      );
      if (Bin) {
        setSelectedValue(Bin);
      }
    }
  }, [props.value, filteredWarehouses]);

  const [selectedValue, setSelectedValue] = useState(null);

  const handleAutocompleteChange = (event: any, newValue: any) => {
    setSelectedValue(newValue);

    if (props.onChange) {
      const selectedCode = newValue ? newValue?.AbsEntry : null;
      props.onChange(selectedCode);
    }
  };

  return (
    <div className="block  ">
      <label htmlFor="" className={`  text-[#656565] mt-1`}>
        {props?.label}
      </label>

      <Autocomplete
        options={filteredWarehouses ?? data}
        autoHighlight
        value={selectedValue}
        onChange={handleAutocompleteChange}
        loading={isLoading}
        getOptionLabel={(option: WareBinLocation) => option.BinCode}
        renderOption={(props, option: WareBinLocation) => (
          <Box component="li" {...props} key={option.AbsEntry}>
            <BsDot />
            {option.BinCode}
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
