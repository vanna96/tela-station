import React from "react";
import { Alert, Collapse, IconButton, TextField } from "@mui/material";
import MUITextField from "@/components/input/MUITextField";
import PaymentTable from "./PaymentTable";
import CashAccount from "@/components/selectbox/CashAccount";
import { useDocumentTotalHook } from "../hook/useDocumentTotalHook";
import { APIContext } from "../context/APIContext";
import FormattedInputs from "@/components/input/NumberFormatField";
import { NumericFormat } from "react-number-format";
import { currencyFormat } from "@/utilies";
import NewContentForm from "../../components/NewContentForm";
import AccountCodeAutoComplete from "@/components/input/AccountCodeAutoComplete";

interface PaymentFormProps {
  handlerAddItem: () => void;
  handlerChangeItem: (record: any) => void;
  handlerRemoveItem: (record: any[]) => void;
  data: any;
  onChange: (key: any, value: any) => void;
  onChangeItemByCode: (record: any) => void;
  ContentLoading?: any;
}

export default function PaymentForm({ data, onChange }: PaymentFormProps) {
  const [collapseError, setCollapseError] = React.useState(false);
  const { sysInfo }: any = React.useContext(APIContext);
  React.useEffect(() => {
    setCollapseError("Items" in data?.error);
  }, [data?.error]);

  const [totalUsd, TotalFc] = useDocumentTotalHook(data);
  

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
          <div>
            <NewContentForm data={data} onChange={onChange} />
          </div>

          <fieldset className="border border-solid border-gray-300 p-3 mb-6 shadow-md">
            <legend className="text-md px-2 font-bold">
              Payment Means - Check
            </legend>

            <div className="grid grid-cols-12 py-2 ">
              <div className="col-span-2 col-start-2">
                <label htmlFor="Code" className="text-gray-500 text-[14px]">
                  Cash Account
                </label>
              </div>
              <div className="col-span-5 col-start-4">
                <AccountCodeAutoComplete
                  onChange={(e: any) => onChange("GLCash", e)}
                  value={data?.GLCash}
                  disabled={data?.edit}
                />
              </div>
            </div>
            <PaymentTable data={data} onChange={onChange} />
          </fieldset>
        </div>
      </div>
    </>
  );
}
function useParams(): any {
  throw new Error("Function not implemented.");
}
