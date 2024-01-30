import React, { useState, useEffect } from "react";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { BsDot } from "react-icons/bs";
import { useQuery } from "react-query";
import PriceListRepository from "@/services/actions/pricelistRepository";

interface Type {
  PriceListNo: string;
  PriceListName: string;
  IsGrossPrice: boolean;
  Active: boolean;
}

export default function PriceListAutoComplete(props: {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  name?: any;
  disabled?: any;
  isActiveAndGross?: boolean;
}) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["priceList"],
    queryFn: () => new PriceListRepository().get(),
  });
  let dataFilter = data?.filter(
    (item: Type) => item.IsGrossPrice && item.Active
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

      const selectedPriceList = data?.find(
        (priceList: any) => priceList.PriceListNo === selectedValue
      );
      setSelectedValue(selectedPriceList);
    }
  }, [props.value, data]);
  const [selectedValue, setSelectedValue] = useState(null);

  const handleAutocompleteChange = (event: any, newValue: any) => {
    setSelectedValue(newValue);

    if (props.onChange) {
      const selectedCode = newValue ? newValue.PriceListNo : null;
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
        options={props.isActiveAndGross ? dataFilter : data}
        autoHighlight
        value={selectedValue}
        onChange={handleAutocompleteChange}
        loading={isLoading}
        getOptionLabel={(e: Type) => e.PriceListName}
        renderOption={(props, e: Type) => (
          <Box component="li" {...props}>
            {e.PriceListName}
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
