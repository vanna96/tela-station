import React from "react";
import MUITextField from "@/components/input/MUITextField";
import { Alert, Collapse, IconButton } from "@mui/material";
import { MdOutlineClose } from "react-icons/md";
import { numberWithCommas } from "@/helper/helper";
import shortid from "shortid";
import MUISelect from "@/components/selectbox/MUISelect";
import { ClockNumberClassKey } from "@mui/x-date-pickers";
import { NumericFormat } from "react-number-format";
import NewContentComponent from "./NewContentComponent";
import AccountTextField from "@/components/input/AccountTextField";
import CashACAutoComplete from "@/components/input/CashAccountAutoComplete";
import AccountCodeAutoComplete from "@/components/input/AccountCodeAutoComplete";
interface ContentFormProps {
  handlerAddItem?: () => void;
  handlerChangeItem?: (record: any) => void;
  handlerRemoveItem?: (record: any[]) => void;
  data: any;
  onChange: (key: any, value: any) => void;
  onChangeItemByCode?: (record: any) => void;
  ContentLoading?: any;
}

export default function NewContentForm({
  data,
  handlerRemoveItem,
  onChange,
  ContentLoading,
}: ContentFormProps) {
  const [key, setKey] = React.useState(shortid.generate());
  //   const { tlExpDic }: any = React.useContext(APIContext);
  const [collapseError, setCollapseError] = React.useState(false);
  React.useEffect(() => {
    setCollapseError("Items" in data?.error);
  }, [data?.error]);

  const handlerUpdateRow = (key: number, obj: any) => {
    const newData = data?.IncomingCash?.map((item: any, index: number) => {
      if (index.toString() !== key.toString()) return item;
      item[Object.keys(obj).toString()] = Object.values(obj).toString();
      return item;
    });
    if (newData.length <= 0) return;
    onChange("IncomingCash", newData);
  };

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "Currency",
        header: "Currency",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              // onBlur={(e: any) =>
              //   handlerUpdateRow(cell.row.id, ["ExpenseName", e.target.value])
              // }
            />
          );
        },
      },
      {
        accessorKey: "Rate",
        header: "Rate",
        visible: true,
        // size: 300,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
            key={"Rate_" + cell.getValue()}
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale
            customInput={MUITextField}
            defaultValue={cell.getValue()}
            onBlur={(event) => {
              const newValue = parseFloat(
                event.target.value.replace(/,/g, "")
              );
              handlerUpdateRow(cell?.row?.id || 0, {
                Rate: event.target.value,
              });
            }}
          />
          );
        },
      },

      {
        accessorKey: "Amount",
        header: "Amount",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"Amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(event) => {
                const newValue = parseFloat(
                  event.target.value.replace(/,/g, "")
                );
                handlerUpdateRow(cell?.row?.id || 0, {
                  Amount: event.target.value,
                });
              }}
            />
          );
        },
      },
    ],
    []
  );

  const onClose = React.useCallback(() => setCollapseError(false), []);
  const isNotAccount = data?.DocType !== "rAccount";
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
              onClick={onClose}
            >
              <MdOutlineClose fontSize="inherit" />
            </IconButton>
          }
        >
          {data?.error["Items"]}
        </Alert>
      </Collapse>
      <NewContentComponent
        key={key}
        columns={itemColumns}
        items={[...data?.IncomingCash]}
        isNotAccount={isNotAccount}
        data={data.IncomingCash}
        onChange={onChange}
        onRemoveChange={handlerRemoveItem}
        loading={ContentLoading}
        handlerAddSequence={() => {
          // handlerAddSequence()
          // setKey(shortid.generate())
        }}
      />
    </>
  );
}
