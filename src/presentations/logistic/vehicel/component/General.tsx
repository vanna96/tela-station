import FormCard from '@/components/card/FormCard';
import MUIDatePicker from '@/components/input/MUIDatePicker';
import MUITextField from '@/components/input/MUITextField';
import CitySelect from '@/components/selectbox/City';
import CountrySelect from '@/components/selectbox/Country';
import DriverSelect from '@/components/selectbox/Driver';
import MUISelect from '@/components/selectbox/MUISelect';
import { Checkbox, SelectChangeEvent } from '@mui/material';
import React from 'react';
export interface ILogisticFormProps {
  data: any,
  handlerChange: (key: string, value: any) => void
  edit: boolean
}

export default function General({ data, handlerChange, edit }: ILogisticFormProps) {
  const [bShow, setBShow] = React.useState<any>({});

  const handleSelectChangeB = (event: any) => {
    const key = 'country';
    const value = event.target.value as string;
    // const selectedValue = event.target.value as string;
    let emp;
    // ------------------------------------------------
    emp = {
      ...data,
      country: event.target.value
    }
    setBShow(emp);
    //-------------------------------------------------
    handlerChange(key, value)

  };
  return (
    <FormCard title='General'>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-3">
          <MUITextField label="Vehicle Code" value={data?.u_VEHCODE} onChange={(e) => handlerChange('u_VEHCODE', e.target.value)} name="U_VEHCODE" />
          <MUITextField label="Vehicle Number" value={data?.u_VEHNAME} onChange={(e) => handlerChange('u_VEHNAME', e.target.value)} name="U_VEHNAME" />
          <MUITextField label="Make" value={data?.u_VEHMAKE} onChange={(e) => handlerChange('u_VEHMAKE', e.target.value)} name="U_VEHMAKE" />
          <MUITextField label="VIN Number" value={data?.u_VEHVINNO} onChange={(e) => handlerChange('u_VEHVINNO', e.target.value)} name="U_VEHVINNO" />
          {/* <MUITextField label="State:" value={data?.state} onChange={(e) => handlerChange('state', e.target.value)} name="State" /> */}

          <div>
            <label htmlFor="Code" className="text-gray-500 text-[14px]">Driver</label>
            <DriverSelect
              value={data?.u_VEHDRIVER}
              onChange={(e) => handlerChange('u_VEHDRIVER', e.target.value)}
              name="U_VEHDRIVER"

            />
          </div>

          <div>
            <label htmlFor='Code' className='text-gray-500 text-[14px]'>Vehicle Type</label>
            <div className=''>
              <MUISelect
                items={[
                  {
                    label: "Truck",
                    value: "Truck",
                  },
                  {
                    label: "Ship",
                    value: "Ship",
                  },
                  {
                    label: "Train",
                    value: "Train",
                  },
                ]}
                name="U_VEHTYPE"

                value={data?.u_VEHTYPE}
                onChange={(e) => handlerChange('u_VEHTYPE', e.target.value)}
              />
            </div>
          </div>
          <MUITextField label="Length ( cm )" value={data?.u_VEHLENGTH} onChange={(e) => handlerChange('u_VEHLENGTH', e.target.value)} name="U_VEHLENGTH" />
          <MUITextField label="Width ( cm )" value={data?.u_VEHWIDTH} onChange={(e) => handlerChange('u_VEHWIDTH', e.target.value)} name="U_VEHWIDTH" />
          <MUITextField label="Height ( cm )" value={data?.u_VEHHEIGHT} onChange={(e) => handlerChange('u_VEHHEIGHT', e.target.value)} name="U_VEHHEIGHT" />

        </div>

      </div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-3">

          <MUITextField label="Plate Number" value={data?.u_VEHPLATENO} onChange={(e) => handlerChange('u_VEHPLATENO', e.target.value)} name="U_VEHPLATENO" />
          <div className="">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Inspection Expiry
            </label>
            <div className="">
              <MUIDatePicker value={data?.u_VEHEXPDATE} error={data?.message?.includes('U_VEHEXPDATE')} onChange={(e: any) => handlerChange('u_VEHEXPDATE', e)} />
            </div>
          </div>
          <div className="">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Op. License Expiry
            </label>
            <div className="">
              <MUIDatePicker value={data?.u_VEHOPLICED} error={data?.message?.includes('u_VEHOPLICED')} onChange={(e: any) => handlerChange('u_VEHOPLICED', e)} />
            </div>
          </div>
          <div className="">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Next Maint. Date
            </label>
            <div className="">
              <MUIDatePicker value={data?.u_VEHNEXTMAINT} error={data?.message?.includes('u_VEHNEXTMAINT')} onChange={(e: any) => handlerChange('u_VEHNEXTMAINT', e)} />
            </div>
          </div>
          <MUITextField label="Stage Bin" value={data?.u_VEHSTAGING} onChange={(e) => handlerChange('u_VEHSTAGING', e.target.value)} name="U_VEHSTAGING" />
          <MUITextField label="Weight ( kg )" value={data?.u_VEHWEIGHT} onChange={(e) => handlerChange('u_VEHWEIGHT', e.target.value)} name="U_VEHWEIGHT" />
          <MUITextField label="Volumn ( Lt )" value={data?.u_VEHVOLUME} onChange={(e) => handlerChange('u_VEHVOLUME', e.target.value)} name="U_VEHVOLUME" />
          <MUITextField label="Model" value={data?.u_VEHMODEL} onChange={(e) => handlerChange('u_VEHMODEL', e.target.value)} name="U_VEHMODEL" />

        </div>

      </div>
    </FormCard>
  )
}