import React from "react"
import MUITextField from "../../../../components/input/MUITextField"
import ItemGroupRepository from "../../../../services/actions/itemGroupRepository"
import MUIDatePicker from "@/components/input/MUIDatePicker"
import { TbEdit } from "react-icons/tb"
import ContentComponent from "./ContentComponents"
import { ItemModal } from "./ItemModal"
import { ServiceModal } from "./ServiceModal"
import { Alert, Collapse, IconButton } from "@mui/material"
import { MdOutlineClose } from "react-icons/md"
import GLAccountRepository from "@/services/actions/GLAccountRepository"
import { numberWithCommas } from "@/helper/helper"

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
  const updateRef = React.createRef<ItemModal>()
  const serviceModalRef = React.createRef<ServiceModal>()
  const itemGroupRepo = new ItemGroupRepository()
  const [collapseError, setCollapseError] = React.useState(false)

  React.useEffect(() => {
    setCollapseError("Items" in data?.error)
  }, [data?.error])

  const handlerChangeInput = (event: any, row: any, field: any) => {
    if (data?.isApproved) return

    let value = event?.target?.value ?? event
    handlerChangeItem({ value: value, record: row, field })
  }

  const handlerUpdateRow = (row: any, e: any) => {
    const index = row?.index || 0
    const items: any = data?.Items?.map((item: any, indexItem: number) => {
      if (index === indexItem)
        return {
          ...item,
          Discount: e.target.value,
        }
      return item
    })
    onChange("Items", items)
  }

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "DocumentNo",
        header: "Document No.",
        visible: true,
      },
      {
        accessorKey: "TransTypeName",
        header: "Document Type",
        visible: true,
      },
      {
        accessorKey: "DueDate",
        header: "Date",
        visible: false,
      },
      {
        accessorKey: "DocTotal",
        header: "Total",
        visible: true,
        Cell: ({ cell }: any) => {
          const row = cell?.row?.original
          return `${row?.FCCurrency} ${numberWithCommas(
            (row?.DocTotalFC || row?.DocTotal).toFixed(2)
          )}`
        },
      },
      {
        accessorKey: "DocBalance",
        header: "Balance Due",
        visible: true,
        Cell: ({ cell }: any) => {
          const row = cell?.row?.original
          return `${row?.FCCurrency} ${numberWithCommas(
            (row?.DocBalanceFC || row?.DocBalance).toFixed(2)
          )}`
        },
      },
      {
        accessorKey: "CardParent",
        header: "Cash Discount",
        visible: true,
        Cell: ({ cell }: any) => (
          <MUITextField
            type="number"
            value={cell?.row?.original.Discount}
            onChange={(e: any) => handlerUpdateRow(cell?.row, e)}
          />
        ),
      },
      {
        accessorKey: "OverDueDays",
        header: "OverDue Days",
        visible: true,
      },
      {
        header: "Total Payment",
        visible: true,
        Cell: ({ cell }: any) => <MUITextField type="number" value="" />,
      },
    ],
    [updateRef]
  )

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
              disabled={data.disable["DocumentLine"]}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "LineTotal")
              }
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
              disabled={data.disable["DocumentLine"]}
            />
          )
        },
      },
      {
        accessorKey: "Discount",
        header: "Discount", //uses the default width from defaultColumn prop
        visible: true,
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.ItemCode) return null

          return (
            <MUITextField
              key={"discount_" + cell.getValue()}
              value={cell.getValue() || 0}
              startAdornment={"%"}
              disabled={data.disable["DocumentLine"]}
              onBlur={(event) =>
                handlerChangeInput(event, cell?.row?.original, "Discount")
              }
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
              startAdornment={"USD"}
              value={cell.row?.original?.UnitPrice || 0}
              disabled={true}
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
        columns={data?.DocType !== "rAccount" ? itemColumns : serviceColumns}
        items={[...data?.Items]}
        isNotAccount={isNotAccount}
        data={data}
        onChange={onChange}
        onRemoveChange={handlerRemoveItem}
        loading={ContentLoading}
      />
      <ServiceModal ref={serviceModalRef} onSave={onUpdateByItem} />
    </>
  )
}
