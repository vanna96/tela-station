import FormCard from '@/components/card/FormCard';
import MUITextField from '@/components/input/MUITextField';
import MUISelect from '@/components/selectbox/MUISelect';
import Checkbox from '@mui/material/Checkbox';
import React from 'react';
import { SelectChangeEvent, TextField } from '@mui/material';
import ItemGroupSelectSelect from '@/components/selectbox/ItemGroupselect';
export interface IGeneralFormProps {
  data: any,
  handlerChange: (key: string, value: any) => void,
  edit?: boolean,
}


export default function General({ data, handlerChange, edit }: IGeneralFormProps) {
  //---------------------------1----------------------------
  const [show1, setShow1] = React.useState<boolean>(false);
  const [show2, setShow2] = React.useState<boolean>(false);
  const [show3, setShow3] = React.useState<boolean>(false);
  const [show4, setShow4] = React.useState<boolean>(false);
  //---------------------------2----------------------------
  const [bShow, setBShow] = React.useState<boolean>(false);
  //---------------------------------------------------------
  const [Ushow1, setUShow1] = React.useState<boolean>(false);
  const [Ushow2, setUShow2] = React.useState<boolean>(false);
  const [Ushow3, setUShow3] = React.useState<boolean>(false);
  const [Ushow4, setUShow4] = React.useState<boolean>(false);
  //------------------------3---------------------------------
  const [Tshow, setTShow] = React.useState<boolean>(false);
  const [Tshow1, setTShow1] = React.useState<boolean>(false);

  const handleSelectChange = (event: SelectChangeEvent<any>) => {
    const key = 'restrictedItemType';
    const value = event.target.value;
    const selectedValue1 = event.target.value as number;
    const selectedValue2 = event.target.value as number;
    const selectedValue3 = event.target.value as number;
    const selectedValue4 = event.target.value as number;

    // ------------------------------------------------
    setShow1(selectedValue1 === 1);
    setShow2(selectedValue2 === 2);
    setShow3(selectedValue3 === 3);
    setShow4(selectedValue4 === 4);

    //-------------------------------------------------
    handlerChange('restrictedItemType', selectedValue1);
    handlerChange('restrictedItemType', selectedValue2);
    handlerChange('restrictedItemType', selectedValue3);
    handlerChange('restrictedItemType', selectedValue4);
    handlerChange(key, value);
  };
  const handleSelectChangeB = (event: SelectChangeEvent<any>) => {
    const key = 'batchRestrictions';
    const value = event.target.value;
    const selectedValue = event.target.value as string;
    // ------------------------------------------------
    setBShow(selectedValue === "Y");
    //-------------------------------------------------
    handlerChange('batchRestrictions', selectedValue);
    handlerChange(key, value);
  };
  const handleSelectChangeU = (event: SelectChangeEvent<any>) => {
    const key = 'restrictedUoMType';
    const value = event.target.value;
    const selectedValue1 = event.target.value as number;
    const selectedValue2 = event.target.value as number;
    const selectedValue3 = event.target.value as number;
    const selectedValue4 = event.target.value as number;

    // ------------------------------------------------
    setUShow1(selectedValue1 === 1);
    setUShow2(selectedValue2 === 2);
    setUShow3(selectedValue3 === 3);
    setUShow4(selectedValue4 === 4);

    //-------------------------------------------------
    handlerChange('restrictedUoMType', selectedValue1);
    handlerChange('restrictedUoMType', selectedValue2);
    handlerChange('restrictedUoMType', selectedValue3);
    handlerChange('restrictedUoMType', selectedValue4);
    handlerChange(key, value);
  };
  const handleSelectChangeT = (event: SelectChangeEvent<any>) => {
    const key = 'restrictedTransType';
    const value = event.target.value;
    const selectedValue = event.target.value as number;
    const selectedValue1 = event.target.value as number;

    // ------------------------------------------------
    setTShow(selectedValue === 1 || selectedValue === 2 || selectedValue === 3 || selectedValue === 4);
    setTShow1(selectedValue === 0);

    //-------------------------------------------------
    handlerChange('restrictedTransType', selectedValue);
    handlerChange('restrictedTransType', selectedValue1);
    handlerChange(key, value);
  };
  return (
    <FormCard title='General'>
      <h1>
        <div className="flex items-center text-sm pt-3">
          <Checkbox />
          <label htmlFor="Code" className="text-gray-500 text-[14px]">
            Active BinLocation
          </label>
        </div>
        <div className="flex items-center text-sm">
          <Checkbox />
          <label htmlFor="Code" className="text-gray-500 text-[14px]">
            ExcludeAutoAllocOnIssue
          </label>
        </div>
      </h1>
      <h1>
        <div className="flex items-center text-sm pt-3">
          <Checkbox />
          <label htmlFor="Code" className="text-gray-500 text-[14px]">
            Receiving BinLocation
          </label>
        </div> </h1>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <MUITextField label="Item Weight:" disabled value={data?.cardCode} name="" />
          <MUITextField label="No. of Items:" disabled value={data?.cardName} name="" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MUITextField label="Alternative Sort Code:" onChange={(e) => handlerChange('alternativeSortCode', e.target.value)}
            value={data?.alternativeSortCode} name="AlternativeSortCode" />
          <MUITextField label="Minimun Quantity:" onChange={(e) => handlerChange('minimumQty', e.target.value)} value={data?.minimumQty} name="MinimumQty" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MUITextField label="Maximun Weight:" onChange={(e) => handlerChange('maximunWeight', e.target.value)} value={data?.maximunWeight} name="MaximunWeight" />
          <MUITextField label="Bar Code:" onChange={(e) => handlerChange('barCode', e.target.value)} value={data?.barCode} name="BarCode" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MUITextField label="Maximun Quantity:" onChange={(e) => handlerChange('maximumQty', e.target.value)} value={data?.maximumQty} name="MaximumQty" />
          <MUITextField label="Item Group:" onChange={(e) => handlerChange('specificItemGroup', e.target.value)} value={data?.specificItemGroup} name="SpecificItemGroup" />
          <MUITextField label="Item Quantity:" disabled onChange={(e) => handlerChange('maximunWeigt', e.target.value)} value={data?.cardCode} name="" />
          <MUITextField label="No. of Batches/Serials:" disabled value={data?.cardName} name="" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="AgreementMethod" className="text-gray-500 text-[14px]">
              Restricted Item Type
            </label>
            <MUISelect
              items={[
                { value: 0, name: "None" },
                { value: 1, name: "Specific Item" },
                { value: 2, name: "Single Item Only" },
                { value: 3, name: "Specific Item Group" },
                { value: 4, name: "Single Item Group only" },
              ]}
              aliaslabel='name'
              aliasvalue='value'
              onChange={handleSelectChange}
              value={data?.restrictedItemType ?? 0}
              name="RestrictedItemType"
            />


          </div>
          <div>
            <label htmlFor="AgreementMethod" className="text-gray-500 text-[14px]">
              Batch Restriction
            </label>
            <MUISelect
              items={[
                { value: "N", name: "None" },
                { value: "Y", name: "Single batch" },
              ]}
              aliaslabel='name'
              aliasvalue='value'
              onChange={handleSelectChangeB} value={data?.batchRestrictions ?? "N"} name="BatchRestrictions" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="AgreementMethod" className="text-gray-500 text-[14px]">
              Restricted UoM Type
            </label>
            <MUISelect
              items={[
                { value: 0, name: "None" },
                { value: 1, name: "Specific UoM" },
                { value: 2, name: "Single UoM Only" },
                { value: 3, name: "Specific UoM Group" },
                { value: 4, name: "Single UoM Group only" },
              ]}
              aliaslabel='name'
              aliasvalue='value'
              onChange={handleSelectChangeU}
              value={data?.restrictedUoMType ?? 0} name="RestrictedUoMType" />

          </div>
          <div>
            <label htmlFor="AgreementMethod" className="text-gray-500 text-[14px]">
              Transaction Restriction
            </label>
            <MUISelect
              items={[
                { value: 0, name: "None" },
                { value: 1, name: "All transaction" },
                { value: 2, name: "Inbount Transactions" },
                { value: 3, name: "Outbound Transactions" },
                { value: 4, name: "All Except Inventory Transfer and Counting Transactions" },
              ]}
              aliaslabel='name'
              aliasvalue='value'
              onChange={handleSelectChangeT}
              name="RestrictedTransType"
              value={data?.restrictedTransType ?? 0}
            />
          </div>
          <div>
            <MUITextField label="Lastb Update On:" disabled={true} value={data?.c} name="" />
          </div>
          <div className=' h-[55px]'>
            {show1 && (
              <>
                <MUITextField
                  label="Item"
                  value={data?.specificItem ?? ''}
                  onChange={(e) => handlerChange('specificItem', e.target.value)}
                  name="SpecificItem"
                />
              </>
            )}
            {show2 && (
              <>
                <MUITextField
                  label="courent Item"
                  disabled
                  value={data?.specificItem ?? ''}
                  onChange={(e) => handlerChange('specificItem', e.target.value)}
                  name="SpecificItem"
                />
              </>
            )}
            {show3 && (
              <>
      <label htmlFor="" className='text-sm text-slate-600'>Item Group</label>
                <ItemGroupSelectSelect
               
                  value={data?.specificItemGroup ?? ''}
                  onChange={(e) => handlerChange('specificItemGroup', e.target.value)}
                  name="SpecificItemGroup"
                />
              </>
            )}
            {show4 && (
              <>
                <MUITextField
                  label="Single Item Group Only"
                  value={data?.field1 ?? ''}
                  onChange={(e) => handlerChange('specificItemGroup', e.target.value)}
                  disabled
                  name="SpecificItemGroup"
                />
              </>
            )}
          </div>
          <div className=' h-[55px]'>
            {bShow && (
              <>
                <MUITextField
                  label="Current Batch"
                  value={data?.currentBatch ?? ''}
                  onChange={(e) => handlerChange('currentBatch', e.target.value)}
                  disabled
                  name="CurrentBatch"
                />
              </>
            )}
          </div>
          <div>
            {Ushow1 && (
              <>
                <MUITextField
                  label="UoM"
                  value={data?.field1 ?? ''}
                  onChange={(e) => handlerChange('field1', e.target.value)}
                />
              </>
            )}
            {Ushow2 && (
              <>
                <MUITextField
                  label="courent UoM"
                  value={data?.field1 ?? ''}
                  onChange={(e) => handlerChange('field1', e.target.value)}
                  disabled
                />
              </>
            )}
            {Ushow3 && (
              <>
                <MUITextField
                  label="UoM Group"
                  value={data?.specificUoMGroup ?? ''}
                  onChange={(e) => handlerChange('specificUoMGroup', e.target.value)}
                  name="SpecificUoMGroup"
                />
              </>
            )}
            {Ushow4 && (
              <>
                <MUITextField
                  label="Current UoM Group"
                  value={data?.specificUoMGroup ?? ''}
                  onChange={(e) => handlerChange('specificUoMGroup', e.target.value)}
                  name="SpecificUoMGroup"
                  disabled
                />
              </>
            )}
          </div>
  
   
        </div>
        <div className='grid grid-cols-1'>
          <div>
            {Tshow && (
              <div className='w-[100%]'>
                <MUITextField
                  label="Reason"
                  value={data?.restrictionReason ?? ''}
                  onChange={(e) => handlerChange('restrictionReason', e.target.value)}
                />
              </div>
            )
            }
          </div>
        </div>
      </div>
    </FormCard>
  )
}