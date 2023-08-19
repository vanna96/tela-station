import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import PositionRepository from "@/services/actions/positionRepository";
interface StatusProps<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
}



function PositionSelect(props: StatusProps) {
  const { data, isLoading }: any = useQuery({ queryKey: ['position'], queryFn: () => new PositionRepository().get(), staleTime: Infinity })

  return <MUISelect
    {...props}
    items={data ?? []}
    aliaslabel="Name"
    aliasvalue="PositionID"
    loading={isLoading}
  />
}

export default PositionSelect;