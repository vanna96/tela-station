import FormCard from "@/components/card/FormCard";
import { TextField } from "@mui/material";
export interface IRemarkProps {
  data: any;
  handlerChange: (key: string, value: any) => void;

  edit?: boolean;
}

export default function Remark({ data, edit, handlerChange }: IRemarkProps) {
  return (
    <>
      <FormCard title="Remark">
        <div className="flex flex-col gap-2 mt-2">
          <div className="">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Remarks
            </label>
            <div className="">
              <TextField
                size="small"
                multiline
                rows={4}
                fullWidth
                name="FreeText"
                value={data?.freeText}
                onChange={(e) => handlerChange("freeText", e.target.value)}
              />
            </div>
          </div>
        </div>
      </FormCard>
    </>
  );
}
