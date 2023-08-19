import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import CustomsGroupRepository from "@/services/actions/customsGroupRepository";

interface BranchProps<T = unknown> {
    name?: string,
    defaultValue?: any,
    value?: any,
    onChange?: SelectInputProps<T>['onChange'],
}


function CustomGroupSelect(props: BranchProps) {

    const { data, isLoading }: any = useQuery({ queryKey: ['custom-group'], queryFn: () => new CustomsGroupRepository().get(), staleTime: Infinity })


    return <MUISelect
        {...props}
        aliaslabel="Name"
        aliasvalue="Code"
        loading={isLoading}
        items={data}
    />
}

export default CustomGroupSelect;