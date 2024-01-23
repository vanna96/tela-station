import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import ExpdicRepository from "@/services/actions/ExpDicRepository";
interface ExpDicProps<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
}



function ExpDicSelect(props: ExpDicProps) {
  const { data, isLoading }: any = useQuery({ queryKey: ['expdic'], queryFn: () => new ExpdicRepository().get(), staleTime: Infinity })

  return <MUISelect
    {...props}
    items={data ?? []}
    aliaslabel="Code"
    aliasvalue="Code"
    loading={isLoading}
  />
}

export default ExpDicSelect;