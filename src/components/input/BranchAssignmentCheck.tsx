import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { useQuery } from "react-query";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function BranchAssignmentCheck(props:any) {
  const { data, isLoading }: any = useQuery({
    queryKey: ["branchAss"],
    queryFn: () => new BranchBPLRepository().get(),
    staleTime: Infinity,
  });

  const handleChange = (event:any) => {
    const {
      target: { value },
    } = event;
    props?.setBranchAss(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <div>
      <FormControl sx={{ width: "100%" }}>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={props?.branchAss}
          onChange={handleChange}
          input={
            <OutlinedInput
              sx={{
                fontSize: "17px",
                height: 33,
                padding: "10px", // Adjust padding as needed
              }}
            />
          }
          renderValue={(selected: any) => {
            return selected?.map((obj: any) => obj.BPLID).join(" , ");
          }}
          MenuProps={MenuProps}
        >
          {data?.map((name: any) => (
            <MenuItem key={name.BPLID} value={name} sx={{ height: 40 }}>
              <Checkbox
                checked={props?.branchAss.some(
                  (obj: any) => obj.BPLID === name.BPLID
                )}
              />
              <ListItemText primary={name?.BPLID + ' - ' + name?.BPLName} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
