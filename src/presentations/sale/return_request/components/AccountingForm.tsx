import FormCard from "@/components/card/FormCard"
import MUITextField from "@/components/input/MUITextField"
import BPAddress from "@/components/selectbox/BPAddress"
import BPProject from "@/components/selectbox/BPProject"
import MUISelect from "@/components/selectbox/MUISelect"
import Owner from "@/components/selectbox/Owner"
import PaymentMethod from "@/components/selectbox/PaymentMethod"
import PaymentTerm from "@/components/selectbox/PaymentTerm"
import ShippingType from "@/components/selectbox/ShippingType"
import { agreementMethodLists, documentStatusList } from "@/constants"
import PaymentTermTypeRepository from "@/services/actions/paymentTermTypeRepository"
import { FormControlLabel, FormGroup, MenuItem, Select } from "@mui/material"
import Checkbox from "@mui/material/Checkbox"
import TextField from "@mui/material/TextField"
import { useEffect } from "react"
import { useQuery } from "react-query"

export interface ILogisticFormProps {
  data: any
  handlerChange: (key: string, value: any) => void
  edit?: boolean
  ref?: React.RefObject<FormCard>
}

export default function LogisticForm({
  data,
  handlerChange,
  edit,
  ref,
}: ILogisticFormProps) {
  const { data: PaymentTermData }: any = useQuery({
    queryKey: ["payment-term-types"],
    queryFn: () => new PaymentTermTypeRepository().get(),
    // staleTime: Infinity,
  })

  useEffect(() => {
    const discount =
      PaymentTermData?.find(
        ({ GroupNumber }: any) => GroupNumber === data?.PaymentTermType
      )?.GeneralDiscount || 0
    handlerChange("DocDiscount", discount)
  }, [data?.PaymentTermType])
  
  return (
    <FormCard title="Logistic" ref={ref}>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex flex-col gap-1 text-sm">
            <div className="">
              <MUITextField
                label="Journal Remark"
                defaultValue={data?.JournalRemark}
                name=""
                onBlur={(e) => handlerChange("JournalRemark", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Payment Method{" "}
            </label>
            <div className="">
              {/* <PaymentMethod
                type="outgoing"
                disabled={data?.disable["PaymentMethod"]}
                name="PaymentMethod"
                value={data.PaymentMethod}
                onChange={(e) => handlerChange("PaymentMethod", e.target.value)}
              /> */}
              <Select
                className="form-control h-[30px] w-[100%]"
                sx={{ border: "0px solid black", padding: 0 }}
                onChange={(e) => handlerChange("PaymentMethod", e.target.value)}
                value={data?.PaymentMethod || ""}
                disabled={data?.isStatusClose || false}
              >
                <MenuItem value=""> - Payment Method - </MenuItem>
                {data?.vendor?.bpPaymentMethod?.map((e: any, index: number) => (
                  <MenuItem key={index} value={e.PaymentMethodCode}>
                    {e.PaymentMethodCode}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              BP Project
            </label>
            <div className="">
              <BPProject
                name="BPProject"
                disabled={data?.disable["BPProject"]}
                value={data.BPProject}
                onChange={(e) => handlerChange("BPProject", e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <label
              htmlFor="SettlementProbability"
              className="text-gray-500 text-[14px]"
            >
              Federal Tax ID
            </label>
            <div className="">
              <TextField
                size="small"
                value={data?.FederalTax ?? ""}
                fullWidth
                className="w-full text-field"
                // type="number"
                name="FederalTax"
                onBlur={(e) => handlerChange("FederalTax", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 text-sm">
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Use Shipped Goods Account"
              value={data?.ShippedGoods}
              onChange={(e: any) => handlerChange("ShippedGoods", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 text-sm">
          <label
            htmlFor="SettlementProbability"
            className="text-gray-500 text-[14px]"
          >
            Payment Terms
          </label>
          <div className="">
            <PaymentTerm
              name="PaymentTermType"
              value={data.PaymentTermType}
              disabled={data?.isStatusClose || false}
              onChange={(e) => handlerChange("PaymentTermType", e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Cash Discount Date Offset
            </label>
            <div className="">
              <TextField
                size="small"
                defaultValue={data?.CashDiscount ?? ""}
                fullWidth
                className="w-full text-field"
                type="number"
                name="CashDiscount"
                onBlur={(e) => handlerChange("CashDiscount", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Create QR Code From
            </label>
            <div className="">
              <TextField
                size="small"
                multiline
                rows={4}
                fullWidth
                name="QRCode"
                className="w-full "
                value={data?.QRCode}
                onBlur={(e) => handlerChange("QRCode", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </FormCard>
  )
}
