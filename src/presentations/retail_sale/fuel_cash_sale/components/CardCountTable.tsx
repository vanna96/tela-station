import React from "react";
import MUITextField from "../../../../components/input/MUITextField";
import request from "@/utilies/request";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import { useQuery } from "react-query";
import { NumericFormat } from "react-number-format";
import MaterialReactTable from "material-react-table";
import FormCard from "@/components/card/FormCard";
import MUIRightTextField from "@/components/input/MUIRightTextField";
import { commaFormatNum } from "@/utilies/formatNumber";

interface CardCountProps {
  data: any;
  onChange: (key: any, value: any) => void;
  edit?: boolean;
  handlerChangeObject: (obj: any) => void;
}

export default function CardCount({
  data,
  onChange,
  edit,
  handlerChangeObject,
}: CardCountProps) {
  data.cardCountData = data.nozzleData?.filter(
    (e: any) => parseFloat(e.U_tl_nmeter) > 0
  );

  console.log(data.cardCountData);

  const handlerChangeItem = (key: number, obj: any) => {
    const newData = data.cardCountData?.map((item: any, index: number) => {
      if (index.toString() !== key.toString()) return item;
      item[Object.keys(obj).toString()] = Object.values(obj).toString();
      return item;
    });
    if (newData.length <= 0) return;
    onChange("cardCountData", newData);
  };
  const fetchItemName = async (itemCode: any) => {
    const res = await request("GET", `/Items('${itemCode}')?$select=ItemName`);
    return res;
  };

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "U_tl_itemcode",
        header: "Item Code",
        visible: true,
        Cell: ({ cell }: any) => {
          const itemCode = cell.row.original.U_tl_itemcode;

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

          return (
            <MUITextField
              disabled
              value={
                itemName?.data?.ItemName || cell.row.original?.U_tl_itemCode
              }
            />
          );
        },
      },

      {
        accessorKey: "U_tl_1l",
        header: "1L",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              customInput={MUIRightTextField}
              placeholder="0.000"
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_1l: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_2l",
        header: "2L",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              customInput={MUIRightTextField}
              placeholder="0.000"
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_2l: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_5l",
        header: "5L",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              customInput={MUIRightTextField}
              placeholder="0.000"
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_5l: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_10l",
        header: "10L",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              customInput={MUIRightTextField}
              placeholder="0.000"
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_10l: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_20l",
        header: "20L",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              customInput={MUIRightTextField}
              placeholder="0.000"
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_20l: e.target.value,
                })
              }
            />
          );
        },
      },

      {
        accessorKey: "U_tl_50l",
        header: "50L",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              customInput={MUIRightTextField}
              placeholder="0.000"
              defaultValue={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  U_tl_50l: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        accessorKey: "total",
        header: "Total (Litre)",
        Cell: ({ cell }: any) => {
          const total =
            commaFormatNum(cell.row.original?.U_tl_1l || 0) +
            commaFormatNum(cell.row.original?.U_tl_2l || 0) +
            commaFormatNum(cell.row.original?.U_tl_5l || 0) +
            commaFormatNum(cell.row.original?.U_tl_10l || 0) +
            commaFormatNum(cell.row.original?.U_tl_20l || 0) +
            commaFormatNum(cell.row.original?.U_tl_50l || 0);

          const isValid =
            total === commaFormatNum(cell.row.original.U_tl_nmeter);
          console.log(commaFormatNum(cell.row.original.U_tl_nmeter));
          console.log(total);
          return (
            <NumericFormat
              thousandSeparator
              decimalScale={2}
              // readOnly
              customInput={MUIRightTextField}
              placeholder="0.000"
              value={total}
              inputProps={{
                style: {
                  color: isValid ? "inherit" : "red",
                },
              }}
            />
          );
        },
      },
    ],
    [data.cardCountData]
  );

  return (
    <>
      <FormCard title="Card Count ">
        <>
          <div className="col-span-2 data-table">
            <MaterialReactTable
              columns={[...itemColumns]}
              data={[...data.cardCountData]}
              enableStickyHeader={true}
              enableColumnActions={false}
              enableColumnFilters={false}
              enablePagination={false}
              enableSorting={false}
              enableTopToolbar={false}
              enableColumnResizing={true}
              enableColumnFilterModes={false}
              enableDensityToggle={false}
              enableFilters={false}
              enableFullScreenToggle={false}
              enableGlobalFilter={false}
              enableHiding={true}
              enablePinning={true}
              enableStickyFooter={false}
              enableMultiRowSelection={true}
              initialState={{
                density: "compact",
              }}
              state={{}}
              muiTableBodyRowProps={() => ({
                sx: { cursor: "pointer" },
              })}
              enableTableFooter={false}
            />
          </div>
        </>
      </FormCard>
    </>
  );
}
