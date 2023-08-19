import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import ItemGroupRepository from "@/services/actions/itemGroupRepository";

interface BranchProps<T = unknown> {
    name?: string,
    defaultValue?: any,
    value?: any,
    onChange?: SelectInputProps<T>['onChange'],
}


function ItemGroupSelect(props: BranchProps) {

    const { data, isLoading }: any = useQuery({ queryKey: ['item-group'], queryFn: () => new ItemGroupRepository().get(), staleTime: Infinity })

    return <MUISelect
        {...props}
        aliaslabel="GroupName"
        aliasvalue="Number"
        loading={isLoading}
        items={data}
    />
}

export default ItemGroupSelect;