import BusinessPartnerRepository from "@/services/actions/bussinessPartnerRepository"
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material"
import React from "react"
import { BsDot } from "react-icons/bs"
import { useQuery } from "react-query"

export default function BPAutoComplete(props: {
  label?: any
  type?: "Customer" | "Supplier"
}) {
  const { type = "Customer" } = props
  const { data, isLoading }: any = useQuery({
    queryKey: [`venders_${type}`],
    queryFn: () =>
      new BusinessPartnerRepository().get(`&$filter=CardType eq 'c${type}'`),
    staleTime: Infinity,
  })
  const [value, setValue] = React.useState()
  return (
    <div className="block">
      <label htmlFor="">{props?.label || "Vendor/Customer"}</label>
      <Autocomplete
        options={data}
        autoHighlight
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        loading={isLoading}
        getOptionLabel={(option: any) => option.CardCode}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <BsDot />
            {option.CardName} ({option.CardCode})
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
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </div>
  )
}
