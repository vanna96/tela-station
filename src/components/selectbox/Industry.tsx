import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import IndustryRepository from "@/services/actions/industries";
interface IndustryProps<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
}



function IndustrySelect(props: IndustryProps) {
  const { data, isLoading }: any = useQuery({ queryKey: ['industry'], queryFn: () => new IndustryRepository().get(), staleTime: Infinity })

  return <MUISelect
    {...props}
    items={data ?? []}
    aliaslabel="IndustryName"
    aliasvalue="IndustryCode"
    loading={isLoading}
  />
}

export default IndustrySelect;