import React, { useMemo } from "react"
import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table"
import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai"
import { MdDeleteOutline } from "react-icons/md"
import MUITextField from "@/components/input/MUITextField"
import StopsSelect from "@/components/selectbox/StopsSelect"
export default function SequenceTable(props: any) {
  const { data, onChange }: any = props
  const [rowSelection, setRowSelection] = React.useState<any>({})

  const handlerAddCheck = () => {
    onChange("TL_RM_SEQUENCECollection", [
      ...(data?.TL_RM_SEQUENCECollection || []),
      {
        U_Code: "",
        U_Distance: "",
        U_Duration: "",
        U_Stop_Duration: "",
      },
    ])
  }

  const handlerRemoveCheck = () => {
    const rows = Object.keys(rowSelection)
    if (rows.length <= 0) return
    const newData = data?.TL_RM_SEQUENCECollection?.filter(
      (item: any, index: number) => !rows.includes(index.toString()),
    )
    onChange("TL_RM_SEQUENCECollection", newData)
    setRowSelection({})
  }

  const handlerChangeItem = (key: number, obj: any) => {
    const newData = data?.TL_RM_SEQUENCECollection?.map((item: any, index: number) => {
      if (index.toString() !== key.toString()) return item
      item[Object.keys(obj).toString()] = Object.values(obj).toString()
      return item
    })
    if (newData.length <= 0) return
    onChange("TL_RM_SEQUENCECollection", newData)
  }

  const columns = [
    {
      accessorKey: "U_Code",
      header: "Stops",
      Cell: ({ cell }: any) => (
        <StopsSelect
          key={"U_Code" + cell.getValue() + cell?.row?.id}
          value={cell.row.original?.U_Code || 0}
          disabled={data?.edit}
          onChange={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              U_Code: e.target.value,
            })
          }}
        />
      ),
    },
    {
      accessorKey: "U_Distance",
      header: "Distance",
      Cell: ({ cell }: any) => (
        <MUITextField
          key={"U_Distance" + cell.getValue() + cell?.row?.id}
          disabled={data?.edit}
          defaultValue={cell.row.original?.U_Distance || ""}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              U_Distance: e.target.value,
            })
          }}
        />
      ),
    },

    {
      accessorKey: "U_Duration",
      header: "Travel Duration",
      Cell: ({ cell }: any) => (
        <MUITextField
          key={"U_Duration" + cell.getValue() + cell?.row?.id}
          disabled={data?.edit}
          defaultValue={cell.row.original?.U_Duration || ""}
          onBlur={(e: any) => {
            handlerChangeItem(cell?.row?.id || 0, {
              U_Duration: e.target.value,
            })
          }}
        />
      ),
    },
    {
        accessorKey: "U_Stop_Duration",
        header: "Stops Duration",
        Cell: ({ cell }: any) => (
          <MUITextField
            key={"U_Stop_Duration" + cell.getValue() + cell?.row?.id}
            disabled={data?.edit}
            defaultValue={cell.row.original?.U_Stop_Duration || ""}
            onBlur={(e: any) => {
              handlerChangeItem(cell?.row?.id || 0, {
                U_Stop_Duration: e.target.value,
              })
            }}
          />
        ),
      },
  ]
console.log(data);

  return (
    <>
      <div className="flex space-x-4 text-[25px] justify-end mb-2">
        {!data?.edit && (
          <>
            <AiOutlinePlus
              className="text-blue-700 cursor-pointer"
              onClick={handlerAddCheck}
            />
            <MdDeleteOutline
              className="text-red-500 cursor-pointer"
              onClick={handlerRemoveCheck}
            />
          </>
        )}
        <AiOutlineSetting className="cursor-pointer" />
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
    </>
  )
}
