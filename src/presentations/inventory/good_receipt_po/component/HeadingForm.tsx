import FormCard from "@/components/card/FormCard";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import {
  BPAddress,
  ContactEmployee,
  getShippingAddress,
} from "@/models/BusinessParter";
import TextField from "@mui/material/TextField";
import { documentStatusList } from "@/constants";
import ShippingType from "../../../../components/selectbox/ShippingType";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import WarehouseSelect from "@/components/selectbox/Warehouse";
import PriceListSelect from "@/components/selectbox/PriceList";

export interface IHeadingFormProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
}

export default function HeadingForm({
  data,
  handlerChange,
  edit,
}: IHeadingFormProps) {
  console.log(data);
  return (
    <>
      <FormCard title="Information">
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
                onChange={(e: any) => handlerChange("serie", e.target.value)}
              />
              <div className="-mt-1">
                <MUITextField
                  size="small"
                  name="DocNum"
                  value={data?.docNum}
                  placeholder="Document No"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Price List
              </label>
              <PriceListSelect
                name="priceList"
                value={data?.priceList}
                onChange={(e: any) =>
                  handlerChange("priceList", e.target.value)
                }
              />
            </div> */}
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Warehouse
              </label>
              <div className="">
                <WarehouseSelect
                  onChange={(e) => handlerChange("warehouseCode", e.target.value)}
                  value={data?.warehouseCode}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Posting Date
            </label>
            <div className="">
              <MUIDatePicker
                error={data?.message?.includes("DocDate")}
                value={data.docDate}
                onChange={(e: any) => handlerChange("docDate", e)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Document Date
            </label>
            <div className="">
              <MUIDatePicker
                error={data?.message?.includes("dueDate")}
                value={data.dueDate}
                onChange={(e: any) => handlerChange("dueDate", e)}
              />
            </div>
          </div>

          <MUITextField
            label="Ref 2"
            value={data?.reference1}
            name="Reference1"
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-1 text-sm">
              <label htmlFor="Renewal" className="text-gray-500 text-[14px]">
                Reference
              </label>
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

      
      </FormCard>
    </>
  );
}
