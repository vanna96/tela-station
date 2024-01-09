import React from "react"
import MUITextField from "../../../../components/input/MUITextField"
import { currencyFormat } from "@/utilies"
import ItemGroupRepository from "../../../../services/actions/itemGroupRepository"
import MUIDatePicker from "@/components/input/MUIDatePicker"
import { TbEdit } from "react-icons/tb"
import ContentComponent from "./ContentComponents"
import { ItemModal } from "./ItemModal"
import { ServiceModal } from "./ServiceModal"
import { Alert, Collapse, IconButton } from "@mui/material"
import { MdOutlineClose } from "react-icons/md"

interface ContentFormProps {
  handlerAddItem: () => void
  handlerChangeItem: (record: any) => void
  handlerRemoveItem: (record: any[]) => void
  data: any
  onChange: (key: any, value: any) => void
  onChangeItemByCode: (record: any) => void
}

export default function ContentForm({
  data,
  handlerChangeItem,
  handlerAddItem,
  handlerRemoveItem,
  onChange,
  onChangeItemByCode,
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

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "ItemCode",
        Header: (header: any) => (
          <label>
            Item No <span className="text-red-500">*</span>
          </label>
        ),
        header: "Item No", //uses the default width from defaultColumn prop
        visible: true,
        Cell: ({ cell }: any) => (
          /* if (!cell.row.original?.ItemCode)*/ /*     return <div role="button" className="px-4 py-2 text-inherit rounded hover:bg-gray-200 border shadow-inner" onClick={handlerAddItem}>Add Row</div>*/ <MUITextField
            value={cell.getValue()}
            disabled={data?.isStatusClose || false}
            onBlur={(event) =>
              handlerChangeInput(event, cell?.row?.original, "ItemCode")
            }
            endAdornment={!(data?.isStatusClose || false)}
            onClick={() => {
              if (cell.getValue() === "") {
                handlerAddItem()
              } else {
                updateRef.current?.onOpen(cell.row.original)
              }
            }}
            endIcon={cell.getValue() === "" ? null : <TbEdit className="text-lg" />}
            readOnly={true}
          />
        ),
      },
      {
        accessorKey: "ItemName",
        header: "Description",
        visible: true,
        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null
          return cell.getValue()
        },
      },
      {
        accessorKey: "ItemGroup",
        header: "Item Group",
        visible: false,
        Cell: ({ cell }: any) => (
          <MUITextField
            readOnly={true}
            disabled={data.disable["DocumentLine"]}
            value={itemGroupRepo.find(cell.getValue())?.GroupName}
          />
        ),
      },
      {
        accessorKey: "Quantity",
        header: "Quantity",
        Header: (header: any) => (
          <label>
            Quantity <span className="text-red-500">*</span>
          </label>
        ),

        visible: true,
        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null
          return cell.getValue()
        },
      },
      {
        accessorKey: "UnitPrice",
        header: "Unit Price",
        visible: true,
        Header: (header: any) => (
          <label>
            Unit Price <span className="text-red-500">*</span>
          </label>
        ),

        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null
          return currencyFormat(cell.getValue())
        },
      },
      {
        accessorKey: "VatGroup",
        header: "Tax Code",
        visible: false,

        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null
          return cell.getValue()
        },
      },
      {
        accessorKey: "GrossPrice",
        header: "Gross Price",
        visible: false,

        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null

          const total = parseFloat(cell.row.original?.VatRate ?? "0")
          return (
            "AUD " +
            currencyFormat(
              cell.row.original?.UnitPrice +
                (total * cell.row.original?.UnitPrice) / 100
            )
          )
        },
      },
      {
        accessorKey: "LineTotal",
        header: "Total",
        visible: false,

        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null
          return currencyFormat(cell.getValue() * data?.ExchangeRate)
        },
      },
      {
        accessorKey: "UomCode",
        header: "Uom Code",
        visible: false,

        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null
          return currencyFormat(cell.getValue())
        },
      },
      {
        accessorKey: "UomGrop",
        header: "Uom Grop",
        visible: false,

        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null
          return currencyFormat(cell.getValue())
        },
      },
      {
        accessorKey: "UnitOfMeasure",
        header: "Item Per Group",

        visible: false,
        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null
          return currencyFormat(cell.getValue())
        },
      },
      {
        accessorKey: "Dimesion1",
        header: "Dimesion 1",
        visible: false,

        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null
          return currencyFormat(cell.getValue())
        },
      },
      {
        accessorKey: "Dimesion2",
        header: "Dimesion 2",

        visible: false,

        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null
          return currencyFormat(cell.getValue())
        },
      },
      {
        accessorKey: "Dimesion3",
        header: "Dimesion 3",
        visible: false,

        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null
          return currencyFormat(cell.getValue())
        },
      },
      {
        accessorKey: "Dimesion4",
        header: "Dimesion 4",
        visible: false,

        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null
          return currencyFormat(cell.getValue())
        },
      },
      {
        accessorKey: "Dimesion5",
        header: "Dimesion 5",
        visible: false,

        Cell: ({ cell }: any) => {
          if (Object.keys(cell.row.original).length === 1) return null
          return currencyFormat(cell.getValue())
        },
      },
    ],
    [updateRef]
  )

  const serviceColumns = React.useMemo(
    () => [
      {
        accessorKey: "UnitPrice",
        header: "Planned Amount (LC)", //uses the default width from defaultColumn prop
        visible: true,
        Header: (header: any) => (
          <label>
            Planned Amount (LC) <span className="text-red-500">*</span>
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
              key={"unitPrice_" + cell.getValue()}
              defaultValue={currencyFormat(cell.getValue())}
              startAdornment={"USD"}
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
        accessorKey: "Discount",
        header: "Line Discount", //uses the default width from defaultColumn prop
        visible: true,
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.ItemCode) return null

          return (
            <MUITextField
              key={"discount_" + cell.getValue()}
              defaultValue={cell.getValue()}
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
        header: "Open Amount (LC)", //uses the default width from defaultColumn prop
        visible: true,
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.ItemCode) return null

          return (
            <MUITextField
              startAdornment={"USD"}
              value={cell.row?.original?.UnitPrice}
              disabled={true}
            />
          )
        },
      },
      {
        accessorKey: "FreeText",
        header: "Free Text", //uses the default width from defaultColumn prop
        visible: true,
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.ItemCode) return null

          return (
            <MUITextField
              key={"freeText_" + cell.getValue()}
              defaultValue={cell.getValue()}
              disabled={data.disable["DocumentLine"]}
              onBlur={(event: any) =>
                handlerChangeInput(event, cell?.row?.original, "FreeText")
              }
            />
          )
        },
      },
      {
        accessorKey: "PortionOfReturns",
        visible: false,
        header: "Portion Of Returns %", //uses the default width from defaultColumn prop
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.ItemCode) return null

          return (
            <MUITextField
              type="number"
              value={cell.getValue()}
              onChange={(value) =>
                handlerChangeInput(value, cell?.row?.original, "PortionOfReturns")
              }
            />
          )
        },
      },
      {
        accessorKey: "EndOfWarranty",
        visible: false,
        header: "End Of Warranty", //uses the default width from defaultColumn prop
        Cell: ({ cell }: any) => {
          if (!cell.row.original?.ItemCode) return null
          return (
            <MUIDatePicker
              value={cell.getValue() ?? null}
              onChange={(value) =>
                handlerChangeInput(value, cell?.row?.original, "EndOfWarranty")
              }
            />
          )
        },
      },
    ],
    [serviceModalRef]
  )

  const onUpdateByItem = (item: any) => onChangeItemByCode(item)
  const onClose = React.useCallback(() => setCollapseError(false), [])

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
        columns={data?.DocType === "dDocument_Items" ? itemColumns : serviceColumns}
        items={data?.Items ?? []}
        data={data}
        onChange={onChange}
        labelType={"Item / Service Type"}
        type={data?.DocType ?? "dDocument_Items"}
        typeLists={[
          { name: "Item", value: "dDocument_Items" },
          // { name: "Service", value: "dDocument_Service" },
        ]}
        onRemoveChange={handlerRemoveItem}
      />
      <ItemModal
        ref={updateRef}
        onSave={onUpdateByItem}
        columns={itemColumns}
      />
      <ServiceModal ref={serviceModalRef} onSave={onUpdateByItem} />
    </>
  )
}
