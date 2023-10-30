import React, { useEffect, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  darken,
} from "@mui/material";
import { AiOutlineSetting } from "react-icons/ai";
import { currencyFormat } from "@/utilies";
import FormCard from "@/components/card/FormCard";
import { TbSettings } from "react-icons/tb";
import { ThemeContext } from "@/contexts";
import Modal from "@/components/modal/Modal";
import MUISelect from "@/components/selectbox/MUISelect";
import { useDocumentTotalHook } from "../hook/useDocumentTotalHook";
import { BiSearch } from "react-icons/bi";
import MUITextField from "@/components/input/MUITextField";
import shortid from "shortid";
import { useExchangeRate } from "../hook/useExchangeRate";
import { useParams } from "react-router-dom";
import { bgColor } from "../../../../assets/index";
import { NumericFormat } from "react-number-format";
import { sysInfo } from "@/helper/helper";
import CurrencyRepository from "@/services/actions/currencyRepository";
import { useQuery } from "react-query";
import request from "@/utilies/request";

interface ContentComponentProps {
  items: any[];
  onChange?: (key: any, value: any) => void;
  columns: any[];
  type?: String;
  labelType?: String;
  typeLists?: any[];
  onRemoveChange?: (record: any[]) => void;
  readOnly?: boolean;
  viewOnly?: boolean;
  data: any;
  LineOfBusiness?: string;
}

