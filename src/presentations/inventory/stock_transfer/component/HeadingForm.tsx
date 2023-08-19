import FormCard from '@/components/card/FormCard';
import MUIDatePicker from '@/components/input/MUIDatePicker';
import MUITextField from '@/components/input/MUITextField';
import MUISelect from '@/components/selectbox/MUISelect';
import { BPAddress, ContactEmployee } from '@/models/BusinessParter';
import TextField from '@mui/material/TextField';
import { documentStatusList } from '@/constants';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import { getShippingAddress } from '@/models/BusinessParter';
import PriceListSelect from '@/components/selectbox/PriceList';
import BranchSelect from '@/components/selectbox/Branch';

export interface IHeadingFormProps {
  handlerOpenVendor: () => void,
  handlerChange: (key: string, value: any) => void;
  data: any,
  edit?: boolean
  handlerOpenProject?: () => void,
}

export default function HeadingForm({ handlerOpenVendor, data, handlerChange, handlerOpenProject, edit }: IHeadingFormProps) {

  console.log(data)
  return (
    <>
      <FormCard title='Information'>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <MUITextField label="Business Partner" disabled={edit} value={data?.cardCode} name="BPCode" onClick={handlerOpenVendor} endAdornment={!edit} />
            <MUITextField label="Name" disabled={edit} value={data?.cardName} name="BPName" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">Contact Person</label>
              <div className="">
                <MUISelect
                  items={data?.contactPersonList?.map((e: ContactEmployee) => ({ id: e.id, name: e.name }))}
                  onChange={(e) => handlerChange('contactPersonCode', e.target.value)}
                  // value={data?.contactPersonCode}
                  value={edit ? data?.contactPerson : data?.contactPersonCode}

                  aliasvalue="id"
                  aliaslabel="name"
                  name="ContactPersonCode"
                />

              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">Ship To </label>
              {edit ? (
                <div><MUITextField disabled={edit} label='' value={data?.shipToCode} name="shipToCode" /></div>
              ) : (
                <MUISelect
                  disabled={edit}
                  items={data?.shippingType?.filter((e: { addressName: string; }) => e.addressName !== 'Bill To').map((e: BPAddress) => ({
                    addressName: e.addressName,
                    street: e.street,
                    city: e.city,
                    country: e.city,
                    federalTaxId: e.federalTaxId,
                    addressType: e.addressType
                  }))}
                  onChange={(e) => handlerChange('shipToDefault', e.target.value)}
                  value={data?.shipToDefault}
                  aliasvalue="addressName"
                  aliaslabel="addressName"
                  name="shipToDefault"
                />
              )}

            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">Price List</label>
              <div className="">
                <PriceListSelect
                  disabled={edit}
                  name="priceLists"
                  value={data.priceLists}
                  onChange={(e: any) => handlerChange('priceLists', e)}
                />

              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">Ship To Address</label>
              {edit === data.address ? (
                <TextField
                  size="small"
                  multiline
                  rows={3}
                  fullWidth
                  name="address"
                  className="w-full "
                  value={getShippingAddress(data.shipToDefault, data.shippingType)}

                />
              ) : (
                <TextField
                  disabled={edit}
                  size="small"
                  multiline
                  rows={3}
                  fullWidth
                  name="address"
                  className="w-full "
                  value={data.address}


                />
              )}

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
                items={data.series ?? []}
                aliasvalue="Series"
                aliaslabel="Name"
                name="Series"
                loading={data?.isLoadingSerie}
                value={data?.serie}
                disabled={edit}
                onChange={(e: any) => handlerChange('serie', e.target.value)}
              />
              <div className='-mt-1'>
                <MUITextField size="small" name="DocNum" value={data?.docNum} disabled={edit} placeholder='Document No' />
              </div>
            </div>
          </div>


          <div className="grid grid-cols-2 gap-3">
            {data.documentStatus === "bost_Open" ?
              <>
                <MUITextField label="Status" disabled={edit} value={(data?.documentStatus).replace("bost_", "")} name="DocumentStatus" />

                <div className="flex flex-col gap-1 text-sm">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Posting Date
                  </label>
                  <div className="">
                    <MUIDatePicker disabled={edit} error={data?.message?.includes('DocDate')} value={data.docDate} onChange={(e: any) => handlerChange('docDate', e)} />
                  </div>
                </div>


                <div className="flex flex-col gap-1 text-sm">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Document Date
                  </label>
                  <div className="">
                    <MUIDatePicker error={data?.message?.includes('dueDate')} value={data.dueDate} onChange={(e: any) => handlerChange('dueDate', e)} />
                  </div>
                </div>

              </> :
              <>

                {/* <div className="flex flex-col gap-1 text-sm">
                  <MUITextField label="Status" disabled={edit} value={(data?.documentStatus)} name="DocumentStatus" />


                </div> */}

                <div className="flex flex-col gap-1 text-sm">

                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Posting Date
                  </label>
                  <div className="">
                    <MUIDatePicker disabled={edit} error={data?.message?.includes('DocDate')} value={data.docDate} onChange={(e: any) => handlerChange('docDate', e)} />
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Document Date
                  </label>
                  <div className="">
                    <MUIDatePicker error={data?.message?.includes('taxDate')} value={data.taxDate} onChange={(e: any) => handlerChange('taxDate', e)} />
                  </div>
                </div>
              </>
            }
          </div>

          <div className="flex gap-1 text-sm">

            <div className='grid grid-cols-2 gap-3'>
              <div className='flex items-center gap-1 text-sm'>
                <label htmlFor='Renewal' className='text-gray-500 text-[14px]'>Reference</label>
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-haspopup="true"
                >
                  <MoreHorizIcon />
                </IconButton>
              </div>
            </div>

          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">From Branch</label>
              <div className="">
                <BranchSelect
                  onChange={(e) => handlerChange('fromBranch', e.target.value)}
                  value={data?.fromBranch}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">To Branch</label>
              <div className="">
                <BranchSelect
                  onChange={(e) => handlerChange('toBranch', e.target.value)}
                  value={data?.toBranch}
                />
              </div>
            </div>
          </div>
        </div>
      </FormCard>
    </>
  )
}