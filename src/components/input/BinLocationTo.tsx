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
  BinAbsEntry: number;
  id__: number;
}

export default function BinLocationTo(props: {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  Warehouse?: any;
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

  // Use a Set to keep track of unique BinCode values
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
      const selectedWarehouse = uniqueWarehouses?.find(
        (warebin: any) => warebin.WhsCode === props.value
      );
      if (selectedWarehouse) {
        setSelectedValue(selectedWarehouse);
      }
    }
  }, [props.value, uniqueWarehouses]);

  const [selectedValue, setSelectedValue] = useState(null);

  const handleAutocompleteChange = (event: any, newValue: any) => {
    setSelectedValue(newValue);

    if (props.onChange) {
      const selectedCode = newValue ? newValue.BinCode : null;
      props.onChange(selectedCode);
    }
  };

  return (
    <div className="block  ">
      <label htmlFor="" className={`  text-[#656565] mt-1`}>
        {props?.label}
      </label>

      <Autocomplete
        options={uniqueWarehouses ?? data}
        autoHighlight
        value={selectedValue}
        onChange={handleAutocompleteChange}
        loading={isLoading}
        getOptionLabel={(option: WareBinLocation) => option.BinCode}
        renderOption={(props, option: WareBinLocation) => (
          <Box component="li" {...props} key={option.BinCode}>
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
