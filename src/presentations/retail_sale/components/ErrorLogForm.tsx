import { TextField } from "@mui/material";

export interface ErrorLogForm {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
}

export default function ErrorLogForm({
  data,
  handlerChange,
  edit,
}: ErrorLogForm) {
  console.log(data);
  return (
    <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-screen">
      <TextField
        fullWidth
        multiline
        className="w-full"
        rows={15}
        value={data.U_tl_errormsg}
        onChange={(e: any) => handlerChange("U_tl_errormsg", e.target.value)}
      />
    </div>
  );
}
