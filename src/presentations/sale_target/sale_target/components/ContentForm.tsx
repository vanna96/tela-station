import MUITextField from "../../../../components/input/MUITextField"
import MaterialReactTable from "material-react-table"
import FormCard from "@/components/card/FormCard"
import { Button, IconButton } from "@mui/material"
import { TbEdit, TbSettings } from "react-icons/tb"
import { AiOutlineDelete, AiOutlineFileAdd } from "react-icons/ai"
import SalePersonAutoComplete from "@/components/input/SalesPersonAutoComplete"
import MUISelect from "@/components/selectbox/MUISelect"
import SalePersonRepository from "@/services/actions/salePersonRepository"
import { useQuery } from "react-query"
import Select from "react-tailwindcss-select"
import { useState, useMemo } from "react"
import DistributionRuleSelect from "@/components/selectbox/DistributionRule"
import itemRepository from "@/services/actions/itemRepostory"
import { fontSize } from "@mui/system"

const ContentForm = function ContentForm({ data, handlerChange }: any) {
  const handlerAddNewLob = (index: any) => {
    const cpTarget = data?.Targets.find((e: any, idx: any) => index === idx)
    if (!cpTarget?.saleCode?.value) return
    let newArray = [
      ...data?.Targets,
      {
        ...cpTarget,
        itemCode: "",
        description: "",
        uom: "",
        lob: "",
        Jan_amount: "0",
        Jan_qty: "0",
        Feb_amount: "0",
        Feb_qty: "0",
        Mar_amount: "0",
        Mar_qty: "0",
        Apr_amount: "0",
        Apr_qty: "0",
        May_amount: "0",
        May_qty: "0",
        Jun_amount: "0",
        Jun_qty: "0",
        Jul_amount: "0",
        Jul_qty: "0",
        Aug_amount: "0",
        Aug_qty: "0",
        Sep_qty: "0",
        Sep_amount: "0",
        Oct_amount: "0",
        Oct_qty: "0",
        Nov_amount: "0",
        Nov_qty: "0",
        Dec_amount: "0",
        Dec_qty: "0",
        Total: "0",
        isLob: true,
      },
    ]
    newArray.sort((a, b) => a.saleName.localeCompare(b.saleName))
    handlerChange("Targets", newArray)
    // .sort((a, b) => {
    //   // Compare by age
    //   const ageComparison = a.age - b.age;

    //   // If ages are equal, compare by name
    //   return ageComparison === 0 ? a.name.localeCompare(b.name) : ageComparison;
    // });
  }

  const handlerAddNewSale = () => {
    handlerChange("Targets", [
      ...data?.Targets,
      {
        saleCode: "",
        saleName: "",
        itemCode: "",
        description: "",
        uom: "",
        lob: "",
        Jan_amount: "0",
        Jan_qty: "0",
        Feb_amount: "0",
        Feb_qty: "0",
        Mar_amount: "0",
        Mar_qty: "0",
        Apr_amount: "0",
        Apr_qty: "0",
        May_amount: "0",
        May_qty: "0",
        Jun_amount: "0",
        Jun_qty: "0",
        Jul_amount: "0",
        Jul_qty: "0",
        Aug_amount: "0",
        Aug_qty: "0",
        Sep_qty: "0",
        Sep_amount: "0",
        Oct_amount: "0",
        Oct_qty: "0",
        Nov_amount: "0",
        Nov_qty: "0",
        Dec_amount: "0",
        Dec_qty: "0",
        Total: "0",
        isLob: false,
      },
    ])
  }

  const handlerChangeField = (index: number, key: any, value: any) => {
    const newData: any = data?.Targets?.map((target: any, idx: any) => {
      let inputString = value?.label
      let result = inputString?.replace(`${value?.value} - `, "")

      if (idx === index) {
        if (key === "saleCode") return { ...target, [key]: value, saleName: result }
        return { ...target, [key]: value }
      }
      return target
    })

    handlerChange("Targets", newData)
  }

  const { data: salePersons }: any = useQuery({
    queryKey: ["sale_persons"],
    queryFn: () => new SalePersonRepository().get(),
  })

  const { data:Items }: any = useQuery({
    queryKey: ["items_group"],
    queryFn: () => new itemRepository().getSaleItem(
      ` &$filter=ItemType eq 'itItems' and (ItemsGroupCode eq 100 or ItemsGroupCode eq 101 or ItemsGroupCode eq 102)&$orderby=ItemCode asc`
    )
  });

  const itemColumns: any = [
    {
      accessorKey: "id",
      header: "Action",
      visible: true,
      size: 80,
      Cell: ({ cell }: any) => {
        return <Button size="small">
        <span className="capitalize text-sm" onClick={() => {}}>
          <AiOutlineDelete className="text-red-500 text-[22px]"/>
        </span>
      </Button>
      },
    },
    {
      accessorKey: "saleCode",
      header: "Sale Code",
      visible: true,
      Cell: ({ cell }: any) => {
        if (!cell.row.original.isLob) {
          return (
            <div>
              <Select
                value={cell.row.original.saleCode}
                isSearchable={true}
                onChange={(e: any) =>
                  handlerChangeField(cell.row.index, "saleCode", e)
                }
                options={
                  salePersons?.map((e: any) => {
                    return {
                      value: e.code,
                      label: `${e.code} - ${e.name}`,
                    }
                  }) ?? []
                }
                primaryColor={""}
              />
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
        if (!cell.row.original.isLob)
          return <MUITextField value={cell.getValue()} readOnly={true} />
      },
    },
    {
      accessorKey: "lob",
      header: "LOB",
      visible: true,
      Cell: ({ cell }: any) => {
        return (
          <div className="flex" style={{ position: "relative" }}>
            {!cell.row.original.isLob && (
              <div className="text-field text-right">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handlerAddNewLob(cell.row.index)}
                  style={{ width: "100% !important", height: "30px" }}
                >
                  <span className="text-xs  capitalize font-normal">+ Add LOB</span>
                </Button>
              </div>
            )}
            {cell.row.original.isLob && (
              <DistributionRuleSelect
                value={cell.getValue()}
                onChange={(e: any) =>
                  handlerChangeField(cell.row.index, "lob", e.target.value)
                }
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

        let dataItems:any = useMemo(() => {
          switch (cell.row.original.lob) {
            case 'Oil':
                return Items?.filter((e:any) => e.ItemsGroupCode === 100)
            case 'Lube':
                return Items?.filter((e:any) => e.ItemsGroupCode === 101)
            case 'LPG':
                return Items?.filter((e:any) => e.ItemsGroupCode === 102)
            default:
              return Items
          }
        }, [Items, cell.row.original.lob]);

        return (
          <div>
            { cell.row.original.isLob &&
              <Select
                value={cell.row.original.itemCode}
                isSearchable={true}
                onChange={(e: any) => handlerChangeField(cell.row.index, "itemCode", e)}
                options={
                  dataItems?.map((e: any) => {
                    return {
                      value: e.ItemCode,
                      label: `${e.ItemCode} - ${e.ItemName}`,
                    }
                  }) ?? []
                }
                primaryColor={""}
              />
            }
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
          <div>
            {cell.row.original.isLob && (
              <MUITextField value={Items?.find((e:any) => e.ItemCode === cell.row.original.itemCode.value)?.ItemName} readOnly />
            )}{" "}
          </div>
        )
      },
    },
    {
      accessorKey: "uom",
      header: "UoM",
      visible: true,
      Cell: ({ cell }: any) => {
        return (
          <div>
            {cell.row.original.isLob && <MUITextField value={cell.getValue()} />}{" "}
          </div>
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
                defaultValue={cell.row.original.Jan_qty}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Jan_qty", e.target.value)}
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
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Jan_amount", e.target.value)}
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
                defaultValue={cell.row.original.Feb_qty}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Feb_qty", e.target.value)}
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
                defaultValue={cell.row.original.Feb_amount}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Feb_amount", e.target.value)}
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
                defaultValue={cell.row.original.Mar_qty}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Mar_qty", e.target.value)}
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
                defaultValue={cell.row.original.Mar_amount}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Mar_amount", e.target.value)}
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
                defaultValue={cell.row.original.Apr_qty}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Apr_qty", e.target.value)}
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
                defaultValue={cell.row.original.Apr_amount}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Apr_amount", e.target.value)}
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
                defaultValue={cell.row.original.May_qty}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "May_qty", e.target.value)}
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
                defaultValue={cell.row.original.May_amount}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "May_amount", e.target.value)}
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
                defaultValue={cell.row.original.Jun_qty}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Jun_qty", e.target.value)}
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
                defaultValue={cell.row.original.Jun_amount}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Jun_amount", e.target.value)}
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
                defaultValue={cell.row.original.Jul_qty}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Jul_qty", e.target.value)}
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
                defaultValue={cell.row.original.Jul_amount}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Jul_amount", e.target.value)}
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
                defaultValue={cell.row.original.Aug_qty}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Aug_qty", e.target.value)}
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
                defaultValue={cell.row.original.Aug_amount}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Aug_amount", e.target.value)}
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
                defaultValue={cell.row.original.Sep_qty}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Sep_qty", e.target.value)}
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
                defaultValue={cell.row.original.Sep_amount}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Sep_amount", e.target.value)}
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
                defaultValue={cell.row.original.Oct_qty}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Oct_qty", e.target.value)}
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
                defaultValue={cell.row.original.Oct_amount}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Oct_amount", e.target.value)}
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
                defaultValue={cell.row.original.Nov_qty}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Nov_qty", e.target.value)}
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
                defaultValue={cell.row.original.Nov_amount}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Nov_amount", e.target.value)}
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
                defaultValue={cell.row.original.Dec_qty}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Dec_qty", e.target.value)}
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
                defaultValue={cell.row.original.Dec_amount}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "Dec_amount", e.target.value)}
              />
            </div>
          </>
        )
      },
    },
    {
      accessorKey: "Total",
      header: "Total (QTY | Amount)",
      visible: true,
      size: 450,
      Cell: ({ cell }: any) => {
        return (
          <>
            <div className="flex">
              <MUITextField
                defaultValue={cell.row.original.total_qty}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "total_qty", e.target.value)}
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
                defaultValue={cell.row.original.total_amount}
                className="text-xs text-field pr-0"
                onBlur={(e: any) => handlerChangeField(cell.row.index, "total_amount", e.target.value)}
              />
            </div>
          </>
        )
      },
    },
  ]

  return (
    <>
      <FormCard
        title="Content"
        action={
          <div className="flex ">
            {/* <Button size="small">
              <span className="capitalize text-sm" onClick={() => {}}>
                Remove
              </span>
            </Button> */}
            {/* <Button size="small">
              <span className="capitalize text-sm" onClick={handlerAddNewSale}>
                Add New Sale
              </span>
            </Button> */}
            <Button
              variant="outlined"
              size="small"
              onClick={handlerAddNewSale}
              style={{
                width: "100% !important",
                height: "30px",
                marginBottom: "10px",
              }}
            >
              <span className="text-xs  capitalize font-normal">+ Add New Sale</span>
            </Button>
            {/* <IconButton
              onClick={() => {
                // columnRef.current?.onOpen()
              }}
            >
              <TbSettings className="text-2lg" />
            </IconButton> */}
          </div>
        }
      >
        <>
          <div className="col-span-2 data-table">
            <MaterialReactTable
              columns={itemColumns}
              data={data?.Targets ?? []}
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
                columnPinning: { left: ['id', 'saleName', 'lob', 'saleCode', 'itemCode', 'description', 'uom'], right: [] }
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
}

export default ContentForm
