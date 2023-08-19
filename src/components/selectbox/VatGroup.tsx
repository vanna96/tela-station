import React from 'react'
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import VatGroupRepository from "@/services/actions/VatGroupRepository";

type Category = 'InputTax' | 'OutputTax';

interface VatGroupProps<T = unknown> {
    name?: string,
    defaultValue?: any,
    value?: any,
    onChange?: SelectInputProps<T>['onChange'],
    disabled?: boolean,
    category: Category
}



function VatGroup(props: VatGroupProps) {
    const { data, isLoading }: any = useQuery({ queryKey: ['vat_group'], queryFn: () => new VatGroupRepository().get(), staleTime: Infinity });
    const items = React.useMemo(() => data?.filter((e: any) => e?.category === props.category), [data]);

    return <MUISelect
        {...props}
        items={items ?? []}
        aliaslabel="code"
        aliasvalue="code"
        loading={isLoading}
    />
}

export default VatGroup;