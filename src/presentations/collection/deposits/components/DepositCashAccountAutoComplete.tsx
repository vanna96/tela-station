import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import { BsDot } from "react-icons/bs";
import { useQuery } from "react-query";
import request from "@/utilies/request";
import GLAccountRepository from "@/services/actions/GLAccountRepository";

export default function DepositCashAccountAutoComplete(props: {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  BPdata?: any;
  disabled?: any;
  name?: any;
  curr?: string
}) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["deposit_cash_"+props?.curr],
    queryFn: () => request('GET', `/TL_CashAcct?$filter=U_tl_cashtype eq 'Deposit'${props?.curr ? `&$filter=U_tl_cashacct eq '${props?.curr}'`:""}&$select=Code, Name,U_tl_cashacct`).then((res:any) => res.data.value),
    staleTime: Infinity,
    refetchOnWindowFocus : false,
  });

  console.log(data);
  
// const list = useMemo(()=>{
//   return data?.filter((e:any)=> e?.U_tl_cashacct === props?.curr)
// },[props?.curr,data])

  useEffect(() => {
    // Ensure that the selected value is set when the component is mounted
    if (props.value) {
      const selectedBranch = data?.find(
        (branch: any) => branch?.Code === props.value
      );
      if (selectedBranch) {
        setSelectedValue(selectedBranch);
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
      const selectedId = newValue ? newValue.Code : null;
      props.onChange(newValue);
    }
  };
  const disabled = props.disabled;

  return (
    <div className="block text-[14px] xl:text-[13px] ">
      <label
        htmlFor=""
        className={`text-[14px] xl:text-[13px] text-[#656565] mt-1`}
      >
        {props?.label}
      </label>

      <Autocomplete
        disabled={disabled}
        options={data}
        autoHighlight
        value={selectedValue}
        onChange={handleAutocompleteChange}
        loading={isLoading}
        getOptionLabel={(option: any) => option?.Code + " - " + option.Name}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <BsDot />
            {option.Code} - {option.Name}
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
