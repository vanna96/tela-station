import React from "react";
import MUITextField from "../../../../components/input/MUITextField";
import ContentComponent from "./ContentComponents";
import { ItemModal } from "./ItemModal";
import { Alert, Collapse, IconButton } from "@mui/material";
import { MdOutlineClose } from "react-icons/md";
import { numberWithCommas } from "@/helper/helper";
import { useDocumentTotalHook } from "../hook/useDocumentTotalHook";
import shortid from "shortid";
import MUISelect from "@/components/selectbox/MUISelect";
import { APIContext } from "../context/APIContext";
import { ClockNumberClassKey } from "@mui/x-date-pickers";
import { NumericFormat } from "react-number-format";
import NewContentComponent from "./NewContentComponent";
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
  // handlerChangeItem,
  // handlerAddItem,
  handlerRemoveItem,
  onChange,
  // onChangeItemByCode,
  ContentLoading,
}: ContentFormProps) {
  const [key, setKey] = React.useState(shortid.generate());
  const { tlExpDic }: any = React.useContext(APIContext);
  const [collapseError, setCollapseError] = React.useState(false);

  React.useEffect(() => {
    setCollapseError("Items" in data?.error);
  }, [data?.error]);

  const handlerUpdateRow = (i: number, e: any) => {
    const items: any = data?.Items?.map((item: any, indexItem: number) => {
      if (i.toString() === indexItem.toString()) item[e[0]] = e[1];
      return item;
    });
    onChange("Items", items);
  };

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "Type",
        header: "Type",
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
        accessorKey: "GLAccountCode",
        header: "GL Account Code",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={
                tlExpDic?.find(
                  (e: any) => e.Code === cell.row.original.ExpenseCode
                )?.Name
              }
              // onBlur={(e: any) =>
              //   handlerUpdateRow(cell.row.id, ["ExpenseName", e.target.value])
              // }
            />
          );
        },
      },
      {
        accessorKey: "GLAccountName",
        header: "GL Account Name",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(event) => {
                const newValue = parseFloat(
                  event.target.value.replace(/,/g, "")
                );
                handlerUpdateRow(cell.row.id, ["Amount", newValue]);
              }}
            />
          );
        },
      },
      {
        accessorKey: "Total",
        header: "Total",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerUpdateRow(cell.row.id, ["Total", e.target.value])
              }
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
        items={[...data?.Items]}
        isNotAccount={isNotAccount}
        data={data}
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
