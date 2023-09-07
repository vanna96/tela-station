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
}

function DistributionRuleSelect(props: Props) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["distribution-rule"],
    queryFn: () => new DistributionRuleRepository().get(),
    staleTime: Infinity,
  });
  const items = useMemo(
    () => data?.filter((e: any) => e.InWhichDimension === 1),
    [data, 1]
  );
  const filteredData = items?.filter(
    (item: any) => item.FactorCode !== "201999"
  );
  return (
    <MUISelect
      {...props}
      items={filteredData}
      aliaslabel="FactorDescription"
      aliasvalue="FactorCode"
      loading={isLoading}
    />
  );
}

export default DistributionRuleSelect;
