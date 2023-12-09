import React from "react"
import MUITextField from "../../../../components/input/MUITextField"
import MaterialReactTable from "material-react-table"
import FormCard from "@/components/card/FormCard"
import { Button, IconButton } from "@mui/material"
import { TbSettings } from "react-icons/tb"
import { AiOutlineFileAdd } from "react-icons/ai"

const ContentForm = React.memo(function ContentForm({ Items }: any) {
  const handlerAddNew = () => {}
  
  const itemData = React.useMemo(() => {
    return Items
  }, [Items])

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "saleCode",
        header: "Sale Code",
        visible: true,
        Cell: ({ cell }: any) => {
          if (cell.row.original.isSale) {
            return (
              <div style={{ position: "relative" }}>
                <AiOutlineFileAdd
                  style={{
                    position: "absolute",
                    right: 2,
                    top: 9,
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                />
                <MUITextField value={cell.getValue()} />
              </div>
            )
          }
        },
      },
      {
        accessorKey: "saleName",
        header: "Sale Name",
        visible: true,
        Cell: ({ cell }: any) => {
          if (!cell?.row?.original?.saleCode) {
            return (
              <Button variant="outlined" size="small" onClick={handlerAddNew}>
                <span className="text-xs  capitalize font-normal">+ Add New</span>
              </Button>
            )
          }

          if (cell.row.original.isSale)
            return <MUITextField value={cell.getValue()} readOnly={true} />
        },
      },
      {
        accessorKey: "lob",
        header: "LOB",
        visible: true,
        Cell: ({ cell }: any) => {
          if (!cell.row.original.isItem)
            return (
              <div className="flex" style={{ position: "relative" }}>
                <MUITextField
                  value={cell.getValue()}
                  disabled={cell.row.original.isSale}
                />
                {!cell.row.original.isSale && (
                  <AiOutlineFileAdd
                    style={{
                      position: "absolute",
                      right: 2,
                      top: 9,
                      fontSize: "20px",
                      cursor: "pointer",
                    }}
                  />
                )}
              </div>
            )
        },
      },
      {
        accessorKey: "itemCode",
        header: "Item Code",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <div className="flex" style={{ position: "relative" }}>
              <MUITextField
                value={cell.getValue()}
                disabled={cell.row.original.isSale || cell.row.original.isLob}
              />
              {!(cell.row.original.isSale || cell.row.original.isLob) && (
                <AiOutlineFileAdd
                  style={{
                    position: "absolute",
                    right: 2,
                    top: 9,
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                />
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              disabled={cell.row.original.isSale || cell.row.original.isLob}
              readOnly={cell.row.original.isItem}
            />
          )
        },
      },
      {
        accessorKey: "uom",
        header: "UoM",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              disabled={cell.row.original.isSale || cell.row.original.isLob}
            />
          )
        },
      },
      {
        accessorKey: "Jan",
        header: "Jan (QTY | Amount)",
        visible: true,
        size: 450,
        Cell: ({ cell }: any) => {
          return (
            <>
              <div className="flex">
                <MUITextField
                  value={cell.row.original.Jan_qty}
                  className="text-xs text-field pr-0"
                />
                <div
                  style={{
                    margin: "6px 9px 0px 9px",
                    height: "28px",
                    background: "#00000057",
                    width: "1px",
                  }}
                ></div>
                <MUITextField
                  value={cell.row.original.Jan_amount}
                  className="text-xs text-field pr-0"
                />
              </div>
            </>
          )
        },
      },
      {
        accessorKey: "Feb",
        header: "Feb (QTY | Amount)",
        visible: true,
        size: 450,
        Cell: ({ cell }: any) => {
          return (
            <>
              <div className="flex">
                <MUITextField
                  value={cell.row.original.Feb_qty}
                  className="text-xs text-field pr-0"
                />
                <div
                  style={{
                    margin: "6px 9px 0px 9px",
                    height: "28px",
                    background: "#00000057",
                    width: "1px",
                  }}
                ></div>
                <MUITextField
                  value={cell.row.original.Feb_amount}
                  className="text-xs text-field pr-0"
                />
              </div>
            </>
          )
        },
      },
      {
        accessorKey: "Mar",
        header: "Mar (QTY | Amount)",
        visible: true,
        size: 450,
        Cell: ({ cell }: any) => {
          return (
            <>
              <div className="flex">
                <MUITextField
                  value={cell.row.original.Mar_qty}
                  className="text-xs text-field pr-0"
                />
                <div
                  style={{
                    margin: "6px 9px 0px 9px",
                    height: "28px",
                    background: "#00000057",
                    width: "1px",
                  }}
                ></div>
                <MUITextField
                  value={cell.row.original.Mar_amount}
                  className="text-xs text-field pr-0"
                />
              </div>
            </>
          )
        },
      },
      {
        accessorKey: "Apr",
        header: "Apr (QTY | Amount)",
        visible: true,
        size: 450,
        Cell: ({ cell }: any) => {
          return (
            <>
              <div className="flex">
                <MUITextField
                  value={cell.row.original.Apr_qty}
                  className="text-xs text-field pr-0"
                />
                <div
                  style={{
                    margin: "6px 9px 0px 9px",
                    height: "28px",
                    background: "#00000057",
                    width: "1px",
                  }}
                ></div>
                <MUITextField
                  value={cell.row.original.Apr_amount}
                  className="text-xs text-field pr-0"
                />
              </div>
            </>
          )
        },
      },
      {
        accessorKey: "May",
        header: "May (QTY | Amount)",
        visible: true,
        size: 450,
        Cell: ({ cell }: any) => {
          return (
            <>
              <div className="flex">
                <MUITextField
                  value={cell.row.original.May_qty}
                  className="text-xs text-field pr-0"
                />
                <div
                  style={{
                    margin: "6px 9px 0px 9px",
                    height: "28px",
                    background: "#00000057",
                    width: "1px",
                  }}
                ></div>
                <MUITextField
                  value={cell.row.original.May_amount}
                  className="text-xs text-field pr-0"
                />
              </div>
            </>
          )
        },
      },
      {
        accessorKey: "Jun",
        header: "Jun (QTY | Amount)",
        visible: true,
        size: 450,
        Cell: ({ cell }: any) => {
          return (
            <>
              <div className="flex">
                <MUITextField
                  value={cell.row.original.Jun_qty}
                  className="text-xs text-field pr-0"
                />
                <div
                  style={{
                    margin: "6px 9px 0px 9px",
                    height: "28px",
                    background: "#00000057",
                    width: "1px",
                  }}
                ></div>
                <MUITextField
                  value={cell.row.original.Jun_amount}
                  className="text-xs text-field pr-0"
                />
              </div>
            </>
          )
        },
      },
      {
        accessorKey: "Jul",
        header: "Jul (QTY | Amount)",
        visible: true,
        size: 450,
        Cell: ({ cell }: any) => {
          return (
            <>
              <div className="flex">
                <MUITextField
                  value={cell.row.original.Jul_qty}
                  className="text-xs text-field pr-0"
                />
                <div
                  style={{
                    margin: "6px 9px 0px 9px",
                    height: "28px",
                    background: "#00000057",
                    width: "1px",
                  }}
                ></div>
                <MUITextField
                  value={cell.row.original.Jul_amount}
                  className="text-xs text-field pr-0"
                />
              </div>
            </>
          )
        },
      },
      {
        accessorKey: "Aug",
        header: "Aug (QTY | Amount)",
        visible: true,
        size: 450,
        Cell: ({ cell }: any) => {
          return (
            <>
              <div className="flex">
                <MUITextField
                  value={cell.row.original.Aug_qty}
                  className="text-xs text-field pr-0"
                />
                <div
                  style={{
                    margin: "6px 9px 0px 9px",
                    height: "28px",
                    background: "#00000057",
                    width: "1px",
                  }}
                ></div>
                <MUITextField
                  value={cell.row.original.Aug_amount}
                  className="text-xs text-field pr-0"
                />
              </div>
            </>
          )
        },
      },
      {
        accessorKey: "Sep",
        header: "Sep (QTY | Amount)",
        visible: true,
        size: 450,
        Cell: ({ cell }: any) => {
          return (
            <>
              <div className="flex">
                <MUITextField
                  value={cell.row.original.Sep_qty}
                  className="text-xs text-field pr-0"
                />
                <div
                  style={{
                    margin: "6px 9px 0px 9px",
                    height: "28px",
                    background: "#00000057",
                    width: "1px",
                  }}
                ></div>
                <MUITextField
                  value={cell.row.original.Sep_amount}
                  className="text-xs text-field pr-0"
                />
              </div>
            </>
          )
        },
      },
      {
        accessorKey: "Oct",
        header: "Oct (QTY | Amount)",
        visible: true,
        size: 450,
        Cell: ({ cell }: any) => {
          return (
            <>
              <div className="flex">
                <MUITextField
                  value={cell.row.original.Oct_qty}
                  className="text-xs text-field pr-0"
                />
                <div
                  style={{
                    margin: "6px 9px 0px 9px",
                    height: "28px",
                    background: "#00000057",
                    width: "1px",
                  }}
                ></div>
                <MUITextField
                  value={cell.row.original.Oct_amount}
                  className="text-xs text-field pr-0"
                />
              </div>
            </>
          )
        },
      },
      {
        accessorKey: "Nov",
        header: "Nov (QTY | Amount)",
        visible: true,
        size: 450,
        Cell: ({ cell }: any) => {
          return (
            <>
              <div className="flex">
                <MUITextField
                  value={cell.row.original.Nov_qty}
                  className="text-xs text-field pr-0"
                />
                <div
                  style={{
                    margin: "6px 9px 0px 9px",
                    height: "28px",
                    background: "#00000057",
                    width: "1px",
                  }}
                ></div>
                <MUITextField
                  value={cell.row.original.Nov_amount}
                  className="text-xs text-field pr-0"
                />
              </div>
            </>
          )
        },
      },
      {
        accessorKey: "Dec",
        header: "Dec (QTY | Amount)",
        visible: true,
        size: 450,
        Cell: ({ cell }: any) => {
          return (
            <>
              <div className="flex">
                <MUITextField
                  value={cell.row.original.Dec_qty}
                  className="text-xs text-field pr-0"
                />
                <div
                  style={{
                    margin: "6px 9px 0px 9px",
                    height: "28px",
                    background: "#00000057",
                    width: "1px",
                  }}
                ></div>
                <MUITextField
                  value={cell.row.original.Dec_amount}
                  className="text-xs text-field pr-0"
                />
              </div>
            </>
          )
        },
      },
      {
        accessorKey: "Total",
        header: "Total",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={cell.getValue()}
              className="text-xs text-field pr-0"
            />
          )
        },
      },
    ],
    [Items],
  )

  return (
    <>
      <FormCard
        title="Content"
        action={
          <div className="flex ">
            {/* <Button size="small" disabled={data?.isStatusClose || false}>
              <span className="capitalize text-sm" onClick={() => {}}>
                Remove
              </span>
            </Button> */}
            {/* <Button size="small" disabled={data?.isStatusClose || false}>
              <span className="capitalize text-sm" onClick={() => {}}>
                Add
              </span>
            </Button> */}
            <IconButton
              onClick={() => {
                // columnRef.current?.onOpen()
              }}
            >
              <TbSettings className="text-2lg" />
            </IconButton>
          </div>
        }
      >
        <>
          <div className="col-span-2 data-table">
            <MaterialReactTable
              columns={itemColumns}
              data={itemData ?? []}
              // enableRowNumbers={true}
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
              // onColumnVisibilityChange={setColVisibility}
              enableStickyFooter={false}
              enableMultiRowSelection={true}
              initialState={{
                density: "compact",
                //   columnVisibility: colVisibility,
                //   rowSelection,
              }}
              state={
                {
                  //   columnVisibility: colVisibility,
                  //   rowSelection,
                  //   isLoading: props.loading,
                  //   showProgressBars: props.loading,
                  //   showSkeletons: props.loading,
                }
              }
              muiTableBodyRowProps={() => ({
                sx: { cursor: "pointer" },
              })}
              // icons={{
              //   ViewColumnIcon: (props: any) => <AiOutlineSetting {...props} />,
              // }}
              enableTableFooter={false}
            />
          </div>
          {/* <div className="col-span-2 mt-[-40px]">
            <div className="grid grid-cols-2">
              <div className="w-full grid grid-cols-2 mt-4"></div>
              <div className="pl-20">
                <div className="grid grid-cols-5">
                  <div className="col-span-2">
                    <span className="flex items-center pt-2 text-sm">
                      <b>Total Payment Due</b>
                    </span>
                  </div>
                  <div className="col-span-3">
                    <NumericFormat
                      placeholder="0.00"
                      thousandSeparator
                      //   startAdornment={props?.data?.Currency}
                      decimalScale={2}
                      className="bg-white"
                      fixedDecimalScale
                      customInput={MUITextField}
                      disabled={true}
                      //   value={itemInvoicePrices || 0}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {/* <ContentTableSelectColumn
            ref={columnRef}
            columns={props.columns}
            visibles={colVisibility}
            onSave={(value) => {
              setColVisibility(value)
            }}
          /> */}
        </>
      </FormCard>
    </>
  )
})

export default ContentForm
