import React, { useMemo, FC } from "react";

import MUISelect from "./MUISelect";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import { useQuery } from "react-query";
import PaymentMethodRepository from "@/services/actions/paymentMethodRepository";

type PaymentMethodType = 'outgoing' | 'incoming';


interface PaymentMethodProps<T = unknown> {
    type: PaymentMethodType,
    name?: string,
    defaultValue?: any,
    value?: any,
    onChange?: SelectInputProps<T>['onChange'],
    disabled?: boolean,
}

const PaymentMethod: FC<PaymentMethodProps> = ({ type, name, defaultValue, value, onChange, disabled }: PaymentMethodProps) => {

    const { data, isLoading }: any = useQuery({
        queryKey: ["payment-methods"],
        queryFn: () => new PaymentMethodRepository().get(),
        staleTime: Infinity,
    });

    const items = React.useMemo(() => data?.filter((e: any) => e?.Type?.replace("bopt", "")?.toLowerCase() === type), [data])

    return <MUISelect
        disabled={disabled}
        aliaslabel="PaymentMethodCode"
        aliasvalue="PaymentMethodCode"
        items={items ?? "No Item"}
        onChange={onChange}
        loading={isLoading}
        value={value}
        defaultValue={defaultValue}
    />
}
export default PaymentMethod;