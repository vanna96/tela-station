import FormCard from '@/components/card/FormCard';
import MUIDatePicker from '@/components/input/MUIDatePicker';
import MUITextField from '@/components/input/MUITextField';
import MUISelect from '@/components/selectbox/MUISelect';
import { ContactEmployee } from '@/models/BusinessParter';
import TextField from '@mui/material/TextField';
import { documentStatusList } from '@/constants';

export interface IHeadingFormProps {
  handlerOpenVendor: () => void,
  handlerChange: (key: string, value: any) => void;
  data: any,
  edit?: boolean
  handlerOpenProject?: () => void,
}

export default function HeadingForm({ handlerOpenVendor, data, handlerChange, handlerOpenProject,edit }: IHeadingFormProps) {


  return (
    <>
      <FormCard title='Information'>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <MUITextField label="Vendor Code" disabled={edit} value={data?.CardCode} name="BPCode" onClick={handlerOpenVendor} endAdornment={!edit} />
            <MUITextField label="Vendor Name" disabled={edit} value={data?.CardName} name="BPName" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">Contact Person</label>
              <div className="">
                <MUISelect
                  items={data?.ContactPersonList?.map((e: ContactEmployee) => ({ id: e.id, name: e.name }))}
                  onChange={(e) => handlerChange('ContactPersonCode', e.target.value)}
                  value={data?.ContactPersonCode}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="ContactPersonCode"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 text-sm">
              <MUITextField label="Vender Ref.No" name="NumAtCard"
                onChange={(e) => handlerChange('NumAtCard', e.target.value)}
                value={data?.NumAtCard}
              />
            </div>
          </div>

          <div className="grid grid-cols- gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Currency
              </label>
              <div className="grid grid-cols-2 gap-3">
                <MUITextField
                  name="DocCurrency"
                  value={data.Currency}
                  onChange={(e) => handlerChange('Currency', e.target.value)}
                disabled={edit}
                />
                <div></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              No
            </label>
            <div className="grid grid-cols-2 gap-3">
              <MUISelect
                items={data.SerieLists ?? []}
                aliasvalue="Series"
                aliaslabel="Name"
                name="Series"
                loading={data?.isLoadingSerie}
                value={data?.Series}
                disabled={edit}
                onChange={(e: any) => handlerChange('Series', e.target.value)}
              />
              <div className='-mt-1'>
                <MUITextField size="small" name="DocNum" value={data?.DocNum} disabled={edit} placeholder='Document No' />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* <MUISelect
                  items={[{ name: 'Item Method', value: 'I' }, { name: 'Monetary Method', value: 'M' }]}
                  aliaslabel='name'
                  aliasvalue='value'
                  name="AgreementMethod"
                  value={data.agreementMethod}
                  onChange={(e) => handlerChange('agreementMethod', e.target.value)}
                /> */}
            <MUITextField label="Status" disabled={edit} value={(data?.DocumentStatus).replace("bost_","")} name="DocumentStatus" />
          </div>

          <div className="grid grid-cols-2 gap-3">
              <>
              <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Posting Date
              </label>
              <div className="">
                <MUIDatePicker error={data?.message?.includes('DocDate')}  value={data.DocDate} name="DocDate" onChange={(e: any) => handlerChange('DocDate', e)} />
              </div>
            </div>

            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Delivery date
              </label>
              <div className="">
                <MUIDatePicker error={data?.message?.includes('DocDueDate')} name="DocDueDate" value={data.DocDueDate} onChange={(e: any) => handlerChange('DocDueDate', e)} />
              </div>
                </div>
              </> 
              <>
                <div className="flex flex-col gap-1 text-sm">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                   Document date
                  </label>
                  <div className="">
                    <MUIDatePicker disabled={edit} error={data?.message?.includes('TaxDate')} name="TaxDate" value={data.TaxDate} onChange={(e: any) => handlerChange('TaxDate', e)} />
                  </div>
                </div>
                {/* <div className="flex flex-col gap-1 text-sm">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                  </label>
                  <div className="">
                    <MUIDatePicker disabled={edit} error={data?.message?.includes('TaxDate')} name="TaxDate" value={data.taxDate} onChange={(e: any) => handlerChange('taxDate', e)} />
                  </div>
                </div> */}
              </> 
     
            
          
          </div>
        </div>  
      </FormCard>
    </>
  )
}