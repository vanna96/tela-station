import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import BusinessPartnerGroupsRepository from "@/services/actions/businessPartnerGroups";
interface BusinessPartnerGroupsProps<T = unknown> {
    name?: string,
    defaultValue?: any,
    value?: any,
    onChange?: SelectInputProps<T>['onChange'],
}


function BusinessPartnerGroupsSelect(props: BusinessPartnerGroupsProps) {

    const { data, isLoading }: any = useQuery({ queryKey: ['businessPartnerGroups'], queryFn: () => new BusinessPartnerGroupsRepository().get(), staleTime: Infinity })


    return <MUISelect
        {...props}
        aliaslabel="Name"
        aliasvalue="Code"
        loading={isLoading}
        items={data}
    />
}

export default BusinessPartnerGroupsSelect;