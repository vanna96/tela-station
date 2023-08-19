import FormCard from "@/components/card/FormCard";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import BuyerSelect from "@/components/selectbox/buyer";
import MUISelect from "@/components/selectbox/MUISelect";
import StatusSelect from "@/components/selectbox/Status";
import TerminationReasonSelect from "@/components/selectbox/TerminationReason";
import { ContactEmployee } from "@/models/BusinessParter";
import TextField from "@mui/material/TextField";

export interface IAdministrationProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
}

export default function Administration({
  data,
  edit,
  handlerChange,
}: IAdministrationProps) {
  return (
    <>
      <FormCard title="Administration">
        <div className="flex flex-col gap-2 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Start Date
              </label>
              <div className="">
                <MUIDatePicker
                  error={data?.message?.includes("StartDate")}
                  value={data.startDate}
                  onChange={(e: any) => handlerChange("startDate", e)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Status
              </label>
              <StatusSelect
                value={data?.statusCode}
                onChange={(e) => handlerChange("statusCode", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                TerminationDate
              </label>
              <div className="">
                <MUIDatePicker
                  error={data?.message?.includes("terminationDate")}
                  value={data.startDate}
                  onChange={(e: any) => handlerChange("terminationDate", e)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Termination Reason
              </label>
              <TerminationReasonSelect
                value={data?.treminationReason}
                onChange={(e) => handlerChange("treminationReason", e.target.value)}
              />
            </div>
          </div>
      </FormCard>
    </>
  );
}
