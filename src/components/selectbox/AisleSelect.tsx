import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQueryHook } from "@/utilies/useQueryHook";
import request from "@/utilies/request";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import OwnerRepository from "@/services/actions/ownerRepository";
import FactoringIndicatorRepository from "@/services/actions/FactoringIndicatorRepository";
import wareBinRepository from "@/services/actions/WareBinRepository";
import ShelfRepository from "@/services/actions/ShelfRepository";
import AisleRepository from "@/services/actions/AisleRepository";


interface Aisleprops<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
}



function AisleSelect(props: Aisleprops) {
  const { data, isLoading }: any = useQuery({ queryKey: ['aisle'], queryFn: () => new AisleRepository().get(), staleTime: Infinity })

  return <MUISelect
    {...props}
    items={data ?? []}
    aliaslabel="Code"
    aliasvalue="Code"
    loading={isLoading}
  />
}

export default AisleSelect;