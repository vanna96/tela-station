import { withRouter } from "@/routes/withRouter";
import { Component } from "react";
import { useMemo } from "react";
import { dateFormat } from "@/utilies";
import DocumentHeader from "@/components/DocumenHeader";
import MenuButton from "@/components/button/MenuButton";
import LoadingProgress from "@/components/LoadingProgress";
import request from "@/utilies/request";
import BusinessPartner from "@/models/BusinessParter";
import MaterialReactTable from "material-react-table";
import WarehouseRepository from "@/services/warehouseRepository";
import { NumericFormat } from "react-number-format";
import MUITextField from "@/components/input/MUITextField";
import PriceListRepository from "@/services/actions/pricelistRepository";
import SalePersonRepository from "@/services/actions/salePersonRepository";
import WareBinLocationRepository from "@/services/whBinLocationRepository";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import { useDocumentTotalHook } from "@/hook";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { TextField } from "@mui/material";
import DistributionRuleRepository from "@/services/actions/distributionRulesRepository";
import MUIRightTextField from "@/components/input/MUIRightTextField";
import { motion } from "framer-motion";
import { formatNumberWithoutRounding } from "@/utilies/formatNumber";
import React from "react";

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

      let seriesList: any = this.props?.query?.find("orders-series");

      if (!seriesList) {
        seriesList = await DocumentSerieRepository.getDocumentSeries({
          Document: "17",
        });
        this.props?.query?.set("orders-series", seriesList);
      }
      await request("GET", `Orders(${id})`)
        .then(async (res: any) => {
          const data: any = res?.data;
          // vendor
          const vendor: any = await request(
            "GET",
            `/BusinessPartners('${data?.CardCode}')`
          )
            .then((res: any) => new BusinessPartner(res?.data, 0))
            .catch((err: any) => console.log(err));

          // attachment
          let disabledFields: any = {
            CurrencyType: true,
          };

          this.setState({
            seriesList,
            ...data,
            Description: data?.Comments,
            Owner: data?.DocumentsOwner,
            Currency: data?.DocCurrency,
            Items: data?.DocumentLines?.map((item: any) => {
              return {
                ItemCode: item.ItemCode || null,
                ItemName: item.ItemDescription || item.Name || null,
                Quantity: item.Quantity || null,
                UnitPrice:
                  item.GrossPrice / (1 + item.TaxPercentagePerRow / 100),
                GrossPrice: item.GrossPrice || item.total,
                Discount: item.DiscountPercent || 0,
                VatGroup: item.VatGroup || "",
                UomGroupCode: item.UoMCode || null,
                UomEntry: item.UoMEntry || null,
                Currency: item.Currency,
                LineTotal: item.GrossTotal,
                VatRate: item.TaxPercentagePerRow,
                WarehouseCode: item.WarehouseCode,
                DiscountPercent: item.DiscountPercent,
                MeasureUnit: item.MeasureUnit,
                ItemsGroupCode: item.CostingCode,
              };
            }),
            ExchangeRate: data?.DocRate || 1,
            CurrencyType: "B",
            vendor,
            DocDiscount: data?.DiscountPercent,
            BPAddresses: vendor?.bpAddress?.map(
              ({ addressName, addressType }: any) => {
                return { addressName: addressName, addressType: addressType };
              }
            ),
            disabledFields,

            Edit: true,
            PostingDate: data?.DocDate,
            DueDate: data?.DocDueDate,
            DocumentDate: data?.TaxDate,
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

  navigateToSalesOrder = () => {
    const { history } = this.props;
    history.push("/sale/sales-order");
  };

  onTap(index: number) {
    this.setState({ ...this.state, tapIndex: index });
  }
  async handlerChangeMenu(index: number) {
    this.setState({ ...this.state, tapIndex: index });
  }
  HeaderTabs = () => {
    return (
      <>
        <div className="w-full flex justify-between">
          <div className="">
            <MenuButton
              active={this.state.tapIndex === 0}
              onClick={() => this.handlerChangeMenu(0)}
            >
              General
            </MenuButton>
            <MenuButton
              active={this.state.tapIndex === 1}
              onClick={() => this.handlerChangeMenu(1)}
            >
              <span>Content</span>
            </MenuButton>
            <MenuButton
              active={this.state.tapIndex === 2}
              onClick={() => this.handlerChangeMenu(2)}
            >
              Logistics
            </MenuButton>
          </div>
        </div>
      </>
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
                  {this.state.tapIndex === 2 && <Logistic data={this.state} />}
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

function renderKeyValue(label: string, value: any) {
  return (
    <div className="grid grid-cols-2 py-2">
      <div className="col-span-1 text-gray-700">{label}</div>
      <div className="col-span-1 text-gray-900">
        <MUITextField disabled value={value ?? "N/A"} />
      </div>
    </div>
  );
}

function General(props: any) {
  const filteredSeries = props.data?.seriesList?.filter(
    (e: any) => e.Series === props.data?.Series
  );

  const seriesNames = filteredSeries?.map((series: any) => series.Name);

  const seriesName = seriesNames?.join(", ");

  return (
    <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-full">
      <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
        <h2>Basic Information</h2>
      </div>
      <div className="py-4 px-8">
        <div className="grid grid-cols-12 ">
          <div className="col-span-5">
            {renderKeyValue("Branch", props?.data?.BPLName)}
            {renderKeyValue(
              "Warehouse",
              new WarehouseRepository().find(props?.data?.U_tl_whsdesc)
                ?.WarehouseName
            )}
            {renderKeyValue(
              "Bin Location",
              new WareBinLocationRepository().find(props.data?.U_tl_sobincode)
                ?.BinCode
            )}
            {renderKeyValue("Customer", props.data.CardCode)}
            {renderKeyValue("Name", props.data.CardName)}
            {renderKeyValue(
              "Contact Person",
              props?.data?.vendor?.contactEmployee?.find(
                (e: any) => e.id == props.data.ContactPersonCode
              )?.name ?? "N/A"
            )}
            {renderKeyValue(
              "Price List",
              new PriceListRepository().find(
                parseInt(props.data.U_tl_sopricelist)
              )?.PriceListName ?? "N/A"
            )}
            {renderKeyValue(
              "Currency",
              props.data.Currency ?? props.data.DocCurrency
            )}
          </div>
          <div className="col-span-2"></div>
          <div className="col-span-5">
            {renderKeyValue("Series", seriesName)}
            {renderKeyValue("DocNum", props.data.DocNum)}
            {renderKeyValue("Posting Date", dateFormat(props.data.TaxDate))}
            {renderKeyValue("Delivery Date", dateFormat(props.data.DocDueDate))}
            {renderKeyValue("Document Date", dateFormat(props.data.DocDate))}
            {renderKeyValue(
              "Sale Employee",
              new SalePersonRepository().find(props.data?.SalesPersonCode)?.name
            )}
            {renderKeyValue(
              "Revenue Line",
              new DistributionRuleRepository().find(props.data?.U_ti_revenue)
                ?.FactorDescription
            )}
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700">Remark </div>
              <div className="col-span-1 text-gray-900">
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  disabled
                  className="bg-gray-100"
                  value={props?.data?.Comments}
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
        accessorKey: "ItemCode",
        header: "Item Code",
        size: 220,
        Cell: ({ cell }: any) => {
          return <MUITextField disabled value={cell.getValue()} />;
        },
      },
      {
        accessorKey: "ItemName",
        header: "Item Name",
        size: 240,
        Cell: ({ cell }: any) => {
          return <MUITextField disabled value={cell.getValue()} />;
        },
      },
      {
        accessorKey: "Quantity",
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
        accessorKey: "MeasureUnit",
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
        accessorKey: "DiscountPercent",
        header: "Discount %",

        Cell: ({ cell }: any) => {
          return (
            <MUIRightTextField
              placeholder="0.000"
              type="number"
              startAdornment={"%"}
              value={props?.data?.DiscountPercent ?? 0}
              disabled
            />
          );
        },
      },

      {
        accessorKey: "LineTotal",
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
            data={data.Items}
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

function Logistic(props: any) {
  return (
    <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-full">
      <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
        <h2>Logistic Information</h2>
      </div>
      <div className="py-2 px-4">
        <div className="grid grid-cols-12 ">
          <div className="col-span-5">
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700">Ship From Address</div>
              <div className="col-span-1 text-gray-900">
                <TextField
                  size="small"
                  fullWidth
                  disabled
                  multiline
                  className="bg-gray-100"
                  value={
                    new BranchBPLRepository().find(
                      props?.data?.BPL_IDAssignedToInvoice
                    )?.Address ?? "N/A"
                  }
                  // value={props.data.ShipFrom}
                  InputProps={{ readOnly: true }}
                />
              </div>
            </div>
            {renderKeyValue(
              "Attention Terminal",
              new WarehouseRepository().find(props?.data?.U_tl_attn_ter)
                ?.WarehouseName ?? "N/A"
            )}
          </div>
          <div className="col-span-2"></div>
          <div className="col-span-5">
            {renderKeyValue(
              "Ship-To Address",
              props?.data?.ShipToCode ?? "N/A"
            )}
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700">Shipping Address</div>
              <div className="col-span-1 text-gray-900">
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  disabled
                  className="bg-gray-100"
                  value={props?.data?.Address2}
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
