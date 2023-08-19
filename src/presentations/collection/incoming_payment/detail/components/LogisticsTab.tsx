import request from "@/utilies/request";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { LabelText } from "./Label";

type LogisticsTabProps = {
  data?: any;
  ShippingType?: any;
};

export const LogisticsTab = ({ data, ShippingType }: LogisticsTabProps) => {
  return (
    <div className="text-gray-500">
      <LabelText label="Ship To" text={data?.Address2} />
      <div className="my-5"></div>
      <LabelText label="Pay To" text={data?.Address} />
      <div className="my-5"></div>
      <LabelText label="Shipping Type" text={ShippingType?.Name} />
      <div className="my-5"></div>
      <div className="my-4 ml-[6px]">
        <FormControlLabel
          label="Print Picking Sheet"
          control={
            <Checkbox
              disabled
              checked={data?.Pick === "tYES"}
              sx={{ "& .MuiSvgIcon-root": { fontSize: 22 } }}
            />
          }
        />
      </div>
      <div className="my-4 ml-[6px]">
        <FormControlLabel
          checked={data?.Confirmed === "tYES"}
          label="Approved"
          control={
            <Checkbox
              disabled
              sx={{ "& .MuiSvgIcon-root": { fontSize: 22 } }}
            />
          }
        />
      </div>
      <div className="my-4 ml-[6px]">
        <FormControlLabel
          checked={data?.PartialSupply === "tYES"}
          label="Allow Partial Delivery"
          control={
            <Checkbox
              checked={true}
              disabled
              sx={{ "& .MuiSvgIcon-root": { fontSize: 22 } }}
            />
          }
        />
      </div>
      <LabelText
        label="Pick and Pack Remarks"
        text={data?.PickRemark ? data?.PickRemark : "N/A"}
      />
    </div>
  );
};
