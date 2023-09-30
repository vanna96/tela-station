import BusinessPartnerRepository from "@/services/actions/bussinessPartnerRepository";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import React from "react";
import { BsDot } from "react-icons/bs";
import { useQuery } from "react-query";

export default function BPAutoComplete(props: {
  label?: any;
  type?: "Customer" | "Supplier";
  value?: string;
  onChange?: (value: string) => void;
}) {
  const { type = "Customer" } = props;
  const { data, isLoading }: any = useQuery({
    queryKey: [`venders_${type}`],
    queryFn: () => new BusinessPartnerRepository().getCustomerCode(),
    staleTime: Infinity,
  });
  console.log(data)
  const [value, setValue] = React.useState();
  return (
    <div className="block">
      <label
        htmlFor=""
        className={` text-[14px] xl:text-[13px] text-[#656565] mt-1`}
      >
        {props?.label || "Vendor/Customer"}
      </label>

      <Autocomplete
        options={data}
        autoHighlight
        value={props.value ? value : value}
        onChange={(event, newValue) => {
          if (props.onChange) {
            const selectedValue = newValue ? newValue.CardCode : "";
            props.onChange(selectedValue);
          }
        }}
        loading={isLoading}
        getOptionLabel={(option: any) => option.CardCode}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            {/* <BsDot /> */}
            {option.CardCode} - {option.CardName}
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
