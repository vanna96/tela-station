import { useMemo, useState } from "react";
import MUISelect from "./MUISelect";
import { useQueryHook } from "@/utilies/useQueryHook";
import request from "@/utilies/request";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import OwnerRepository from "@/services/actions/ownerRepository";
import FactoringIndicatorRepository from "@/services/actions/FactoringIndicatorRepository";
import CountryRepository from "@/services/actions/CountryRepository";
import cityRepository from "@/services/actions/CityRepository";


interface CityProps<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onChange?: SelectInputProps<T>['onChange'],
  disabled?: boolean,
  country?: string
  key?: string
}


function CitySelect(props: CityProps) {
  const { data, isLoading }: any = useQuery({ queryKey: ['city'], queryFn: () => new cityRepository().get(), staleTime: Infinity })
  const items = useMemo(() =>
    data?.filter((e: any) => e?.Country === props?.country)?.map((e: any) => ({ label: e?.Name + "(" + e?.Code + ")", value: e?.Code })),
    [data, props?.country])
  return <MUISelect
    {...props}
    items={items ?? []}
    aliaslabel={"Name"}
    aliasvalue="Code"
    loading={isLoading}
  />
}
export default CitySelect;