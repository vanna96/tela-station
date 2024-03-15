import { withRouter } from "@/routes/withRouter";
import React, { Component } from "react";
import { useMemo } from "react";
import { dateFormat } from "@/utilies";
import DocumentHeader from "@/components/DocumenHeader";
import MenuButton from "@/components/button/MenuButton";
import LoadingProgress from "@/components/LoadingProgress";
import request from "@/utilies/request";
import MaterialReactTable from "material-react-table";
import WarehouseRepository from "@/services/warehouseRepository";
import { NumericFormat } from "react-number-format";
import MUITextField from "@/components/input/MUITextField";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { TextField } from "@mui/material";
import MUIRightTextField from "@/components/input/MUIRightTextField";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import Formular from "@/utilies/formular";
import { motion } from "framer-motion";
import BankRepository from "@/services/actions/bankRepository";
import CashACAutoComplete from "@/components/input/CashAccountAutoComplete";
import CurrencySelect from "@/components/selectbox/Currency";
import UnitOfMeasurementGroupRepository from "@/services/actions/unitOfMeasurementGroupRepository";
import ItemGroupRepository from "@/services/actions/itemGroupRepository";
import { formatNumberWithoutRounding } from "@/utilies/formatNumber";
import { useDocumentTotalHook } from "@/hook";
class DeliveryDetail extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      isError: false,
      message: "",
      tapIndex: 0,
    };

    this.fetchData = this.fetchData.bind(this);
    this.onTap = this.onTap.bind(this);
  }

  componentDidMount(): void {
    this.fetchData();
  }

  async fetchData() {
    const { id } = this.props.match.params;
    const data = this.props.query.find("pa-id-" + id);
    this.setState({ ...this.state, loading: true });
    await new Promise((resolve) => setTimeout(() => resolve(""), 800));

    if (!data) {
      const { id }: any = this.props?.match?.params || 0;

      let seriesList: any = this.props?.query?.find("retail-sale-series");

      if (!seriesList) {
        seriesList = await DocumentSerieRepository.getDocumentSeries({
          Document: "TL_RETAILSALE_LU",
        });
        this.props?.query?.set("retail-sale-series", seriesList);
      }

      let bin: any;
      if (!bin) {
        try {
          const binData = await request(
            "GET",
            "BinLocations?$select=BinCode,AbsEntry"
          );
          bin = binData.data;
          this.props.query.set("bin", bin);
        } catch (error) {
          this.setState({ isError: true, message: error.message });
          return;
        }
      }

      let pumpAttend: any;
      if (!pumpAttend) {
        try {
          const binData = await request(
            "GET",
            "TL_PUMP_ATTEND?$select=Code,U_tl_fname,U_tl_lname,U_tl_bplid"
          );
          pumpAttend = binData.data.value;
        } catch (error) {
          this.setState({ isError: true, message: error.message });
          return;
        }
      }

      await request("GET", `TL_RETAILSALE_LU(${id})`)
        .then(async (res: any) => {
          const data: any = res?.data;
          this.setState({
            seriesList,
            bin,
            pumpAttend,
            ...data,
            loading: false,
          });
        })
        .catch((err: any) =>
          this.setState({ isError: true, message: err.message })
        );
    } else {
      this.setState({ ...data, loading: false });
    }
  }

  onTap(index: number) {
    this.setState({ ...this.state, tapIndex: index });
  }
  async handlerChangeMenu(index: number) {
    this.setState({ ...this.state, tapIndex: index });
  }
  HeaderTabs = () => {
    const menuItems = [
      { label: "Basic Information" },
      { label: "Content" },
      { label: "Incoming Payment" },
    ];

    return (
      <div className="w-full flex justify-between">
        <div className="">
          {menuItems.map((menuItem, index) => (
            <MenuButton
              key={index}
              active={this.state.tapIndex === index}
              onClick={() => this.handlerChangeMenu(index)}
            >
              <span>{menuItem.label}</span>
            </MenuButton>
          ))}
        </div>
      </div>
    );
  };

  render() {
    return (
      <>
        <DocumentHeader
          data={this.state}
          menuTabs={this.HeaderTabs}
          handlerChangeMenu={this.handlerChangeMenu}
        />

        <form
          id="formData"
          className="h-full w-full flex flex-col gap-4 relative"
        >
          {this.state.loading ? (
            <div className="w-full h-full flex item-center justify-center">
              <LoadingProgress />
            </div>
          ) : (
            <>
              <div className="relative">
                <motion.div
                  className="grow px-16 py-4"
                  key={this.state.tapIndex}
                  transition={{ duration: 0.2 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {this.state.tapIndex === 0 && <General data={this.state} />}
                  {this.state.tapIndex === 1 && <Content data={this.state} />}
                  {this.state.tapIndex === 2 && (
                    <IncomingPayment data={this.state} />
                  )}
                </motion.div>
              </div>
            </>
          )}
        </form>
      </>
    );
  }
}

export default withRouter(DeliveryDetail);

const renderCell =
  (key: string) =>
  ({ cell }: any) => {
    return (
      <NumericFormat
        key={key + cell.getValue()}
        thousandSeparator
        disabled
        decimalScale={2}
        customInput={MUIRightTextField}
        placeholder="0.000"
        defaultValue={cell.getValue()}
      />
    );
  };

function renderKeyValue(label: string, value: any) {
  return (
    <div className="grid grid-cols-2 py-2">
      <div className="col-span-1 text-gray-700">{label}</div>
      <div className="col-span-1 text-gray-900">
        <MUITextField disabled className="" value={value ?? "N/A"} />
      </div>
    </div>
  );
}

function CustomMaterialReactTable({
  columns,
  data,
}: {
  columns: any[];
  data: any[];
}) {
  return (
    <MaterialReactTable
      muiTableProps={() => ({
        sx: {
          "& .MuiTableHead-root .MuiTableCell-root": {
            backgroundColor: "#e4e4e7",
            fontWeight: "500",
            paddingTop: "8px",
            paddingBottom: "8px",
          },
          border: "1px solid #d1d5db",
        },
      })}
      enableColumnActions={false}
      enableColumnFilters={false}
      enablePagination={false}
      enableSorting={false}
      enableBottomToolbar={false}
      enableTopToolbar={false}
      muiTableBodyRowProps={{ hover: false }}
      columns={columns}
      data={data}
    />
  );
}
function General({ data }: any) {
  const filteredSeries = data?.seriesList?.filter(
    (e: any) => e.Series === data?.Series
  );

  const seriesNames = filteredSeries?.map((series: any) => series.Name);

  const seriesName = seriesNames?.join(", ");
  return (
    <div className="rounded-lg shadow-sm  border p-8 px-14 h-full">
      <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
        <h2>Basic Information</h2>
      </div>
      <div className="py-4 px-8">
        <div className="grid grid-cols-12 ">
          <div className="col-span-5">
            {renderKeyValue(
              "Branch",
              new BranchBPLRepository().find(data?.U_tl_bplid)?.BPLName
            )}
            {renderKeyValue("Warehouse", data?.U_tl_whs)}
            {renderKeyValue(
              "Bin Location",
              data.bin.value?.find(
                (e: any) => e?.AbsEntry === parseInt(data?.U_tl_bincode)
              )?.BinCode
            )}
            {renderKeyValue("Customer", data.U_tl_cardcode)}
            {renderKeyValue("Name", data.U_tl_cardname)}

            {renderKeyValue("Currency", data?.U_tl_doccur)}
          </div>
          <div className="col-span-2"></div>
          <div className="col-span-5">
            {renderKeyValue("Series", seriesName)}
            {renderKeyValue("DocNum", data.DocNum)}
            {renderKeyValue("Posting Date", dateFormat(data.U_tl_taxdate))}
            {renderKeyValue("Delivery Date", dateFormat(data.U_tl_devdate))}
            {renderKeyValue("Document Date", dateFormat(data.U_tl_docdate))}

            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700"> Remark </div>
              <div className="col-span-1 text-gray-900">
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  disabled
                  className="bg-gray-100"
                  value={data?.Remark || "N/A"}
                  InputProps={{ readOnly: true }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IncomingPayment({ data }: any) {
  const totalCashSale: number = React.useMemo(() => {
    const total = data?.TL_RETAILSALE_LU_INCollection?.reduce(
      (prevTotal: any, item: any) => {
        const lineTotal = Formular.findLineTotal(
          (item.U_tl_cashallow || 0)?.toString(),
          // item.ItemPrice || 0,
          "1",
          "0"
        );
        return prevTotal + lineTotal;
      },
      0
    );
    return total;
  }, []);

  const parseAmount = (amount: any) => {
    return (
      Number(typeof amount === "string" ? amount.replace(/,/g, "") : amount) ||
      0
    );
  };
  const calculateTotalByCurrency = (data: any, currency: any) => {
    let total = 0;

    // Aggregate CashBankData
    total += data.TL_RETAILSALE_LU_INCollection?.reduce(
      (acc: any, item: any) => {
        if (item.U_tl_paycur === currency) {
          const cashAmount = parseAmount(item.U_tl_amtcash) || 0;
          const bankAmount = parseAmount(item.U_tl_amtbank) || 0;
          return acc + cashAmount + bankAmount;
        }
        return acc;
      },
      0
    );

    // Aggregate CheckNumberData
    total += data.TL_RETAILSALE_LU_INCollection?.reduce(
      (acc: any, item: any) => {
        if (item.U_tl_paycur === currency) {
          const checkAmount = parseAmount(item.U_tl_amtcheck) || 0;
          return acc + checkAmount;
        }
        return acc;
      },
      0
    );

    // Aggregate CouponData
    total += data.TL_RETAILSALE_LU_INCollection?.reduce(
      (acc: any, item: any) => {
        if (item.U_tl_paycur === currency) {
          const couponAmount = parseAmount(item.U_tl_amtcoupon) || 0;
          return acc + couponAmount;
        }
        return acc;
      },
      0
    );

    return total;
  };
  let exchangeRate = data?.ExchangeRate || 4100;
  console.log(exchangeRate);
  const totalKHR = React.useMemo(
    () => calculateTotalByCurrency(data, "KHR"),
    [data]
  );
  const TotalKHRtoUSD: number = React.useMemo(() => {
    const convertedKHRToUSD =
      exchangeRate > 0 ? parseAmount(totalKHR) / exchangeRate : 0;
    return convertedKHRToUSD;
  }, [totalKHR, exchangeRate]);

  const totalUSD = React.useMemo(
    () => calculateTotalByCurrency(data, "USD"),
    [data]
  );
  const cashBankColumn: any = useMemo(
    () => [
      {
        accessorKey: "U_tl_paytype",
        header: "Type",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              key={"U_tl_paytype" + cell.getValue() + cell?.row?.id}
              value={cell.row.original?.U_tl_paytype || ""}
              disabled
            />
          );
        },
      },
      {
        accessorKey: "U_tl_paycur",
        header: "Currency",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              disabled
              key={"U_tl_paycur" + cell.getValue() + cell?.row?.id}
              value={cell.row.original?.U_tl_paycur || 0}
            />
          );
        },
      },
      data?.TL_RETAILSALE_LU_INCollection?.some(
        (item: any) => item?.U_tl_paytype === "Cash"
      )
        ? {
            accessorKey: "U_tl_amtcash",
            header: "Amount",
            Cell: ({ cell }: any) => {
              return (
                <NumericFormat
                  placeholder="0.000"
                  key={"U_tl_amtcash" + cell.getValue() + cell?.row?.id}
                  disabled
                  name={"U_tl_amtcash"}
                  customInput={MUIRightTextField}
                  value={cell.row.original?.U_tl_amtcash || ""}
                  startAdornment={cell.row.original?.U_tl_paycur}
                />
              );
            },
          }
        : {
            accessorKey: "U_tl_amtbank",
            header: "Amount",
            Cell: ({ cell }: any) => {
              return (
                <NumericFormat
                  placeholder="0.000"
                  key={"U_tl_amtbank" + cell.getValue() + cell?.row?.id}
                  customInput={MUIRightTextField}
                  disabled
                  name={"U_tl_amtbank"}
                  value={cell.row.original?.U_tl_amtbank || ""}
                  startAdornment={cell.row.original?.U_tl_paycur}
                />
              );
            },
          },
    ],
    []
  );
  const checkNumberColumn: any = useMemo(
    () => [
      {
        accessorKey: "U_tl_acccheck",
        header: "Check Number",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              key={"U_tl_acccheck" + cell.getValue() + cell?.row?.id}
              value={cell.row.original?.U_tl_acccheck || ""}
              disabled
            />
          );
        },
      },
      {
        accessorKey: "U_tl_checkdate",
        header: "Check Date",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              key={"U_tl_checkdate" + cell.getValue() + cell?.row?.id}
              value={dateFormat(cell.row.original?.U_tl_checkdate || "")}
              disabled
            />
          );
        },
      },
      {
        accessorKey: "U_tl_paycur",
        header: "Currency",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              disabled
              key={"U_tl_paycur" + cell.getValue() + cell?.row?.id}
              value={cell.row.original?.U_tl_paycur || 0}
            />
          );
        },
      },
      {
        accessorKey: "U_tl_amtcheck",
        header: "Check Amount",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              key={"U_tl_amtcheck" + cell.getValue() + cell?.row?.id}
              value={cell.row.original?.U_tl_amtcheck || ""}
              disabled
            />
          );
        },
      },
      {
        accessorKey: "U_tl_checkbank",
        header: "Bank",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              key={"U_tl_checkbank" + cell.getValue() + cell?.row?.id}
              value={
                new BankRepository().find(cell.row.original?.U_tl_checkbank)
                  ?.BankName
              }
              disabled
            />
          );
        },
      },
    ],
    []
  );

  console.log(
    data?.TL_RETAILSALE_LU_INCollection?.filter(
      (e: any) => e.U_tl_paytype === "Coupon"
    )
  );

  return (
    <div className="rounded-lg shadow-sm  border p-8 px-14 h-screen">
      <div className="font-medium text-xl flex justify-start items-center border-b mb-6">
        <h2>Cash Sale - </h2>
        <div className="ml-2">
          <NumericFormat
            thousandSeparator
            placeholder="0.000"
            disabled
            className=""
            decimalScale={2}
            value={totalCashSale}
          />
        </div>
      </div>
      <div className="col-span-2 data-table">
        <CustomMaterialReactTable
          columns={cashBankColumn}
          data={
            data?.TL_RETAILSALE_LU_INCollection?.filter(
              (e: any) => e.U_tl_paytype === "Cash" || e.U_tl_paytype === "Bank"
            ) || []
          }
        />
      </div>
      <div className="mt-4" />
      <div className="col-span-2 data-table">
        <CustomMaterialReactTable
          columns={checkNumberColumn}
          data={
            data?.TL_RETAILSALE_LU_INCollection?.filter(
              (e: any) => e.U_tl_paytype === "Check"
            ) || []
          }
        />
      </div>

      <div className="mt-4">
        {data?.TL_RETAILSALE_LU_INCollection?.filter(
          (e: any) => e.U_tl_paytype === "Coupon"
        ).map((item: any, index: number) => (
          <div key={index}>
            <div className="col-span-5 mb-4">
              <div className="grid grid-cols-2 gap-4 ">
                <div className="grid grid-cols-12">
                  <div className="col-span-4 mt-1 text-gray-700   ">
                    Coupon Account{" "}
                  </div>
                  <div className="col-span-4 ">
                    <CashACAutoComplete value={item.U_tl_acccoupon} disabled />
                  </div>
                  <div className="col-span-4 ml-2">
                    <CurrencySelect
                      value={item.U_tl_paycur}
                      name="U_tl_paycur"
                      disabled
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 ">
                  <div className="col-span-4  col-start-5 text-gray-700 ">
                    Coupon Amount
                  </div>
                  {/* <div className=" col-span-4  col-start-9"> */}
                  <div className=" col-span-4 ">
                    <NumericFormat
                      placeholder="0.000"
                      disabled
                      customInput={MUIRightTextField}
                      defaultValue={item.U_tl_amtcoupon}
                      name="U_tl_amtcoupon"
                      value={item.U_tl_amtcoupon}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 ">
        <div className="grid grid-cols-12">
          <div className="col-span-4 mt-1 text-gray-700 ">Over / Shortage</div>
          <div className="col-span-4 ">
            <NumericFormat
              key={"OverShortage"}
              thousandSeparator
              disabled
              placeholder="0.000"
              decimalScale={3}
              customInput={MUIRightTextField}
              value={totalCashSale - totalUSD - TotalKHRtoUSD}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 ">
          <div className="col-span-4  col-start-5 text-gray-700 ">
            Total /KHR
          </div>
          <div className=" col-span-4  ">
            <NumericFormat
              key={"total"}
              thousandSeparator
              placeholder="0.000"
              decimalScale={3}
              disabled
              customInput={MUIRightTextField}
              value={totalKHR}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="grid grid-cols-12"></div>
        <div className="grid grid-cols-12">
          <div className="col-span-4  col-start-5 text-gray-700 ">
            Total /USD
          </div>
          <div className=" col-span-4 ">
            <NumericFormat
              key={"totalUSD"}
              thousandSeparator
              disabled
              placeholder="0.000"
              decimalScale={3}
              customInput={MUIRightTextField}
              value={totalUSD}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Content(props: any) {
  const { data } = props;
  const [docTotal, docTaxTotal, totalBefore] = useDocumentTotalHook(
    props.data.Items ?? [],
    props?.data?.DiscountPercent === "" ? 0 : props.data?.DiscountPercent,
    props.data.ExchangeRate === 0 ? 1 : props.data.ExchangeRate
  );
  console.log(props.data.Items);
  const discountAmount = useMemo(() => {
    if (totalBefore == null) {
      return 0;
    }
    // Calculate discountAmount
    const dataDiscount: number = props?.data?.DiscountPercent || 0;
    if (dataDiscount <= 0) return 0;
    if (dataDiscount > 100) return 100;
    const discountedAmount = totalBefore * (dataDiscount / 100);

    return formatNumberWithoutRounding(discountedAmount, 3);
  }, [props?.data?.DiscountPercent, props.data.Items, totalBefore]);
  const discountedDocTaxTotal: number = React.useMemo(() => {
    if (discountAmount === 0) {
      return docTaxTotal;
    } else {
      return (totalBefore - discountAmount) / 10;
    }
  }, [
    props.data.Items,
    props.data.DiscountPercent,
    props.data.ExchangeRate,
    discountAmount,
  ]);

  const discountedDocTotal: number = React.useMemo(() => {
    if (discountAmount === 0) {
      return docTotal;
    } else {
      return (
        formatNumberWithoutRounding(totalBefore, 3) -
        formatNumberWithoutRounding(discountAmount, 3) +
        formatNumberWithoutRounding(discountedDocTaxTotal, 3)
      );
    }
  }, [props.data.Items, props.data.DiscountPercent]);
  const itemColumn: any = useMemo(
    () => [
      {
        accessorKey: "U_tl_itemCode",
        header: "Item Code",
        size: 220,
        Cell: ({ cell }: any) => {
          return <MUITextField disabled value={cell.getValue()} />;
        },
      },
      {
        accessorKey: "U_tl_itemname",
        header: "Item Name",
        size: 240,
        Cell: ({ cell }: any) => {
          return <MUITextField disabled value={cell.getValue()} />;
        },
      },
      {
        accessorKey: "U_tl_qty",
        header: "Qty",
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              disabled
              value={cell.getValue()}
              thousandSeparator
              customInput={MUIRightTextField}
              decimalScale={data.Currency === "USD" ? 3 : 0}
              // fixedDecimalScale
            />
          );
        },
      },

      {
        accessorKey: "U_tl_uom",
        header: "UoM ",

        Cell: ({ cell }: any) => {
          return <MUITextField disabled value={cell.getValue()} />;
        },
      },
      {
        accessorKey: "GrossPrice",
        header: "Unit Price",

        Cell: ({ cell }: any) => (
          <NumericFormat
            disabled
            key={"GrossPrice" + cell.getValue()}
            thousandSeparator
            decimalScale={data.Currency === "USD" ? 4 : 0}
            // fixedDecimalScale
            customInput={MUIRightTextField}
            value={cell.getValue() || 0}
          />
        ),
      },

      {
        accessorKey: "U_tl_dispercent",
        header: "Discount %",

        Cell: ({ cell }: any) => {
          return (
            <MUIRightTextField
              placeholder="0.000"
              type="number"
              startAdornment={"%"}
              // value={props?.data?.DiscountPercent ?? 0}
              value={cell.getValue() || 0}
              disabled
            />
          );
        },
      },

      {
        accessorKey: "U_tl_amount",
        header: "Amount",

        Cell: ({ cell }: any) => (
          <NumericFormat
            value={cell.getValue() ?? 0}
            thousandSeparator
            disabled
            customInput={MUIRightTextField}
            decimalScale={props.data.Currency === "USD" ? 3 : 0}
            // fixedDecimalScale
          />
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-full">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
          <h2>Content Information</h2>
        </div>
        <div className="col-span-2 data-table">
          <MaterialReactTable
            columns={itemColumn}
            data={data.TL_RETAILSALE_LU_COCollection}
            enableRowNumbers={false}
            enableColumnActions={false}
            enableColumnFilters={false}
            enablePagination={false}
            enableSorting={false}
            enableTopToolbar={false}
            enableColumnResizing={false}
            enableColumnFilterModes={false}
            enableDensityToggle={false}
            enableFilters={false}
            enableFullScreenToggle={false}
            enableGlobalFilter={false}
            enableStickyFooter={false}
            initialState={{
              density: "compact",
            }}
            state={{
              isLoading: props.loading,
              showProgressBars: props.loading,
              showSkeletons: props.loading,
            }}
            muiTableBodyRowProps={() => ({
              sx: { cursor: "pointer" },
            })}
            muiTableProps={() => ({
              sx: {
                "& .MuiTableHead-root .MuiTableCell-root": {
                  backgroundColor: "#e4e4e7",
                  fontWeight: "500",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                },
                border: "1px solid #d1d5db",
              },
            })}
            enableTableFooter={false}
          />
          <div className="grid grid-cols-12 mt-2">
            <div className="col-span-5"></div>

            <div className="col-span-2"></div>
            <div className="col-span-5 ">
              <div className="grid grid-cols-12 py-1">
                <div className="col-span-6 text-gray-700">
                  Total Before Discount
                </div>
                <div className="col-span-6 text-gray-900">
                  <NumericFormat
                    value={
                      props?.data?.DocTotal +
                      props.data?.TotalDiscount -
                      props.data.VatSum
                    }
                    thousandSeparator
                    startAdornment={props?.data?.Currency}
                    decimalScale={props.data.Currency === "USD" ? 3 : 0}
                    // fixedDecimalScale
                    placeholder="0.000"
                    readonly
                    customInput={MUIRightTextField}
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 py-1">
                <div className="col-span-6 text-gray-700">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-7 text-gray-700">Discount</div>
                    <div className="col-span-5 text-gray-900 mr-2">
                      <MUIRightTextField
                        placeholder="0.000"
                        type="number"
                        startAdornment={"%"}
                        value={props?.data?.DiscountPercent ?? 0}
                        onChange={(event: any) => {
                          if (
                            !(
                              event.target.value <= 100 &&
                              event.target.value >= 0
                            )
                          ) {
                            event.target.value = 0;
                          }
                        }}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-6 text-gray-900 ">
                  <div className="grid grid-cols-4">
                    <div className="col-span-4">
                      <NumericFormat
                        thousandSeparator
                        // value={
                        //   discountAmount === 0 || "" ? "0.000" : discountAmount
                        // }
                        value={props.data?.TotalDiscount}
                        startAdornment={props?.data?.Currency}
                        decimalScale={props.data.Currency === "USD" ? 3 : 0}
                        // fixedDecimalScale
                        placeholder="0.000"
                        readonly
                        customInput={MUIRightTextField}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 py-1">
                <div className="col-span-6 text-gray-700">Tax</div>
                <div className="col-span-6 text-gray-900">
                  <NumericFormat
                    // value={
                    //   discountedDocTaxTotal === 0 ? "" : discountedDocTaxTotal
                    // }
                    value={props.data.VatSum}
                    thousandSeparator
                    startAdornment={props?.data?.Currency}
                    decimalScale={props.data.Currency === "USD" ? 3 : 0}
                    // fixedDecimalScale
                    placeholder="0.000"
                    readonly
                    customInput={MUIRightTextField}
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 py-1">
                <div className="col-span-6 text-gray-700">Total</div>
                <div className="col-span-6 text-gray-900">
                  <NumericFormat
                    readOnly
                    // value={discountedDocTotal === 0 ? "" : discountedDocTotal}
                    value={props.data?.DocTotal}
                    thousandSeparator
                    startAdornment={props?.data?.Currency}
                    decimalScale={props.data.Currency === "USD" ? 3 : 0}
                    // fixedDecimalScale
                    placeholder="0.000"
                    readonly
                    customInput={MUIRightTextField}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
