import { diffDays, formatDate, getLocalCacheData } from "@/helper/helper"
import GLAccountRepository from "@/services/actions/GLAccountRepository"
import BranchBPLRepository from "@/services/actions/branchBPLRepository"
import DistributionRuleRepository from "@/services/actions/distributionRulesRepository"
import request from "@/utilies/request"
import { createContext, useEffect, useState } from "react"
import { useQuery } from "react-query"

type GeneralProps = { children: any; Edit?: any }

export const APIContext = createContext({})
export const APIContextProvider = ({ children }: GeneralProps) => {
  
  const { data: LineOfBussiness, loadingLineOfBussiness }: any = useQuery({
    queryKey: ["distribution-rule"],
    queryFn: () => new DistributionRuleRepository().get(),
    // staleTime: Infinity,
  })

  const { data:branchBPL, isLoading }: any = useQuery({
    queryKey: ["branchBPL"],
    queryFn: () => new BranchBPLRepository().get(),
    staleTime: Infinity,
  });

  const { data:glAccount }: any = useQuery({
    queryKey: ["gl_account"],
    queryFn: () => new GLAccountRepository().get(),
    // staleTime: Infinity,
  });
  

  return (
    <>
      <APIContext.Provider value={{ LineOfBussiness, loadingLineOfBussiness, branchBPL }}>
        {children}
      </APIContext.Provider>
    </>
  )
}
