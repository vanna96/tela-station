import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import BankChargesAllocationCodeRepository from "@/services/actions/bankChargesAllocationCodeRepository";
interface BankChargesAllocationCodesProps<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
}



function BankChargesAllocationCodesSelect(props: BankChargesAllocationCodesProps) {
  const { data, isLoading }: any = useQuery({ queryKey: ['bankChargesAllocationCodes'], queryFn: () => new BankChargesAllocationCodeRepository().get(), staleTime: Infinity })

  return <MUISelect
    {...props}
    items={data ?? []}
    aliaslabel="Code"
    aliasvalue="Code"
    loading={isLoading}
  />
}

export default BankChargesAllocationCodesSelect;