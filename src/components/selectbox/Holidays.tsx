
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import HolidayRepository from "@/services/actions/holidaysRepository";


interface HolidayProps<T = unknown> {
    name?: string,
    defaultValue?: any,
    value?: any,
    onChange?: SelectInputProps<T>['onChange'],
    disabled?: boolean,
}



function HolidaySelect(props: HolidayProps) {
    const { data, isLoading }: any = useQuery({ queryKey: ['holiday'], queryFn: () => new HolidayRepository().get(), staleTime: Infinity })

    return <MUISelect
        {...props}
        items={data ?? []}
        aliaslabel="HolidayCode"
        aliasvalue="HolidayCode"
        loading={isLoading}
    />
}

export default HolidaySelect;