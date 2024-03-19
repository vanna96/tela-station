import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import { useGetBranchesAssignHook } from "@/hook/useGetBranchesAssignHook";

export default function FuelLevelBranchAutoComplete(props: {
    label?: any;
    value?: any;
    onChange?: (value: any) => void;
    BPdata?: any;
    disabled?: any;
    name?: any;
}) {
    const { data, isLoading } = useGetBranchesAssignHook();
    const { disabled } = props;

    const [selectedValue, setSelectedValue] = useState<any>({});

    const handleAutocompleteChange = (event: any, newValue: any) => {
        setSelectedValue(newValue);
        if (props.onChange) {
            props.onChange(newValue);
        }
    };

    useEffect(() => {
        const selectedBranch = data?.find((branch: any) => branch?.BPLID === props.value);
        setSelectedValue(selectedBranch);
    }, [props.value, data]);


    return (
        <Autocomplete
            disabled={disabled}
            options={data ?? []}
            autoHighlight
            value={selectedValue ?? {}}
            onChange={handleAutocompleteChange}
            loading={isLoading}

            getOptionLabel={(option: any) => option?.BPLName ?? ''}
            renderOption={(props, option) => (
                <Box component="li" {...props} >
                    {/* <BsDot /> */}
                    {/* {selectedValue === option.BPLID ? <CheckIcon /> : null} */}
                    {option?.BPLName ?? ''}
                </Box>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    className={`w-full text-field text-xs ${disabled ? "bg-gray-100" : ""
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
    );
}
