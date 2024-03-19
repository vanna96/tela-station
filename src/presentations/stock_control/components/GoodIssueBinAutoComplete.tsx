import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import shortid from "shortid";
import { useQuery } from "react-query";
import request from "@/utilies/request";

const getData = async (whsCode: string | undefined, itemCode: string | undefined) => {
    if (!whsCode || !itemCode) return []

    const url = `/sml.svc/BIZ_BIN_QUERY?$filter=WhsCode eq '${whsCode}' and ItemCode eq '${itemCode}'`
    const response: any = await request('GET', url)
    if (!response?.data) return []

    return response?.data?.value?.map((e: any) => ({ AbsEntry: e?.BinID, Warehouse: e?.WhsCode, BinCode: e?.BinCode })) ?? []
}

export default function GoodIssueBinAutoComplete(props: {
    label?: any;
    value?: any;
    onChange?: (value: any) => void;
    BPdata?: any;
    disabled?: any;
    name?: any;
    whsCode: string | undefined,
    itemCode: string | undefined,
}) {
    const { data, isLoading } = useQuery({ queryKey: [`whs_bins_${props.whsCode}_${props.itemCode}`], queryFn: () => getData(props.whsCode, props.itemCode) })
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
            const selectedBranch = data?.find((branch: any) => branch?.AbsEntry == props.value);
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
            getOptionLabel={(option: any) => option?.BinCode ?? ''}
            renderOption={(props, option) => (
                <Box component="li" {...props} key={shortid.generate()} >
                    {/* <BsDot /> */}
                    {/* {selectedValue === option.AbsEntry ? <CheckIcon /> : null} */}
                    {option?.BinCode ?? ''}
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
