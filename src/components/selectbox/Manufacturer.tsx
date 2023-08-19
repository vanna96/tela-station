import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import ManufacturerRepository from "@/services/actions/manufacturerRepository";

interface BranchProps<T = unknown> {
    name?: string,
    defaultValue?: any,
    value?: any,
    onChange?: SelectInputProps<T>['onChange'],
}


function ManufacturerSelect(props: BranchProps) {

    const { data, isLoading }: any = useQuery({ queryKey: ['manufacturer'], queryFn: () => new ManufacturerRepository().get(), staleTime: Infinity })


    return <MUISelect
        {...props}
        aliaslabel="ManufacturerName"
        aliasvalue="Code"
        loading={isLoading}
        items={data}
    />
}

export default ManufacturerSelect;