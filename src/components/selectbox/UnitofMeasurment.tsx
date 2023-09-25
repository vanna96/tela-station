import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";

interface UOMProps<T = unknown> {
  name?: string;
  defaultValue?: any;
  value?: any;
  onChange?: SelectInputProps<T>["onChange"];
  label?: string;
  filterAbsEntry?: any[] | undefined;
}

function UOMSelect(props: UOMProps) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["uom"],
    queryFn: () => new UnitOfMeasurementRepository().get(),
    staleTime: Infinity,
  });
  const filterAbsEntry = props.filterAbsEntry || []; 

  const uomFilter = data?.filter((e: any) =>
    filterAbsEntry.includes(e.AbsEntry)
  );
  return (
    <MUISelect
      {...props}
      aliaslabel="Name"
      aliasvalue="AbsEntry"
      loading={isLoading}
      items={uomFilter ?? data}
      label={props?.label}
    />
  );
}

export default UOMSelect;
