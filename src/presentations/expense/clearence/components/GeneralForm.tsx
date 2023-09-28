import MUIDatePicker from "@/components/input/MUIDatePicker"
import MUITextField from "@/components/input/MUITextField"
import BPLBranchSelect from "@/components/selectbox/BranchBPL"
import MUISelect from "@/components/selectbox/MUISelect"
import SalePerson from "@/components/selectbox/SalePerson"
import { useContext } from "react"
// import { APIContext } from "../context/APIContext"
import { VendorTextField } from "./VendorTextField"
import { useExchangeRate } from "../hook/useExchangeRate"
import { useCookies } from "react-cookie"
import { sysInfo } from "@/helper/helper"
import { APIContext } from "../../settle_receipt/context/APIContext"

export interface IGeneralFormProps {
  handlerChange: (key: string, value: any) => void
  data: any
  handlerOpenProject?: () => void
  edit?: boolean
  hanndResetState?: any
}

export default function GeneralForm({
  data,
  handlerChange,
  edit,
  hanndResetState,
}: IGeneralFormProps) {
  let { LineOfBussiness, loadingLineOfBussiness, CurrencyAPI, sysInfo }: any =
    useContext(APIContext)
  const [cookies, setCookie] = useCookies(["user"])
  const dataCurrency = data?.vendor?.currenciesCollection
    ?.filter(({ Include }: any) => Include === "tYES")
    ?.map(({ CurrencyCode }: any) => {
      return { value: CurrencyCode, name: CurrencyCode }
    })

  useExchangeRate(data?.Currency, handlerChange)

  const branchId =
    data?.Branch || cookies?.user?.Branch || (cookies?.user?.Branch < 0 && 1)

  return (
    <>
      <div className={`rounded-lg shadow-sm bg-white border p-6 px-8 h-screen `}>
        <div
          className={`font-medium  text-xl flex justify-between items-center border-b  mb-4`}
        >
          <h2>Information</h2>
        </div>
        <div>
          <div className="grid grid-cols-2">
            <div className="pl-4 pr-20">
              <div className="grid grid-cols-5 py-2">
                <div className="col-span-2">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Branch <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="col-span-3">
                  <BPLBranchSelect
                    BPdata={cookies?.user?.UserBranchAssignment}
                    onChange={(e) => handlerChange("Branch", e.target.value)}
                    value={branchId || 0}
                    name="Branch"
                    disabled={data?.edit}
                  />
                </div>
              </div>
              <div className="grid grid-cols-5 py-2">
                <div className="col-span-2">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Customer <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="col-span-3">
                  <VendorTextField
                    vtype={`customer`}
                    onChange={(vendor: any) => handlerChange("vendor", vendor)}
                    key={data?.CardCode}
                    error={"CardCode" in data?.error}
                    helpertext={data?.error?.CardCode}
                    autoComplete="off"
                    defaultValue={data?.CardCode}
                    name="BPCode"
                    endAdornment={!edit}
                    branchId={branchId || 0}
                    disabled={data?.edit}
                  />
                </div>
              </div>
              <div className="grid grid-cols-5">
                <div className="col-span-2">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Name
                  </label>
                </div>
                <div className="col-span-3">
                  <MUITextField value={data?.CardName} disabled={true} />
                </div>
              </div>
              <div className="grid grid-cols-5 py-2">
                <div className="col-span-2">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Line of Business
                  </label>
                </div>
                <div className="col-span-3">
                  <MUISelect
                    items={
                      LineOfBussiness?.filter(
                        ({ InWhichDimension, FactorDescription }: any) =>
                          InWhichDimension === 1 &&
                          FactorDescription !== "Unclassified",
                      ) ?? []
                    }
                    aliaslabel="FactorDescription"
                    aliasvalue="FactorCode"
                    loading={loadingLineOfBussiness}
                    value={data?.Lob}
                    onChange={(e) => handlerChange("Lob", e.target.value)}
                    disabled={data?.edit}
                  />
                </div>
              </div>
              <div className="grid grid-cols-5 py-2">
                <div className="col-span-2">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Sale Employees
                  </label>
                </div>
                <div className="col-span-3">
                  <SalePerson
                    name="SalesPersonCode"
                    value={data?.SalesPersonCode}
                    onChange={(e) =>
                      handlerChange("SalesPersonCode", e.target.value)
                    }
                    disabled={data?.edit}
                  />
                </div>
              </div>
              <div className="grid grid-cols-5 py-2">
                <div className="col-span-2">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Currency
                  </label>
                </div>
                <div className="col-span-3">
                  <div className="grid grid-cols-12">
                    <div className="col-span-6">
                      <div className="flex gap-4 items-start">
                        <MUISelect
                          value={data?.Currency || sysInfo?.SystemCurrency}
                          disabled={data?.edit}
                          items={
                            dataCurrency?.length > 0
                              ? dataCurrency
                              : CurrencyAPI?.map((c: any) => {
                                  return {
                                    value: c.Code,
                                    name: c.Name,
                                  }
                                })
                          }
                          aliaslabel="name"
                          aliasvalue="value"
                          onChange={(e: any) =>
                            handlerChange("Currency", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="col-span-6 pl-5">
                      {(data?.Currency || sysInfo?.SystemCurrency) !==
                        sysInfo?.SystemCurrency && (
                        <MUITextField
                          value={data?.ExchangeRate || 0}
                          name=""
                          disabled={true}
                          className="-mt-1"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pl-20">
              <div className="grid grid-cols-5 py-2">
                <div className="col-span-2">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Series
                  </label>
                </div>
                <div className="col-span-3">
                  <div className="grid grid-cols-2 gap-3">
                    <MUISelect
                      items={data.SerieLists ?? []}
                      aliasvalue="Series"
                      aliaslabel="Name"
                      name="Series"
                      loading={data?.isLoadingSerie}
                      value={data?.Series === "" ? "M" : data?.Series}
                      disabled={edit}
                      onChange={(e: any) => handlerChange("Series", e.target.value)}
                    />
                    <div className="-mt-1">
                      <MUITextField
                        size="small"
                        name="DocNum"
                        value={data?.DocNum}
                        disabled={edit}
                        placeholder="Document No"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-5 py-2">
                <div className="col-span-2">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Posting Date
                  </label>
                </div>
                <div className="col-span-3">
                  <MUIDatePicker
                    disabled={data?.isStatusClose || false}
                    value={data.PostingDate}
                    onChange={(e: any) => handlerChange("PostingDate", e)}
                  />
                </div>
              </div>
              {/* <div className="grid grid-cols-5 py-2">
                <div className="col-span-2">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="col-span-3">
                  <MUIDatePicker
                    required
                    error={"DueDate" in data?.error}
                    helpertext={data?.error["DueDate"]}
                    disabled={data?.isStatusClose || false}
                    value={data.DueDate ?? null}
                    onChange={(e: any) => handlerChange("DueDate", e)}
                  />
                </div>
              </div> */}
              <div className="grid grid-cols-5 py-2">
                <div className="col-span-2">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Document Date
                  </label>
                </div>
                <div className="col-span-3">
                  <MUIDatePicker
                    disabled={edit && data?.Status?.includes("A")}
                    value={data.DocumentDate}
                    onChange={(e: any) => handlerChange("DocumentDate", e)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
