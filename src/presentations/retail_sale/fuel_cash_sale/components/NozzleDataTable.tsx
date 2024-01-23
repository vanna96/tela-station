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
interface NozzleDataProps {
  data: any;
  onChange: (key: any, value: any) => void;
}

export default function NozzleData({ data, onChange }: NozzleDataProps) {
  const [key, setKey] = React.useState(shortid.generate());
  const onClose = React.useCallback(() => setCollapseError(false), []);
  const [collapseError, setCollapseError] = React.useState(false);

  React.useEffect(() => {
    setCollapseError("Items" in data?.error);
  }, [data?.error]);

  const tl_Dispenser = [...data.DispenserData.TL_DISPENSER_LINESCollection];
  if (tl_Dispenser.length > 0) {
    data.nozzleData = tl_Dispenser;
  }

  console.log(data)
  const handlerChangeItem = (key: number, obj: any) => {
    const newData = tl_Dispenser?.map((item: any, index: number) => {
      if (index.toString() !== key.toString()) return item;
      item[Object.keys(obj).toString()] = Object.values(obj).toString();
      return item;
    });
    if (newData.length <= 0) return;
    onChange("nozzleData", newData);
  };

  const fetchItemName = async (itemCode: any) => {
    const res = await request("GET", `/Items('${itemCode}')?$select=ItemName`);
    return res;
  };

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "U_tl_pumpcode",
        header: "Nozzle Code",
        visible: true,
        Cell: ({ cell }: any) => {
          return <MUITextField value={cell.getValue()} disabled />;
        },
      },
      {
        accessorKey: "U_tl_itemnum",
        header: "Item Code",
        visible: true,
        Cell: ({ cell }: any) => {
          return <MUITextField value={cell.getValue()} disabled />;
        },
      },
      {
        accessorKey: "U_tl_itemdesc",
        header: "Item Name",
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
        accessorKey: "U_tl_uom",
        header: "UoM",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={
                new UnitOfMeasurementRepository().find(
                  cell.row.original.U_tl_uom
                )?.Name
              }
              disabled
            />
          );
        },
      },

      {
        Header: (header: any) => (
          <label>
            New Meter <span className="text-red-500">*</span>
          </label>
        ),
        accessorKey: "U_tl_upd_meter",
        header: "New Meter",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              //   disabled
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_upd_meter: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_reg_meter",
        header: "Old Meter",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              disabled
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
            />
          );
        },
      },

      {
        accessorKey: "consumption",
        header: "Consumption",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              disabled
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale
              customInput={MUITextField}
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  consumption: e.target.value,
                })
              }
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
        items={[tl_Dispenser ?? []]}
        data={data}
        onChange={onChange}
      />
    </>
  );
}
