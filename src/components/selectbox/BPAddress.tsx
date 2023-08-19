import MUISelect from "./MUISelect"
import { useQuery } from "react-query"
import { SelectInputProps } from "@mui/material/Select/SelectInput"
import request from "@/utilies/request"
import { useMemo } from "react"

interface BPAddress<T = unknown> {
  type?: any
  data?: any
  name?: string
  defaultValue?: any
  value?: any
  onChange?: SelectInputProps<T>["onChange"]
  disabled?: boolean
  label?: string
}

function BPAddress(props: BPAddress) {
  const address = useMemo(
    () =>
      props.data?.BPAddresses?.filter(
        ({ addressType }: any) => addressType === (props.type || "bo_ShipTo")
      ).concat({ addressName: "" }),
    [props.type || ""]
  )

  return (
    <MUISelect
      {...props}
      aliaslabel="addressName"
      aliasvalue="addressName"
      items={address ?? []}
      label={props.label}
    />
  )
}

export default BPAddress
