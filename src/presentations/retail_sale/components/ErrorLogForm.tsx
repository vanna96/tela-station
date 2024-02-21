import { TextField } from "@mui/material";

export interface ErrorLogForm {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
  handlerChangeObject: (obj: any) => void;
}

export default function ErrorLogForm({
  data,
  handlerChange,
  handlerChangeObject,
  edit,
}: ErrorLogForm) {
  return (
    <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-screen">
      <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
        <h2>Error Log</h2>
      </div>

      <div className="grid grid-cols-12 ">
        <div className="col-span-5 ">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
              Error Log
              </label>
            </div>
            <div className="col-span-3">
              <TextField
                multiline
                className="w-full"
                rows={2}
                value={data.Error}
                onChange={(e: any) => handlerChange("Remark", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
