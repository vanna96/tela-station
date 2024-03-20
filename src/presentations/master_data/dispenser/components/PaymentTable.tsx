import React, { useMemo } from "react";
import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table";
import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import MUITextField from "@/components/input/MUITextField";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BankSelect from "@/components/selectbox/bank";
import FormattedInputs from "@/components/input/NumberFormatField";
import { TbEdit } from "react-icons/tb";
import { ItemModal } from "./ItemModal";
import ItemGroupRepository from "@/services/actions/itemGroupRepository";
import MUISelect from "@/components/selectbox/MUISelect";
import FormCard from "@/components/card/FormCard";
import BinLocationToAsEntry from "@/components/input/BinLocationToAsEntry";
import BinLocationItemCode from "@/components/input/BinLocationItemCode";
import { LoadingButton } from "@mui/lab";

export default function PaymentTable(props: any) {
  const { data, onChange, handlerAddItem, edit }: any = props;
  const [rowSelection, setRowSelection] = React.useState<any>({});
  const updateRef = React.createRef<ItemModal>();
  const itemGroupRepo = new ItemGroupRepository();
  const [collapseError, setCollapseError] = React.useState(false);

  const handlerAddCheck = () => {
    onChange("PumpData", [
      ...(data?.PumpData || []),
      {
        pumpCode: "",
        itemMaster: "",
        itemName: "",
        uom: "",
        registerMeeting: "",
        updateMetering: "",
        status: "",
      },
    ]);
  };
  
  const handlerRemoveCheck = () => {
    const rows = Object.keys(rowSelection);
    if (rows.length <= 0) return;
    const newData = data?.PumpData?.filter(
      (item: any, index: number) => !rows.includes(index.toString())
    );
    onChange("PumpData", newData);
    setRowSelection({});
  };
  const handlerChangeItem = (key: number, obj: any) => {
    const newData = data?.PumpData?.map((item: any, index: number) => {
      if (index.toString() !== key.toString()) return item;
      item[Object.keys(obj).toString()] = Object.values(obj).toString();
      return item;
    });
    if (newData.length <= 0) return;
    onChange("PumpData", newData);
  };

  const handlerReset = (index:number) => {
    let newData = data?.PumpData?.map((e:any, idx:number) => {
      if(idx.toString() !== index.toString()) return e;
      return {...e, registerMeeting:0, updateMetering:0}
    });
    onChange("PumpData", newData);
  }
  
  const columns = [
    {
      accessorKey: "reset",
      header: "",
      visable: true,
      Cell: ({ cell }: any) => (
        <LoadingButton
          sx={{ height: "25px", background: "#2D53AB" }}
          loading={false}
          size="small"
          variant="contained"
          disableElevation
          onClick={() => handlerReset(cell?.row?.id)}
        >
          <span className="px-6 text-[11px] py-4 text-white">
            Reset
          </span>
        </LoadingButton>
      ),
    },
    {
      accessorKey: "pumpCode",
      header: "Nozzle Code",
      Header: (header: any) => (
        <label>
          Nozzle Code <span className="text-red-500">*</span>
        </label>
      ),
      Cell: ({ cell }: any) => (
        <MUITextField
          key={"pumpCode" + cell.getValue() + cell?.row?.id}
          type="text"
          defaultValue={cell.getValue() || ""}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              pumpCode: e.target.value,
            });
          }}
        />
      ),
    },

    {
      accessorKey: "binCode",
      header: "Bin Locaition",
      Header: (header: any) => (
        <label>
          Bin Locaition <span className="text-red-500">*</span>
        </label>
      ),
      Cell: ({ cell }: any) => (
        <BinLocationToAsEntry
          Warehouse={data?.U_tl_whs}
          key={"binCode" + cell.getValue() + cell?.row?.id}
          value={cell.getValue()}
          onChange={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              binCode: e,
            });
          }}
        />
      ),
    },
    {
      accessorKey: "itemCode",
      header: "Item Code", //uses the default width from defaultColumn prop
      visible: true,
      size: 120,
      Header: (header: any) => (
        <label>
          Item Code <span className="text-red-500">*</span>
        </label>
      ),
      Cell: ({ cell }: any) => {
        return (
          <MUITextField
            value={cell.getValue()}
            endAdornment={!(data?.isStatusClose || false)}
            onClick={() => {
              if ((cell.getValue() ?? "") === "") {
                handlerAddItem(cell?.row.id);
              } else {
                handlerAddItem(cell?.row.id);
                // updateRef.current?.onOpen(cell.row.original);
              }
            }}
            endIcon={
              cell.getValue() === "" ? null : <TbEdit className="text-lg" />
            }
            readOnly={true}
          />
        );
      },
    },
    {
      accessorKey: "ItemDescription",
      header: "Item Name",
      Header: (header: any) => (
        <label>
          Item Name <span className="text-red-500">*</span>
        </label>
      ),
      Cell: ({ cell }: any) => (
        <MUITextField
          key={"itemName" + cell.getValue() + cell?.row?.id}
          type="text"
          readOnly={true}
          defaultValue={cell.row.original?.ItemDescription || ""}
          // onBlur={(e: any) => {
          //   handlerChangeItem(cell?.row?.id || 0, {
          //     itemName: e.target.value,
          //   });
          // }}
        />
      ),
    },
    {
      accessorKey: "UomAbsEntry",
      header: "UOM",
      Header: (header: any) => (
        <label>
          UOM <span className="text-red-500">*</span>
        </label>
      ),
      Cell: ({ cell }: any) => (
        <MUISelect
          value={cell.getValue()}
          items={cell.row.original.UomLists?.map((e: any) => ({
            label: e.Name,
            value: e.AbsEntry,
          }))}
          aliaslabel="label"
          aliasvalue="value"
          onChange={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              UomAbsEntry: e.target.value,
            });
          }}
        />
      ),
    },
    {
      accessorKey: "registerMeeting",
      header: "Register Metering",
      Cell: ({ cell }: any) => (
        <FormattedInputs
          key={"registerMeeting" + cell.getValue() + cell?.row?.id}
          disabled={edit && data?.Status !== "New"}
          defaultValue={cell.row.original?.registerMeeting || 0}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              registerMeeting: e.target.value,
            });
          }}
          name={"registerMeeting"}
          value={cell.row.original?.registerMeeting || ""}
        />
      ),
    },
    {
      accessorKey: "updateMetering",
      header: "Update Metering",
      Cell: ({ cell }: any) => (
        <FormattedInputs
          key={"updateMetering" + cell.getValue() + cell?.row?.id}
          disabled={edit && data?.Status !== "New"}
          defaultValue={cell.row.original?.updateMetering || 0}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              updateMetering: e.target.value,
            });
          }}
          name={"updateMetering"}
          value={cell.row.original?.updateMetering || ""}
        />
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ cell }: any) => (
        <MUISelect
          key={"status" + cell.getValue() + cell?.row?.id}
          items={[
            { id: "New", name: "New" },
            { id: "Initialized", name: "Initialized" },
            { id: "Active", name: "Active" },
            { id: "Inactive", name: "Inactive" },
          ]}
          onChange={(e) =>
            handlerChangeItem(cell?.row?.id || 0, {
              status: e.target.value,
            })
          }
          value={cell.getValue()}
          aliasvalue="id"
          aliaslabel="name"
          name="Status"
        />
      ),
    },
  ];
 
  return (
    <>
      <FormCard title="Nozzle Data">
        <div className="col-span-2 data-table">
          <MaterialReactTable
            columns={columns}
            data={data?.PumpData || []}
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
            enableRowSelection={false}
            onRowSelectionChange={setRowSelection}
            enableRowNumbers={false}
            initialState={{
              density: "compact",
              columnVisibility: { reset: data?.Status === 'Inactive' }
              // rowSelection,
            }}
            // state={{
            //   rowSelection,
            // }}
            muiTableProps={{
              sx: { cursor: "pointer", height: "60px" },
            }}
          />
        </div>
        <ItemModal ref={updateRef} onSave={() => {}} columns={columns} />
      </FormCard>
    </>
  );
}
