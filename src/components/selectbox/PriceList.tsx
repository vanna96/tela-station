import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import PriceListRepository from "@/services/actions/pricelistReporitory";
interface PriceListProps<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
}



function PriceListSelect(props: PriceListProps) {
  const { data, isLoading }: any = useQuery({ queryKey: ['priceList'], queryFn: () => new PriceListRepository().get(), staleTime: Infinity })

  return <MUISelect
    {...props}
    items={data ?? []}
    aliaslabel="PriceListName"
    aliasvalue="PriceListNo"
    loading={isLoading}
  />
}

export default PriceListSelect;