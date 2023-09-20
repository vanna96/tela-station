import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import WarehouseRepository from "@/services/warehouseRepository";

interface WarehouseProps<T = unknown> {
  name?: string;
  defaultValue?: any;
  value?: any;
  onChange?: SelectInputProps<T>["onChange"];
  disabled?: boolean;
  Branch?: any;
}

function WarehouseByBranch(props: WarehouseProps) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["warehouse"],
    queryFn: () => new WarehouseRepository().get(),
    staleTime: Infinity,
  });
  const filteredWarehouses = data?.filter(
    (warehouse: any) => warehouse.BusinessPlaceID === props?.Branch
  );

  console.log(data)
  const filter = data?.filter((e: any) => e?.BusinessPlaceID === 1 )

  console.log(filter)

  return (
    <MUISelect
      {...props}
      aliaslabel="WarehouseName"
      aliasvalue="WarehouseCode"
      loading={isLoading}
      items={filteredWarehouses}
    />
  );
}

export default WarehouseByBranch;
