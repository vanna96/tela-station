import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import PriceListRepository from "@/services/actions/pricelistReporitory";
import PriorityRepository from "@/services/actions/priorityReposiroty";
interface PriorityProps<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
}



function PrioritySelect(props: PriorityProps) {
  const { data, isLoading }: any = useQuery({ queryKey: ['priority'], queryFn: () => new PriorityRepository().get(), staleTime: Infinity })

  return <MUISelect
    {...props}
    items={data ?? []}
    aliaslabel="PriorityDescription"
    aliasvalue="Priority"
    loading={isLoading}
  />
}

export default PrioritySelect;