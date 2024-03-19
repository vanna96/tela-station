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
          Document: "TL_RETAILSALE",
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

      await request("GET", `TL_RETAILSALE(${id})`)
        .then(async (res: any) => {
          const data: any = res?.data;
          const fetchItemPrice = async (itemCode: string) => {
            try {
              const res = await request(
                "GET",
                `/Items('${itemCode}')?$select=ItemName,ItemPrices,UoMGroupEntry,InventoryUoMEntry`
              );
              return res.data;
            } catch (error) {
              console.error("Error fetching item details:", error);
              return null;
            }
          };

          const fetchDispenserData = async (pump: string) => {
            const res = await request(
              "GET",
              `TL_Dispenser('${pump}')?$select=U_tl_whs,TL_DISPENSER_LINESCollection`
            );
            return res.data;
          };
          const dispenser = await fetchDispenserData(data.U_tl_pump);
          const updatedAllocationData = await Promise.all(
            data.TL_RETAILSALE_FU_COCollection?.map(async (item: any) => {
              const itemDetails = await fetchItemPrice(item.U_tl_itemcode);
              const price = itemDetails?.ItemPrices?.find(
                (priceDetail: any) => priceDetail.PriceList === 2
              )?.Price;

              return {
                ...item,
                ItemPrice: price,
              };
            })
          );
          this.setState({
            seriesList,
            bin,
            pumpAttend,
            allocationData: updatedAllocationData,
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
      { label: "Consumption" },
      { label: "Incoming Payment" },
      { label: "Stock Allocation" },
      { label: "Card Count" },
      { label: "Error Log" },
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
    console.log(this.state);
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
                  {this.state.tapIndex === 1 && (
                    <NozzleData data={this.state} />
                  )}
                  {this.state.tapIndex === 2 && (
                    <IncomingPayment data={this.state} />
                  )}
                  {this.state.tapIndex === 3 && <Stock data={this.state} />}
                  {this.state.tapIndex === 4 && <CardCount data={this.state} />}
                  {this.state.tapIndex === 5 && <ErrorLog data={this.state} />}
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
    (e: any) => e.BPLID === parseInt(data?.U_tl_bplid)
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
            {renderKeyValue("Pump", data?.U_tl_pump)}
            {renderKeyValue("Customer", data.U_tl_cardcode)}
            {renderKeyValue("Name", data.U_tl_cardname)}

            {renderKeyValue("Shift", data?.U_tl_shiftcode)}
            {renderKeyValue(
              "Pump Attendant",
              data?.U_tl_attend +
                " - " +
                data.pumpAttend.find((e: any) => e.Code === data?.U_tl_attend)
                  ?.U_tl_fname +
                " " +
                data.pumpAttend.find((e: any) => e.Code === data?.U_tl_attend)
                  ?.U_tl_lname
            )}
          </div>
          {/* data?.U_tl_attend */}
          <div className="col-span-2"></div>
          <div className="col-span-5">
            {renderKeyValue("Series", seriesName)}
            {renderKeyValue("DocNum", data.DocNum)}
            {renderKeyValue("Document Date", dateFormat(data.DocDate))}

            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700"> Own Usage Remark </div>
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

function NozzleData({ data }: any) {
  const NozzleDataColumn: any = useMemo(
    () => [
      {
        size: 5,
        minSize: 5,
        maxSize: 5,
        accessorKey: "deleteButton",
        align: "center",
        header: "",
        Cell: ({ cell }: any) => {
          null;
        },
      },
      {
        accessorKey: "U_tl_nozzlecode",
        header: "Nozzle Code",
        enableClickToCopy: true,
        Cell: ({ cell }: any) => {
          return <MUITextField disabled value={cell.getValue()} />;
        },
      },
      {
        accessorKey: "U_tl_itemcode",
        header: "Item Code",
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        Cell: ({ cell }: any) => {
          return <MUITextField disabled value={cell.getValue()} />;
        },
      },
      {
        accessorKey: "U_tl_itemname",
        header: "Item Name",
        enableClickToCopy: true,
        Cell: ({ cell }: any) => {
          return <MUITextField disabled value={cell.getValue()} />;
        },
      },
      {
        accessorKey: "U_tl_uom",
        header: "UoM ",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              disabled
              value={
                new UnitOfMeasurementRepository().find(cell.getValue())?.Name
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_nmeter",
        header: "New Meter",
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              disabled
              value={cell.getValue()}
              thousandSeparator
              customInput={MUIRightTextField}
              decimalScale={data.Currency === "USD" ? 3 : 0}
            />
          );
        },
      },
      {
        accessorKey: "U_tl_ometer",
        header: "Old Meter",

        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              disabled
              value={cell.getValue()}
              thousandSeparator
              customInput={MUIRightTextField}
              decimalScale={data.Currency === "USD" ? 3 : 0}
            />
          );
        },
      },
      {
        accessorKey: "U_tl_cmeter",
        header: "Consumption",
        Cell: ({ cell }: any) => (
          <NumericFormat
            disabled
            key={"U_tl_cmeter" + cell.getValue()}
            thousandSeparator
            // decimalScale={data.Currency === "USD" ? 4 : 0}
            customInput={MUIRightTextField}
            value={cell.getValue() || 0}
          />
        ),
      },
      {
        size: 5,
        minSize: 5,
        maxSize: 5,
        accessorKey: "deleteButton",
        align: "center",
        header: "",
        Cell: ({ cell }: any) => {
          null;
        },
      },
    ],
    []
  );

  const GenerateAllocationColumn: any = useMemo(
    () => [
      {
        accessorKey: "U_tl_cmeter",
        header: "",
        size: 10,
        Cell: ({ cell }: any) => null,
      },

      {
        accessorKey: "U_tl_itemcode",
        header: "Item Code",
        enableClickToCopy: true,
        Cell: ({ cell }: any) => {
          return <MUITextField disabled value={cell.getValue()} />;
        },
      },

      {
        accessorKey: "U_tl_cashallow",
        header: "Cash Sales (Litre)",
        Cell: ({ cell }: any) => (
          <NumericFormat
            disabled
            key={"U_tl_cashallow" + cell.getValue()}
            thousandSeparator
            // decimalScale={data.Currency === "USD" ? 4 : 0}
            customInput={MUIRightTextField}
            value={cell.getValue() || 0}
          />
        ),
      },
      {
        accessorKey: "U_tl_partallow",
        header: "Partnership (Litre)",
        Cell: ({ cell }: any) => (
          <NumericFormat
            disabled
            key={"U_tl_partallow" + cell.getValue()}
            thousandSeparator
            // decimalScale={data.Currency === "USD" ? 4 : 0}
            customInput={MUIRightTextField}
            value={cell.getValue() || 0}
          />
        ),
      },
      {
        accessorKey: "U_tl_stockallow",
        header: "  Stock Transfer (Liter)",
        Cell: ({ cell }: any) => (
          <NumericFormat
            disabled
            key={"U_tl_stockallow" + cell.getValue()}
            thousandSeparator
            // decimalScale={data.Currency === "USD" ? 4 : 0}
            customInput={MUIRightTextField}
            value={cell.getValue() || 0}
          />
        ),
      },

      {
        accessorKey: "U_tl_ownallow",
        header: " Own Usage (Litre)",
        Cell: ({ cell }: any) => (
          <NumericFormat
            disabled
            key={"U_tl_ownallow" + cell.getValue()}
            thousandSeparator
            // decimalScale={data.Currency === "USD" ? 4 : 0}
            customInput={MUIRightTextField}
            value={cell.getValue() || 0}
          />
        ),
      },
      {
        accessorKey: "U_tl_cardallow",
        header: "Tela Card (Litre)",
        Cell: ({ cell }: any) => (
          <NumericFormat
            disabled
            key={"U_tl_cardallow" + cell.getValue()}
            thousandSeparator
            // decimalScale={data.Currency === "USD" ? 4 : 0}
            customInput={MUIRightTextField}
            value={cell.getValue() || 0}
          />
        ),
      },
      {
        accessorKey: "U_tl_pumpallow",
        header: " Pump Test (Litre)",
        Cell: ({ cell }: any) => (
          <NumericFormat
            disabled
            key={"U_tl_pumpallow" + cell.getValue()}
            thousandSeparator
            // decimalScale={data.Currency === "USD" ? 4 : 0}
            customInput={MUIRightTextField}
            value={cell.getValue() || 0}
          />
        ),
      },
      {
        accessorKey: "U_tl_totalallow",
        header: " Total (Litre)",
        Cell: ({ cell }: any) => {
          const total =
            (cell.row.original?.U_tl_cardallow || 0) +
            (cell.row.original?.U_tl_cashallow || 0) +
            (cell.row.original?.U_tl_ownallow || 0) +
            (cell.row.original?.U_tl_partallow || 0) +
            (cell.row.original?.U_tl_pumpallow || 0) +
            (cell.row.original?.U_tl_stockallow || 0);
          return (
            <NumericFormat
              disabled
              key={"U_tl_totalallow" + cell.getValue()}
              thousandSeparator
              // decimalScale={data.Currency === "USD" ? 4 : 0}
              customInput={MUIRightTextField}
              value={cell.getValue() !== 0 ? cell.getValue() : total}
            />
          );
        },
      },

      {
        accessorKey: "U_tl_cmeter",
        header: "",
        size: 10,
        Cell: ({ cell }: any) => null,
      },
    ],
    []
  );

  return (
    <>
      <div className="rounded-lg shadow-sm  border p-8 px-14 h-full">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
          <h2>Nozzle Data</h2>
        </div>
        <div className="col-span-2 data-table">
          <CustomMaterialReactTable
            columns={NozzleDataColumn}
            data={data?.TL_RETAILSALE_FU_COCollection || []}
          />
        </div>
      </div>
      <div className="mt-8" />
      <div className="rounded-lg shadow-sm  border p-8 px-14 h-full">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
          <h2>Generate Allocation </h2>
        </div>
        <div className="col-span-2 data-table">
          <CustomMaterialReactTable
            columns={GenerateAllocationColumn}
            data={data?.TL_RETAILSALE_FU_COCollection || []}
          />
        </div>
      </div>
    </>
  );
}

function IncomingPayment({ data }: any) {
  const totalCashSale: number = React.useMemo(() => {
    const total = data?.allocationData?.reduce(
      (prevTotal: any, item: any) => {
        const lineTotal = Formular.findLineTotal(
          (item.U_tl_cashallow || 0)?.toString(),
          item.ItemPrice || 0,
          // "1",
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
    total += data.TL_RETAILSALE_FU_INCollection.reduce(
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
    total += data.TL_RETAILSALE_FU_INCollection.reduce(
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
    total += data.TL_RETAILSALE_FU_INCollection.reduce(
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
      data?.TL_RETAILSALE_FU_INCollection?.some(
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
    data?.TL_RETAILSALE_FU_INCollection?.filter(
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
            data?.TL_RETAILSALE_FU_INCollection?.filter(
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
            data?.TL_RETAILSALE_FU_INCollection?.filter(
              (e: any) => e.U_tl_paytype === "Check"
            ) || []
          }
        />
      </div>

      <div className="mt-4">
        {data?.TL_RETAILSALE_FU_INCollection?.filter(
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

function Stock({ data }: any) {
  const stockColumns = React.useMemo(
    () => [
      {
        accessorKey: "U_tl_bplid",
        header: "Branch",
        type: "number",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              disabled
              value={
                new BranchBPLRepository()?.find(cell.row.original.U_tl_bplid)
                  ?.BPLName
              }
            />
          );
        },
      },

      {
        accessorKey: "U_tl_whs",
        header: "Warehouse",
        type: "number",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              disabled
              value={
                new WarehouseRepository()?.find(cell.row.original.U_tl_whs)
                  ?.WarehouseName
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_bincode",
        header: "Bin Location",
        type: "number",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              disabled
              value={
                data.bin.value?.find(
                  (e: any) =>
                    e?.AbsEntry === parseInt(cell.row.original.U_tl_bincode)
                )?.BinCode
              }
            />
          );
        },
      },
      {
        accessorKey: "U_tl_itemcode",
        header: "Item Code",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField disabled value={cell.row.original.U_tl_itemcode} />
          );
        },
      },
      {
        accessorKey: "U_tl_itemname",
        header: "Item Name",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField disabled value={cell.row.original.U_tl_itemname} />
          );
        },
      },

      {
        accessorKey: "U_tl_qtycon",
        header: "Cons. Qty ",
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              key={"U_tl_qtycon" + cell.getValue()}
              thousandSeparator
              disabled
              decimalScale={2}
              placeholder="0.000"
              customInput={MUIRightTextField}
              value={cell.getValue()}
            />
          );
        },
      },
      {
        accessorKey: "U_tl_qtyaloc",
        header: "Aloc. Qty",
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              disabled
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              customInput={MUIRightTextField}
              defaultValue={cell.getValue()}
            />
          );
        },
      },
      {
        accessorKey: "U_tl_uom",
        header: "UoM",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              value={
                new UnitOfMeasurementRepository().find(
                  cell.row.original.U_tl_uom
                )?.Name
              }
              disabled
            />
          );
        },
      },

      {
        accessorKey: "U_tl_qtyopen",
        header: "Open. Qty",
        Cell: ({ cell }: any) => {
          return (
            <NumericFormat
              disabled
              key={"amount_" + cell.getValue()}
              thousandSeparator
              decimalScale={2}
              customInput={MUIRightTextField}
              defaultValue={cell.getValue()}
            />
          );
        },
      },

      {
        accessorKey: "U_tl_remark",
        header: "Remark",
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              key={"U_tl_remark" + cell.getValue()}
              defaultValue={cell.getValue()}
              disabled
            />
          );
        },
      },
    ],
    []
  );
  return (
    <>
      <div className="rounded-lg shadow-sm  border p-8 px-14 h-full">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
          <h2>Stock Allocation</h2>
        </div>
        <div className="col-span-2 data-table">
          <CustomMaterialReactTable
            columns={stockColumns}
            data={data?.TL_RETAILSALE_FU_SACollection || []}
          />
        </div>
      </div>
    </>
  );
}

