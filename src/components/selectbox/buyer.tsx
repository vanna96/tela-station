import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQueryHook } from "@/utilies/useQueryHook";
import request from "@/utilies/request";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import OwnerRepository from "@/services/actions/ownerRepository";
import BuyerRepository from "@/services/actions/buyerRepository";

interface BuyerProps<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
}



function BuyerSelect(props: BuyerProps) {
  const { data, isLoading }: any = useQuery({ queryKey: ['buyers'], queryFn: () => new BuyerRepository().get(), staleTime: Infinity })

  return <MUISelect
    {...props}
    items={data ?? []}
    aliaslabel="SalesEmployeeName"
    aliasvalue="SalesEmployeeCode"
    loading={isLoading}
  />
}

export default BuyerSelect;