import React from "react";
import MUITextField from "../../../../components/input/MUITextField";
import ContentComponent from "./ContentComponents";
import {
  Alert,
  Button,
  Checkbox,
  Collapse,
  IconButton,
  TextField,
} from "@mui/material";
import { MdOutlineClose } from "react-icons/md";
import shortid from "shortid";
import MUISelect from "@/components/selectbox/MUISelect";
import UserCodeAutoComplete from "@/components/input/UserCodeAutoCeomplete";
import request from "@/utilies/request";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import { useQuery } from "react-query";
import { NumericFormat } from "react-number-format";
import BranchAutoComplete from "@/components/input/BranchAutoComplete";
import FormCard from "@/components/card/FormCard";
import { TbSettings } from "react-icons/tb";
import MaterialReactTable from "material-react-table";
import { AiOutlineSetting } from "react-icons/ai";
interface StockAllocationDataProps {
  data: any;
  onChange: (key: any, value: any) => void;
}

export default function StockAllocationData({
  data,
  onChange,
}: StockAllocationDataProps) {
  const [key, setKey] = React.useState(shortid.generate());
  const onClose = React.useCallback(() => setCollapseError(false), []);
  const [collapseError, setCollapseError] = React.useState(false);

  React.useEffect(() => {
    setCollapseError("firstData" in data?.error);
  }, [data?.error]);

  const tl_Dispenser = [...data.DispenserData.TL_DISPENSER_LINESCollection];

  console.log(data);
  const handlerChangeItem = (key: number, obj: any) => {
    const newData = tl_Dispenser?.map((item: any, index: number) => {
      if (index.toString() !== key.toString()) return item;
      item[Object.keys(obj).toString()] = Object.values(obj).toString();
      return item;
    });
    if (newData.length <= 0) return;
    onChange("StockAllocationData", newData);
  };

  const fetchItemName = async (itemCode: any) => {
    const res = await request(
      "GET",
      `/firstData('${itemCode}')?$select=ItemName`
    );
    return res;
  };

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "branch",
        header: "Branch",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <BranchAutoComplete
              BPdata={data?.BPL_IDAssignedToInvoice}
              onChange={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  branch: e,
                })
              }
              value={cell.getValue()}
            />
          );
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
        accessorKey: "cons_qty",
        header: "Cons. Qty ",
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
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  cons_qty: e.target.value,
                })
              }
            />
          );
        },
      },
      {
        Header: (header: any) => (
          <label>
            Aloc. Qty <span className="text-red-500">*</span>
          </label>
        ),
        accessorKey: "alloc_qty",
        header: "Aloc. Qty",
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
                  alloc_qty: e.target.value,
                })
              }
            />
          );
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
        accessorKey: "open_qty",
        header: "Open. Qty",
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
                  open_qty: e.target.value,
                })
              }
            />
          );
        },
      },

      {
        accessorKey: "remark",
        header: "Remark",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(e: any) =>
                handlerChangeItem(cell?.row?.id || 0, {
                  remark: e.target.value,
                })
              }
            />
          );
        },
      },
    ],
    [tl_Dispenser]
  );

  const handlerAdd = () => {
    const firstData = [
      ...data.StockAllocationData,
      {
        // remark: "",
        // open_qty: 0,
        // branch: -1,
        // U_tl_itemnum: "",
        // U_tl_itemdesc: "",
        // cons_qty: 0,
      },
    ];
    onChange("StockAllocationData", firstData);
  };

  return (
    <>
      <FormCard
        title="Stock Allocation "
        action={
          <div className="flex ">
            {/* <Button size="small" disabled={data?.isStatusClose || false}>
              <span className="capitalize text-sm" onClick={handlerRemove}>
                Remove
              </span>
            </Button> */}
            <Button size="small" disabled={data?.isStatusClose || false}>
              <span className="capitalize text-sm" onClick={handlerAdd}>
                Add
              </span>
            </Button>
          </div>
        }
      >
        <>
          <div className="col-span-2 data-table">
            <MaterialReactTable
              columns={[...itemColumns]}
              data={tl_Dispenser}
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
              icons={{
                ViewColumnIcon: (props: any) => <AiOutlineSetting {...props} />,
              }}
              enableTableFooter={false}
            />
          </div>
        </>
      </FormCard>
    </>
  );
}
