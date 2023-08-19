import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import EmailGroupRepository from "@/services/actions/emailGroupReporitory";
interface EmailGroupProps<T = unknown> {
  name?: string,
  value?: any,
  defaultValue?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
}



function EmailGroupSelect(props: EmailGroupProps) {
  const { data, isLoading }: any = useQuery({ queryKey: ['emailgroup'], queryFn: () => new EmailGroupRepository().get(), staleTime: Infinity })

  return <MUISelect
    {...props}
    items={data ?? []}
    aliaslabel="EmailGroupCode"
    aliasvalue="EmailGroupCode"
    loading={isLoading}
  />
}

export default EmailGroupSelect;