function CardCount({ data }: any) {
  const cardCountColumn = React.useMemo(
    () => [
      { key: "U_tl_1l", header: "1L" },
      { key: "U_tl_2l", header: "2L" },
      { key: "U_tl_5l", header: "5L" },
      { key: "U_tl_10l", header: "10L" },
      { key: "U_tl_20l", header: "20L" },
      { key: "U_tl_50l", header: "50L" },
      { key: "U_tl_total", header: "Total (Litre)" },
    ],
    []
  );
  return (
    <>
      <div className="rounded-lg shadow-sm  border p-8 px-14 h-full">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
          <h2>Card Count </h2>
        </div>
        <div className="col-span-2 data-table">
          <CustomMaterialReactTable
            columns={[
              {
                accessorKey: "U_tl_itemCode",
                header: "Item Code",
                Cell: ({ cell }: any) => {
                  return <MUITextField disabled value={cell.getValue()} />;
                },
              },
              ...cardCountColumn.map(({ key, header }) => ({
                accessorKey: key,
                header,
                Cell: renderCell(key),
              })),
            ]}
            data={data?.TL_RETAILSALE_FU_CCCollection || []}
          />
        </div>
      </div>
    </>
  );
}

function ErrorLog({ data }: any) {
  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-screen">
        <TextField
          fullWidth
          multiline
          className="w-full"
          aria-readonly
          rows={15}
          disabled
          value={data.U_tl_errormsg}
        />
      </div>
    </>
  );
}
