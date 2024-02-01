import React from "react";
import { Alert, Collapse, IconButton, TextField } from "@mui/material";
import MUITextField from "@/components/input/MUITextField";
// import { APIContext } from "../context/APIContext";
import DocumentTable from "./DocumentTable";
import { APIContext } from "@/presentations/master_data/context/APIContext";
interface DocumentProps {
  handlerAddItem: () => void;
  handlerChangeItem: (record: any) => void;
  handlerRemoveItem: (record: any[]) => void;
  data: any;
  onChange: (key: any, value: any) => void;
  onChangeItemByCode: (record: any) => void;
  ContentLoading?: any;
}

export default function Document({ data, onChange }: DocumentProps) {
  const [collapseError, setCollapseError] = React.useState(false);
  const { sysInfo }: any = React.useContext(APIContext);
  React.useEffect(() => {
    setCollapseError("Items" in data?.error);
  }, [data?.error]);  

  return (
    <>
      <Collapse in={collapseError}>
        <Alert
          className="mb-3"
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              //   onClick={onClose}
            >
              {/* <MdOutlineClose fontSize="inherit" /> */}
            </IconButton>
          }
        >
          {/* {data?.error["Items"]} */}
        </Alert>
      </Collapse>
      <div className=" rounded-lg shadow-sm bg-white border p-6 px-8">
        <div className="mt-6">
          <fieldset className="border border-solid border-gray-300 p-3 mb-6 shadow-md">
            <DocumentTable data={data} onChange={onChange} />
          </fieldset>
        </div>
      </div>
    </>
  );
}
function useParams(): any {
  throw new Error("Function not implemented.");
}
