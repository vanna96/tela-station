import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import WarehouseRepository from "@/services/warehouseRepository";

interface WarehouseProps<T = unknown> {
    name?: string,
    defaultValue?: any,
    value?: any,
    onChange?: SelectInputProps<T>['onChange'],
    disabled?: boolean,

}


function WarehouseSelect(props: WarehouseProps) {

    const { data, isLoading }: any = useQuery({ queryKey: ['warehouse'], queryFn: () => new WarehouseRepository().get(), staleTime: Infinity });


    return <MUISelect
        {...props}
        aliaslabel="WarehouseName"
        aliasvalue="WarehouseCode"
        loading={isLoading}
        items={data}
    />
}

export default WarehouseSelect;