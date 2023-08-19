import FormCard from '@/components/card/FormCard';
import MUISelect from '@/components/selectbox/MUISelect';
import Owner from '@/components/selectbox/Owner';
import PaymentMethod from '@/components/selectbox/PaymentMethod';
import PaymentTerm from '@/components/selectbox/PaymentTerm';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import ShippingType from '@/components/selectbox/ShippingType';
export interface ILogisticFormProps {
  data: any,
  handlerChange: (key: string, value: any) => void
  edit: boolean
}
export default function Logistic({ data, handlerChange, edit }: ILogisticFormProps) {
  return (
    <FormCard title='Logistic'>
      <div className='flex flex-col gap-3 mt-2'>
        <div className=''>
          <label htmlFor="Code" className="text-gray-500 text-[14px]">
            Ship To
          </label>
          <div className="">
            <TextField
              size="small"
              defaultValue={data?.Address2 ?? "Level 1 - 168 Walker Street''"}
              multiline
              rows={4}
              disabled={
                data?.DocumentStatus === "bost_Close" ? true :false
              }
              fullWidth
              name="Description"
              className="w-full "
            />
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-3 mt-2'>
        <div className=''>
          <label htmlFor="Code" className="text-gray-500 text-[14px]">
            Pay To
          </label>
          <div className="">
            <TextField
              size="small"
              multiline
              rows={4}
              fullWidth
              disabled={
                data?.DocumentStatus === "bost_Close" ? true : false
              }
              name="Description"
              className="w-full "
              defaultValue={data?.Address}
            />
          </div>
        </div>
      </div>
      <div className='flex flex-col -mt-4'>
        <div className='grid grid-cols-2'>
          <div>
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Shipping Type
            </label>
            <ShippingType
              onChange={(e) => handlerChange('TransportationCode', e.target.value)}
              value={data?.TransportationCode}
              name="TransportationCode"
            />
          </div>
        </div>
      </div>
    </FormCard>
  )
}