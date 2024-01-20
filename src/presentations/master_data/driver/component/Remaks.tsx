import MUITextField from "@/components/input/MUITextField";
import { TextField } from "@mui/material";
import React from "react";
import { UseFormProps } from "../form";

const Remarks = ({
  register,
}: UseFormProps) => {
  return (
    <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
      <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
        <h2>Remarks</h2>
      </div>
      <div className="  flex gap-[100px]">
        <div className="col-span-5  w-[50%]">
          <TextField
            size="small"
            fullWidth
            multiline
            rows={2}
            name="Comments"
            className="w-full "
            inputProps={{ ...register("Remarks") }}
          />
        </div>
      </div>
    </div>
  );
};

export default Remarks;
