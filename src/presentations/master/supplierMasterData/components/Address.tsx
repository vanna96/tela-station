import React, { useCallback, useState } from "react";
import MaterialReactTable from "material-react-table";
import { Button, Checkbox, TextField } from "@mui/material";
import MUITextField from "../../../../components/input/MUITextField";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineSetting } from "react-icons/ai";
import FormCard from "@/components/card/FormCard";
import MUISelect from "@/components/selectbox/MUISelect";
import shortid from "shortid";
import AddressModal from "./AddressesModal";

export interface AddressProps {
  handlerChangeItems: (record: any) => void;
  handlerRemoveItems: (record: string) => void;
  handlerChange: (key: string, value: any) => void;
  handlerUpdate: (value: any) => void;
  open: boolean;
  onClose: () => void;
  onOk: (address: any) => void;
  data: any;
  handlerOpenAddress: () => void;
}

export default function Address(props: AddressProps) {
  const [tableKey, setTableKey] = React.useState(Date.now());
  const {
    data,
    handlerChangeItems,
    handlerRemoveItems,
    handlerOpenAddress,
    handlerChange,
    handlerUpdate,
  } = props;
  const handlerChangeInput = (event: any, row: any, field: any) => {
    handlerChangeItems({ value: event.target.value, record: row, field });
  };

  const handlerRemoveRow = (row: any) => {
    handlerRemoveItems(row.CardCode);
  };
  const [items, setItems] = useState<any>([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [itemRow, setItemRow] = useState<any>({});

  const updateRow = (cell: any) => {
    setOpenEditModal(true);
    const dd = cell.row.original;
    setItemRow(dd);
    console.log(dd);
    console.log(itemRow);
  };
  console.log(itemRow);

  function setItemState(data: any) {
    let temp = data.map((e: any) => e);
    setItems(temp);
  }

  function updateItem(value: any) {
    console.log(value);
    handlerUpdate(value);
    setOpenEditModal(false);
  }

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "Action",
        header: "",
        size: 60,
        enableResizing: false,
        Cell: ({ cell }: any) => {
          // return ;
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
        accessorKey: "addressName",
        header: "Address ID", //uses the default width from defaultColumn prop
        Cell: ({cell}: any) => {
          // return ;
          return (
            <MUITextField endAdornment onClick={() => updateRow(cell)} value={cell.getValue()}
            onChange={(event) =>
              handlerChangeInput(event, cell?.row?.original, "addressName")
            }/>
          );
        },
      },

      {
        accessorKey: "addressName2",
        header: "Address Name 2",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "addressName2")
              }
            />
          );
        },
      },
      {
        accessorKey: "addressName3",
        header: "Address Name 3",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "addressName3")
              }
            />
          );
        },
      },
      {
        accessorKey: "street",
        header: "Street / PO Box",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "street")
              }
            />
          );
        },
      },
      {
        accessorKey: "block",
        header: "Block",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "block")
              }
            />
          );
        },
      },
      {
        accessorKey: "city",
        header: "City",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell?.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "city")
              }
            />
          );
        },
      },
      {
        accessorKey: "zipCode",
        header: "Zip Code",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onChange={(event) =>
                handlerChangeInput(event, cell?.row?.original, "zipCode")
              }
            />
          );
        },
      },
      {
        accessorKey: "county",
        header: "County",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "county")
              }
            />
          );
        },
      },
      {
        accessorKey: "state",
        header: "State",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "state")
              }
            />
          );
        },
      },
      {
        accessorKey: "country",
        header: "Country/Region",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "country")
              }
            />
          );
        },
      },
      {
        accessorKey: "streetNo",
        header: "Street No.",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "streetNo")
              }
            />
          );
        },
      },
      {
        accessorKey: "buildingFloorRoom",
        header: "Building/Floor/Room",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              onBlur={(event) =>
                handlerChangeInput(
                  event,
                  cell?.row?.original,
                  "buildingFloorRoom"
                )
              }
            />
          );
        },
      },
    ],
    [data.bPAddresses]
  );
  console.log(data.bPAddresses);

 
  return (
    <FormCard title="Address">
      <div className="col-span-2 data-table">
        <div className="my-4 w-[20%]">
          <label className="text-gray-500 text-[14px]">Ship To/Pay To</label>
          <div className="">
            <MUISelect
              items={[
                { name: "Ship To", value: "bo_ShipTo" },
                { name: "Bill To", value: "bo_BillTo" },
              ]}
              aliaslabel="name"
              aliasvalue="value"
              name="AddressType"
              value={data?.addressType}
              onChange={(e) => handlerChange("addressType", e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col-reverse">
          <MaterialReactTable
            key={tableKey}
            columns={itemColumns}
            data={data.bPAddresses ?? []}
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
            icons={{
              ViewColumnIcon: (props: any) => <AiOutlineSetting {...props} />,
            }}
            renderTopToolbarCustomActions={({ table }) => {
              return (
                <div className="flex gap-2 mb-6 pt-2 justify-center items-center">
                  <Button variant="outlined" size="small">
                    <span
                      className="text-xs  capitalize font-normal"
                      onClick={handlerOpenAddress}
                    >
                      + Define New
                    </span>
                  </Button>
                </div>
              );
            }}
          />
          <AddressModal
            open={openEditModal}
            data={itemRow}
            onClose={() => {
              setOpenEditModal(false);
              setItemRow(null);
            }}
            onOk={updateItem}
            type={"shipTO"}
          />
        </div>
      </div>
    </FormCard>
  );
}
