import MUISelect from "./MUISelect"
import { useQuery } from "react-query"
import { SelectInputProps } from "@mui/material/Select/SelectInput"
import request from "@/utilies/request"

export default function BPProject(props: {
  name?: string
  defaultValue?: any
  value?: any
  onChange?: SelectInputProps<any>["onChange"]
  disabled?: boolean
  label?: string
}) {
  const { data, isLoading } = useQuery({
    queryKey: "projects",
    queryFn: async () => {
      const res = request("GET", "/Projects")
        .then((res: any) => res?.data?.value?.concat({"Name":"None", "Code":""}))
        .catch((error) => console.log(error))
      return res
    },
    // staleTime: Infinity,
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
