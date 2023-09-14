import React from "react"
import { Alert, Collapse, IconButton } from "@mui/material"
import MUITextField from "@/components/input/MUITextField"
import PaymentTable from "./PaymentTable"
import ControlAccount from "@/components/selectbox/ControlAccount"

interface PaymentFormProps {
  handlerAddItem: () => void
  handlerChangeItem: (record: any) => void
  handlerRemoveItem: (record: any[]) => void
  data: any
  onChange: (key: any, value: any) => void
  onChangeItemByCode: (record: any) => void
}

export default function PaymentForm({ data, onChange }: PaymentFormProps) {
  const [collapseError, setCollapseError] = React.useState(false)

  React.useEffect(() => {
    setCollapseError("Items" in data?.error)
  }, [data?.error])

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
          <h2>Payment Means</h2>
        </div>
        <div className="mt-6">
          <label>Payment Means - Check</label>
          <div className="grid grid-cols-2 my-4">
            <div className="pl-4 pr-20">
              <div className="grid grid-cols-5">
                <div className="col-span-2">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    GL Account (Transfer)
                  </label>
                </div>
                <div className="col-span-3">
                  <ControlAccount
                    onChange={(e: any) => onChange("GLCheck", e.target.value)}
                    value={data?.GLCheck}
                  />
                </div>
              </div>
            </div>
            <div className="pl-20"></div>
          </div>
          <div className="mb-12">
            <PaymentTable />
          </div>
          <label>Payment Means - Bank Transfer</label>
          <div className="grid grid-cols-2 my-4">
            <div className="pl-4 pr-20">
              <div className="grid grid-cols-5">
                <div className="col-span-2">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    GL Account (Transfer)
                  </label>
                </div>
                <div className="col-span-3">
                  <ControlAccount
                    onChange={(e: any) => onChange("GLBank", e.target.value)}
                    value={data?.GLBank}
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
                  />
                </div>
              </div>
            </div>
          </div>
          <label>Payment Means - Cash</label>
          <div className="grid grid-cols-2 my-4">
            <div className="pl-4 pr-20">
              <div className="grid grid-cols-5">
                <div className="col-span-2">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    GL Account (Transfer)
                  </label>
                </div>
                <div className="col-span-3">
                  <ControlAccount
                    onChange={(e: any) => onChange("GLCash", e.target.value)}
                    value={data?.GLCash}
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
