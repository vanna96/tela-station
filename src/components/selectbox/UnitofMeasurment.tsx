import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";

interface UOMProps<T = unknown> {
    name?: string,
    defaultValue?: any,
    value?: any,
    onChange?: SelectInputProps<T>['onChange'],
}


function UOMSelect(props: UOMProps) {

    const { data, isLoading }: any = useQuery({ queryKey: ['uom'], queryFn: () => new UnitOfMeasurementRepository().get(), staleTime: Infinity });


    return <MUISelect
        {...props}
        aliaslabel="Name"
        aliasvalue="AbsEntry"
        loading={isLoading}
        items={data}
    />
}

export default UOMSelect;