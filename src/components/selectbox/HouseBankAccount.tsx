
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import HousebankAccountRepository from "@/services/actions/houseBankAccountRepository";


interface HouseBankAccountsProps<T = unknown> {
    name?: string,
    defaultValue?: any,
    value?: any,
    onChange?: SelectInputProps<T>['onChange'],
    disabled?: boolean,
}



function HouseBankAccounts(props: HouseBankAccountsProps) {
    const { data, isLoading }: any = useQuery({ queryKey: ['houseBankAccounts'], queryFn: () => new HousebankAccountRepository().get(), staleTime: Infinity })

    return <MUISelect
        {...props}
        items={data ?? []}
        aliaslabel="AccNo"
        aliasvalue="BankCode"
        loading={isLoading}
    />
}

export default HouseBankAccounts;