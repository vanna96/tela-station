import React, { useEffect, useMemo } from "react"
import MaterialReactTable from "material-react-table"
import { Button, Checkbox, FormControlLabel, IconButton } from "@mui/material"
import { AiOutlineSetting } from "react-icons/ai"
import { currencyFormat } from "@/utilies"
import FormCard from "@/components/card/FormCard"
import { TbSettings } from "react-icons/tb"
import { ThemeContext } from "@/contexts"
import Modal from "@/components/modal/Modal"
import MUISelect from "@/components/selectbox/MUISelect"
import { useDocumentTotalHook } from "../hook/useDocumentTotalHook"
import { BiSearch } from "react-icons/bi"
import MUITextField from "@/components/input/MUITextField"
import shortid from "shortid"
import { useExchangeRate } from "../hook/useExchangeRate"
import { useParams } from "react-router-dom"

interface ContentComponentProps {
  items: any[]
  onChange?: (key: any, value: any) => void
  columns: any[]
  type?: String
  labelType?: String
  typeLists?: any[]
  onRemoveChange?: (record: any[]) => void
  readOnly?: boolean
  viewOnly?: boolean
  data: any
}

export default function ContentComponent(props: ContentComponentProps) {
  const checked = props?.data?.Rounding == "true"

  const { id }: any = useParams()
  if (!(id > 0)) useExchangeRate(props?.data?.Currency, props.onChange)

  const { theme } = React.useContext(ThemeContext)
  const columnRef = React.createRef<ContentTableSelectColumn>()
  const [discount, setDiscount] = React.useState(props?.data?.DocDiscount || 0)
  const [colVisibility, setColVisibility] = React.useState<Record<string, boolean>>(
    {}
  )
  const blankItem = { ItemCode: "" }
  const [rowSelection, setRowSelection] = React.useState<any>({})

  const handlerRemove = () => {
    if (props.onRemoveChange === undefined) return

    let temps: any[] = [...props.items]
    Object.keys(rowSelection).forEach((index: any) => {
      const item = props.items[index]
      const indexWhere = temps.findIndex((e) => e?.ItemCode === item?.ItemCode)

      if (indexWhere >= 0) temps.splice(indexWhere, 1)
    })
    setRowSelection({})
    props.onRemoveChange(temps)
  }

  const [docTotal, docTaxTotal] = useDocumentTotalHook(
    props.items ?? [],
    discount,
    props?.data?.ExchangeRate
  )

  React.useEffect(() => {
    const cols: any = {}
    props.columns.forEach((e: any) => {
      cols[e?.accessorKey] = e?.visible
    })
    setColVisibility({ ...cols, ...colVisibility })
  }, [props.columns])

  const columns = useMemo(() => props.columns, [colVisibility])

  const onChange = (key: string, value: any) => {
    if (key === "DocDiscount") {
      setDiscount(value.target.value)
    }

    if (props.onChange) props.onChange(key, value?.target?.value)
  }

  const onCheckRow = (event: any, index: number) => {
    const rowSelects: any = { ...rowSelection }
    rowSelects[index] = true

    if (!event.target.checked) {
      delete rowSelects[index]
    }

    setRowSelection(rowSelects)
  }

  const dataCurrency = props?.data?.vendor?.currenciesCollection
    ?.filter(({ Include }: any) => Include === "tYES")
    ?.map(({ CurrencyCode }: any) => {
      return { value: CurrencyCode, name: CurrencyCode }
    })

  const discountAmount = useMemo(() => {
    const dataDiscount: number = props?.data?.DocDiscount || discount
    if (dataDiscount <= 0) return 0
    if (dataDiscount > 100) return 100
    return docTotal * (dataDiscount / 100)
  }, [discount, props.items])

  let TotalPaymentDue = docTotal - (docTotal * discount) / 100 + docTaxTotal || 0
  if (checked)
    TotalPaymentDue = TotalPaymentDue + parseFloat(props.data.RoundingValue || 0)

  useEffect(() => {
    if (!checked) onChange("RoundingValue", 0)
  }, [checked])

  return (
    <FormCard
      title="Content"
      action={
        <div className="flex ">
          <Button size="small" disabled={props?.data?.isStatusClose || false}>
            <span className="capitalize text-sm">Copy</span>
          </Button>
          <Button size="small" disabled={props?.data?.isStatusClose || false}>
            <span className="capitalize text-sm">Paste</span>
          </Button>
          <Button size="small" disabled={props?.data?.isStatusClose || false}>
            <span className="capitalize text-sm" onClick={handlerRemove}>
              Remove
            </span>
          </Button>
          <IconButton onClick={() => columnRef.current?.onOpen()}>
            <TbSettings className="text-2lg" />
          </IconButton>
        </div>
      }
    >
      <>
        <div
          className={`col-span-2 grid grid-cols-2 md:grid-cols-1  gap-4 ${
            !props.viewOnly && "my-6"
          }`}
        >
          <div className="grid grid-cols-12 ">
            <div className="col-span-5">
              <div className="flex gap-4 items-start">
                <label
                  htmlFor="currency"
                  className=" flex pt-1 text-[#656565] text-sm"
                >
                  Currency
                </label>
                <MUISelect
                  value={props?.data?.CurrencyType || "L"}
                  items={[
                    { value: "L", name: "Local Currency" },
                    { value: "S", name: "System Currency" },
                    { value: "B", name: "BP Currency" },
                  ]}
                  aliaslabel="name"
                  aliasvalue="value"
                  onChange={(e: any) => onChange("CurrencyType", e)}
                />
              </div>
            </div>
            <div className="col-span-3 px-5">
              {props?.data?.CurrencyType === "B" && (
                <MUISelect
                  value={props?.data?.Currency || "AUD"}
                  disabled={props?.data?.disabledFields?.CurrencyType || false}
                  items={
                    dataCurrency?.length > 0
                      ? dataCurrency
                      : [
                          {
                            value: "AUD",
                            name: "Australian Dollar",
                          },
                          {
                            value: "GBP",
                            name: "British Pound",
                          },
                          {
                            value: "EUR",
                            name: "Euro",
                          },
                          {
                            value: "JPY",
                            name: "Japanese Yen",
                          },
                          {
                            value: "KHR",
                            name: "Khmer",
                          },
                          {
                            value: "NZD",
                            name: "New Zealand Dollar",
                          },
                          {
                            value: "SGD",
                            name: "Singapore Dollar",
                          },
                          {
                            Code: "USD",
                            name: "US Dollar",
                          },
                        ]
                  }
                  aliaslabel="name"
                  aliasvalue="value"
                  onChange={(e: any) => onChange("Currency", e)}
                />
              )}
            </div>
            <div className="col-span-4">
              {props?.data?.CurrencyType === "B" &&
                (props?.data?.Currency || "AUD") !== "AUD" && (
                  <MUITextField
                    value={props?.data?.ExchangeRate || 0}
                    name=""
                    disabled={true}
                    className="-mt-1"
                  />
                )}
            </div>
          </div>
          <div>
            <div className="col-span-2 grid grid-cols-3 gap-3 ">
              <label
                htmlFor="currency"
                className="text-sm col-span-2 md:col-span-1 flex items-center justify-end md:justify-start text-[#656565]"
              >
                Item / Service Type :
              </label>
              <div className="md:col-span-2">
                <MUISelect
                  value={props?.data?.DocType}
                  items={
                    props.typeLists ?? [
                      { value: "dDocument_Items", name: "Items" },
                      { value: "dDocument_Services", name: "Services" },
                    ]
                  }
                  aliaslabel="name"
                  aliasvalue="value"
                  onChange={(event) => onChange("DocType", event)}
                />
              </div>
              <label
                htmlFor="currency"
                className="text-sm col-span-2 md:col-span-1 flex items-center justify-end md:justify-start text-[#656565] "
              >
                Price Mode :
              </label>
              <div className="md:col-span-2">
                <MUISelect
                  value={props?.data?.vendor?.PriceMode}
                  onChange={(event) => onChange("PriceMode", event)}
                  items={[
                    { value: "pmGross", name: "Gross Price" },
                    { value: "pmNet", name: "Net Price" },
                  ]}
                  disabled
                  aliaslabel="name"
                  aliasvalue="value"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 data-table border-t">
          <MaterialReactTable
            columns={
              props.viewOnly
                ? columns
                : [
                    {
                      accessorKey: "id",
                      size: 30,
                      minSize: 30,
                      maxSize: 30,
                      enableResizing: false,
                      Cell: (cell) => (
                        <Checkbox
                          checked={cell.row.index in rowSelection}
                          size="small"
                          onChange={(event) => onCheckRow(event, cell.row.index)}
                        />
                      ),
                    },
                    ...columns,
                  ]
            }
            data={[...props?.items, blankItem] ?? []}
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
            onColumnVisibilityChange={setColVisibility}
            enableStickyFooter={false}
            enableMultiRowSelection={true}
            initialState={{
              density: "compact",
              columnVisibility: colVisibility,
              rowSelection,
            }}
            state={{
              columnVisibility: colVisibility,
              rowSelection,
            }}
            muiTableBodyRowProps={({ row }) => ({
              sx: { cursor: "pointer" },
            })}
            icons={{
              ViewColumnIcon: (props: any) => <AiOutlineSetting {...props} />,
            }}
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: theme === "light" ? "" : "#334155",
              },
            }}
            muiTableBodyCellProps={{
              sx: {
                backgroundColor: theme === "light" ? "" : "#364455 !important",
              },
            }}
            muiTableContainerProps={{
              sx: {
                backgroundColor: theme === "light" ? "" : "#334155",
              },
            }}
            muiTableBodyProps={{
              sx: {
                "& tr:nth-of-type(odd)": {
                  backgroundColor: theme === "light" ? "" : "#2C3847 !important",
                },
                ":hover": {
                  backgroundColor: theme === "light" ? "" : "#334155",
                },
              },
            }}
            muiBottomToolbarProps={{
              sx: {
                display: "none",
                backgroundColor: theme === "light" ? "" : "#334155 !important",
              },
            }}
            enableTableFooter={false}
          />

          <div className="w-full flex justify-between">
            <div className="text-right"></div>
            <div className="grid grid-cols-2 gap-0  w-[26rem] text-gray-600">
              <p className="text-base text-gray-800 font-semibold">Total Summary</p>
              <span></span>
              <div className="col-span-2 my-1 border-b"></div>
              <span className="flex items-center pt-1 text-sm">
                Total Before Discount {}
              </span>
              <MUITextField
                disabled={props?.data?.isStatusClose || false}
                placeholder="0.00"
                type="text"
                value={currencyFormat(docTotal)}
                readonly
                startAdornment={props?.data?.Currency}
              />
              <span className="flex items-center pt-1 text-sm">Discount</span>
              <div className="grid grid-cols-2 gap-2">
                <MUITextField
                  disabled={props?.data?.isStatusClose || false}
                  placeholder="0.00"
                  type="number"
                  startAdornment={"%"}
                  value={props?.data?.DocDiscount}
                  onChange={(event: any) => {
                    if (!(event.target.value <= 100 && event.target.value >= 0)) {
                      event.target.value = 0
                    }
                    onChange("DocDiscount", event)
                  }}
                />
                <span className="w-full  flex items-center pt-1 justify-end text-sm">
                  {props?.data?.Currency}{" "}
                  {parseFloat(discountAmount.toString()).toFixed(2)}
                </span>
              </div>
              <span className="flex items-center pt-1 text-sm">Freight</span>
              <span className="text-right pt-1 text-sm">
                {props?.data?.Currency} 0.00
              </span>
              <span className="flex items-center pt-1 text-sm">
                <FormControlLabel
                  label="Rounding"
                  control={
                    <Checkbox
                      checked={checked}
                      disabled={
                        props?.data?.Edit || props?.data?.isStatusClose || false
                      }
                      onChange={(e: any) => {
                        e.target.value = e.target.checked
                        onChange("Rounding", e)
                      }}
                    />
                  }
                />
              </span>
              <div className="grid grid-cols-1 gap-1">
                <MUITextField
                  disabled={
                    props?.data?.Edit || props?.data?.isStatusClose || !checked
                  }
                  placeholder="0.00"
                  type="number"
                  value={props?.data?.RoundingValue || 0}
                  startAdornment={props?.data?.Currency}
                  onChange={(e) => onChange("RoundingValue", e)}
                />
              </div>
              <span className="flex items-center pt-1 text-sm">Tax</span>
              <MUITextField
                placeholder="0.00"
                type="text"
                value={currencyFormat(docTaxTotal)}
                startAdornment={props?.data?.Currency}
                disabled={props?.data?.isStatusClose || false}
                readonly
              />
              <span className="flex items-center pt-1 text-sm">
                Total Payment Due
              </span>
              <MUITextField
                placeholder="0.00"
                type="text"
                startAdornment={props?.data?.Currency}
                disabled={props?.data?.isStatusClose || false}
                key={TotalPaymentDue.toString()}
                defaultValue={parseFloat(TotalPaymentDue.toString()).toFixed(2)}
              />
            </div>
          </div>
        </div>

        <ContentTableSelectColumn
          ref={columnRef}
          columns={props.columns}
          visibles={colVisibility}
          onSave={(value) => {
            setColVisibility(value)
          }}
        />
      </>
    </FormCard>
  )
}

