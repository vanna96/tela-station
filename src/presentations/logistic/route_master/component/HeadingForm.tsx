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
import PriceListSelect from "@/components/selectbox/PriceList";
import BranchSelect from "@/components/selectbox/Branch";

export interface IHeadingFormProps {
  handlerOpenVendor: () => void;
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
  handlerOpenProject?: () => void;
}

export default function HeadingForm({
  handlerOpenVendor,
  data,
  handlerChange,
  handlerOpenProject,
  edit,
}: IHeadingFormProps) {
  console.log(data);
  return (
    <>
      <FormCard title="Information">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            {/* <MUITextField label="Business Partner" disabled={edit} value={data?.cardCode} name="BPCode" onClick={handlerOpenVendor} endAdornment={!edit} /> */}
            <MUITextField
              label="Route Code"
              disabled={edit}
              value={data?.u_RMCODE}
              name="RouteCode"
            />
            <MUITextField
              label="Route Name"
              disabled={edit}
              value={data?.u_RMNAME}
              name="RouteName"
            />
          </div>

          <div className="grid grid-cols-2 gap-3"></div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <MUITextField
                label="Driver"
                disabled={edit}
                value={data?.driver}
                name="driver"
              />

              <MUITextField
                label="Base Station"
                disabled={edit}
                value={data?.u_RMBASEST}
                name="BaseStation"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <>
              <MUITextField
                label="Description"
                disabled={edit}
                value={(data?.u_RMNAME)}
                name="u_RMNAME"
              />
            </>
          </div>
        </div>
      </FormCard>
    </>
  );
}
