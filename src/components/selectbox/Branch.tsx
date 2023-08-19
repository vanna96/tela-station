import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import BranchRepository from "@/services/actions/branchRepository";

interface BranchProps<T = unknown> {
    name?: string,
    defaultValue?: any,
    value?: any,
    onChange?: SelectInputProps<T>['onChange'],
    disabled?: boolean,
}


function BranchSelect(props: BranchProps) {

    const { data, isLoading }: any = useQuery({ queryKey: ['branch'], queryFn: () => new BranchRepository().get(), staleTime: Infinity })


    return <MUISelect
        {...props}
        aliaslabel="Name"
        aliasvalue="Code"
        loading={isLoading}
        items={data}
        disabled={props?.disabled}
    />
}

export default BranchSelect;