export default function ContentComponent(props: ContentComponentProps) {
  const { id }: any = useParams();

  const { data: CurrencyAPI }: any = useQuery({
    queryKey: ["Currency"],
    queryFn: () => new CurrencyRepository().get(),
    staleTime: Infinity,
  });

  const a = CurrencyAPI?.map((c: any) => {
    return {
      value: c.Code,
      name: c.Name,
    };
  });
  //test

  const { data: sysInfo }: any = useQuery({
    queryKey: ["sysInfo"],
    queryFn: () =>
      request("POST", "CompanyService_GetAdminInfo")
        .then((res: any) => res?.data)
        .catch((err: any) => console.log(err)),
    staleTime: Infinity,
  });

  if (!(id > 0)) useExchangeRate(props?.data?.Currency, props.onChange);

  const columnRef = React.createRef<ContentTableSelectColumn>();
  const [discount, setDiscount] = React.useState(props?.data?.DocDiscount || 0);
  const [colVisibility, setColVisibility] = React.useState<
    Record<string, boolean>
  >({});
  const blankItem = { ItemCode: "" };
  const [rowSelection, setRowSelection] = React.useState<any>({});

  const dataCurrency = props.data?.vendor?.currenciesCollection
    ?.filter(({ Include }: any) => Include === "tYES")
    ?.map(({ CurrencyCode }: any) => {
      return { value: CurrencyCode, name: CurrencyCode };
    });

  useExchangeRate(props.data?.Currency, props.onChange);

  const handlerRemove = () => {
    if (props.onRemoveChange === undefined) return;

    let temps: any[] = [...props.items];
    Object.keys(rowSelection).forEach((index: any) => {
      const item = props.items[index];
      const indexWhere = temps.findIndex((e) => e?.ItemCode === item?.ItemCode);

      if (indexWhere >= 0) temps.splice(indexWhere, 1);
    });
    setRowSelection({});
    props.onRemoveChange(temps);
  };

  const [docTotal, docTaxTotal] = useDocumentTotalHook(
    props.items ?? [],
    discount,
    // props?.data?.ExchangeRate
    1
  );

  React.useEffect(() => {
    const cols: any = {};
    props.columns.forEach((e: any) => {
      cols[e?.accessorKey] = e?.visible;
    });
    setColVisibility({ ...cols, ...colVisibility });
  }, [props.columns]);

  const columns = useMemo(() => props.columns, [colVisibility]);

  const onChange = (key: string, value: any) => {
    if (key === "DocDiscount") {
      setDiscount(value.target.value);
    }

    if (props.onChange) props.onChange(key, value?.target?.value);
  };

  const onCheckRow = (event: any, index: number) => {
    const rowSelects: any = { ...rowSelection };
    rowSelects[index] = true;

    if (!event.target.checked) {
      delete rowSelects[index];
    }

    setRowSelection(rowSelects);
  };

  const discountAmount = useMemo(() => {
    const dataDiscount: number = props?.data?.DocDiscount || discount;
    if (dataDiscount <= 0) return 0;
    if (dataDiscount > 100) return 100;
    return docTotal * (dataDiscount / 100);
  }, [discount, props.items]);

  let TotalPaymentDue =
    docTotal - (docTotal * discount) / 100 + docTaxTotal || 0;

  return (
    <div className="h-screen">
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
              !props.viewOnly && ""
            }`}
          >
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-1">
                <label htmlFor="Code" className="text-gray-500 text-[14px]">
                  Currency
                </label>
              </div>
              <div className="col-span-3  ">
                <div className="grid grid-cols-12">
                  <div className="col-span-6">
                    <div className="flex gap-4 items-start">
                      {
                        <MUISelect
                          value={
                            props.data?.Currency || sysInfo?.SystemCurrency
                          }
                          disabled={props.data?.edit}
                          items={
                            dataCurrency?.length > 0
                              ? CurrencyAPI?.map((c: any) => {
                                  // console.log(c.Name);
                                  return {
                                    value: c.Code,
                                    name: c.Name,
                                  };
                                })
                              : dataCurrency
                          }
                          aliaslabel="name"
                          aliasvalue="value"
                          onChange={(e: any) => onChange("Currency", e)}
                        />
                      }
                    </div>
                  </div>
                  <div className="col-span-6 pl-5">
                    {(props.data?.Currency || sysInfo?.SystemCurrency) !==
                      sysInfo?.SystemCurrency && (
                      <MUITextField
                        value={props.data?.ExchangeRate || 0}
                        name=""
                        disabled={true}
                        className="-mt-1"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/*  */}
          </div>
          <div className="col-span-2 ">
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
                            onChange={(event) =>
                              onCheckRow(event, cell.row.index)
                            }
                          />
                        ),
                      },
                      ...columns,
                    ]
              }
              data={[...props?.items, blankItem] ?? []}
              // enableStickyHeader={true}
              // enableColumnActions={false}
              // enableColumnFilters={false}
              // enablePagination={false}
              // enableSorting={false}
              // enableTopToolbar={false}
              // enableColumnResizing={false}
              // enableColumnFilterModes={false}
              // enableDensityToggle={false}
              // enableFilters={false}
              // enableFullScreenToggle={false}
              // enableGlobalFilter={false}
              // enableHiding={true}
              // enablePinning={true}
              // onColumnVisibilityChange={setColVisibility}
              // enableStickyFooter={false}
              // enableMultiRowSelection={true}
              // initialState={{
              //   density: "compact",
              //   columnVisibility: colVisibility,
              //   rowSelection,
              // }}
              // state={{
              //   columnVisibility: colVisibility,
              //   rowSelection,
              // }}
              // muiTableBodyRowProps={({ row }) => ({
              //   sx: { cursor: "pointer" },
              // })}
              // icons={{
              //   ViewColumnIcon: (props: any) => <AiOutlineSetting {...props} />,
              // }}
              // muiTablePaginationProps={{
              //   rowsPerPageOptions: [5, 10],
              //   showFirstButton: false,
              //   showLastButton: false,
              // }}
              // enableTableFooter={false}

              enablePinning={true}
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
              enableColumnActions={false}
              enableHiding={true}
              enableStickyHeader={true}
              enableColumnFilters={false}
              enablePagination={false}
              enableSorting={false}
              enableBottomToolbar={false}
              enableTopToolbar={false}
              muiTableBodyRowProps={{ hover: false }}
              muiTableProps={{
                sx: {
                  boxShadow: 1,
                  bgcolor: "background.paper",
                  borderRadius: "2",
                  border: "1px solid rgb(209 213 219)",
                },
              }}
              muiTableHeadCellProps={{
                sx: {
                  // border: "1px solid rgba(81, 81, 81, 1)",
                },
              }}
              muiTableBodyCellProps={{
                sx: {
                  // border: "1px solid rgba(81, 81, 81, 1)",
                },
              }}
            />

            <div className="grid grid-cols-12 mt-2">
              <div className="col-span-5"></div>

              <div className="col-span-2"></div>
              <div className="col-span-5 ">
                <div className="grid grid-cols-2 py-2">
                  <div className="col-span-1 text-lg font-medium">
                    Total Summary
                  </div>
                </div>
                <div className="grid grid-cols-12 py-1">
                  <div className="col-span-6 text-gray-700">
                    Total Before Discount
                  </div>
                  <div className="col-span-6 text-gray-900">
                    <NumericFormat
                      className="bg-white w-full"
                      value={docTotal}
                      thousandSeparator
                      fixedDecimalScale
                      startAdornment={props?.data?.Currency}
                      decimalScale={2}
                      placeholder="0.00"
                      readonly
                      customInput={MUITextField}
                      disabled={props?.data?.isStatusClose || false}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 py-1">
                  <div className="col-span-6 text-gray-700">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-7 text-gray-700">Discount</div>
                      <div className="col-span-5 text-gray-900 mr-2">
                        <MUITextField
                          disabled={props?.data?.isStatusClose || false}
                          placeholder="0.00"
                          type="number"
                          startAdornment={"%"}
                          value={discount}
                          onChange={(event: any) => {
                            if (
                              !(
                                event.target.value <= 100 &&
                                event.target.value >= 0
                              )
                            ) {
                              event.target.value = 0;
                            }
                            onChange("DocDiscount", event);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-6 text-gray-900 ">
                    <div className="grid grid-cols-4">
                      <div className="col-span-4">
                        <NumericFormat
                          className="bg-white w-full"
                          value={discountAmount}
                          thousandSeparator
                          fixedDecimalScale
                          startAdornment={props?.data?.Currency}
                          decimalScale={2}
                          placeholder="0.00"
                          readonly
                          customInput={MUITextField}
                          disabled={props?.data?.isStatusClose || false}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12 py-1">
                  <div className="col-span-6 text-gray-700">Tax</div>
                  <div className="col-span-6 text-gray-900">
                    <NumericFormat
                      className="bg-white w-full"
                      value={docTaxTotal}
                      thousandSeparator
                      fixedDecimalScale
                      startAdornment={props?.data?.Currency}
                      decimalScale={2}
                      placeholder="0.00"
                      readonly
                      customInput={MUITextField}
                      disabled={props?.data?.isStatusClose || false}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 py-1">
                  <div className="col-span-6 text-gray-700">Total</div>
                  <div className="col-span-6 text-gray-900">
                    <NumericFormat
                      className="bg-white w-full"
                      value={TotalPaymentDue}
                      thousandSeparator
                      fixedDecimalScale
                      startAdornment={props?.data?.Currency}
                      decimalScale={2}
                      placeholder="0.00"
                      readonly
                      customInput={MUITextField}
                      disabled={props?.data?.isStatusClose || false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ContentTableSelectColumn
            ref={columnRef}
            columns={props.columns}
            visibles={colVisibility}
            onSave={(value) => {
              setColVisibility(value);
            }}
          />
        </>
      </FormCard>
    </div>
  );
}

interface ContentTableSelectColumnProps {
  ref?: React.RefObject<ContentTableSelectColumn | undefined>;
  onSave?: (value: any) => void;
  columns: any[];
  visibles: any;
}

class ContentTableSelectColumn extends React.Component<
  ContentTableSelectColumnProps,
  any
> {
  constructor(props: any) {
    super(props);

    this.state = {
      open: false,
      searchColumn: "",
      showChecks: false,
      visibles: {},
    } as any;

    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSave = this.onSave.bind(this);
    this.handChange = this.handChange.bind(this);
    this.handlerChangeColVisibility =
      this.handlerChangeColVisibility.bind(this);
  }

  componentDidMount(): void {}

  onOpen(data?: any) {
    this.setState({ open: true, visibles: { ...this.props.visibles } });
  }

  onClose() {
    this.setState({ open: false });
  }

  onSave() {
    if (this.props.onSave) {
      this.props.onSave(this.state.visibles);
    }

    this.setState({ open: false });
  }

  handChange(event: any) {
    this.setState({ ...this.state, searchColumn: event.target.value });
  }

  handlerChangeColVisibility(event: any, field: string) {
    const visibles = { ...this.state.visibles };
    visibles[field] = event.target.checked;
    this.setState({
      ...this.state,
      visibles: { ...this.props.visibles, ...visibles },
    });
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
    );
  }
}
