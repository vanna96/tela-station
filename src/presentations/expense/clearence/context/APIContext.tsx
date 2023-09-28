import BranchBPLRepository from "@/services/actions/branchBPLRepository"
import CurrencyRepository from "@/services/actions/currencyRepository"
import DistributionRuleRepository from "@/services/actions/distributionRulesRepository"
import request from "@/utilies/request"
import { createContext } from "react"
import { useQuery } from "react-query"

type GeneralProps = { children: any; Edit?: any }

export const APIContext = createContext({})
export const APIContextProvider = ({ children }: GeneralProps) => {
  const { data: LineOfBussiness, loadingLineOfBussiness }: any = useQuery({
    queryKey: ["distribution-rule"],
    queryFn: () => new DistributionRuleRepository().get(),
    // staleTime: Infinity,
  })

  const { data: branchBPL }: any = useQuery({
    queryKey: ["branchBPL"],
    queryFn: () => new BranchBPLRepository().get(),
    staleTime: Infinity,
  })

  const { data: CurrencyAPI }: any = useQuery({
    queryKey: ["Currency"],
    queryFn: () => new CurrencyRepository().get(),
    staleTime: Infinity,
  })

  const { data: sysInfo }: any = useQuery({
    queryKey: ["sysInfo"],
    queryFn: () =>
      request("POST", "CompanyService_GetAdminInfo")
        .then((res: any) => res?.data)
        .catch((err: any) => console.log(err)),
    staleTime: Infinity,
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
    staleTime: Infinity,
  })

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
        }}
      >
        {children}
      </APIContext.Provider>
    </>
  )
}
