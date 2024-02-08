import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import StopsRepository from "@/services/actions/StopsRepository";
import React from "react";


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
  const { data, isLoading }: any = useQuery({ queryKey: ['stops'], queryFn: () => new StopsRepository().get(), staleTime: Infinity })

  const onHandlerChange = (event: any) => {
    const val = data?.find((e: StopSchema) => e.Code === event?.target?.value);

    if (props.onHandlerChange) {
      props.onHandlerChange(val)
    }
  }


  const values = React.useMemo(() => {
    if (!data) return [];

    return data?.map((e: StopSchema) => ({ ...e, FullName: e?.Code + " - " + e?.Name }));
  }, [data])




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