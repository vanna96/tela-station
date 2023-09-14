import { useMemo } from "react";
import MUISelect from "./MUISelect";
import { useQuery } from "react-query";
import InitializeData from "@/services/actions";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";

interface BranchProps<T = unknown> {
  name?: string;
  defaultValue?: any;
  value?: any;
  onChange?: SelectInputProps<T>["onChange"];
  disabled?: boolean;
  BPdata?:any;
}

function BPLBranchSelect(props: BranchProps) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["branchBPL"],
    queryFn: () => new BranchBPLRepository().get(),
    staleTime: Infinity,
  });

const uniqueBPLIDs = [...new Set(props?.BPdata?.map((e: any) => e.BPLID))];

const filteredBranch = data?.filter((e : any) => uniqueBPLIDs.includes(e.BPLID));


  return (
    <MUISelect
      {...props}
      aliaslabel="BPLName"
      aliasvalue="BPLID"
      loading={isLoading}
      disabled={props?.disabled}
      items={filteredBranch ? filteredBranch : data}
    />
  );
}

export default BPLBranchSelect;
