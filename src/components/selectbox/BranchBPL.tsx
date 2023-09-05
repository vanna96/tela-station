import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import BranchBPLRepository from '@/services/actions/branchBPLRepository';

interface BranchProps<T = unknown> {
    name?: string,
    defaultValue?: any,
    value?: any,
    onChange?: SelectInputProps<T>['onChange'],
    disabled?: boolean,
}


function BPLBranchSelect(props: BranchProps) {

    const { data, isLoading }: any = useQuery({ queryKey: ['branchBPL'], queryFn: () => new BranchBPLRepository().get(), staleTime: Infinity })

    return <MUISelect
        {...props}
        aliaslabel="BPLName"
        aliasvalue="BPLID"
        loading={isLoading}
        items={data}
        disabled={props?.disabled}
    />
}

export default BPLBranchSelect;