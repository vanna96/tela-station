import React, { useEffect } from "react"
import MUITextField from "../../../../components/input/MUITextField"
import ContentComponent from "./ContentComponents"
import { ItemModal } from "./ItemModal"
import { Alert, Collapse, IconButton } from "@mui/material"
import { MdOutlineClose } from "react-icons/md"
import { numberWithCommas } from "@/helper/helper"
import { useDocumentTotalHook } from "../hook/useDocumentTotalHook"
import shortid from "shortid"
import MUISelect from "@/components/selectbox/MUISelect"
import { APIContext } from "../../context/APIContext"
import { ClockNumberClassKey } from "@mui/x-date-pickers"
interface ContentFormProps {
  handlerAddItem: () => void
  handlerChangeItem: (record: any) => void
  handlerRemoveItem: (record: any[]) => void
  data: any
  onChange: (key: any, value: any) => void
  onChangeItemByCode: (record: any) => void
  ContentLoading: any
}

export default function ContentForm({
  data,
  // handlerChangeItem,
  // handlerAddItem,
  handlerRemoveItem,
  onChange,
  // onChangeItemByCode,
  ContentLoading,
}: ContentFormProps) {
  const [key, setKey] = React.useState(shortid.generate())
  const { tlExpDic }: any = React.useContext(APIContext)
  const [collapseError, setCollapseError] = React.useState(false)

  React.useEffect(() => {
    setCollapseError("Items" in data?.error)
  }, [data?.error])

  const handlerUpdateRow = (i: number, e: any) => {
    const items: any = data?.Items?.map((item: any, indexItem: number) => {
      if (i.toString() === indexItem.toString()) item[e[0]] = e[1]
      return item
    })
    onChange("Items", items)
  }

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "U_tl_expcode",
        header: "Expense Code",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              readOnly={true}
            />
          )
        },
      },
      {
        accessorKey: "U_tl_expdesc",
        header: "Expense Name",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              readOnly={true}
            />
          )
        },
      },
      {
        accessorKey: "U_tl_linetotal",
        header: "Amount",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              type="text"
              readOnly={true}
              value={numberWithCommas(cell.getValue(0).toFixed(2))}
            />
          )
        },
      },
      {
        accessorKey: "U_tl_remark",
        header: "Remark",
        visible: true,
        Cell: ({ cell }: any) => {
          return <MUITextField value={cell.getValue()} readOnly={true} />
        },
      },
    ],
    [data?.Items],
  )

  const onClose = React.useCallback(() => setCollapseError(false), [])

  React.useEffect(() => setKey(shortid.generate()), [data?.Items])

  return (
    <>
      <Collapse in={collapseError}>
        <Alert
          className="mb-3"
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onClose}
            >
              <MdOutlineClose fontSize="inherit" />
            </IconButton>
          }
        >
          {data?.error["Items"]}
        </Alert>
      </Collapse>
      <ContentComponent
        key={key}
        columns={itemColumns}
        items={data?.Logs || []}
        isNotAccount={true}
        data={data}
        onChange={onChange}
        onRemoveChange={handlerRemoveItem}
        loading={ContentLoading}
        handlerAddSequence={() => {}}
      />
    </>
  )
}
