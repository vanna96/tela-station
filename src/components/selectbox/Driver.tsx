
import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQueryHook } from "@/utilies/useQueryHook";
import request from "@/utilies/request";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import OwnerRepository from "@/services/actions/ownerRepository";
import BuyerRepository from "@/services/actions/BuyerRepository";
import DriverRepository from "@/services/actions/DriverRepository";


interface DriverProps<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
}



function DriverSelect(props: DriverProps) {
  const { data, isLoading }: any = useQuery({ queryKey: ['driver'], queryFn: () => new DriverRepository().get(), staleTime: Infinity })
  const items = useMemo(() =>
    data?.map((e: any) => ({ label: e?.FirstName + " " + e?.LastName + "", value: e?.EmployeeID })),
    [data])
  return <MUISelect
    {...props}
    items={items ?? []}
    aliaslabel="LastName"
    aliasvalue="EmployeeID"
    loading={isLoading}
  />
}

export default DriverSelect;