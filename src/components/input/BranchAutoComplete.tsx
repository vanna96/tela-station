import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import BranchRepository from "@/services/actions/branchRepository";
import BusinessPartnerRepository from "@/services/actions/bussinessPartnerRepository";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import React from "react";
import { BsDot } from "react-icons/bs";
import { useQuery } from "react-query";

export default function BranchAutoComplete(props: {
  label?: any;
  value?: any;
  onChange?: (value: any) => void;
  BPdata?: any;
}) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["branchBPL"],
    queryFn: () => new BranchBPLRepository().get(),
    staleTime: Infinity,
  });
  const [value, setValue] = React.useState();
  const uniqueBPLIDs = [...new Set(props?.BPdata?.map((e: any) => e.BPLID))];

  const filteredBranch = data?.filter((e: any) =>
    uniqueBPLIDs.includes(e.BPLID)
  );
  return (
    <div className="block text-[14px] xl:text-[13px] ">
      <label
        htmlFor=""
        className={` text-[14px] xl:text-[13px] text-[#656565] mt-1`}
      >
        {props?.label}
      </label>

      <Autocomplete
        options={filteredBranch ?? data}
        autoHighlight
        value={props.value ? value : value}
        defaultValue={filteredBranch ? filteredBranch[0] : 1}
        onChange={(event, newValue) => {
          if (props.onChange) {
            const selectedValue = newValue ? newValue.BPLID : "";
            props.onChange(selectedValue);
          }
        }}
        loading={isLoading}
        getOptionLabel={(option: any) => option.BPLName}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <BsDot />
            {option.BPLName}
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
