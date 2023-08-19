import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import SalePersonRepository from "@/services/actions/salePersonRepository";


interface SalePersonProps<T = unknown> {
    name?: string,
    defaultValue?: any,
    value?: any,
    onChange?: SelectInputProps<T>['onChange'],
    disabled?: boolean,
}

function SalePerson(props: SalePersonProps) {
    const { data, isLoading }: any = useQuery({ queryKey: ['sale_persons'], queryFn: () => new SalePersonRepository().get(), staleTime: Infinity })

    return <MUISelect
        {...props}
        items={data ?? []}
        aliaslabel="name"
        aliasvalue="code"
        loading={isLoading}
    />
}

export default SalePerson;