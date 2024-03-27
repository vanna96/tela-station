import React, { useState, useEffect } from "react";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { BsDot } from "react-icons/bs";
import { useQuery } from "react-query";
import DispenserRepository from "@/services/actions/dispenserRepository";
import request from "@/utilies/request";

interface Type {
  Code: string;
  Name: string;
}

export default function DispenserAutoComplete(props: {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  name?: any;
  disabled?: any;
  isStatusActive?: boolean;
  branch?: number;
  pumpType?: string;
  loading?: boolean,
  old_pump?:any;
}) {
  let { data:OpenPump }: any = useQuery({
    queryKey: ["open_pump"],
    queryFn: () => request('GET', 'sml.svc/BIZ_OPEN_PUMP_QUERY').then((res:any) => res.data.value),
  });

  let { data, isLoading }: any = useQuery({
    queryKey: ["dispenser"],
    queryFn: () => new DispenserRepository().get(),
  });

  let filteredData = data
    ?.filter((e: any) => !props.isStatusActive || e.U_tl_status === "Active")
    ?.filter(
      (e: any) => !props.branch || parseInt(e.U_tl_bplid) === props.branch
    )
    ?.filter((e: any) => !props.pumpType || e.U_tl_type === props.pumpType);

  if(
    OpenPump?.length > 0
  ) filteredData = filteredData.filter((e:any) =>  props.old_pump === e.Code  || !OpenPump.some((p:any) => p.U_tl_pump === e.Code));

  useEffect(() => {
    if (props.value) {
      const oData = filteredData?.find((e: any) => e.Code === props.value);
      if (oData) {
        setSelectedValue(oData);
      }
    }
  }, [props.value, data, props.isStatusActive, props.branch, props.pumpType]);

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
        options={filteredData ?? []}
        autoHighlight
        value={selectedValue}
        onChange={handleAutocompleteChange}
        loading={isLoading || props.loading}
        getOptionLabel={(e: Type) => e.Code + " - " + e.Name}
        renderOption={(props, e: Type) => (
          <Box component="li" {...props}>
            {e.Code + " - " + e.Name}
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
                  {isLoading || props.loading ? (
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
