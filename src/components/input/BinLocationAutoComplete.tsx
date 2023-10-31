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

export default function BinLocationAutoComplete(props: {
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

  useEffect(() => {
    if (props.value) {
      const selectedWarehouse = filteredWarehouses?.find(
        (warebin: any) => warebin.WhsCode === props.value
      );
      if (selectedWarehouse) {
        setSelectedValue(selectedWarehouse);
      }
    }
  }, [props.value, filteredWarehouses]);

  const [selectedValue, setSelectedValue] = useState(null);

  const handleAutocompleteChange = (event: any, newValue: any) => {
    setSelectedValue(newValue);

    if (props.onChange) {
      const selectedCode = newValue ? newValue.WhsCode : null;
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
          // <Box component="li" {...props}>
          //   <BsDot />
          //   {option.BinCode}
          // </Box>
          <Box
            component="li"
            {...props}
            key={ option.BinAbsEntry}
          >
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
