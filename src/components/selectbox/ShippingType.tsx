import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import ShippingTypeRepository from "@/services/actions/shippingTypeRepository";
import { Label } from "@headlessui/react/dist/components/label/label";

interface ShippingTypeProps<T = unknown> {
    name?: string,
    defaultValue?: any,
    value?: any,
    onChange?: SelectInputProps<T>['onChange'],
    disabled?: boolean,
    label?: string,
}


function ShippingType(props: ShippingTypeProps) {

    const { data, isLoading }: any = useQuery({
        queryKey: ["shipping-types"],
        queryFn: () => new ShippingTypeRepository().get(),
        staleTime: Infinity,
    });


    return <MUISelect
        {...props}
        aliaslabel="Name"
        aliasvalue="Code"
        loading={isLoading}
        items={data}
        label={props.label}
    />
}

export default ShippingType;