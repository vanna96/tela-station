import React from "react";
import { Alert, Collapse, IconButton, TextField } from "@mui/material";
import MUITextField from "@/components/input/MUITextField";
import { APIContext } from "../context/APIContext";
import SequenceTable from "./SequenceTable";
interface SequenceProps {
  handlerAddItem: () => void;
  handlerChangeItem: (record: any) => void;
  handlerRemoveItem: (record: any[]) => void;
  data: any;
  onChange: (key: any, value: any) => void;
  onChangeItemByCode: (record: any) => void;
  ContentLoading?: any;
}

export default function Sequence({ data, onChange }: SequenceProps) {
  const [collapseError, setCollapseError] = React.useState(false);
  const { sysInfo }: any = React.useContext(APIContext);
  React.useEffect(() => {
    setCollapseError("Items" in data?.error);
  }, [data?.error]);

  return (
    <>
      <Collapse in={collapseError}>
        <Alert
          className=""
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
            ></IconButton>
          }
        ></Alert>
      </Collapse>
      <div className="">
        <SequenceTable data={data} onChange={onChange} />
      </div>
    </>
  );
}
