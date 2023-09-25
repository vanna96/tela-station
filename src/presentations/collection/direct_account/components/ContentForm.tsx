import React from "react"
import MUITextField from "../../../../components/input/MUITextField"
import ContentComponent from "./ContentComponents"
import { ItemModal } from "./ItemModal"
import { ServiceModal } from "./ServiceModal"
import { Alert, Collapse, IconButton } from "@mui/material"
import { MdOutlineClose } from "react-icons/md"
import { numberWithCommas } from "@/helper/helper"
import { useDocumentTotalHook } from "../hook/useDocumentTotalHook"
import shortid from "shortid"
import GLAccountRepository from "@/services/actions/GLAccountRepository"
import { TbEdit } from "react-icons/tb"
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
  handlerChangeItem,
  handlerAddItem,
  handlerRemoveItem,
  onChange,
  onChangeItemByCode,
  ContentLoading,
}: ContentFormProps) {
  const [key, setKey] = React.useState(shortid.generate())
  const serviceModalRef = React.createRef<ServiceModal>()
  const [collapseError, setCollapseError] = React.useState(false)

  React.useEffect(() => {
    setCollapseError("Items" in data?.error)
  }, [data?.error])

  const serviceColumns = React.useMemo(
    () => [
      {
        accessorKey: "ItemCode",
        header: "G/L Account", //uses the default width from defaultColumn prop
        visible: true,
        Header: (header: any) => (
          <label>
            G/L Account <span className="text-red-500">*</span>
          </label>
        ),
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.ItemCode)
            return (
              <div
                role="button"
                className="px-4 py-2 text-inherit rounded hover:bg-gray-200 border shadow-inner"
                onClick={handlerAddItem}
              >
                Add Row
              </div>
            )

          return (
            <MUITextField
              key={"ItemCode_" + cell.getValue()}
              value={cell.row.original?.ItemCode ?? ""}
              type="text"
              readOnly={true}
              endAdornment
              onClick={() => serviceModalRef.current?.onOpen(cell.row.original)}
              endIcon={
                cell.getValue() === "" ? null : <TbEdit className="text-lg" />
              }
            />
          )
        },
      },
      {
        accessorKey: "ItemName",
        header: "G/L Account Name", //uses the default width from defaultColumn prop
        visible: true,
        Header: (header: any) => (
          <label>
            G/L Account Name <span className="text-red-500">*</span>
          </label>
        ),
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.ItemCode) return

          return (
            <MUITextField
              key={"ItemName_" + cell.getValue()}
              type="text"
              value={
                cell.row.original?.ItemName ??
                new GLAccountRepository().find(cell.row.original?.ItemCode)?.Name
              }
              readOnly={true}
            />
          )
        },
      },
      {
        accessorKey: "VatGroup",
        header: "Tax Code", //uses the default width from defaultColumn prop
        visible: true,
        Header: (header: any) => (
          <label>
            Tax Code <span className="text-red-500">*</span>
          </label>
        ),
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.ItemCode) return
          return (
            <MUITextField
              key={"unitPrice_" + cell.getValue()}
              value={cell.getValue()}
              type="text"
              readOnly={true}
            />
          )
        },
      },
      {
        accessorKey: "OpenAmountLC",
        header: "Amount", //uses the default width from defaultColumn prop
        visible: true,
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.ItemCode) return null
          return (
            <MUITextField
              startAdornment={data?.Currency}
              value={cell.row?.original?.UnitPrice || 0}
              readOnly={true}
            />
          )
        },
      },
    ],
    [serviceModalRef]
  )

  const onUpdateByItem = (item: any) => onChangeItemByCode(item)
  const onClose = React.useCallback(() => setCollapseError(false), [])
  const isNotAccount = data?.DocType !== "rAccount";  

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
        columns={serviceColumns}
        items={[...data?.Items]}
        isNotAccount={isNotAccount}
        data={data}
        onChange={onChange}
        onRemoveChange={handlerRemoveItem}
        loading={false}
      />
      <ServiceModal ref={serviceModalRef} onSave={onUpdateByItem} />
    </>
  )
}
