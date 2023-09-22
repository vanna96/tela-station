import BusinessPartnerRepository from "@/services/actions/bussinessPartnerRepository"
import request from "@/utilies/request"
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material"
import React from "react"
import { BsDot } from "react-icons/bs"
import { useQuery } from "react-query"

export default function AutoCompleteGLAccount(props: {
  label?: any
  type?: "Customer" | "Supplier"
  onChange: any
}) {
  const { data, isLoading }: any = useQuery({
    queryKey: [`ActiveGLAccount`],
    queryFn: () =>
      request("GET", "/ChartOfAccounts?$filter=ActiveAccount eq 'tYES'")
        .then((res: any) =>
          res?.data?.value?.map((res: any) => {
            return {
              ...res,
              Name: `${res?.Code} -  ${res?.Name}​`,
            }
          })
        )
        .catch((err: any) => console.log(err)),
    staleTime: Infinity,
  })
  const [value, setValue] = React.useState()
  return (
    <div className="block">
      <Autocomplete
        options={data}
        autoHighlight
        // value={null}
        // defaultValue=""
        // onChange={(event, newValue: any) => return}
        loading={isLoading}
        getOptionLabel={(option: any) => `${option.Name}`}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <BsDot />
            {option?.Name}
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
