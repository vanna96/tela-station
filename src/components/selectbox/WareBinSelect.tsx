
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


interface WareBinprops<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
}



function WareBinSelect(props: WareBinprops) {
  const { data, isLoading }: any = useQuery({ queryKey: ['warebin'], queryFn: () => new wareBinRepository().get(), staleTime: Infinity })

  return <MUISelect
    {...props}
    items={data ?? []}
    aliaslabel="WarehouseCode"
    aliasvalue="WarehouseCode"
    loading={isLoading}
  />
}

export default WareBinSelect;