import MUISelect from "./MUISelect"
import { useQuery } from "react-query"
import { SelectInputProps } from "@mui/material/Select/SelectInput"
import request from "@/utilies/request"

interface BusinessPlacesProps<T = unknown> {
  name?: string
  defaultValue?: any
  value?: any
  onChange?: SelectInputProps<T>["onChange"]
  disabled?: boolean
}

export default function BusinessPlaces(props: BusinessPlacesProps) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["BusinessPlaces"],
    queryFn: async () =>
      await request("GET", "/BusinessPlaces")
        .then((res: any) => res.data?.value)
        .catch((err: any) => []),
    staleTime: Infinity,
  })

  return (
    <MUISelect
      {...props}
      aliaslabel="BPLName"
      aliasvalue="BPLID"
      loading={isLoading}
      items={data}
      disabled={props?.disabled}
    />
  )
}
