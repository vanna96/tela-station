import { useMemo } from "react";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import MUISelect from "../selectbox/MUISelect";
import request, { url } from "@/utilies/request";
import VatGroupRepository from "@/services/actions/VatGroupRepository";

interface VatProps<T = unknown> {
  name?: string;
  defaultValue?: any;
  value?: any;
  onChange?: SelectInputProps<T>["onChange"];
  disabled?: boolean;
}

function SaleVatSelect(props: VatProps) {
  let { data, isLoading }: any = useQuery({
    queryKey: ["vat-groups"],
    queryFn: () => new VatGroupRepository().get(),
    staleTime: Infinity,
  });

  data = data?.filter(
    (e: any) => e.category === "OutputTax" && e.inActive === "tNO"
  );
  return (
    <MUISelect
      {...props}
      aliaslabel="code"
      aliasvalue="code"
      loading={isLoading}
      disabled={props?.disabled}
      items={data}
    />
  );
}

export default SaleVatSelect;
