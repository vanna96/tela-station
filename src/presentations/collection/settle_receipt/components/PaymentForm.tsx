import React from "react"
import { Alert, Collapse, IconButton } from "@mui/material"
import MUITextField from "@/components/input/MUITextField"
import PaymentTable from "./PaymentTable"
import CashAccount from "@/components/selectbox/CashAccount"
import { useDocumentTotalHook } from "../hook/useDocumentTotalHook"
import { APIContext } from "../context/APIContext"

interface PaymentFormProps {
  handlerAddItem: () => void
  handlerChangeItem: (record: any) => void
  handlerRemoveItem: (record: any[]) => void
  data: any
  onChange: (key: any, value: any) => void
  onChangeItemByCode: (record: any) => void
  ContentLoading?: any
}

export default function PaymentForm({ data, onChange }: PaymentFormProps) {
  const [collapseError, setCollapseError] = React.useState(false)
  const {  sysInfo }: any = React.useContext(APIContext)
  React.useEffect(() => {
    setCollapseError("Items" in data?.error)
  }, [data?.error])

  const [totalUsd, TotalFc] = useDocumentTotalHook(data)

  return (
    <>
      <Collapse in={collapseError}>
        <Alert
          className="mb-3"
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              //   onClick={onClose}
            >
              {/* <MdOutlineClose fontSize="inherit" /> */}
            </IconButton>
          }
        >
          {/* {data?.error["Items"]} */}
        </Alert>
      </Collapse>
      <div className=" rounded-lg shadow-sm bg-white border p-6 px-8">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-4">
          <h2>Payment Means - <b>{data?.Currency || sysInfo?.SystemCurrency} { parseFloat(totalUsd).toFixed(2) || "0.00"}</b></h2>
        </div>
        <div className="mt-6">
          <fieldset className="border border-solid border-gray-300 p-3 mb-6 shadow-md">
              <legend className="text-md px-2 font-bold">Payment Means - Check</legend>
              <div className="grid grid-cols-2 my-4">
                <div className="pl-4 pr-20">
                  <div className="grid grid-cols-5">
                    <div className="col-span-2">
                      <label htmlFor="Code" className="text-gray-500 text-[14px]">
                        GL Check Account
                      </label>
                    </div>
                    <div className="col-span-3">
                      <CashAccount
                        onChange={(e: any) => onChange("GLCheck", e.target.value)}
                        value={data?.GLCheck}
                        disabled={data?.edit}
                      />
                    </div>
                  </div>
                </div>
                <div className="pl-20"></div>
              </div>
              <PaymentTable data={data} onChange={onChange} />
          </fieldset>
          <fieldset className="border border-solid border-gray-300 p-3 mb-6 shadow-md">
              <legend className="text-md px-2 font-bold">Payment Means - Bank Transfer</legend>
              <div className="grid grid-cols-2 my-4">
                <div className="pl-4 pr-20">
                  <div className="grid grid-cols-5">
                    <div className="col-span-2">
                      <label htmlFor="Code" className="text-gray-500 text-[14px]">
                        GL Bank Account
                      </label>
                    </div>
                    <div className="col-span-3">
                      <CashAccount
                        onChange={(e: any) => onChange("GLBank", e.target.value)}
                        value={data?.GLBank}
                        disabled={data?.edit}
                      />
                    </div>
                  </div>
                </div>
                <div className="pl-20">
                  <div className="grid grid-cols-5 py-2">
                    <div className="col-span-2">
                      <label htmlFor="Code" className="text-gray-500 text-[14px]">
                        Total
                      </label>
                    </div>
                    <div className="col-span-3">
                      <MUITextField
                        onChange={(e: any) => onChange("GLBankAmount", e.target.value)}
                        value={data?.GLBankAmount}
                        type="number"
                        disabled={data?.edit}
                      />
                    </div>
                  </div>
                </div>
              </div>
          </fieldset>  
          <fieldset className="border border-solid border-gray-300 p-3 mb-6 shadow-md">
              <legend className="text-md px-2 font-bold">Payment Means - Cash</legend>
              <div className="grid grid-cols-2 my-4">
                <div className="pl-4 pr-20">
                  <div className="grid grid-cols-5">
                    <div className="col-span-2">
                      <label htmlFor="Code" className="text-gray-500 text-[14px]">
                        GL Cash Account
                      </label>
                    </div>
                    <div className="col-span-3">
                      <CashAccount
                        onChange={(e: any) => onChange("GLCash", e.target.value)}
                        value={data?.GLCash}
                        disabled={data?.edit}
                      />
                    </div>
                  </div>
                </div>
                <div className="pl-20">
                  <div className="grid grid-cols-5 py-2">
                    <div className="col-span-2">
                      <label htmlFor="Code" className="text-gray-500 text-[14px]">
                        Total
                      </label>
                    </div>
                    <div className="col-span-3">
                      <MUITextField
                        onChange={(e: any) => onChange("GLCashAmount", e.target.value)}
                        value={data?.GLCashAmount}
                        type="number"
                        disabled={data?.edit}
                      />
                    </div>
                  </div>
                </div>
              </div>
          </fieldset>          
        </div>
      </div>
    </>
  )
}
function useParams(): any {
  throw new Error("Function not implemented.")
}

