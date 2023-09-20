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
  CookieBranch?: any;
}

function CookieBranchSelect(props: BranchProps) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["branchBPL"],
    queryFn: () => new BranchBPLRepository().get(),
    staleTime: Infinity,
  });

  let filteredBranch = data;
  if (props.CookieBranch === -2) {
    // When CookieBranch is -2, select the first value from data
    filteredBranch = data.slice(0, 1); // Slice the first item
  } else if (props.CookieBranch !== 1) {
    // When CookieBranch is not -2 or 1, filter based on CookieBranch
    filteredBranch = data?.filter((e: any) => props?.CookieBranch === e?.BPLID);
  }
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

export default CookieBranchSelect;

// const uniqueBPLIDs = [...new Set(props?.BPdata?.map((e: any) => e.BPLID))];

// const filteredBranch = data?.filter((e : any) => uniqueBPLIDs.includes(e.BPLID));
