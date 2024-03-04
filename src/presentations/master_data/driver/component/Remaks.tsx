import MUITextField from "@/components/input/MUITextField";
import { TextField } from "@mui/material";
import React from "react";
import { UseFormProps } from "../form";

const Remarks = ({
  register,detail
}: UseFormProps) => {
  return (
    <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
      <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
        <h2>Remarks</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-[6rem] md:gap-0 ">
        <div className="">
          <TextField
            disabled={detail}
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
