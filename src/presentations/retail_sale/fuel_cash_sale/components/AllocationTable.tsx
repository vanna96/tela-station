import React from "react";
import MUITextField from "../../../../components/input/MUITextField";
import ContentComponent from "./ContentComponents";
import { Alert, Collapse, IconButton, TextField } from "@mui/material";
import { MdOutlineClose } from "react-icons/md";
import shortid from "shortid";
import MUISelect from "@/components/selectbox/MUISelect";
import UserCodeAutoComplete from "@/components/input/UserCodeAutoCeomplete";
import request from "@/utilies/request";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import { useQuery } from "react-query";
import { NumericFormat } from "react-number-format";
interface AllocationTableProps {
  //   handlerAddItem: () => void;
  //   handlerChangeItem: (record: any) => void;
  //   handlerRemoveItem: (record: any[]) => void;
  data: any;
  onChange: (key: any, value: any) => void;
  //   onChangeItemByCode: (record: any) => void;
}

export default function AllocationTable({
  data,
  onChange,
}: AllocationTableProps) {
  const [key, setKey] = React.useState(shortid.generate());
  const onClose = React.useCallback(() => setCollapseError(false), []);
  const [collapseError, setCollapseError] = React.useState(false);

  React.useEffect(() => {
    setCollapseError("Items" in data?.error);
  }, [data?.error]);

  const handlerUpdateRow = (i: number, e: any) => {
    const items = [...data?.Items];
    items[i] = { ...items[i], [e[0]]: e[1] };
    onChange("Items", items);
  };

  const tl_Dispenser = data.DispenserData?.data;

  const fetchItemName = async (itemCode: any) => {
    const res = await request("GET", `/Items('${itemCode}')?$select=ItemName`);
    console.log(res);
    return res;
  };

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "U_tl_itemdesc",
        header: "Item Code",
        visible: true,
        Cell: ({ cell }: any) => {
          const itemCode = cell.row.original.U_tl_itemnum;

          const {
            data: itemName,
            isLoading,
            isError,
          } = useQuery(["itemName", itemCode], () => fetchItemName(itemCode), {
            enabled: !!itemCode,
          });

          if (isLoading) {
            return <MUITextField disabled />;
          }

          if (isError) {
            return <span>Error fetching itemName</span>;
          }

          return <MUITextField disabled value={itemName?.data?.ItemName} />;
        },
      },

      {
        accessorKey: "cashSales",
        header: "Cash Sales (Litre)",
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
                handlerUpdateRow(cell.row.id, ["cashSales", newValue]);
              }}
            />
          );
        },
      },
      {
        accessorKey: "partnership",
        header: "Partnership (Litre)",
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
                handlerUpdateRow(cell.row.id, ["partnership", newValue]);
              }}
            />
          );
        },
      },
      {
        accessorKey: "stockTransfer",
        header: "Stock Transfer (Liter)",
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
                handlerUpdateRow(cell.row.id, ["stockTransfer", newValue]);
              }}
            />
          );
        },
      },
      {
        accessorKey: "ownUsage",
        header: "Own Usage (Litre)",
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
                handlerUpdateRow(cell.row.id, ["ownUsage", newValue]);
              }}
            />
          );
        },
      },
      {
        accessorKey: "telaCard",
        header: "Tela Card (Litre)",
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
                handlerUpdateRow(cell.row.id, ["telaCard", newValue]);
              }}
            />
          );
        },
      },
      {
        accessorKey: "pumpTest",
        header: "Pump Test (Litre)",
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
                handlerUpdateRow(cell.row.id, ["pumpTest", newValue]);
              }}
            />
          );
        },
      },
      {
        accessorKey: "total",
        header: "Total (Litre)",
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
                handlerUpdateRow(cell.row.id, ["total", newValue]);
              }}
            />
          );
        },
      },
    ],
    [tl_Dispenser]
  );

  return (
    <>
      <ContentComponent
        key={key}
        columns={itemColumns}
        items={[tl_Dispenser?.TL_DISPENSER_LINESCollection]}
        data={data}
        onChange={onChange}
        // onRemoveChange={handlerRemoveItem}
        // loading={ContentLoading}
        // handlerAddSequence={() => {}}
      />
    </>
  );
}