interface ContentTableSelectColumnProps {
  ref?: React.RefObject<ContentTableSelectColumn | undefined>
  onSave?: (value: any) => void
  columns: any[]
  visibles: any
}

class ContentTableSelectColumn extends React.Component<
  ContentTableSelectColumnProps,
  any
> {
  constructor(props: any) {
    super(props)

    this.state = {
      open: false,
      searchColumn: "",
      showChecks: false,
      visibles: {},
    } as any

    this.onOpen = this.onOpen.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onSave = this.onSave.bind(this)
    this.handChange = this.handChange.bind(this)
    this.handlerChangeColVisibility = this.handlerChangeColVisibility.bind(this)
  }

  componentDidMount(): void {}

  onOpen(data?: any) {
    this.setState({ open: true, visibles: { ...this.props.visibles } })
  }

  onClose() {
    this.setState({ open: false })
  }

  onSave() {
    if (this.props.onSave) {
      this.props.onSave(this.state.visibles)
    }

    this.setState({ open: false })
  }

  handChange(event: any) {
    this.setState({ ...this.state, searchColumn: event.target.value })
  }

  handlerChangeColVisibility(event: any, field: string) {
    const visibles = { ...this.state.visibles }
    visibles[field] = event.target.checked
    this.setState({
      ...this.state,
      visibles: { ...this.props.visibles, ...visibles },
    })
  }

  render() {
    return (
      <Modal
        title={`Columns Setting`}
        titleClass="pt-3 px-2 font-bold w-full"
        open={this.state.open}
        widthClass="w-[40rem]"
        heightClass="h-[80vh]"
        onClose={this.onClose}
        onOk={this.onSave}
        okLabel="Save"
      >
        <div className="w-full h-full flex flex-col ">
          <div className="flex justify-between sticky top-0 bg-white py-2 z-10 border-b">
            <div className="flex">
              <div>
                {" "}
                <Checkbox
                  size="small"
                  className="mt-2"
                  defaultChecked={this.state.showChecks}
                  onChange={(e) =>
                    this.setState({
                      ...this.state,
                      showChecks: !this.state.showChecks,
                    })
                  }
                />
              </div>
              <label htmlFor="showAll" className="flex items-center ">
                Show Selected
              </label>
            </div>
            <div className="flex w-[15rem] items-center">
              <MUITextField
                placeholder="Search Column..."
                onChange={this.handChange}
                endAdornment
                endIcon={<BiSearch className="text-sm" />}
              />
            </div>
          </div>
          <ul className=" text-[14px] grid grid-cols-1 mt-3 ">
            {this.props.columns
              .filter((val) =>
                val.header
                  .toLowerCase()
                  .includes(this.state.searchColumn.toLowerCase())
              )
              .map((e) => (
                <li key={shortid.generate()} className={`border-b`}>
                  <Checkbox
                    checked={this.state.visibles[e?.accessorKey] ?? false}
                    onChange={(event) =>
                      this.handlerChangeColVisibility(event, e?.accessorKey)
                    }
                    size="small"
                  />{" "}
                  <span>{e?.header} </span>
                </li>
              ))}
          </ul>
        </div>
      </Modal>
    )
  }
}
