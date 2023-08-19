import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import StatusRepository from "@/services/actions/statusRepository";
import TerminationReasonRepository from "@/services/actions/terminationReason";

interface TerminationReasonProps<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
}



function TerminationReasonSelect(props: TerminationReasonProps) {
  const { data, isLoading }: any = useQuery({ queryKey: ['terminationReason'], queryFn: () => new TerminationReasonRepository().get(), staleTime: Infinity })

  return <MUISelect
    {...props}
    items={data ?? []}
    aliaslabel="Name"
    aliasvalue="ReasonID"
    loading={isLoading}
  />
}

export default TerminationReasonSelect;