
import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQueryHook } from "@/utilies/useQueryHook";
import request from "@/utilies/request";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import OwnerRepository from "@/services/actions/ownerRepository";
import FactoringIndicatorRepository from "@/services/actions/factoringIndicatorRepository";


interface IndicatorProps<T = unknown> {
    name?: string,
    defaultValue?: any,
    value?: any,
    onChange?: SelectInputProps<T>['onChange'],
    disabled?: boolean,
}



function IndicatorSelect(props: IndicatorProps) {
    const { data, isLoading }: any = useQuery({ queryKey: ['indicator'], queryFn: () => new FactoringIndicatorRepository().get(), staleTime: Infinity })

    return <MUISelect
        {...props}
        items={data ?? []}
        aliaslabel="IndicatorName"
        aliasvalue="IndicatorCode"
        loading={isLoading}
    />
}

export default IndicatorSelect;