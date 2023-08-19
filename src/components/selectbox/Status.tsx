import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import StatusRepository from "@/services/actions/statusRepository";

interface StatusProps<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
}



function StatusSelect(props: StatusProps) {
  const { data, isLoading }: any = useQuery({ queryKey: ['status'], queryFn: () => new StatusRepository().get(), staleTime: Infinity })

  return <MUISelect
    {...props}
    items={data ?? []}
    aliaslabel="Name"
    aliasvalue="StatusId"
    loading={isLoading}
  />
}

export default StatusSelect;