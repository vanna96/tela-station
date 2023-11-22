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

  const { data: tl_PumpTest }: any = useQuery({
    queryKey: ["tl_PumpTest"],
    queryFn: () =>
      request("GET", "tl_PumpTest")
        .then((res: any) => res?.data?.value?.TL_PUMP_TEST_LINESCollection)
        .catch((err: any) => console.log(err)),
    // staleTime: Infinity,
  })

  const { data: tl_Dispenser }: any = useQuery({
    queryKey: ["dispenser"],
    queryFn: () =>
      request("GET", "TL_Dispenser")
        .then((res: any) => res?.data?.value)
        .catch((err: any) => console.log(err)),
    // staleTime: Infinity,
  })

  console.log(tl_PumpTest)
  console.log(tl_Dispenser)

  return (
    <>
      <APIContext.Provider
        value={{
          branchBPL,
          sysInfo,
          getPeriod,
          tl_PumpTest,
          tl_Dispenser
        }}
      >
        {children}
      </APIContext.Provider>
    </>
  )
}
