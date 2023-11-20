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
  const { data: LineOfBussiness, loadingLineOfBussiness }: any = useQuery({
    queryKey: ["distribution-rule"],
    queryFn: () => new DistributionRuleRepository().get(),
    // staleTime: Infinity,
  })

  const { data: branchBPL, isLoading }: any = useQuery({
    queryKey: ["branchBPL"],
    queryFn: () => new BranchBPLRepository().get(),
    // staleTime: Infinity,
  })

  const { data: CurrencyAPI }: any = useQuery({
    queryKey: ["Currency"],
    queryFn: () => new CurrencyRepository().get(),
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

  console.log(tl_PumpTest)

  return (
    <>
      <APIContext.Provider
        value={{
          LineOfBussiness,
          loadingLineOfBussiness,
          branchBPL,
          CurrencyAPI,
          sysInfo,
          getPeriod,
          tl_PumpTest
        }}
      >
        {children}
      </APIContext.Provider>
    </>
  )
}
