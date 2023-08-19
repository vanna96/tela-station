import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import CurrencyRepository from "@/services/actions/currencyRepository";
interface CurrencyProps<T = unknown> {
    name?: string,
    defaultValue?: any,
    value?: any,
    onChange?: SelectInputProps<T>['onChange'],
}


function CurrencySelect(props: CurrencyProps) {
    const { data, isLoading }: any = useQuery({ queryKey: ['currency'], queryFn: () => new CurrencyRepository().get(), staleTime: Infinity })


    return <MUISelect
        {...props}
        aliaslabel="Name"
        aliasvalue="Code"
        loading={isLoading}
        items={data}
    />
}

export default CurrencySelect;