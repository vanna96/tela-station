import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import ManagerRepository from "@/services/actions/ManagerRepository";

interface ManagerProps<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
}



function ManagerSelect(props: ManagerProps) {
  const { data, isLoading }: any = useQuery({ queryKey: ['manager'], queryFn: () => new ManagerRepository().get(), staleTime: Infinity })

  return <MUISelect
    {...props}
    items={data ?? []}
    aliaslabel="FirstName"
    aliasvalue="EmployeeID"
    loading={isLoading}
  />
}

export default ManagerSelect;