import FormCard from '@/components/card/FormCard';
import MUIDatePicker from '@/components/input/MUIDatePicker';
import MUITextField from '@/components/input/MUITextField';
import MUISelect from '@/components/selectbox/MUISelect';
import { ContactEmployee } from '@/models/BusinessParter';
import TextField from '@mui/material/TextField';
import { documentStatusList } from '@/constants';
import CountrySelect from '@/components/selectbox/Country';
import { Checkbox } from '@mui/material';
import WareBinSelect from '@/components/selectbox/WareBinSelect';
import ShelfSelect from '@/components/selectbox/shelfSelect';
import AisleSelect from '@/components/selectbox/AisleSelect';
import LevelRepository from '@/services/actions/LevelRepository';
import LevelSelect from '@/components/selectbox/LevelSelect';

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
            <div>
              <label htmlFor="Code" className="text-gray-500 text-[14px]">Warehouse:</label>
              <WareBinSelect disabled={edit} onChange={(e) => handlerChange("warehouse", e?.target.value)} value={data?.warehouse} name="Warehouse" />
            </div>
            <div>
              <label htmlFor="Code" className="text-gray-500 text-[14px]">Shelf:</label>
              <ShelfSelect disabled={edit} onChange={(e) => handlerChange("sublevel2", e?.target.value)} value={data?.sublevel2} name="Sublevel2" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label htmlFor="Code" className="text-gray-500 text-[14px]">Bin Code:</label>
              {
                edit == true ? <MUITextField disabled={true} onChange={(e) => handlerChange("binCode", e?.target.value)} value={data?.binCode} name="BinCode" />
                  :
                  <MUITextField disabled={true} onChange={(e) => handlerChange("binCode", e?.target.value)} value={`${data?.warehouse  ?? ""}-${data?.sublevel2 ?? ""}-${data?.binCode ?? ""}${data?.sublevel1 ?? ""}-${data?.sublevel3 ?? ""}`} name="BinCode" />
              }

            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="Code" className="text-gray-500 text-[14px]">Aisle:</label>
              <AisleSelect disabled={edit} onChange={(e) => handlerChange("sublevel1", e?.target.value)} value={data?.sublevel1} name="sublevel1" />
            </div>
            <div>
              <label htmlFor="Code" className="text-gray-500 text-[14px]">Level:</label>

              <LevelSelect disabled={edit} onChange={(e) => handlerChange("sublevel3", e?.target.value)} value={data?.sublevel3} name="Sublevel3" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label htmlFor="Code" className="text-gray-500 text-[14px]">Description:</label>
              <MUITextField  onChange={(e) => handlerChange("description", e?.target.value ?? "")} value={data?.description} name="Description" />
            </div>
          </div>
        </div>
        {/* <div className='col-span-2'></div> */}

      </FormCard>
    </>
  )
}