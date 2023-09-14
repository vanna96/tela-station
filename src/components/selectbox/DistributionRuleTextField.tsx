import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQueryHook } from "@/utilies/useQueryHook";
import request from "@/utilies/request";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import DistributionRuleRepository from "@/services/actions/distributionRulesRepository";

interface Props<T = unknown> {
  name?: string;
  defaultValue?: any;
  value?: any;
  onChange?: SelectInputProps<T>["onChange"];
  disabled?: boolean;
  inWhichNum?: number;
  label?: string;
}

function DistributionRuleText(props: Props) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["distribution-rule"],
    queryFn: () => new DistributionRuleRepository().get(),
    staleTime: Infinity,
  });
  const items = useMemo(
    () => data?.filter((e: any) => e.InWhichDimension === props?.inWhichNum),
    [data, props?.inWhichNum]
  );

  

  return (
    <MUISelect
      {...props}
      items={items}
      aliaslabel="FactorDescription"
      aliasvalue="FactorDescription"
      loading={isLoading}
      label={props?.label}
    />
  );
}

export default DistributionRuleText;
