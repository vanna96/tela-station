import MUISelect from "./MUISelect"
import { useQuery } from "react-query"
import { SelectInputProps } from "@mui/material/Select/SelectInput"
import AisleRepository from "@/services/actions/AisleRepository"
import request from "@/utilies/request"

interface ControlAccount<T = unknown> {
  name?: string
  defaultValue?: any
  value?: any
  onChange?: SelectInputProps<T>["onChange"]
  disabled?: boolean
}

export default function ControlAccount(props: ControlAccount) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["ControlAccount"],
    queryFn: () =>
      request(
        "GET",
        "/ChartOfAccounts?$filter=ActiveAccount eq 'tYES' and LockManualTransaction eq 'tYES'"
      )
        .then((res: any) =>
          res?.data?.value?.map((res: any) => {
            return {
              ...res,
              Name: `${res?.Code} -  ${res?.Name}`,
            }
          })
        )
        .catch((err: any) => console.log(err)),
    staleTime: Infinity,
  })

  return (
    <MUISelect
      {...props}
      items={data ?? []}
      aliaslabel="Name"
      aliasvalue="Code"
      loading={isLoading}
    />
  )
}
