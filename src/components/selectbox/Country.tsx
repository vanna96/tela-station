import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import CountryRepository from "@/services/actions/CountryRepository";

interface CountryProps<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
}



function CountrySelect(props: CountryProps) {
  const { data, isLoading }: any = useQuery({ queryKey: ['country'], queryFn: () => new CountryRepository().get(), staleTime: Infinity })

  return <MUISelect
    {...props}
    items={data ?? []}
    aliaslabel="Name"
    aliasvalue="Code"
    loading={isLoading}
  />
}

export default CountrySelect;