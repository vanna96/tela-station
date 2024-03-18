import CoreFormDocument from "@/components/core/CoreFormDocument";
import { withRouter } from "@/routes/withRouter";
import { LoadingButton } from "@mui/lab";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import MenuButton from "@/components/button/MenuButton";
import { FormValidateException } from "@/utilies/error";
import GeneralForm from "../components/GeneralForm";
import { formatDate, getAttachment } from "@/helper/helper";
import request from "@/utilies/request";
import BusinessPartner from "@/models/BusinessParter";
import { CircularProgress, Button, Snackbar, Alert } from "@mui/material";
import { ItemModalComponent } from "@/components/modal/ItemComponentModal";
import Consumption from "../components/Consumption";
import IncomingPaymentForm from "../components/IncomingPayment";
import ContentForm from "../components/ContentForm";
import ErrorLogForm from "../../components/ErrorLogForm";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import UnitOfMeasurementGroupRepository from "@/services/actions/unitOfMeasurementGroupRepository";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import StockAllocationTable from "../components/StockAllocationForm";
import CardCount from "../components/CardCountTable";
import { ReactNode } from "react";

class SalesOrderForm extends CoreFormDocument {
  LeftSideField?(): JSX.Element | ReactNode {
    return null;
  }

  RightSideField?(): JSX.Element | ReactNode {
    return null;
  }

