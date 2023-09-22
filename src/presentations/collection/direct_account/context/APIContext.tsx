import { diffDays, formatDate, getLocalCacheData } from "@/helper/helper"
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

  return (
    <>
      <APIContext.Provider value={{ LineOfBussiness, loadingLineOfBussiness, branchBPL }}>
        {children}
      </APIContext.Provider>
    </>
  )
}
