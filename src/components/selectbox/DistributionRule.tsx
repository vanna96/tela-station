
import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQueryHook } from "@/utilies/useQueryHook";
import request from "@/utilies/request";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import OwnerRepository from "@/services/actions/ownerRepository";
import FactoringIndicatorRepository from "@/services/actions/FactoringIndicatorRepository";
import DistributionRuleRepository from "@/services/actions/distributionRulesRepository";


interface Props<T = unknown> {
    name?: string,
    defaultValue?: any,
    value?: any,
    onChange?: SelectInputProps<T>['onChange'],
    disabled?: boolean,
    // dimension = InDimension.ONE,

}



function DistributionRuleSelect(props: Props) {
    const { data, isLoading }: any = useQuery({ queryKey: ['distribution-rule'], queryFn: () => new DistributionRuleRepository().get(), staleTime: Infinity })

    return <MUISelect
        {...props}
        items={data ?? []}
        aliaslabel="FactorCode"
        aliasvalue="FactorCode"
        loading={isLoading}
    />
}


// items={!data?.data ? [] :
//     data?.data?.value?.filter((e) => e?.InWhichDimension === dimension)?.map((e) => ({
//         value: e?.FactorCode,
//         name: e?.FactorCode,
//     }))
// }

export default DistributionRuleSelect;