  HeaderCollapeMenu?(): JSX.Element | ReactNode {
    return <></>;
  }

  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
      loading: true,
      U_tl_docdate: new Date(),
      error: {},
      U_tl_bplid: 1,
      BPCurrenciesCollection: [],
      CurrencyType: "L",
      Currency: "USD",
      DocType: "dDocument_Items",
      ExchangeRate: 1,
      JournalRemark: "",
      BPAddresses: [],
      Rounding: false,
      DocDiscount: 0,
      RoundingValue: 0,
      VatGroup: "S1",
      type: "sale",
      lineofBusiness: "",
      showCollapse: false,
      warehouseCode: "",
      nozzleData: [],
      stockAllocationData: [],
      allocationData: [],
      cashBankData: [
        {
          U_tl_paytype: "Cash",
          U_tl_paycur: "USD",
          U_tl_amtcash: "",
          U_tl_amtbank: "",
        },
      ],
      checkNumberData: [],
      couponData: [
        {
          U_tl_acccoupon: "110101",
          U_tl_amtcoupon: "",
          U_tl_paycur: "USD",
          U_tl_paytype: "Coupon",
        },
      ],
      isDialogOpen: false,
    } as any;

    this.onInit = this.onInit.bind(this);
    this.handlerRemoveItem = this.handlerRemoveItem.bind(this);
    this.handlerSubmit = this.handlerSubmit.bind(this);
    this.handlerChangeMenu = this.handlerChangeMenu.bind(this);
    this.hanndAddNewItem = this.hanndAddNewItem.bind(this);
  }
  handleLineofBusinessChange = (value: any) => {
    this.setState({ lineofBusiness: value });
  };

  handleWarehouseChange = (value: any) => {
    this.setState({ warehouseCode: value });
  };
  componentDidMount(): void {
    this.setState({ loading: true });
    this.onInit();
  }

  async onInit() {
    let state: any = { ...this.state };
    let seriesList: any = this.props?.query?.find("TL_RETAILSALE_LP-series");

    if (!seriesList) {
      seriesList = await DocumentSerieRepository.getDocumentSeries({
        Document: "TL_RETAILSALE_LP",
      });
      this.props?.query?.set("TL_RETAILSALE_LP-series", seriesList);
    }

    let dnSeries: any = this.props?.query?.find("dn-series");

    if (!dnSeries) {
      dnSeries = await DocumentSerieRepository.getDocumentSeries({
        Document: "15",
      });
      this.props?.query?.set("dn-series", dnSeries);
    }
    let invoiceSeries: any = this.props?.query?.find("invoice-series");

    if (!invoiceSeries) {
      invoiceSeries = await DocumentSerieRepository.getDocumentSeries({
        Document: "13",
      });
      this.props?.query?.set("invoice-series", invoiceSeries);
    }

    if (this.props.edit) {
      const { id }: any = this.props?.match?.params || 0;
      await request("GET", `TL_RETAILSALE_LP(${id})`)
        .then(async (res: any) => {
          const data: any = res?.data;
          // vendor
          const vendor: any = await request(
            "GET",
            `/BusinessPartners('${data?.U_tl_cardcode}')`
          )
            .then((res: any) => new BusinessPartner(res?.data, 0))
            .catch((err: any) => console.log(err));

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
            data.TL_RETAILSALE_LP_PSCollection?.map(async (item: any) => {
              const itemDetails = await fetchItemPrice(item.U_tl_itemcode);
              const price = itemDetails?.ItemPrices?.find(
                (priceDetail: any) => priceDetail.PriceList === 2
              )?.Price;

              return {
                ...item,
                ItemPrice: price,
                U_tl_bincode: dispenser.TL_DISPENSER_LINESCollection?.find(
                  (e: any) => e.U_tl_itemnum === item.U_tl_itemcode
                )?.U_tl_bincode,
                U_tl_whs: dispenser.U_tl_whs,
              };
            })
          );

          state = {
            ...data,
            vendor,
            dispenser,
            U_tl_whs: dispenser.U_tl_whs,
            CardCode: data.U_tl_cardcode,
            CardName: data.U_tl_cardname,
            nozzleData: updatedAllocationData,
            allocationData: updatedAllocationData,
            stockAllocationData: data?.TL_RETAILSALE_LP_CSCollection?.map(
              (item: any) => ({
                U_tl_bplid: item.U_tl_bplid || 1,
                U_tl_itemcode: item.U_tl_itemcode,
                U_tl_itemname: item.U_tl_itemname,
                U_tl_alocqty: item.U_tl_alocqty,
                U_tl_consqty: item.U_tl_consqty,
                U_tl_openqty: item.U_tl_openqty,
                U_tl_remark: item.U_tl_remark,
                U_tl_uom: item.U_tl_uom,
                U_tl_whscode: item.U_tl_whscode,
                U_tl_bincode: item.U_tl_bincode,
              })
            ),
            cashBankData: data?.TL_RETAILSALE_LP_INCollection?.filter(
              (e: any) => e.U_tl_paytype === "Cash" || e.U_tl_paytype === "Bank"
            )?.map((item: any) => ({
              U_tl_acccash: item.U_tl_acccash,
              U_tl_acccoupon: item.U_tl_acccoupon,
              U_tl_accbank: item?.U_tl_accbank,
              U_tl_amtcash: item?.U_tl_amtcash || 0,
              U_tl_amtbank: item?.U_tl_amtbank || 0,
              U_tl_paytype: item?.U_tl_paytype,
              U_tl_paycur: item?.U_tl_paycur,
            })),

            checkNumberData: data?.TL_RETAILSALE_LP_INCollection?.filter(
              (e: any) => e.U_tl_paytype === "Check"
            )?.map((item: any) => ({
              U_tl_acccheck: item.U_tl_acccheck,
              U_tl_amtcheck: item?.U_tl_amtcheck || 0,
              U_tl_paytype: item?.U_tl_paytype,
              U_tl_paycur: item?.U_tl_paycur,
              U_tl_checkdate: item?.U_tl_checkdate,
              U_tl_checkbank: item?.U_tl_checkbank,
            })),

            couponData: data?.TL_RETAILSALE_LP_INCollection?.filter(
              (e: any) => e.U_tl_paytype === "Coupon"
            )?.map((item: any) => ({
              U_tl_acccoupon: item.U_tl_acccoupon,
              U_tl_accbank: item?.U_tl_accbank,
              U_tl_amtcoupon: item?.U_tl_amtcoupon || 0,
              U_tl_paytype: item?.U_tl_paytype,
              U_tl_paycur: item?.U_tl_paycur,
            })),
            cardCountData: data?.TL_RETAILSALE_LP_CCCollection?.map(
              (item: any) => ({
                U_tl_itemcode: item.U_tl_itemCode,
                U_tl_1l: item?.U_tl_1l,
                U_tl_2l: item?.U_tl_2l,
                U_tl_5l: item?.U_tl_5l,
                U_tl_10l: item?.U_tl_10l,
                U_tl_20l: item?.U_tl_20l,
                U_tl_50l: item?.U_tl_50l,
                U_tl_total: item?.U_tl_total,
              })
            ),
            Items: await Promise.all(
              (data?.TL_RETAILSALE_LP_USCollection || []).map(
                async (item: any) => {
                  let apiResponse: any;

                  if (item.U_tl_itemcode) {
                    try {
                      const response = await request(
                        "GET",
                        `/Items('${item.U_tl_itemcode}')?$select=UoMGroupEntry, ItemPrices`
                      );

                      apiResponse = response.data;
                    } catch (error) {
                      console.error("Error fetching data:", error);
                    }
                  }

                  const uomGroups: any =
                    await new UnitOfMeasurementGroupRepository().get();

                  const uoms = await new UnitOfMeasurementRepository().get();
                  const uomGroup: any = uomGroups.find(
                    (row: any) => row.AbsEntry === apiResponse.UoMGroupEntry
                  );

                  let uomLists: any[] = [];
                  uomGroup?.UoMGroupDefinitionCollection?.forEach(
                    (row: any) => {
                      const itemUOM = uoms.find(
                        (record: any) => record?.AbsEntry === row?.AlternateUoM
                      );
                      if (itemUOM) {
                        uomLists.push(itemUOM);
                      }
                    }
                  );
                  item.ItemPrices === apiResponse.ItemPrices;

                  return {
                    ItemCode: item.U_tl_itemcode || null,
                    ItemName: item.U_tl_itemname || null,
                    Quantity: item.U_tl_qty || null,
                    UnitPrice:
                      item.GrossPrice / (1 + item.TaxPercentagePerRow / 100),
                    Discount: item.DiscountPercent || 0,
                    GrossPrice: item.U_tl_unitprice,
                    TotalGross: item.GrossTotal,
                    TotalUnit: item.LineTotal,
                    LineTotal: item.U_tl_doctotal,
                    DiscountPercent: item.U_tl_dispercent || 0,
                    VatGroup: item.VatGroup,
                    UoMEntry: item.U_tl_uom || null,
                    WarehouseCode: item?.WarehouseCode || data?.U_tl_whs,
                    UomAbsEntry: item?.U_tl_uom,
                    VatRate: item.TaxPercentagePerRow,
                    UomLists: uomLists,
                    ItemPrices: apiResponse.ItemPrices,
                    ExchangeRate: data?.DocRate || 1,
                    JournalMemo: data?.JournalMemo,
                    COGSCostingCode: item?.COGSCostingCode,
                    COGSCostingCode2: item?.COGSCostingCode2,
                    COGSCostingCode3: item?.COGSCostingCode3,
                    CurrencyType: "B",
                    DocumentLinesBinAllocations:
                      item.DocumentLinesBinAllocations,
                    vendor,
                    warehouseCode: data?.U_tl_whs,
                    DocDiscount: data?.DiscountPercent,
                  };
                }
              )
            ),
          };
        })
        .catch((err: any) => console.log(err))
        .finally(() => {
          state["SerieLists"] = seriesList;
          state["dnSeries"] = dnSeries;
          state["invoiceSeries"] = invoiceSeries;
          state["loading"] = false;
          state["isLoadingSerie"] = false;
          this.setState(state);
        });
    } else {
      state["SerieLists"] = seriesList;
      state["dnSeries"] = dnSeries;
      state["invoiceSeries"] = invoiceSeries;
      // state["DocNum"] = defaultSeries.NextNumber ;
      state["loading"] = false;
      state["isLoadingSerie"] = false;
      this.setState(state);
    }
  }
  createPayload() {
    const data: any = { ...this.state };
    const payload = {
      Series: data?.Series,
      U_tl_bplid: data?.U_tl_bplid || 1,
      U_tl_pump: data?.U_tl_pump,
      U_tl_cardcode: data?.CardCode,
      U_tl_cardname: data?.CardName,
      U_tl_shiftcode: data?.U_tl_shiftcode,
      U_tl_docdate: data?.U_tl_docdate || new Date(),
      U_tl_attend: data?.U_tl_attend,
      U_tl_totalbefdis: data?.U_tl_totalbefdis,
      U_tl_dispercent: data?.U_tl_dispercent,
      U_tl_disperamt: data?.U_tl_disperamt,
      U_tl_tax: data?.U_tl_tax,
      U_tl_doctotal: data?.U_tl_doctotal,
      TL_RETAILSALE_LP_PSCollection: data.nozzleData
        ?.filter((e: any) => parseInt(e.U_tl_nmeter) > 0)
        ?.map((item: any) => ({
          U_tl_nozzlecode: item.U_tl_nozzlecode,
          U_tl_itemcode: item.U_tl_itemcode,
          U_tl_itemname: item.U_tl_itemname,
          U_tl_uom: item.U_tl_uom,
          U_tl_nmeter: item.U_tl_nmeter,
          // U_tl_upd_meter: item.U_tl_ometer,
          U_tl_ometer: item.U_tl_ometer,
          U_tl_cmeter: item.U_tl_cmeter,
          U_tl_cardallow: item.U_tl_cardallow,
          U_tl_cashallow: item.U_tl_cashallow,
          U_tl_ownallow: item.U_tl_ownallow,
          U_tl_partallow: item.U_tl_partallow,
          U_tl_pumpallow: item.U_tl_pumpallow,
          U_tl_stockallow: item.U_tl_stockallow,
          U_tl_totalallow:
            item.U_tl_stockallow +
            item.U_tl_cardallow +
            item.U_tl_cashallow +
            item.U_tl_ownallow +
            item.U_tl_partallow +
            item.U_tl_pumpallow,
        })),
      TL_RETAILSALE_LP_USCollection: data?.Items?.map((item: any) => ({
        U_tl_itemcode: item.ItemCode,
        U_tl_itemname: item.ItemName,
        U_tl_qty: item.Quantity,
        U_tl_uom: item.UomAbsEntry,
        U_tl_dispercent: item.DiscountPercent,
        U_tl_unitprice: item.GrossPrice,
        U_tl_doctotal: item.LineTotal,
      })),
      TL_RETAILSALE_LP_INCollection: [
        ...data?.checkNumberData,
        ...data?.cashBankData,
        ...data?.couponData,
      ],
      TL_RETAILSALE_LP_CCCollection: (data?.cardCountData || []).length
        ? data?.cardCountData?.map((item: any) => ({
            U_tl_itemCode: item.U_tl_itemcode,
            U_tl_1l: item?.U_tl_1l,
            U_tl_2l: item?.U_tl_2l,
            U_tl_5l: item?.U_tl_5l,
            U_tl_10l: item?.U_tl_10l,
            U_tl_20l: item?.U_tl_20l,
            U_tl_50l: item?.U_tl_50l,
            U_tl_total:
              (item?.U_tl_1l || 0) +
              (item?.U_tl_2l || 0) +
              (item?.U_tl_5l || 0) +
              (item?.U_tl_10l || 0) +
              (item?.U_tl_20l || 0) +
              (item?.U_tl_50l || 0),
          }))
        : data?.allocationData?.map((item: any) => ({
            U_tl_itemCode: item.U_tl_itemcode,
            U_tl_1l: 0,
            U_tl_2l: 0,
            U_tl_5l: 0,
            U_tl_10l: 0,
            U_tl_20l: 0,
            U_tl_50l: 0,
            U_tl_total: 0,
          })),

      //Stock Allocation Collection
      TL_RETAILSALE_LP_CSCollection: data?.stockAllocationData?.map(
        (item: any) => ({
          // U_tl_nozzlecode: item.U_tl_nozzlecode,
          U_tl_itemcode: item.U_tl_itemcode,
          U_tl_itemname: item.U_tl_itemname,
          U_tl_consqty: item.U_tl_consqty,
          U_tl_alocqty: item.U_tl_alocqty,
          U_tl_uom: item.U_tl_uom,
          U_tl_openqty: item.U_tl_openqty,
          U_tl_remark: item.U_tl_remark,
          U_tl_whscode: item.U_tl_whscode,
          U_tl_bincode: item.U_tl_bincode,
          U_tl_bplid: item.U_tl_bplid,
        })
      ),
    };
    if (this.props.edit) {
      delete payload.Series;
    }
    return payload;
  }
  handlerRemoveItem(code: string) {
    let items = [...(this.state.Items ?? [])];
    const index = items.findIndex((e: any) => e?.ItemCode === code);
    items.splice(index, 1);
    this.setState({ ...this.state, Items: items });
  }

  async handlerSubmit(event: any) {
    event.preventDefault();
    const data: any = { ...this.state };

    try {
      this.setState({
        ...this.state,
        isSubmitting: false,
        warehouseCode: "",
        loading: true,
      });
      await new Promise((resolve) => setTimeout(() => resolve(""), 800));
      const { id } = this.props?.match?.params || 0;

      const validations = [
        {
          field: "U_tl_bplid",
          message: "Branch is Required!",
          getTabIndex: () => 0,
        },

        {
          field: "U_tl_pump",
          message: "Pump is Required!",
          getTabIndex: () => 0,
        },

        {
          field: "CardCode",
          message: "Customer is Required!",
          getTabIndex: () => 0,
        },
        {
          field: "U_tl_attend",
          message: "Pump Attendant is Required!",
          getTabIndex: () => 0,
        },
        {
          field: "Series",
          message: "Series is Required!",
          getTabIndex: () => 0,
        },

        {
          field: "U_tl_docdate",
          message: "Document date is Required!",
          getTabIndex: () => 0,
        },

        {
          field: "Series",
          message: "Series is Required!",
          getTabIndex: () => 0,
        },

        {
          field: "U_tl_docdate",
          message: "Document date is Required!",
          getTabIndex: () => 0,
        },
        {
          field: "nozzleData",
          message:
            "Nozzle Data is missing or does not have a valid record with New Meter!",
          isArray: true,
          getTabIndex: () => 1,
          validate: (data: any) => {
            return (
              Array.isArray(data.nozzleData) &&
              data.nozzleData.some((item: any) => item.U_tl_nmeter)
            );
          },
        },
        {
          field: "allocationData",
          message:
            "Allocation Data is missing or does not have a valid quantity allowed!",
          isArray: true,
          getTabIndex: () => 1,
          validate: (data: any) => {
            return (
              Array.isArray(data.allocationData) &&
              data.allocationData.every((item: any) => {
                const cashSales = item["U_tl_cashallow"] || 0;
                const partnership = item["U_tl_partallow"] || 0;
                const stockTransfer = item["U_tl_stockallow"] || 0;
                const ownUsage = item["U_tl_ownallow"] || 0;
                const telaCard = item["U_tl_cardallow"] || 0;
                const pumpTest = item["U_tl_pumpallow"] || 0;
                const total = item["U_tl_cmeter"] || 0;
                return (
                  cashSales +
                    partnership +
                    stockTransfer +
                    ownUsage +
                    telaCard +
                    pumpTest ===
                  total
                );
              })
            );
          },
        },
        {
          field: "Items",
          message: "Items is missing and must have at least one record!",
          isArray: true,
          getTabIndex: () => 2,
        },
        {
          field: "cashBankData",
          message: "Please enter at least one amount of Cash Sale!",
          isArray: true,
          getTabIndex: () => 3,
          validate: (data: any) => {
            return (
              Array.isArray(data.cashBankData) &&
              data.cashBankData.some(
                (item: any) => item.U_tl_amtcash || item.U_tl_amtbank
              )
            );
          },
        },
      ];

      validations.forEach(
        ({ field, message, isArray, getTabIndex, validate }) => {
          const value = isArray ? data[field] : data[field];
          if (
            !value ||
            (isArray && value.length === 0) ||
            (validate && !validate(data))
          ) {
            data.error = { [field]: message };
            throw new FormValidateException(message, getTabIndex());
          }
        }
      );

      const warehouseCodeGet = data.U_tl_whsdesc;
      const DocumentLines = getItem(
        data?.Items || [],
        data?.DocType,
        warehouseCodeGet,
        data.BinLocation,
        data.LineOfBusiness,
        data.U_ti_revenue
      );

      const payload = this.createPayload();
      const { allocationData, stockAllocationData, cardCountData } = data;
      const validationResult = validateData(
        allocationData,
        stockAllocationData
      );
      const validationResultCC = validateCardCountData(
        allocationData,
        cardCountData
      );
      if (!validationResultCC.isValid) {
        this.setState({ ...data, isSubmitting: false });
        this.dialog.current?.error(validationResultCC.message, "Invalid");
        return;
      }
      if (!validationResult.isValid) {
        this.setState({ ...data, isSubmitting: false });
        this.dialog.current?.error(validationResult.message, "Invalid");
        return;
      }

      if (id) {
        return await request("PATCH", `/TL_RETAILSALE_LP(${id})`, payload)
          .then((res: any) =>
            this.dialog.current?.success("Update Successfully.", id)
          )
          .catch((err: any) => this.dialog.current?.error(err.message))
          .finally(() => this.setState({ ...this.state, isSubmitting: false }));
      }
      await request("POST", "/TL_RETAILSALE_LP", payload)
        .then(async (res: any) => {
          if ((res && res.status === 200) || 201) {
            const docEntry = res.data.DocEntry;
            this.dialog.current?.success("Create Successfully.", docEntry);
          } else {
            console.error("Error in POST request:", res.statusText);
          }
        })
        .catch((err: any) => {
          this.dialog.current?.error(err.message);
          console.error("Error in POST request:", err.message);
        })
        .finally(() => {
          this.setState({ ...this.state, isSubmitting: false, loading: false });
        });
    } catch (error: any) {
      if (error instanceof FormValidateException) {
        this.setState({ ...data, isSubmitting: false, tapIndex: error.tap });
        this.dialog.current?.error(error.message, "Invalid");
        return;
      }

      this.setState({ ...data, isSubmitting: false });
      this.dialog.current?.error(error.message, "Invalid");
    }
  }
  async handlerSubmitPost(event: any, edit: boolean) {
    event.preventDefault();
    this.setState({ ...this.state, isSubmitting: true });
    const data: any = { ...this.state };

    const payload = this.createPayload();
    console.log(data);
    edit = this.props.edit;

    try {
      await new Promise((resolve) => setTimeout(() => resolve(""), 800));
      const validations = [
        {
          field: "U_tl_bplid",
          message: "Branch is Required!",
          getTabIndex: () => 0,
        },

        {
          field: "U_tl_pump",
          message: "Pump is Required!",
          getTabIndex: () => 0,
        },

        {
          field: "CardCode",
          message: "Customer is Required!",
          getTabIndex: () => 0,
        },
        {
          field: "U_tl_attend",
          message: "Pump Attendant is Required!",
          getTabIndex: () => 0,
        },
        {
          field: "Series",
          message: "Series is Required!",
          getTabIndex: () => 0,
        },

        {
          field: "U_tl_docdate",
          message: "Document date is Required!",
          getTabIndex: () => 0,
        },
        {
          field: "nozzleData",
          message:
            "Nozzle Data is missing or does not have a valid record with New Meter!",
          isArray: true,
          getTabIndex: () => 1,
          validate: (data: any) => {
            return (
              Array.isArray(data.nozzleData) &&
              data.nozzleData.some((item: any) => item.U_tl_nmeter)
            );
          },
        },
        {
          field: "allocationData",
          message:
            "Allocation Data is missing or does not have a valid quantity allowed!",
          isArray: true,
          getTabIndex: () => 1,
          validate: (data: any) => {
            return (
              Array.isArray(data.allocationData) &&
              data.allocationData.every((item: any) => {
                const cashSales = item["U_tl_cashallow"] || 0;
                const partnership = item["U_tl_partallow"] || 0;
                const stockTransfer = item["U_tl_stockallow"] || 0;
                const ownUsage = item["U_tl_ownallow"] || 0;
                const telaCard = item["U_tl_cardallow"] || 0;
                const pumpTest = item["U_tl_pumpallow"] || 0;
                const total = item["U_tl_cmeter"] || 0;
                return (
                  cashSales +
                    partnership +
                    stockTransfer +
                    ownUsage +
                    telaCard +
                    pumpTest ===
                  total
                );
              })
            );
          },
        },
        {
          field: "cashBankData",
          message: "Please enter at least one amount of Cash Sale!",
          isArray: true,
          getTabIndex: () => 2,
          validate: (data: any) => {
            return (
              Array.isArray(data.cashBankData) &&
              data.cashBankData.some(
                (item: any) => item.U_tl_amtcash || item.U_tl_amtbank
              )
            );
          },
        },
      ];

      validations.forEach(
        ({ field, message, isArray, getTabIndex, validate }) => {
          const value = isArray ? data[field] : data[field];
          if (
            !value ||
            (isArray && value.length === 0) ||
            (validate && !validate(data))
          ) {
            data.error = { [field]: message };
            throw new FormValidateException(message, getTabIndex());
          }
        }
      );
      let docEntry;
      if (!edit) {
        const { isFirstAttempt } = this.state;

        if (!this.state.docEntry || isFirstAttempt) {
          const response = await request("POST", "/TL_RETAILSALE_LP", payload);
          docEntry = response.data.DocEntry;
          this.setState({
            docEntry,
            isFirstAttempt: false,
            disableBranch: true,
          });
        } else {
          docEntry = this.state.docEntry; // Assign docEntry from state
          await request("PATCH", `/TL_RETAILSALE_LP(${docEntry})`, payload);
        }
      } else {
        docEntry = data.DocEntry; // Assign docEntry from props
        await request("PATCH", `/TL_RETAILSALE_LP(${docEntry})`, payload);
      }

      const generateAllocationPayload = (data: any, allocationType: any) => {
        const filteredData = data?.allocationData?.filter(
          (item: any) => item[allocationType] > 0
        );

        if (!filteredData || filteredData.length === 0) {
          return [];
        }

        return filteredData.map((item: any) => {
          let quantity = item[allocationType];

          if (item.InventoryUoMEntry !== item.U_tl_uom) {
            const uomList = item.uomLists?.find(
              (list: any) => list.AlternateUoM === item.U_tl_uom
            );
            if (uomList) {
              quantity *= uomList.BaseQuantity;
            } else {
              console.error("UoM conversion factor not found!");
            }
          }

          return {
            ItemCode: item.U_tl_itemcode,
            Quantity: quantity,
            GrossPrice: item.ItemPrice,
            DiscountPercent: 0,
            TaxCode: "VO10",
            UoMEntry: item.InventoryUoMEntry,
            LineOfBussiness: "201001",
            RevenueLine: "202004",
            ProductLine: "203004",
            BinAbsEntry: item.U_tl_bincode,
            // BranchCode: data.U_tl_bplid,
            WarehouseCode: item.U_tl_whs,
            DocumentLinesBinAllocations: [
              {
                BinAbsEntry: item.U_tl_bincode,
                Quantity: quantity,
                AllowNegativeQuantity: "tNO",
              },
            ],
          };
        });
      };

      const DocumentLines = data?.Items?.map((item: any) => {
        let quantity = item["Quantity"];

        if (item.InventoryUoMEntry !== item.UomAbsEntry) {
          const uomList = item.uomLists?.find(
            (list: any) => list.AlternateUoM === item.UomAbsEntry
          );
          if (uomList) {
            quantity *= uomList.BaseQuantity;
          } else {
            console.error("UoM conversion factor not found!");
          }
        }

        return {
          ItemCode: item.ItemCode,
          Quantity: quantity,
          GrossPrice: item.GrossPrice,
          DiscountPercent: item.DiscountPercent,
          TaxCode: "VO10",
          UoMEntry: item.InventoryUoMEntry,
          LineOfBussiness: "201001", // item.LineOfBussiness
          RevenueLine: "202004", // item.RevenueLine
          ProductLine: "203004", // item.ProductLine
          BinAbsEntry:
            item.BinAbsEntry === undefined || item.BinAbsEntry === null
              ? data.U_tl_bincode
              : item.BinAbsEntry,
          // BranchCode: data.U_tl_bplid,
          WarehouseCode: item.WarehouseCode,
          DocumentLinesBinAllocations: [
            {
              BinAbsEntry:
                item.BinAbsEntry === undefined || item.BinAbsEntry === null
                  ? data.U_tl_bincode
                  : item.BinAbsEntry,
              Quantity: quantity,
              AllowNegativeQuantity: "tNO",
            },
          ],
        };
      });
      const cashSaleItems = data?.allocationData?.filter(
        (item: any) => item.U_tl_cashallow > 0
      );

      const cashSale = cashSaleItems?.map((item: any) => ({
        ItemCode: item.U_tl_itemcode,
        Quantity: item.U_tl_cashallow,
        GrossPrice: item.ItemPrice,
        DiscountPercent: 0,
        TaxCode: "VO10",
        UoMEntry: item.U_tl_uom,
        LineOfBussiness: "201001", // item.LineOfBussiness
        RevenueLine: "202004", // item.RevenueLine
        ProductLine: "203004", // item.ProductLine
        BinAbsEntry: item.U_tl_bincode,
        // BranchCode: data.U_tl_bplid,
        WarehouseCode: item.U_tl_whs,
        DocumentLinesBinAllocations: [
          {
            BinAbsEntry: item.U_tl_bincode,
            Quantity: item.U_tl_cashallow,
            AllowNegativeQuantity: "tNO",
          },
        ],
      }));
      const cashSales = [...cashSale, DocumentLines];

      const PostPayload = {
        SaleDocEntry: docEntry,
        // data.docEntry,
        ToWarehouse: data?.U_tl_whs,
        // U_tl_whsdesc: "WHC",
        U_tl_whsdesc: data?.U_tl_whs,
        InvoiceSeries: data?.INSeries,
        IncomingSeries: data?.DNSeries,
        DocDate: new Date(),
        DocCurrency: "USD",
        DocRate: data?.ExchangeRate === 0 ? "4100" : data?.ExchangeRate,
        CardCode: data?.CardCode,
        CardName: data?.CardName,
        DiscountPercent: 0.0,
        BPL_IDAssignedToInvoice: data?.U_tl_bplid,
        CashAccount: "110102",
        CashAccountFC: "110103",
        TransferAccount: "110102",
        TransferAccountFC: "110103",
        CheckAccount: "110102",
        CouponAccount: "110102",
        Remarks: data.Remark,

        IncomingPayment: [
          ...(data?.cashBankData || [])
            .map((item: any) => ({
              Type: item.U_tl_paytype,
              DocCurrency: item.U_tl_paycur,
              Amount: item.U_tl_amtcash || item.U_tl_amtbank,
            }))
            .filter((item: any) => item.Amount > 0),
          ...(data?.checkNumberData || [])
            .map((item: any) => ({
              Type: item.U_tl_paytype,
              DocCurrency: item.U_tl_paycur,
              DueDate: item.U_tl_checkdate || new Date(),
              Amount: item.U_tl_amtcheck === "" ? 0 : item.U_tl_amtcheck,
              Bank: item.U_tl_checkbank,
              CheckNum: item.U_tl_acccheck,
            }))
            .filter((item: any) => item.Amount > 0),
        ],
        IncomingPaymentCoupon: [
          ...(data?.couponData || [])
            .map((item: any) => ({
              Type: item.U_tl_paytype,
              DocCurrency: item.U_tl_paycur,
              DueDate: new Date(),
              Amount: item.U_tl_amtcoupon === "" ? 0 : item.U_tl_amtcoupon,
              // CounNum: item.U_tl_acccoupon,
            }))
            .filter((item: any) => item.Amount > 0),
        ],

        StockAllocation: (() => {
          const uniqueItemsMap = new Map();

          data?.stockAllocationData?.forEach((item: any) => {
            let quantity = parseFloat(item.U_tl_qtyaloc);

            if (quantity >= 0 && !isNaN(quantity)) {
              if (item.InventoryUoMEntry !== item.U_tl_uom) {
                const uomList = item.uomLists?.find(
                  (list: any) => list.AlternateUoM === item.U_tl_uom
                );
                if (uomList) {
                  quantity *= uomList.BaseQuantity;
                } else {
                  console.error("UoM conversion factor not found!");
                }
              }

              if (uniqueItemsMap.has(item.U_tl_itemcode)) {
                const existingQuantity = uniqueItemsMap.get(item.U_tl_itemcode);
                uniqueItemsMap.set(
                  item.U_tl_itemcode,
                  existingQuantity + quantity
                );
              } else {
                uniqueItemsMap.set(item.U_tl_itemcode, quantity);
              }
            }
          });

          const stockAllocation = Array.from(uniqueItemsMap)
            .map(([itemCode, quantity]) => {
              if (quantity >= 0) {
                return {
                  ItemCode: itemCode,
                  Quantity: quantity.toString(),
                  DiscountPercent: 0,
                  TaxCode: "VO10",
                  LineOfBussiness: "201001",
                  RevenueLine: "202004",
                  ProductLine: "203004",
                  BinAbsEntry: data.stockAllocationData[0].U_tl_bincode,
                  BranchCode: data.stockAllocationData[0].U_tl_bplid,
                  WarehouseCode: data.stockAllocationData[0].U_tl_whs,
                  DocumentLinesBinAllocations: [
                    {
                      BinAbsEntry: data.stockAllocationData[0].U_tl_bincode,
                      Quantity: quantity.toString(),
                      AllowNegativeQuantity: "tNO",
                    },
                  ],
                };
              }
            })
            .filter(Boolean); // Filter out undefined items

          return stockAllocation;
        })(),
        CardCount: [].concat(
          ...data?.cardCountData?.map((item: any) => {
            const mappedData = [];
            const itemCode = item.U_tl_itemcode;
            for (let i = 1; i <= 50; i++) {
              // considering up to 50L
              const quantityKey = `U_tl_${i}l`;
              const allowKey = `U_tl_${i}l`;
              if (item[quantityKey]) {
                let quantity = parseFloat(item[quantityKey]);
                let allow = parseFloat(item[allowKey]);
                if (quantity > 0) {
                  // Adjust quantity based on the specified rules
                  if (i > 1) {
                    quantity /= i;
                    allow /= i;
                  }
                  mappedData.push({
                    ItemCode: `${itemCode}-${i.toString().padStart(2, "0")}`,
                    Quantity: quantity,
                    UoMEntry: data.nozzleData?.find(
                      (e: any) => e.U_tl_itemcode === item.U_tl_itemcode
                    )?.U_tl_uom,
                    LineOfBussiness: "201001", // item.LineOfBussiness
                    RevenueLine: "202004", // item.RevenueLine
                    ProductLine: "203004", // item.ProductLine
                    // BinAbsEntry: data.U_tl_bincode,
                    U_tl_bincode: edit
                      ? data.dispenser.TL_DISPENSER_LINESCollection?.find(
                          (e: any) => e.U_tl_itemnum === item.U_tl_itemcode
                        )?.U_tl_bincode
                      : data.nozzleData?.find(
                          (e: any) => e.U_tl_itemcode === item.U_tl_itemcode
                        )?.U_tl_bincode,
                    WarehouseCode: data.U_tl_whs,
                    DocumentLinesBinAllocations: [
                      {
                        BinAbsEntry: edit
                          ? data.dispenser.TL_DISPENSER_LINESCollection?.find(
                              (e: any) => e.U_tl_itemnum === item.U_tl_itemcode
                            )?.U_tl_bincode
                          : data.nozzleData?.find(
                              (e: any) => e.U_tl_itemcode === item.U_tl_itemcode
                            )?.U_tl_bincode,
                        Quantity: quantity,
                        AllowNegativeQuantity: "tNO",
                      },
                    ],
                  });
                }
              }
            }
            return mappedData;
          })
        ),

        CashSale: cashSales?.length > 0 ? cashSales : [],
        Partnership: generateAllocationPayload(data, "U_tl_partallow"),
        StockTransfer: generateAllocationPayload(data, "U_tl_stockallow"),
        OwnUsage: generateAllocationPayload(data, "U_tl_ownallow"),
        TelaCard: generateAllocationPayload(data, "U_tl_cardallow"),
        PumpTest: generateAllocationPayload(data, "U_tl_pumpallow"),
      };

      await request("POST", "/script/test/LubeCashSales", PostPayload);
      this.dialog.current?.success("Create Successfully.", docEntry);
    } catch (error: any) {
      if (!this.dialog.current) {
        console.error("Dialog component reference is not set properly.");
        return;
      }

      if (error instanceof FormValidateException) {
        this.dialog.current?.error(error.message, "Invalid");
        this.setState({ ...data, isSubmitting: false, tapIndex: error.tap });
      } else {
        this.dialog.current?.error(error?.toString() ?? "An error occurred");
      }
    } finally {
      this.setState({ isSubmitting: false });
    }
  }
  async handlerChangeMenu(index: number) {
    this.setState({ ...this.state, tapIndex: index });
  }

  handleNextTab = () => {
    const currentTab = this.state.tapIndex;
    const requiredFields = this.getRequiredFieldsByTab(currentTab);
    const hasErrors = requiredFields.some((field: any) => {
      if (field === "Items") {
        // Check if the "Items" array is empty
        return !this.state[field] || this.state[field].length === 0;
      }
      return !this.state[field];
    });

    if (hasErrors) {
      // Show the dialog if there are errors
      this.setState({ isDialogOpen: true });
    } else {
      // If no errors, allow the user to move to the next tab
      this.handlerChangeMenu(currentTab + 1);
    }
  };

  handleCloseDialog = () => {
    // Close the dialog
    this.setState({ isDialogOpen: false });
  };

  getRequiredFieldsByTab(tabIndex: number): string[] {
    const requiredFieldsMap: { [key: number]: string[] } = {
      // 0: ["CardCode"],
      1: [],
      2: [],
      3: [],
    };
    return requiredFieldsMap[tabIndex] || [];
  }

  handleMenuButtonClick = (index: any) => {
    const requiredFields = this.getRequiredFieldsByTab(index - 1);
    const hasErrors = requiredFields.some((field) => {
      if (field === "Items") {
        return !this.state[field] || this.state[field].length === 0;
      }
      return !this.state[field];
    });

    if (hasErrors) {
      this.setState({ isDialogOpen: true });
    } else {
      this.setState({ tapIndex: index });
    }
  };
  HeaderTaps = () => {
    return (
      <>
        <div className="w-full flex justify-start">
          <MenuButton
            active={this.state.tapIndex === 0}
            onClick={() => this.handleMenuButtonClick(0)}
          >
            <span className="flex">Basic Information</span>
          </MenuButton>
          <MenuButton
            active={this.state.tapIndex === 1}
            onClick={() => this.handleMenuButtonClick(1)}
          >
            <span>Consumption</span>
          </MenuButton>
          <MenuButton
            active={this.state.tapIndex === 2}
            onClick={() => this.handleMenuButtonClick(2)}
          >
            Unit Sale
          </MenuButton>
          <MenuButton
            active={this.state.tapIndex === 3}
            onClick={() => this.handleMenuButtonClick(3)}
          >
            <span> Incoming Payment</span>
          </MenuButton>
          <MenuButton
            active={this.state.tapIndex === 4}
            onClick={() => this.handleMenuButtonClick(4)}
          >
            <span> Stock Allocation</span>
          </MenuButton>
          <MenuButton
            active={this.state.tapIndex === 5}
            onClick={() => this.handleMenuButtonClick(5)}
          >
            <span>Card Count</span>
          </MenuButton>
          <MenuButton
            active={this.state.tapIndex === 6}
            onClick={() => this.handleMenuButtonClick(6)}
          >
            <span>Error Log</span>
          </MenuButton>
        </div>

        <Snackbar
          open={this.state.isDialogOpen}
          autoHideDuration={6000}
          onClose={this.handleCloseDialog}
        >
          <Alert
            onClose={this.handleCloseDialog}
            severity="error"
            sx={{ width: "100%" }}
          >
            {this.state.message}
            Please complete all required fields before proceeding to the next
            tab.
          </Alert>
        </Snackbar>
      </>
    );
  };

  hanndAddNewItem() {
    if (!this.state?.CardCode) return;
    if (this.state.DocType === "dDocument_Items")
      return this.itemModalRef.current?.onOpen(
        this.state?.CardCode,
        "sale",
        this.state.warehouseCode,
        this.state.Currency
      );
  }

  FormRender = () => {
    const itemGroupCode = 102;
    const navigate = useNavigate();
    const priceList = 13;
    return (
      <>
        <ItemModalComponent
          type="sale"
          group={itemGroupCode}
          onOk={this.handlerConfirmItem}
          ref={this.itemModalRef}
          priceList={priceList}
          U_ti_revenue={this.state.U_ti_revenue}
        />
        <form
          id="formData"
          onSubmit={this.handlerSubmit}
          className="h-full w-full flex flex-col gap-4 relative"
        >
          <div className="w-full h-full flex items-center justify-center">
            {this.state.loading ? (
              <div className="flex items-center justify-center">
                <CircularProgress />
              </div>
            ) : (
              <>
                <div className="grow">
                  <motion.div
                    key={this.state.tapIndex}
                    transition={{ duration: 0.2 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {this.state.tapIndex === 0 && (
                      <GeneralForm
                        data={this.state}
                        edit={this.props?.edit}
                        handlerChange={(key, value) =>
                          this.handlerChange(key, value)
                        }
                        handlerChangeObject={(value) =>
                          this.handlerChangeObject(value)
                        }
                      />
                    )}
                    {this.state.tapIndex === 1 && (
                      <Consumption
                        data={this.state}
                        handlerChange={this.handlerChange}
                        edit={this.props?.edit}
                        handlerChangeObject={(value) =>
                          this.handlerChangeObject(value)
                        }
                      />
                    )}

                    {this.state.tapIndex === 2 && (
                      <ContentForm
                        data={this.state}
                        handlerAddItem={() => {
                          this.hanndAddNewItem();
                        }}
                        handlerRemoveItem={(items: any[]) =>
                          this.setState({ ...this.state, Items: items })
                        }
                        handlerChangeItem={this.handlerChangeItems}
                        onChangeItemByCode={this.handlerChangeItemByCode}
                        onChange={this.handlerChange}
                        ContentLoading={undefined}
                        edit={this.props?.edit}
                      />
                    )}

                    {this.state.tapIndex === 3 && (
                      <IncomingPaymentForm
                        data={this.state}
                        edit={this.props?.edit}
                        handlerChange={(key, value) => {
                          this.handlerChange(key, value);
                        }}
                      />
                    )}
                    {this.state.tapIndex === 4 && (
                      <StockAllocationTable
                        data={this.state}
                        edit={this.props?.edit}
                        onChange={(key, value) =>
                          this.handlerChange(key, value)
                        }
                        handlerChangeObject={(value) =>
                          this.handlerChangeObject(value)
                        }
                      />
                    )}
                    {this.state.tapIndex === 5 && (
                      <CardCount
                        handlerChangeObject={(value) =>
                          this.handlerChangeObject(value)
                        }
                        data={this.state}
                        edit={this.props?.edit}
                        onChange={(key, value) =>
                          this.handlerChange(key, value)
                        }
                      />
                    )}
                    {this.state.tapIndex === 6 && (
                      <ErrorLogForm
                        data={this.state}
                        edit={this.props?.edit}
                        handlerChange={(key, value) =>
                          this.handlerChange(key, value)
                        }
                      />
                    )}
                    <div className="sticky w-full bottom-4 mt-2">
                      <div className="backdrop-blur-sm bg-white p-4 rounded-lg shadow-lg z-[1000] flex justify-end gap-3 border drop-shadow-sm">
                        <div className="flex gap-2">
                          <LoadingButton
                            onClick={() => navigate(-1)}
                            variant="outlined"
                            size="small"
                            sx={{ height: "30px", textTransform: "none" }}
                            disableElevation
                          >
                            <span className="px-3 text-[13px] py-1 text-red-500 font-no">
                              Cancel
                            </span>
                          </LoadingButton>
                        </div>
                        <div>
                          <LoadingButton
                            variant="outlined"
                            size="small"
                            type="submit"
                            sx={{ height: "30px", textTransform: "none" }}
                            disableElevation
                            // disabled={this.props.edit}
                          >
                            <span className="px-3 text-[13px] py-1 text-green-500">
                              {this.props.edit ? "Update" : "Add"}
                            </span>
                          </LoadingButton>
                        </div>
                        {
                          <div className="flex items-center space-x-4">
                            <LoadingButton
                              onClick={(event) =>
                                this.handlerSubmitPost(event, this.props.edit)
                              }
                              sx={{ height: "30px", textTransform: "none" }}
                              className="bg-white"
                              loading={false}
                              // disabled={this.state.tapIndex < 4}
                              size="small"
                              variant="contained"
                              disableElevation
                            >
                              <span className="px-6 text-[13px] py-4 text-white">
                                Post
                              </span>
                            </LoadingButton>
                          </div>
                        }
                      </div>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </div>
        </form>
      </>
    );
  };
}

export default withRouter(SalesOrderForm);

const getItem = (
  items: any,
  type: any,
  warehouseCode: any,
  BinLocation: any,
  LineOfBussiness: any,
  U_ti_revenue: any
) =>
  items?.map((item: any, index: number) => {
    return {
      ItemCode: item.ItemCode || null,
      Quantity: item.Quantity || null,
      GrossPrice: item.GrossPrice || item.total,
      DiscountPercent: item.DiscountPercent || 0,
      // TaxCode: item.VatGroup || item.taxCode || null,
      VatGroup: item.VatGrup,
      // UoMCode: item.UomGroupCode || null,
      UoMEntry: item.UomAbsEntry || null,
      UomAbsEntry: item.UomAbsEntry,
      LineOfBussiness: LineOfBussiness,
      // RevenueLine: item.revenueLine ?? "202001",
      // ProductLine: item.REV ?? "203004",
      COGSCostingCode: item.COGSCostingCode ?? "201001",
      COGSCostingCode2: U_ti_revenue,
      COGSCostingCode3: item.COGSCostingCode3 ?? "203004",
      // BinAbsEntry: item.BinAbsEntry ?? 65,
      WarehouseCode: item?.WarehouseCode || warehouseCode,
      DocumentLinesBinAllocations: [
        {
          BinAbsEntry: item.BinAbsEntry,
          Quantity: item.Quantity,
          AllowNegativeQuantity: "tNO",
          SerialAndBatchNumbersBaseLine: -1,
          BaseLineNumber: index,
        },
      ],
    };
  });
interface AllocationDataItem {
  U_tl_itemcode: string;
  U_tl_stockallow?: number;
}

interface StockAllocationDataItem {
  U_tl_itemcode: string;
  U_tl_consqty: number;
  U_tl_alocqty?: number;
  U_tl_bincode: any;
  U_tl_bplid: number;
  U_tl_whscode: any;
}

function validateData(
  allocationData: AllocationDataItem[],
  stockAllocationData: StockAllocationDataItem[]
): { isValid: boolean; message: string } {
  // Check if allocationData has at least one item with valid U_tl_itemcode and U_tl_stockallow > 0
  const hasValidAllocationData = allocationData.some(
    (item) =>
      item.U_tl_itemcode && item.U_tl_stockallow && item.U_tl_stockallow > 0
  );

  if (!hasValidAllocationData) {
    return {
      isValid: true,
      message: "No validation required for Stock Allocation Data.",
    };
  }

  const hasStockAllowData = allocationData.some(
    (item) => item.U_tl_stockallow !== undefined && item.U_tl_stockallow > 0
  );

  if (!hasStockAllowData) {
    return {
      isValid: true,
      message: "No Stock Allocation Data validation required.",
    };
  }

  const itemcodeAllocationMap = new Map<string, number>();

  allocationData.forEach((item) => {
    const { U_tl_itemcode, U_tl_stockallow } = item;
    if (U_tl_itemcode && U_tl_stockallow) {
      const existingTotal = itemcodeAllocationMap.get(U_tl_itemcode) || 0;
      itemcodeAllocationMap.set(U_tl_itemcode, existingTotal + U_tl_stockallow);
    }
  });

  const isValid = [...itemcodeAllocationMap.entries()].every(
    ([itemcode, expectedTotalAllow]) => {
      const rowsWithSameItemCode = stockAllocationData.filter(
        (r) => r.U_tl_itemcode === itemcode
      );

      if (rowsWithSameItemCode.length === 0) {
        const message = `No entries found in stock Allocation Data for Item Code: ${itemcode}`;
        console.log(message);
        throw new FormValidateException(message, 3);
      }

      const totalQuantity = rowsWithSameItemCode.reduce(
        (sum, r) => sum + parseFloat((r.U_tl_alocqty || 0).toString()),
        0
      );

      const firstQuantity = rowsWithSameItemCode[0]?.U_tl_consqty || 0;

      const isValid =
        totalQuantity === firstQuantity && totalQuantity === expectedTotalAllow;

      if (!isValid) {
        const message = `Stock Allocation does not match the totals in Allocation Data for Item Code: ${itemcode}`;
        console.log(message);
        throw new FormValidateException(message, 3);
      }

      return isValid;
    }
  );
  // Check for required fields in stockAllocationData
  const hasMissingFields = stockAllocationData.some(
    (item) =>
      !item.U_tl_whscode ||
      !item.U_tl_bincode ||
      !item.U_tl_bplid ||
      !item.U_tl_itemcode ||
      !item.U_tl_alocqty
  );

  if (hasMissingFields) {
    const message =
      "One or more required fields are missing in Stock Allocation Data.";
    throw new FormValidateException(message, 3);
  }
  return {
    isValid,
    message: isValid
      ? "Stock Allocation Data is valid."
      : "Stock Allocation Data does not match the totals in Allocation Data.",
  };
}
interface AllocationDataItem {
  U_tl_itemcode: string;
  U_tl_cardallow?: number;
}

interface CardCountDataItem {
  U_tl_itemcode: string;
  U_tl_1l?: number;
  U_tl_2l?: number;
  U_tl_5l?: number;
  U_tl_10l?: number;
  U_tl_20l?: number;
  U_tl_50l?: number;
  U_tl_total: number;
  U_tl_cardallow?: number;
}

function commaFormatNum(num: number | string): number {
  // Implement the logic for commaFormatNum function
  return typeof num === "string" ? parseFloat(num.replace(/,/g, "")) : num;
}
function validateCardCountData(
  allocationData: AllocationDataItem[],
  cardCountData: CardCountDataItem[]
): { isValid: boolean; message: string } {
  const itemcodeCardAllowMap = new Map<string, number>();

  allocationData.forEach((item) => {
    const { U_tl_itemcode, U_tl_cardallow } = item;
    if (U_tl_itemcode && U_tl_cardallow !== undefined) {
      itemcodeCardAllowMap.set(U_tl_itemcode, U_tl_cardallow);
    }
  });

  const isValid = cardCountData.every((item) => {
    const { U_tl_itemcode } = item;
    const expectedCardAllow = itemcodeCardAllowMap.get(U_tl_itemcode) || 0;

    const total =
      (item.U_tl_1l || 0) +
      (item.U_tl_2l || 0) +
      (item.U_tl_5l || 0) +
      (item.U_tl_10l || 0) +
      (item.U_tl_20l || 0) +
      (item.U_tl_50l || 0);

    if (total !== expectedCardAllow) {
      return false;
    }

    return true;
  });

  const message = isValid
    ? "Card Count Data is valid."
    : `Card Count Data does not match the Tela Card values in Allocation Data. ${getErrorDetails(cardCountData, itemcodeCardAllowMap)}`;

  return {
    isValid,
    message,
  };
}

function getErrorDetails(
  cardCountData: CardCountDataItem[],
  itemcodeCardAllowMap: Map<string, number>
): string {
  const errors: string[] = [];
  cardCountData.forEach((item) => {
    const { U_tl_itemcode } = item;
    const expectedCardAllow = itemcodeCardAllowMap.get(U_tl_itemcode) || 0;
    const total =
      (item.U_tl_1l || 0) +
      (item.U_tl_2l || 0) +
      (item.U_tl_5l || 0) +
      (item.U_tl_10l || 0) +
      (item.U_tl_20l || 0) +
      (item.U_tl_50l || 0);
    if (total !== expectedCardAllow) {
      errors.push(
        `Invalid total for Item ${U_tl_itemcode}. Expected: ${expectedCardAllow}, Actual: ${total}`
      );
    }
  });
  return errors.join("\n");
}
