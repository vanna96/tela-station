import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import BankRepository from "@/services/actions/bankRepository";
interface BankProps<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
}



function BankSelect(props: BankProps) {
  const { data, isLoading }: any = useQuery({ queryKey: ['bank'], queryFn: () => new BankRepository().get(), staleTime: Infinity })

  return <MUISelect
    {...props}
    items={data ?? []}
    aliaslabel="BankName"
    aliasvalue="BankCode"
    loading={isLoading}
  />
}

export default BankSelect;