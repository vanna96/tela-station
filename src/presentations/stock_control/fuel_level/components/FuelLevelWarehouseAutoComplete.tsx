import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import { useGetWhsTerminalAssignHook } from "@/hook/useGetWhsTerminalAssignHook";
import shortid from "shortid";

export default function FuelLevelWhsAutoComplete(props: {
    label?: any;
    value?: any;
    onChange?: (value: any) => void;
    BPdata?: any;
    disabled?: any;
    name?: any;
}) {
    const { data, isLoading } = useGetWhsTerminalAssignHook(false);
    const { disabled } = props;

    const [selectedValue, setSelectedValue] = useState<any>({});

    const handleAutocompleteChange = (event: any, newValue: any) => {
        setSelectedValue(newValue);
        if (props.onChange) {
            props.onChange(newValue);
        }
    };

    useEffect(() => {
        if (props.value) {
            const selectedBranch = data?.find((branch: any) => branch?.WarehouseCode === props.value);
            if (selectedBranch) setSelectedValue(selectedBranch);
        }
    }, [props.value, data]);


    return (
        <Autocomplete
            disabled={disabled}
            options={data ?? []}
            autoHighlight
            value={selectedValue ?? {}}
            onChange={handleAutocompleteChange}
            loading={isLoading}
            getOptionLabel={(option: any) => option?.WarehouseName ?? ''}
            renderOption={(props, option) => (
                <Box component="li" {...props} key={shortid.generate()} >
                    {/* <BsDot /> */}
                    {/* {selectedValue === option.WarehouseCode ? <CheckIcon /> : null} */}
                    {option?.WarehouseName ?? ''}
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
