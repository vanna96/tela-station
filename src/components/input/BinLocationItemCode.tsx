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

export default function BinLocationItemCode(props: {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  Warehouse?: any;
  BinAbsEntry?: any;
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
  const uniqueData = filteredWarehouses?.filter((warebin: any) => {
    if (!uniqueBinCodes.has(warebin.ItemCode)) {
      uniqueBinCodes.add(warebin.ItemCode);
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (props.value) {
      const selectedValue = uniqueData?.find(
        (warebin: any) => warebin.ItemCode === props.value
      );
      if (selectedValue) {
        setSelectedValue(selectedValue);
      }
    }
  }, [props.value, uniqueData]);

  const [selectedValue, setSelectedValue] = useState(null);

  const handleAutocompleteChange = (event: any, newValue: any) => {
    setSelectedValue(newValue);

    if (props.onChange) {
      const selectedCode = newValue ? newValue.ItemCode : null;
      console.log(selectedCode)
      props.onChange(selectedCode);
    }
  };

  return (
    <div className="block  ">
      <label htmlFor="" className={`  text-[#656565] mt-1`}>
        {props?.label}
      </label>

      <Autocomplete
        options={uniqueData ?? data}
        autoHighlight
        value={selectedValue}
        onChange={handleAutocompleteChange}
        loading={isLoading}
        getOptionLabel={(option: WareBinLocation) => option.ItemCode}
        renderOption={(props, option: WareBinLocation) => (
          <Box component="li" {...props} key={option.ItemCode}>
            <BsDot />
            {option.ItemCode}
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
