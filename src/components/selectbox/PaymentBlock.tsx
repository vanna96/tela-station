import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import PaymentBlockRepository from "@/services/actions/paymentBlockReporitory";
interface PaymentBlockProps<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
}



function PaymentBlockSelect(props: PaymentBlockProps) {
  const { data, isLoading }: any = useQuery({ queryKey: ['paymentblock'], queryFn: () => new PaymentBlockRepository().get(), staleTime: Infinity })

  return <MUISelect
    {...props}
    items={data ?? []}
    aliaslabel="PaymentBlockCode"
    aliasvalue="AbsEntry"
    loading={isLoading}
  />
}

export default PaymentBlockSelect;