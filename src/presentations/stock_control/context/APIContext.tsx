import { diffDays, formatDate, getLocalCacheData } from "@/helper/helper"
import BranchBPLRepository from "@/services/actions/branchBPLRepository"
import CurrencyRepository from "@/services/actions/currencyRepository"
import DistributionRuleRepository from "@/services/actions/distributionRulesRepository"
import request from "@/utilies/request"
import { createContext, useEffect, useState } from "react"
import { useQuery } from "react-query"

type GeneralProps = { children: any; Edit?: any }

export const APIContext = createContext({})
export const APIContextProvider = ({ children }: GeneralProps) => {

  const { data: branchBPL, isLoading }: any = useQuery({
    queryKey: ["branchBPL"],
    queryFn: () => new BranchBPLRepository().get(),
    // staleTime: Infinity,
  })


  const { data: sysInfo }: any = useQuery({
    queryKey: ["sysInfo"],
    queryFn: () =>
      request("POST", "CompanyService_GetAdminInfo")
        .then((res: any) => res?.data)
        .catch((err: any) => console.log(err)),
    // staleTime: Infinity,
  })

  const { data: getPeriod }: any = useQuery({
    queryKey: ["CompanyService_GetPeriod"],
    queryFn: () =>
      request("POST", "CompanyService_GetPeriod", {
        PeriodCategoryParams: {
          AbsoluteEntry: 2,
        },
      })
        .then((res: any) => res?.data)
        .catch((err: any) => console.log(err)),
    // staleTime: Infinity,
  })

  const { data: TL_FUEL_LEVEL }: any = useQuery({
    queryKey: ["TL_FUEL_LEVEL"],
    queryFn: () =>
      request("GET", "TL_FUEL_LEVEL")
        .then((res: any) => res?.data?.value?.TL_FUEL_LEVEL_LINESCollection)
        .catch((err: any) => console.log(err)),
    // staleTime: Infinity,
  })




  return (
    <>
      <APIContext.Provider
        value={{
          branchBPL,
          sysInfo,
          getPeriod,
          TL_FUEL_LEVEL
        }}
      >
        {children}
      </APIContext.Provider>
    </>
  )
}
