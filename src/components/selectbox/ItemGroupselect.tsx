
import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQueryHook } from "@/utilies/useQueryHook";
import request from "@/utilies/request";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import OwnerRepository from "@/services/actions/ownerRepository";
import FactoringIndicatorRepository from "@/services/actions/FactoringIndicatorRepository";
import ItemGroupRepository from "@/services/actions/itemGroupRepository";


interface ItemGroupProps<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
}



function ItemGroupSelectSelect(props: ItemGroupProps) {
  const { data, isLoading }: any = useQuery({ queryKey: ['itemgroup'], queryFn: () => new ItemGroupRepository().get(), staleTime: Infinity })

  return <MUISelect
    {...props}
    items={data ?? []}
    aliaslabel="GroupName"
    aliasvalue="Number"
    loading={isLoading}
  />
}

export default ItemGroupSelectSelect;