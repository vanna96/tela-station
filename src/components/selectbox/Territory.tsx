import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import IndustryRepository from "@/services/actions/industries";
import TerritoryRepository from "@/services/actions/territoryRepository";
interface TerritoryProps<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
}



function TerritorySelect(props: TerritoryProps) {
  const { data, isLoading }: any = useQuery({ queryKey: ['territory'], queryFn: () => new TerritoryRepository().get(), staleTime: Infinity })

  return <MUISelect
    {...props}
    items={data ?? []}
    aliaslabel="Description"
    aliasvalue="TerritoryID"
    loading={isLoading}
  />
}

export default TerritorySelect;