import React from "react";
import MUITextField from "../../../../components/input/MUITextField";
import ContentComponent from "./ContentComponents";
import { ItemModal } from "./ItemModal";
import {
  Alert,
  Autocomplete,
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  TextField,
} from "@mui/material";
import { MdOutlineClose } from "react-icons/md";
import { numberWithCommas } from "@/helper/helper";
import { useDocumentTotalHook } from "../hook/useDocumentTotalHook";
import shortid from "shortid";
import MUISelect from "@/components/selectbox/MUISelect";
import { APIContext } from "../../context/APIContext";
import { ClockNumberClassKey } from "@mui/x-date-pickers";
import { NumericFormat } from "react-number-format";
import UserCodeAutoComplete from "@/components/input/UserCodeAutoCeomplete";
import BranchAutoComplete from "@/components/input/BranchAutoComplete";
import WarehouseAutoComplete from "@/components/input/WarehouseAutoComplete";
import WarehouseAttendTo from "@/components/selectbox/WarehouseAttention";
import BinLocationAutoComplete from "@/components/input/BinLocationAutoComplete";
import BinLocationTo from "@/components/input/BinLocationTo";
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
  handlerRemoveItem,
  onChange,
  ContentLoading,
}: ContentFormProps) {
  const [key, setKey] = React.useState(shortid.generate());
  const { TL_FUEL_LEVEL }: any = React.useContext(APIContext);

  const [collapseError, setCollapseError] = React.useState(false);

  React.useEffect(() => {
    setCollapseError("Items" in data?.error);
  }, [data?.error]);

  const handlerUpdateRow = (i: number, e: any) => {
    const items = [...data?.Items];
    items[i] = { ...items[i], [e[0]]: e[1] };
    onChange("Items", items);
  };

  const handlerUpdateMultipleRow = (i: number, updates: [string, any][]) => {
    const items = [...data.Items];

    updates.forEach(([property, value]) => {
      items[i] = {
        ...items[i],
        [property]: value,
      };
    });
    onChange("Items", items);
  };

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "U_tl_whscode",
        header: "Warehouse Code",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <WarehouseAttendTo
              U_tl_attn_ter={false}
              value={cell.getValue() || -1}
              onChange={(e: any) =>
                handlerUpdateRow(cell.row.id, ["U_tl_whscode", e])
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_bincode",
        header: "Bin Code",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <BinLocationTo
              Warehouse={cell.row.original.U_tl_whscode}
              value={cell.getValue()}
              onChange={(e: any) =>
                handlerUpdateRow(cell.row.id, ["U_tl_bincode", e])
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_volumn",
        header: "Volumn",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onChange={(e: any) =>
                handlerUpdateRow(cell.row.id, ["U_tl_volumn", e.target.value])
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_qty",
        header: "Qty",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              thousandSeparator
              decimalScale={1}
              fixedDecimalScale
              customInput={MUITextField}
              value={cell.getValue()}
              onChange={(event) => {
                const newValue = parseFloat(
                  event.target.value.replace(/,/g, "")
                );
                handlerUpdateRow(cell.row.id, ["U_tl_qty", newValue]);
              }}
            />
          );
        },
      },

      {
        accessorKey: "U_tl_remark",
        header: "Remark",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onChange={(e: any) =>
                handlerUpdateRow(cell.row.id, ["U_tl_remark", e.target.value])
              }
            />
          );
        },
      },
    ],
    [data?.Items]
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
      <ContentComponent
        key={key}
        columns={itemColumns}
        items={[...data?.Items]}
        data={data}
        onChange={onChange}
        onRemoveChange={handlerRemoveItem}
        loading={ContentLoading}
        handlerAddSequence={() => {}}
      />
    </>
  );
}
