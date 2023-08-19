import FormCard from "@/components/card/FormCard";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import BranchSelect from "../../../../components/selectbox/Branch";
import Checkbox from "@mui/material/Checkbox";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { AiOutlineDelete, AiOutlineSetting } from "react-icons/ai";
import MaterialReactTable from "material-react-table";

export interface InventoryFomProps {
  handlerChange: (key: string, value: any) => void;
  edit?: boolean;
  handlerAddWarehouse: () => void;
  handlerChangeWarehouse: (record: any) => void;
  handlerRemoveWarehouse: (record: string) => void;
  data: any;
}

export default function InventoryFom({
  handlerChange,
  edit,
  handlerChangeWarehouse,
  handlerAddWarehouse,
  handlerRemoveWarehouse,
  data,
}: InventoryFomProps) {
  const [isCheckedManage, setIsCheckedManage] = useState<boolean>(false);

  const [tableKey, setTableKey] = React.useState(Date.now());

  const handlerChangeInput = (event: any, row: any, field: any) => {
    let value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    handlerChangeWarehouse({ value: value, record: row, field });
  };

  const handlerRemoveRow = (row: any) => {
    handlerRemoveWarehouse(row.WarehouseCode);
  };

  const [isCheckedLock, setIsCheckedLock] = useState<boolean>(false);

  const WHColumns = React.useMemo(
    () => [
      {
        accessorKey: "Action",
        header: "",
        size: 60,
        enableResizing: false,

        Cell: ({ cell }: any) => {
          return (
            <Button
              size="small"
              color="error"
              onClick={() => handlerRemoveRow(cell.row.original)}
            >
              <AiOutlineDelete />
            </Button>
          );
        },
      },
      {
        accessorKey: "warehouseCode",
        header: "Warehouse Code",

        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "warehouseCode")
              }
              disabled
            />
          );
        },
      },

      {
        accessorKey: "warehouseName",
        header: "Warehouse Name",

        Cell: ({ cell }: any) => {
          return <MUITextField value={cell.getValue()} disabled />;
        },
      },

      {
        accessorKey: "locked",
        header: "Lock ",
        Cell: ({ cell }: any) => (
          <input
            type="checkbox"
            name="locked"
            checked={edit ? cell.getValue() : isCheckedLock}
            onChange={(e) => {
              const { checked } = e.target;
              const value = checked ? true : false;
              setIsCheckedLock(value);
              handlerChangeInput(e, cell?.row?.original, "locked");
            }}
          />
        ),
      },
      //   onChange={(e) => handlerChange('fromWarehouse', e.target.value)}
      // handlerChange("locked", value);

      {
        accessorKey: "inStock",
        header: "In Stock ",

        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              disabled={!edit}
              type="number"
              name="inStock"
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "inStock")
              }
            />
          );
        },
      },

      {
        accessorKey: "committed",
        header: "Committed ",

        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              disabled={!edit}
              type="number"
              name="committed"
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "committed")
              }
            />
          );
        },
      },

      {
        accessorKey: "ordered",
        header: "Ordered ",

        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              disabled={!edit}
              type="number"
              name="ordered"
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "ordered")
              }
            />
          );
        },
      },

      {
        accessorKey: "available",
        header: "Available ",

        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              disabled={!edit}
              type="number"
              name="available"
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "available")
              }
            />
          );
        },
      },

      {
        accessorKey: "minimalStock",
        header: "Min. Inventory ",

        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              disabled={!edit}
              type="number"
              name="minimalStock"
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "minimalStock")
              }
            />
          );
        },
      },

      {
        accessorKey: "maximalStock",
        header: "Max. Inventory ",

        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              disabled={!edit}
              type="number"
              name="maximalStock"
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "maximalStock")
              }
            />
          );
        },
      },

      {
        accessorKey: "minimalOrder",
        header: "Req. Inv. Level ",

        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              disabled={!edit}
              type="number"
              name="minimalOrder"
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "minimalOrder")
              }
            />
          );
        },
      },
    ],
    []
  );
  console.log(data);
  return (
    <>
      <FormCard title="Inventory">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Set G/L Account by
              </label>
              <div className="">
                <MUISelect
                  items={[
                    { name: "Warehouse", value: "glm_WH" },
                    { name: "Item Group", value: "glm_ItemClass" },
                    { name: "Item Level", value: "glm_ItemLevel" },
                  ]}
                  onChange={(e) => handlerChange("glMethod", e.target.value)}
                  name="glMethod"
                  value={data?.glMethod}
                  aliasvalue="id"
                  aliaslabel="name"
                />
              </div>
            </div>
            <MUITextField
              label=" UoM Name"
              name="inventoryUOM"
              value={data.inventoryUOM}
              onChange={(e) => handlerChange("inventoryUOM", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Weight"
              name="inventoryWeight"
              value={data.inventoryWeight}
              onChange={(e) => handlerChange("inventoryWeight", e.target.value)}
            />
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Valuation Method
              </label>
              <div className="">
                <MUISelect
                  items={[
                    { name: "Moving Average", value: "bis_MovingAverage" },
                    { name: "Standard", value: "bis_Standard" },
                    { name: "FIFO", value: "bis_FIFO" },
                    { name: "Serial/Batch", value: "bis_SNB" },
                  ]}
                  onChange={(e) =>
                    handlerChange("costAccountingMethod", e.target.value)
                  }
                  name="costAccountingMethod"
                  value={data?.costAccountingMethod}
                  aliasvalue="id"
                  aliaslabel="name"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Item Cost"
              name="countingItemsPerUnit"
              value={data.countingItemsPerUnit}
              onChange={(e) =>
                handlerChange("countingItemsPerUnit", e.target.value)
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              name="manageStockByWarehouse"
              checked={edit ? data?.manageStockByWarehouse : isCheckedManage}
              onChange={(e) => {
                const { checked } = e.target;
                const value = checked ? true : false;
                setIsCheckedManage(value);
                handlerChange("manageStockByWarehouse", value);
              }}
            />
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Manage Inventory by Warehouse
            </label>
          </div>
          Inventory Level
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Required
              </label>
              <div className="">
                <MUITextField
                  name="ç"
                  value={data.desiredInventory}
                  onChange={(e) =>
                    handlerChange("desiredInventory", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Minimum
              </label>
              <div className="">
                <MUITextField
                  name="ç"
                  value={data.minInventory}
                  onChange={(e) =>
                    handlerChange("minInventory", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Maximum
              </label>
              <div className="">
                <MUITextField
                  name="maxInventory"
                  value={data.maxInventory}
                  onChange={(e) =>
                    handlerChange("maxInventory", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </FormCard>
      <div>
        <div>
          <div className="col-span-2 data-table gap-3">
            <MaterialReactTable
              key={tableKey}
              // columns={itemColumns}
              columns={WHColumns}
              data={data?.warehouse ?? []}
              enableStickyHeader={true}
              enableColumnActions={false}
              enableColumnFilters={false}
              enablePagination={false}
              enableSorting={false}
              enableBottomToolbar={false}
              enableTopToolbar={true}
              enableColumnResizing={true}
              enableColumnFilterModes={false}
              enableDensityToggle={false}
              enableFilters={false}
              enableFullScreenToggle={false}
              enableGlobalFilter={false}
              enableHiding={true}
              initialState={{
                density: "compact",
              }}
              state={{}}
              icons={{
                ViewColumnIcon: (props: any) => <AiOutlineSetting {...props} />,
              }}
              renderTopToolbarCustomActions={({ table }) => {
                return (
                  <div className="flex gap-2 mb-6 pt-2 justify-center items-center">
                    {!data?.isApproved ? (
                      <>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handlerAddWarehouse}
                        >
                          <span className="text-xs  capitalize font-normal">
                            + Add New
                          </span>
                        </Button>
                      </>
                    ) : null}
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
