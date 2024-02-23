import React, { useMemo } from "react";
import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table";
import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import MUITextField from "@/components/input/MUITextField";
import StopsSelect from "@/components/selectbox/StopsSelect";
import { FaMapMarkerAlt } from "react-icons/fa";
import { DurationPicker } from "./duration-picker";
import { Button } from "@mui/material";
export default function SequenceTable(props: any) {
  const { data, onChange }: any = props;
  const [rowSelection, setRowSelection] = React.useState<any>({});

  const handlerAddCheck = () => {
    const lists: any[] = data?.TL_RM_SEQUENCECollection ?? [];
    onChange("TL_RM_SEQUENCECollection", [
      ...lists,
      {
        U_Order: lists?.length + 1,
        U_Code: "",
        U_Distance: "",
        U_Duration: "",
        U_Stop_Duration: "",
        U_Lat: null,
        U_Lng: null,
      },
    ]);
  };

  const handlerRemoveCheck = () => {
    const rows = Object.keys(rowSelection);
    if (rows.length <= 0) return;
    const newData = data?.TL_RM_SEQUENCECollection?.filter(
      (item: any, index: number) => !rows.includes(index.toString())
    );
    onChange("TL_RM_SEQUENCECollection", newData);
    setRowSelection({});
  };

  const handlerChangeItem = (key: number, obj: any) => {
    const newData = data?.TL_RM_SEQUENCECollection?.map(
      (item: any, index: number) => {
        if (index.toString() !== key.toString()) return item;
        item[Object.keys(obj).toString()] = Object.values(obj).toString();
        return item;
      }
    );
    if (newData.length <= 0) return;
    onChange("TL_RM_SEQUENCECollection", newData);
  };

  const columns = [
    {
      accessorKey: "LineId",
      header: (
        <>
          Priority<span style={{ color: "red" }}>*</span>
        </>
      ),
      Cell: ({ cell }: any) => {
        return (
          <MUITextField
            type="number"
            key={"S_LineId" + cell.row.original?.U_Order}
            disabled={data?.edit}
            defaultValue={cell.row.original?.U_Order || ""}
            onBlur={(e: any) => {
              handlerChangeItem(cell?.row?.id || 0, {
                LineId: e.target.value,
              });
            }}
          />
        );
      },
    },
    {
      accessorKey: "U_Code",
      header: (
        <>
          Stops<span style={{ color: "red" }}>*</span>
        </>
      ),
      Cell: ({ cell }: any) => (
        <StopsSelect
          key={"U_Code" + cell.getValue() + cell?.row?.id}
          value={cell.row.original?.U_Code || 0}
          disabled={data?.edit}
          onHandlerChange={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              U_Code: e.Code,
            });
            handlerChangeItem(cell?.row?.id || 0, {
              U_Lat: e.U_lat,
            });
            handlerChangeItem(cell?.row?.id || 0, {
              U_Lng: e.U_lng,
            });
          }}
        />
      ),
    },
    {
      accessorKey: "U_Distance",
      header: "Distance KM",
      Cell: ({ cell }: any) => (
        <MUITextField
          type="number"
          key={"U_Distance" + cell.getValue() + cell?.row?.id}
          disabled={data?.edit}
          defaultValue={cell.row.original?.U_Distance || ""}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              U_Distance: e.target.value,
            });
          }}
        />
      ),
    },

    {
      accessorKey: "U_Duration",
      header: "Travel Duration",
      Cell: ({ cell }: any) => (
        // <MUITextField
        //   key={"U_Duration" + cell.getValue() + cell?.row?.id}
        //   disabled={data?.edit}
        //   defaultValue={cell.row.original?.U_Duration || ""}
        //   onBlur={(e: any) => {
        //     handlerChangeItem(cell?.row?.id || 0, {
        //       U_Duration: e.target.value,
        //     });
        //   }}
        // />

        <DurationPicker
          value={cell.row.original?.U_Duration}
          key={"U_Duration" + cell.getValue() + cell?.row?.id}
          disabled={data?.edit}
          onChange={(e) => {
            handlerChangeItem(cell?.row?.id || 0, {
              U_Duration: e,
            });
          }}
        />
      ),
    },
    {
      accessorKey: "U_Stop_Duration",
      header: "Stops Duration",
      Cell: ({ cell }: any) => (
        // <MUITextField
        //   key={"U_Stop_Duration" + cell.getValue() + cell?.row?.id}
        //   disabled={data?.edit}
        //   defaultValue={cell.row.original?.U_Stop_Duration || ""}
        //   onBlur={(e: any) => {
        //     handlerChangeItem(cell?.row?.id || 0, {
        //       U_Stop_Duration: e.target.value,
        //     });
        //   }}
        // />
        <DurationPicker
          value={cell.row.original?.U_Stop_Duration}
          key={"U_Stop_Duration" + cell.getValue() + cell?.row?.id}
          disabled={data?.edit}
          onChange={(e) => {
            handlerChangeItem(cell?.row?.id || 0, {
              U_Stop_Duration: e,
            });
          }}
        />
      ),
    },
    {
      accessorKey: "LineId",
      header: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span className="ml-[70px]">Pointed</span>
        </div>
      ),
      Cell: ({ cell }: any) => {
        const lat = cell?.row?.original?.U_Lat;
        const lng = cell?.row?.original?.U_Lng;

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "green",
                fontSize: "20px",
                verticalAlign: "middle",
              }}
            >
              <FaMapMarkerAlt
                className={lat && lng ? "text-green-600" : "text-gray-400"}
              />
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex space-x-4 text-[25px] justify-end mb-2">
        {!data?.edit && (
          <>
            <span
              onClick={handlerRemoveCheck}
              className="p-1 text-sm hover:shadow-md transition-all duration-300 rounded-md bg-white w-[90px] mt-5 text-center inline-block cursor-pointer border-[1px] shadow-sm"
            >
              Remove
            </span>
          </>
        )}
      </div>
      <MaterialReactTable
        columns={columns}
        data={data?.TL_RM_SEQUENCECollection || []}
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
      <span
        onClick={handlerAddCheck}
        className="p-1 text-sm hover:shadow-md transition-all duration-300 rounded-md bg-white w-[90px] mt-5 text-center inline-block cursor-pointer border-[1px] shadow-sm"
      >
       Add
      </span>
    </>
  );
}
