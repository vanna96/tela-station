import {
  FormControl,
  InputBase,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
} from "@mui/material";
import React from "react";

const BootstrapInput: any = styled(InputBase)(({ theme }: any) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    border: "1px solid #ced4da",
    fontSize: 15,
    padding: "5px 0px 5px 12px",
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
}));

interface ISelect {
  value: number; 
  setValue: React.Dispatch<React.SetStateAction<number>>;
}

const SelectPage: React.FC<ISelect> = ({ value, setValue }) => {
  const handleChange = (event: SelectChangeEvent<number>) => {
    setValue(
      typeof event.target.value === "string"
        ? parseInt(event.target.value, 10)
        : (event.target.value as number)
    );
  };

  return (
    <FormControl >
      <Select
        labelId="demo-customized-select-label"
        id="demo-customized-select"
        value={value}
        onChange={handleChange}
        input={<BootstrapInput />}
      >
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
        <MenuItem value={30}>30</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SelectPage;
