import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import DepartmentRepository from "@/services/actions/departmentRepository";

interface DepartmentProps<T = unknown> {
    name?: string,
    defaultValue?: any,
    value?: any,
    onChange?: SelectInputProps<T>['onChange'],
    disabled?: boolean,
}


function DepartmentSelect(props: DepartmentProps) {
    const { data, isLoading }: any = useQuery({ queryKey: ['department'], queryFn: () => new DepartmentRepository().get(), staleTime: Infinity })


    return <MUISelect
        {...props}
        aliaslabel="Name"
        aliasvalue="Code"
        loading={isLoading}
        items={data}
        disabled={props.disabled}
    />
}

export default DepartmentSelect;