import { useMemo } from "react"
import MUISelect from "./MUISelect"
import { useQuery } from "react-query"
import InitializeData from "@/services/actions"
import { SelectInputProps } from "@mui/material/Select/SelectInput"
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository"
import request from "@/utilies/request"

interface LineofBussinessProps<T = unknown> {
  name?: string
  defaultValue?: any
  value?: any
  onChange?: SelectInputProps<T>["onChange"]
}

export default function LineofBussiness(props: LineofBussinessProps) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["LineofBussiness"],
    queryFn: async () =>
      await request("GET", "/DistributionRules?$filter=InWhichDimension eq 1")
        .then((res: any) =>
          res.data?.value.filter((res: any) =>
            ["Oil", "Lube", "LPG"].includes(res.FactorDescription)
          )
        )
        .catch((err: any) => []),
    staleTime: Infinity,
  })

  return (
    <MUISelect
      {...props}
      aliaslabel="FactorDescription"
      aliasvalue="FactorCode"
      loading={isLoading}
      items={data} 
    />
  )
}
