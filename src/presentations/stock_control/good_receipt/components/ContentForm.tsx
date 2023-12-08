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
import { APIContext } from "../../context/APIContext";
import { ClockNumberClassKey } from "@mui/x-date-pickers";
import { NumericFormat } from "react-number-format";
import { TbEdit } from "react-icons/tb";
import ItemGroupRepository from "@/services/actions/itemGroupRepository";
interface ContentFormProps {
  handlerAddItem: () => void;
  handlerChangeItem: (record: any) => void;
  handlerRemoveItem: (record: any[]) => void;
  data: any;
  onChange: (key: any, value: any) => void;
  onChangeItemByCode: (record: any) => void;
  ContentLoading: any;
}

export default function ContentForm({
  data,
  // handlerChangeItem,
  handlerAddItem,
  handlerRemoveItem,
  onChange,
  onChangeItemByCode,
  ContentLoading,
}: ContentFormProps) {
  const updateRef = React.createRef<ItemModal>();
  const [key, setKey] = React.useState(shortid.generate());
  // const { tlExpDic }: any = React.useContext(APIContext);
  const [collapseError, setCollapseError] = React.useState(false);
  const itemGroupRepo = new ItemGroupRepository();

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
  console.log(data);
  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "ItemCode",
        Header: (header: any) => (
          <label>
            Item No <span className="text-red-500">*</span>
          </label>
        ),
        header: "Item No", //uses the default width from defaultColumn prop
        visible: true,
        size: 120,
        Cell: ({ cell }: any) => (
          <MUITextField
            value={cell.getValue()}
            onBlur={(e) =>
              handlerUpdateRow(cell.row.id, ["ItemCode", e.target.value])
            }
            onClick={() => handlerAddItem()}
            endAdornment
            // onClick={() => {
            //   if (cell.getValue() === "") {
            //     handlerAddItem();
            //     updateRef.current?.onOpen(cell.row.original);
            //   } else {
            //     updateRef.current?.onOpen(cell.row.original);
            //   }
            // }}
            // endIcon={
            //   cell.getValue() === "" ? null : <TbEdit className="text-lg" />
            // }
            // readOnly={true}
          />
        ),
      },
      {
        accessorKey: "ItemName",
        header: "Item Description",
        visible: true,
        Cell: ({ cell }: any) => (
          <MUITextField
            key={"itemName" + cell.getValue() + cell?.row?.id}
            type="text"
            readOnly={true}
            defaultValue={cell.row.original?.ItemDescription || ""}
          />
        ),
      },
      {
        accessorKey: "Quantity",
        header: "Quantity",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"Quantity" + cell.getValue()}
              thousandSeparator
              decimalScale={0}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(event) => {
                const newValue = parseFloat(
                  event.target.value.replace(/,/g, "")
                );
                handlerUpdateRow(cell.row.id, ["Quantity", newValue]);
              }}
            />
          );
        },
      },
      {
        accessorKey: "UomAbsEntry",
        header: "Inventory UoM",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUISelect
              items={cell.row.original?.UomLists?.map((e: any) => ({
                id: e.AbsEntry,
                name: e.Name,
              }))}
              onChange={(e: any) =>
                handlerUpdateRow(cell.row.id, ["UomAbsEntry", e.target.value])
              }
              value={cell.getValue()}
              aliasvalue="id"
              aliaslabel="name"
              name="UomAbsEntry"
            />
          );
        },
      },
      {
        accessorKey: "OffsetAccount",
        header: "Offset Account",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerUpdateRow(cell.row.id, ["OffsetAccount", e.target.value])
              }
            />
          );
        },
      },
      {
        accessorKey: "WarehouseCode",
        header: "Warehouse",
        visible: false,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerUpdateRow(cell.row.id, ["WarehouseCode", e.target.value])
              }
            />
          );
        },
      },
    ],
    [data?.Items]
  );

  const onUpdateByItem = (item: any) => onChangeItemByCode(item);
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
      <ContentComponent
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
