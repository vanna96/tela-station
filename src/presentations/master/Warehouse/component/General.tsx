import FormCard from '@/components/card/FormCard';
import MUITextField from '@/components/input/MUITextField';
import CitySelect from '@/components/selectbox/City';
import CountrySelect from '@/components/selectbox/Country';
import { Checkbox, SelectChangeEvent } from '@mui/material';
import React from 'react';
export interface IGeneralProps {
  data: any,
  handlerChange: (key: string, value: any) => void
  edit: boolean
}

export default function General({ data, handlerChange, edit }: IGeneralProps) {
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
      <div className="flex flex-col gap-2 py-3">
        <div className="grid grid-cols-2">
          <div className="flex items-center text-sm">
            <Checkbox />
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Inactive
            </label>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2">
          <div className="flex items-center text-sm">
            <Checkbox />
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Enable BinLocation
            </label>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-3">
          <MUITextField label="Street/PO Box:" value={data?.street} onChange={(e) => handlerChange('street', e.target.value)} name="Street" />
          <MUITextField label="Street Number:" value={data?.streetNo} onChange={(e) => handlerChange('streetNo', e.target.value)} name="StreetNo" />
          <MUITextField label="Zip Code:" value={data?.zipCode} onChange={(e) => handlerChange('zipCode', e.target.value)} name="ZipCode" />
          <MUITextField label="County:" value={data?.county} onChange={(e) => handlerChange('county', e.target.value)} name="County" />
          <div>
            <label htmlFor="Code" className="text-gray-500 text-[14px]">State</label>

            <CitySelect
              value={data?.state}
              onChange={(e) => handlerChange('state', e.target.value)}
              name="State"
              country={bShow?.country}
              key={bShow?.country}
            />
          </div>
          {/* <MUITextField label="State:" value={data?.state} onChange={(e) => handlerChange('state', e.target.value)} name="State" /> */}

          <MUITextField label="GLN:" value={data?.globalLocationNumber} onChange={(e) => handlerChange('globalLocationNumber', e.target.value)} name="GlobalLocationNumber" />

        </div>

      </div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-3">

          <MUITextField label="Block:" value={data?.block} onChange={(e) => handlerChange('block', e.target.value)} name="Block" />
          <MUITextField label="Building/Floor/Room:" value={data?.buildingFloorRoom} onChange={(e) => handlerChange('buildingFloorRoom', e.target.value)} name="BuildingFloorRoom" />
          <MUITextField label="City:" value={data?.city} onChange={(e) => handlerChange('city', e.target.value)} name="City" />
          <div>
            <label htmlFor="Code" className="text-gray-500 text-[14px]">Country/Region</label>
            <CountrySelect
              value={data?.country} onChange={handleSelectChangeB} name="Country"
            />
          </div>
          <MUITextField label="Federal Tax ID:" value={data?.federalTaxID} onChange={(e) => handlerChange('federalTaxID', e.target.value)} name="FederalTaxID" />

        </div>

      </div>
    </FormCard>
  )
}