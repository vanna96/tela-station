import React, { useMemo } from "react";
import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table";
import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import MUITextField from "@/components/input/MUITextField";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BankSelect from "@/components/selectbox/bank";
import FormattedInputs from "@/components/input/NumberFormatField";
import FormCard from "@/components/card/FormCard";
import { Button } from "@mui/material";
import request from "@/utilies/request";
import MUISelect from "@/components/selectbox/MUISelect";
import UserCodeAutoComplete from "@/components/input/UserCodeAutoCeomplete";

export default function PaymentTable(props: any) {
  const { data, onChange }: any = props;
  const [rowSelection, setRowSelection] = React.useState<any>({});

  const handlerAddCheck = () => {
    onChange("pumpData", [
      ...(data?.pumpData || []),
      {
        U_tl_pumpcode: "",
        U_tl_itemnum: "",
        U_tl_itemdesc: "",
        U_tl_old_meter: 0,
        U_tl_new_meter: 0,
        con: -1,
      },
    ]);
  };

  const handlerRemoveCheck = () => {
    const rows = Object.keys(rowSelection);
    if (rows.length <= 0) return;
    const newData = data?.pumpData?.filter(
      (item: any, index: number) => !rows.includes(index.toString())
    );
    onChange("pumpData", newData);
    setRowSelection({});
  };

  const handlerChangeItem = (key: number, obj: any) => {
    const newData = data?.pumpData?.map((item: any, index: number) => {
      if (index.toString() !== key.toString()) return item;
      item[Object.keys(obj).toString()] = Object.values(obj).toString();
      return item;
    });
    if (newData.length <= 0) return;
    onChange("pumpData", newData);
  };
  const handlerUpdateRow = (i: number, e: any) => {
    const items = [...data?.pumpData];
    items[i] = { ...items[i], [e[0]]: e[1] };
    onChange("pumpData", items);
  };



  const handlerUpdateMultipleRow = (i: number, updates: [string, any][]) => {
    const items = [...data.pumpData];

    updates.forEach(([property, value]) => {
      items[i] = {
        ...items[i],
        [property]: value,
      };
    });
    onChange("pumpData", items);
  };

  const tl_Dispenser = data.tl_Dispenser?.value;
  // console.log(data.tl_Dispenser)
  const TL_DISPENSER_LINESCollection = tl_Dispenser?.map(
    (item: any) => item.TL_DISPENSER_LINESCollection
  );




  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "U_tl_pumpcode",
        header: "Pump ID",
        visible: true,
        Cell: ({ cell }: any) => {
          const handlePumpCodeChange = async (newPumpCode: string) => {
            handlerUpdateRow(cell.row.id, ["U_tl_pumpcode", newPumpCode]);

            const selectedPump = TL_DISPENSER_LINESCollection?.find(
              (dispenser: any) =>
                dispenser.some(
                  (item: any) => item.U_tl_pumpcode === newPumpCode
                )
            );

            if (selectedPump) {
              const selectedItem = selectedPump[0];
            
              const itemDetailsResponse = await request(
                "GET",
                `/Items('${selectedItem?.U_tl_itemnum}')`
              );
              const itemDetails = itemDetailsResponse.data;

              handlerUpdateMultipleRow(cell.row.id, [
                ["U_tl_pumpcode", newPumpCode],
                ["U_tl_itemnum", selectedItem?.U_tl_itemnum],
                ["U_tl_old_meter", selectedItem?.U_tl_reg_meter],
                ["U_tl_new_meter", selectedItem?.U_tl_upd_meter],
                ["U_tl_itemdesc", itemDetails.ItemName],
              ]);
            }
          };

          return (
            <MUISelect
              value={cell.row.original.U_tl_pumpcode}
              items={
                TL_DISPENSER_LINESCollection?.flatMap((dispenser: any) =>
                  dispenser.map((item: any) => ({
                    label: `${item.U_tl_pumpcode}`,
                    value: item.U_tl_pumpcode,
                    TL_DISPENSER_LINESCollection:
                      item.TL_DISPENSER_LINESCollection,
                  }))
                ) || []
              }
              loading={!tl_Dispenser}
              aliaslabel="label"
              aliasvalue="Code"
              onChange={(e: any) => handlePumpCodeChange(e.target.value)}
            />
          );
        },
      },
      {
        accessorKey: "U_tl_itemnum",
        header: "Item Code",
        visible: true,
        Cell: ({ cell }: any) => {
          return <MUITextField value={cell.getValue()} />;
        },
      },

      {
        accessorKey: "U_tl_itemdesc",
        header: "Item Name",
        visible: true,
        Cell: ({ cell }: any) => {
          return <MUITextField disabled value={cell.getValue()} />;
        },
      },
      {
        accessorKey: "U_tl_old_meter",
        header: "Old Meter",
        visible: true,

        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onChange={(e: any) =>
                handlerUpdateRow(cell.row.id, [
                  "U_tl_old_meter",
                  e.target.value,
                ])
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_new_meter",
        header: "New Meter",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onChange={(e: any) =>
                handlerUpdateRow(cell.row.id, [
                  "U_tl_new_meter",
                  e.target.value,
                ])
              }
            />
          );
        },
      },
    ],
    [TL_DISPENSER_LINESCollection]
  );
  console.log(data);
  return (
    <FormCard
      title="Pump Data"
      action={
        <div className="flex ">
          <Button size="small" disabled={props?.data?.isStatusClose || false}>
            <span className="capitalize text-sm" onClick={handlerRemoveCheck}>
              Remove
            </span>
          </Button>
          <Button size="small" disabled={props?.data?.isStatusClose || false}>
            <span className="capitalize text-sm" onClick={handlerAddCheck}>
              Add
            </span>
          </Button>
          {/* <IconButton onClick={() => columnRef.current?.onOpen()}>
            <TbSettings className="text-2lg" />
          </IconButton> */}
        </div>
      }
    >
      <>
        <div className="col-span-2 data-table">
          <MaterialReactTable
            columns={itemColumns}
            data={data?.pumpData || []}
            enableStickyHeader={true}
            enableHiding={true}
            enablePinning={true}
            enableSelectAll={true}
            enableMultiRowSelection={true}
            enableColumnActions={false}
            enableColumnFilters={false}
            enablePagination={false}
            enableSorting={false}
            enableBottomToolbar={false}
            enableTopToolbar={false}
            enableColumnResizing={true}
            enableTableFooter={false}
            enableRowSelection
            onRowSelectionChange={setRowSelection}
            initialState={{
              density: "compact",
              rowSelection,
            }}
            state={{
              rowSelection,
            }}
            muiTableProps={{
              sx: { cursor: "pointer", height: "60px" },
            }}
          />
        </div>
      </>
    </FormCard>
  );
}
