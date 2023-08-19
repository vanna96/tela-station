import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import PaymentTermTypeRepository from '../../services/actions/paymentTermTypeRepository';

interface PaymentTermTypeProps<T = unknown> {
    name?: string,
    defaultValue?: any,
    value?: any,
    onChange?: SelectInputProps<T>['onChange'],
    disabled?: boolean,
}


function PaymentTerm(props: PaymentTermTypeProps) {

    const { data, isLoading  }: any = useQuery({
        queryKey: ["payment-term-types"],
        queryFn: () => new PaymentTermTypeRepository().get(),
        staleTime: Infinity,
    });


    return <MUISelect
        {...props}
        aliaslabel="PaymentTermsGroupName"
        aliasvalue="GroupNumber"
        loading={isLoading}
        items={data}
    />
}

export default PaymentTerm;