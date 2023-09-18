import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import WareBinLocationRepository from "@/services/whBinLocationRepository";

interface WarehouseProps<T = unknown> {
  name?: string;
  defaultValue?: any;
  value?: any;
  onChange?: SelectInputProps<T>["onChange"];
  disabled?: boolean;
  label?: string;
  Whse?: string;
  itemCode?: string;
}

function WareBinLocation(props: WarehouseProps) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["ware-BinLocation"],
    queryFn: () => new WareBinLocationRepository().get(),
    staleTime: Infinity,
  });
  //   console.log(data);

  const filterBinItem = data?.filter(
    (e: any) => e?.ItemCode === props.itemCode
  );
  const filterBin = filterBinItem?.filter(
    (e: any) => e?.WhsCode === props.Whse
  );
    // Create a variable for the value
    let selectedValue;
    if (filterBin && filterBin.length > 0) {
      selectedValue = filterBin[0]?.BinAbsEntry;
    } else {
      selectedValue = "";
    }

    let disabled = filterBin?.length === 0 ? true : false 
  

  return (
    <MUISelect
      {...props}
      aliaslabel="BinCode"
      aliasvalue="BinAbsEntry"
      loading={isLoading}
      items={filterBin}
      disabled={disabled}
      label={props?.label ?? "Bin Location"}
      value={selectedValue}
    />
  );
}

export default WareBinLocation;
