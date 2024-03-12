import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import StopsRepository from "@/services/actions/StopsRepository";
import React from "react";
import request from "@/utilies/request";


interface StopsProps<T = unknown> {
  name?: string,
  defaultValue?: any,
  value?: any,
  onHandlerChange?: (val: StopSchema) => void,
  disabled?: boolean,
}

export type StopSchema = {
  Code: string;
  Name: string;
  U_lat: string;
  U_lng: string;
}

function StopsSelect(props: StopsProps) {
  const { data, isLoading }: any = useQuery({ queryKey: ['stops'], queryFn: () => request('GET', '/TL_STOPS'), staleTime: 0 })


  const values = React.useMemo(() => {
    if (!data?.data?.value) return [];

    return data?.data?.value?.map((e: StopSchema) => ({ ...e, FullName: e?.Code + " - " + e?.Name }));
  }, [data])

  const onHandlerChange = (event: any) => {
    const val = values?.find((e: StopSchema) => e.Code === event?.target?.value);

    if (props.onHandlerChange) {
      props.onHandlerChange(val)
    }
  }

  return <MUISelect
    {...props}
    onChange={onHandlerChange}
    items={values ?? []}
    aliaslabel="FullName"
    aliasvalue="Code"
    loading={isLoading}
  />
}

export default StopsSelect;