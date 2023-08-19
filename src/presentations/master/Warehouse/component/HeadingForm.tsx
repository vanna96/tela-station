import FormCard from '@/components/card/FormCard';
import MUIDatePicker from '@/components/input/MUIDatePicker';
import MUITextField from '@/components/input/MUITextField';
import MUISelect from '@/components/selectbox/MUISelect';
import { ContactEmployee } from '@/models/BusinessParter';
import TextField from '@mui/material/TextField';
import { documentStatusList } from '@/constants';

export interface IHeadingFormProps {
  handlerChange: (key: string, value: any) => void;
  data: any,
  edit?: boolean

}

export default function HeadingForm({ data, handlerChange, edit }: IHeadingFormProps) {


  return (
    <>
      <FormCard title='Information'>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <MUITextField label="Warehouse Code" value={data?.warehouseCode} name="WarehouseCode" onChange={(e) => handlerChange('warehouseCode', e.target.value)}
 />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <MUITextField label="Warehouse Name" value={data?.warehouseName} name="WarehouseName" onChange={(e) => handlerChange('warehouseName', e.target.value)}/>
          </div>
        </div>
      </FormCard>
    </>
  )
}