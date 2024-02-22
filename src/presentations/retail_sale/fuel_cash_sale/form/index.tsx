import CoreFormDocument from "@/components/core/CoreFormDocument";
import { withRouter } from "@/routes/withRouter";
import { LoadingButton } from "@mui/lab";
import MenuButton from "@/components/button/MenuButton";
import { FormValidateException } from "@/utilies/error";
import LoadingProgress from "@/components/LoadingProgress";
import GeneralForm from "../components/GeneralForm";
import request from "@/utilies/request";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import BusinessPartner from "@/models/BusinessParter";
import { Alert, Button, CircularProgress, Snackbar } from "@mui/material";
import Consumption from "../components/Consumption";
import StockAllocationForm from "../components/StockAllocationForm";
import IncomingPaymentForm from "../components/IncomingPayment";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import CardCount from "../components/CardCountTable";
import NonCoreDcument from "@/components/core/NonCoreDocument";
import { motion } from "framer-motion";

class Form extends NonCoreDcument {
  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
      showCollapse: false,
      nozzleData: [],
      PriceList: 2,
      U_tl_bplid: 1,
      dispenserData: [],
      U_tl_docdate: new Date(),
      allocationData: [],
      cashBankData: [
        {
          U_tl_paytype: "cash",
          U_tl_paycur: "USD",
          U_tl_amtcash: "",
          U_tl_amtbank: "",
        },
      ],
      checkNumberData: [
        {
          U_tl_acccheck: "111122",
          U_tl_checkdate: new Date(),
          U_tl_checkbank: "",
          U_tl_paytype: "check",
          U_tl_amtcheck: "",
          U_tl_paycur: "USD",
        },
      ],
      couponData: [
        {
          U_tl_acccoupon: "101111",
          U_tl_amtcoupon: "",
          U_tl_paycur: "USD",
          U_tl_paytype: "coupon",
        },
      ],
    } as any;

    this.onInit = this.onInit.bind(this);
    this.handlerSubmit = this.handlerSubmit.bind(this);
    this.handlerSubmitPost = this.handlerSubmitPost.bind(this);
    this.handlerChangeMenu = this.handlerChangeMenu.bind(this);
  }

  componentDidMount(): void {
    this.setState({ loading: true });
    this.onInit();
  }

  async onInit() {
    let state: any = { ...this.state };

    let seriesList = await DocumentSerieRepository.getDocumentSeries({
      Document: "TL_RETAILSALE",
    });
    console.log(seriesList);
    if (this.props.edit) {
      const { id }: any = this.props?.match?.params || 0;
      await request("GET", `TL_RETAILSALE(${id})`)
        .then(async (res: any) => {
          const data: any = res?.data;
          // vendor
          console.log(data);
          const vendor: any = await request(
            "GET",
            `/BusinessPartners('${data?.U_tl_cardcode}')`
          )
            .then((res: any) => new BusinessPartner(res?.data, 0))
            .catch((err: any) => console.log(err));

          state = {
            ...data,
            vendor,
            CardCode: data.U_tl_cardcode,
            CardName: data.U_tl_cardname,
            seriesList,
            nozzleData: data.TL_RETAILSALE_CONHCollection,

            allocationData: data.TL_RETAILSALE_CONHCollection,

            stockAllocationData: data?.TL_RETAILSALE_STACollection?.map(
              (item: any) => ({
                U_tl_bplid: item.U_tl_bplid || 1,
                U_tl_itemcode: item.U_tl_itemcode,
                U_tl_itemname: item.U_tl_itemname,
                U_tl_qtyaloc: item.U_tl_qtyaloc,
                U_tl_qtycon: item.U_tl_qtycon,
                U_tl_qtyopen: item.U_tl_qtyopen,
                U_tl_remark: item.U_tl_remark,
                U_tl_uom: item.U_tl_uom,
                U_tl_whs: item.U_tl_whs,
                U_tl_bincode: item.U_tl_bincode,
              })
            ),
            cashBankData: data?.TL_RETAILSALE_INCCollection?.filter(
              (e: any) => e.U_tl_paytype === "cash" || e.U_tl_paytype === "bank"
            )?.map((item: any) => ({
              U_tl_acccash: item.U_tl_acccash,
              U_tl_acccoupon: item.U_tl_acccoupon,
              U_tl_accbank: item?.U_tl_accbank,
              U_tl_amtcash: item?.U_tl_amtcash,
              U_tl_amtbank: item?.U_tl_amtbank,
              U_tl_paytype: item?.U_tl_paytype,
              U_tl_paycur: item?.U_tl_paycur,
            })),

            checkNumberData: data?.TL_RETAILSALE_INCCollection?.filter(
              (e: any) => e.U_tl_paytype === "check"
            )?.map((item: any) => ({
              U_tl_acccheck: item.U_tl_acccheck,
              U_tl_amtcheck: item?.U_tl_amtcheck,
              U_tl_paytype: item?.U_tl_paytype,
              U_tl_paycur: item?.U_tl_paycur,
              U_tl_checkdate: item?.U_tl_checkdate,
              U_tl_checkbank: item?.U_tl_checkbank,
            })),

            couponData: data?.TL_RETAILSALE_INCCollection?.filter(
              (e: any) => e.U_tl_paytype === "coupon"
            )?.map((item: any) => ({
              U_tl_acccoupon: item.U_tl_acccoupon,
              U_tl_accbank: item?.U_tl_accbank,
              U_tl_amtcoupon: item?.U_tl_amtcoupon,
              U_tl_paytype: item?.U_tl_paytype,
              U_tl_paycur: item?.U_tl_paycur,
            })),
            cardCountData: data?.TL_RETAILSALE_CACCollection?.map(
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
          };
        })
        .catch((err: any) => console.log(err))
        .finally(() => {
          state["loading"] = false;
          state["seriesList"] = seriesList;
          state["isLoadingSerie"] = false;
          this.setState(state);
          console.log(state);
        });
    } else {
      state["seriesList"] = seriesList;
      state["loading"] = false;

      state["isLoadingSerie"] = false;
      this.setState(state);
      console.log(state);
    }
  }

  async handlerSubmit(event: any) {
    event.preventDefault();
    const data: any = { ...this.state };

    try {
      this.setState({ ...this.state, isSubmitting: true });
      await new Promise((resolve) => setTimeout(() => resolve(""), 800));
      const { id } = this.props?.match?.params || 0;

      const payload = {
        // general
        // Series: data?.Series,
        U_tl_bplid: data?.U_tl_bplid || 1,
        U_tl_pump: data?.U_tl_pump,
        U_tl_cardcode: data?.CardCode,
        U_tl_cardname: data?.CardName,
        U_tl_shiftcode: data?.U_tl_shift_code,
        U_tl_docdate: new Date(),
        U_tl_docduedate: new Date(),
        U_tl_taxdate: new Date(),
        U_tl_attend: data?.U_tl_attend,
        U_tl_status: data?.U_tl_status || "1",
        //Consumption
        TL_RETAILSALE_CONHCollection: data?.allocationData
          ?.filter((e: any) => parseInt(e.U_tl_nmeter) > 0)
          ?.map((item: any) => ({
            U_tl_nozzlecode: item.U_tl_nozzlecode,
            U_tl_itemcode: item.U_tl_itemcode,
            U_tl_itemname: item.U_tl_itemname,
            U_tl_uom: item.U_tl_uom,
            U_tl_nmeter: item.U_tl_nmeter,
            // U_tl_upd_meter: item.U_tl_ometer,
            U_tl_ometer: item.U_tl_upd_meter,
            U_tl_cmeter: item.U_tl_cmeter,
            U_tl_cardallow: item.U_tl_cardallow,
            U_tl_cashallow: item.U_tl_cashallow,
            U_tl_ownallow: item.U_tl_ownallow,
            U_tl_partallow: item.U_tl_partallow,
            U_tl_pumpallow: item.U_tl_pumpallow,
            U_tl_stockallow: item.U_tl_stockallow,
            U_tl_totalallow: item.U_tl_totalallow,
          })),

        //  incoming payment
        TL_RETAILSALE_INCCollection: [
          ...data?.checkNumberData,
          ...data?.cashBankData,
          ...data?.couponData,
        ],
        TL_RETAILSALE_CACCollection: data?.cardCountData?.map((item: any) => ({
          U_tl_itemCode: item.U_tl_itemcode,
          U_tl_1l: item?.U_tl_1l,
          U_tl_2l: item?.U_tl_2l,
          U_tl_5l: item?.U_tl_5l,
          U_tl_10l: item?.U_tl_10l,
          U_tl_20l: item?.U_tl_20l,
          U_tl_50l: item?.U_tl_50l,
          U_tl_total:
            parseFloat(item?.U_tl_1l || 0) +
            parseFloat(item?.U_tl_2l || 0) +
            parseFloat(item?.U_tl_5l || 0) +
            parseFloat(item?.U_tl_10l || 0) +
            parseFloat(item?.U_tl_20l || 0) +
            parseFloat(item?.U_tl_50l || 0),
        })),
        //Stock Allocation Collection
        TL_RETAILSALE_STACollection: data?.stockAllocationData?.map(
          (item: any) => ({
            U_tl_nozzlecode: item.U_tl_nozzlecode,
            U_tl_itemcode: item.U_tl_itemcode,
            U_tl_itemname: item.U_tl_itemname,
            U_tl_qtycon: item.U_tl_qtycon,
            U_tl_qtyaloc: item.U_tl_qtyaloc,
            U_tl_uom: item.U_tl_uom,
            U_tl_qtyopen: item.U_tl_qtyopen,
            U_tl_remark: item.U_tl_remark,
            U_tl_whs: item.U_tl_whs,
            U_tl_bincode: item.U_tl_bincode,
            U_tl_bplid: data.U_tl_bplid || 1,
          })
        ),
      };

      if (id) {
        return await request("PATCH", `/TL_RETAILSALE(${id})`, payload)
          .then((res: any) =>
            this.dialog.current?.success("Update Successfully.", id)
          )
          .catch((err: any) => this.dialog.current?.error(err.message))
          .finally(() => this.setState({ ...this.state, isSubmitting: false }));
      }

      await request("POST", "/TL_RETAILSALE", payload)
        .then((res: any) =>
          this.dialog.current?.success(
            "Create Successfully.",
            res?.data?.DocEntry
          )
        )
        .catch((err: any) => this.dialog.current?.error(err.message))
        .finally(() => this.setState({ ...this.state, isSubmitting: false }));
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

  async handlerSubmitPost(event: any) {
    event.preventDefault();
    const data: any = { ...this.state };

    try {
      this.setState({ ...this.state, isSubmitting: true });
      await new Promise((resolve) => setTimeout(() => resolve(""), 800));

      const PostPayload = {
        SANumber: "123456789", //doc number of fuel cash sale, lube case sale or lPG case sale,
        ToWarehouse: data?.U_tl_whs, // to warehouse take from pump warehouse
        InvoiceSeries: 7638,
        IncomingSeries: 183,
        DocDate: data?.U_tl_taxdate,
        DocCurrency: "USD",
        DocRate: "4000.0",
        CardCode: data?.CardCode,
        CardName: data?.CardName,
        DiscountPercent: 0.0,
        BPL_IDAssignedToInvoice: data?.U_tl_bplid,
        U_tl_whsdesc: "WH0C",
        CashAccount: "110101",
        TransferAccount: "110101",
        CheckAccount: "110101",
        CouponAccount: data?.couponData?.U_tl_amtcoupon,
        Remarks: data.Remark,

        IncomingPayment: [
          ...data?.cashBankData?.map((item: any) => ({
            Type: item.U_tl_paytype,
            DocCurrency: item.U_tl_paycur,
            Amount: item.U_tl_amtcash,
          })),
          ...data?.checkNumberData?.map((item: any) => ({
            Type: item.U_tl_paytype,
            DocCurrency: item.U_tl_paycur,
            DueDate: item.U_tl_checkdate,
            Amount: item.U_tl_amtcash,
            Bank: item.U_tl_checkbank,
            CheckNum: item.U_tl_acccheck,
          })),
        ],
        IncomingPaymentCoupon: [
          ...data?.couponData?.map((item: any) => ({
            Type: item.U_tl_paytype,
            DocCurrency: item.U_tl_paycur,
            DueDate: "",
            Amount: item.U_tl_amtcoupon,
            CounNum: item.U_tl_acccoupon,
          })),
        ],
        StockAllocation: data?.stockAllocationData?.map((item: any) => ({
          ItemCode: item.U_tl_itemcode,
          Quantity: item.U_tl_qtycon,
          GrossPrice: item.ItemPrice,
          DiscountPercent: 0,
          TaxCode: "VO10",
          // UoMCode: "L"
          UoMEntry: item.U_tl_uom,
          LineOfBussiness: "201001", // item.LineOfBussiness
          RevenueLine: "202004", // item.RevenueLine
          ProductLine: "203004", // item.ProductLine
          BinAbsEntry: item.U_tl_bincode,
          BranchCode: item.U_tl_bplid || 1,
          WarehouseCode: item.U_tl_whs,
          DocumentLinesBinAllocations: [
            {
              BinAbsEntry: item.U_tl_bincode,
              Quantity: item.U_tl_qtycon,
              AllowNegativeQuantity: "tNO",
              BaseLineNumber: 0,
            },
          ],
        })),
        CardCount: [].concat(
          ...data?.allocationData?.map((item: any) => {
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
                    GrossPrice: item.ItemPrice,
                    DiscountPercent: 0,
                    TaxCode: "VO10",
                    // UoMCode: "L"
                    UoMEntry: item.U_tl_uom,
                    LineOfBussiness: "201001", // item.LineOfBussiness
                    RevenueLine: "202004", // item.RevenueLine
                    ProductLine: "203004", // item.ProductLine
                    BinAbsEntry: item.U_tl_bincode,
                    BranchCode: item.U_tl_bplid || 1,
                    WarehouseCode: item.U_tl_whs,
                    DocumentLinesBinAllocations: [
                      {
                        BinAbsEntry: item.U_tl_bincode,
                        Quantity: item.U_tl_qtycon,
                        AllowNegativeQuantity: "tNO",
                        BaseLineNumber: 0,
                      },
                    ],
                  });
                }
              }
            }
            return mappedData;
          })
        ),

        // CardCount: [
        //   data?.allocationData?.map((item: any) => ({
        //     ItemCode: item.U_tl_itemcode,
        //     Quantity: item.U_tl_cardallow,
        //     GrossPrice: item.ItemPrice,
        //     DiscountPercent: 0,
        //     TaxCode: "VO10",
        //     // UoMCode: "L"
        //     UoMEntry: item.U_tl_uom,
        //     LineOfBussiness: "201001", // item.LineOfBussiness
        //     RevenueLine: "202004", // item.RevenueLine
        //     ProductLine: "203004", // item.ProductLine
        //     BinAbsEntry: item.U_tl_bincode,
        //     BranchCode: item.U_tl_bplid || 1,
        //     WarehouseCode: item.U_tl_whs,
        //     DocumentLinesBinAllocations: [
        //       {
        //         BinAbsEntry: item.U_tl_bincode,
        //         Quantity: item.U_tl_qtycon,
        //         AllowNegativeQuantity: "tNO",
        //         BaseLineNumber: 0,
        //       },
        //     ],
        //   })),
        // ],
        CashSale: [
          data?.allocationData?.map((item: any) => ({
            ItemCode: item.U_tl_itemcode,
            Quantity: item.U_tl_cashallow,
            GrossPrice: item.ItemPrice,
            DiscountPercent: 0,
            TaxCode: "VO10",
            // UoMCode: "L"
            UoMEntry: item.U_tl_uom,
            LineOfBussiness: "201001", // item.LineOfBussiness
            RevenueLine: "202004", // item.RevenueLine
            ProductLine: "203004", // item.ProductLine
            BinAbsEntry: item.U_tl_bincode,
            BranchCode: item.U_tl_bplid || 1,
            WarehouseCode: item.U_tl_whs,
            DocumentLinesBinAllocations: [
              {
                BinAbsEntry: item.U_tl_bincode,
                Quantity: item.U_tl_cashallow,
                AllowNegativeQuantity: "tNO",
                BaseLineNumber: 0,
              },
            ],
          })),
        ],

        Partnership: [
          data?.allocationData?.map((item: any) => ({
            ItemCode: item.U_tl_itemcode,
            Quantity: item.U_tl_partallow,
            GrossPrice: item.ItemPrice,
            DiscountPercent: 0,
            TaxCode: "VO10",
            // UoMCode: "L"
            UoMEntry: item.U_tl_uom,
            LineOfBussiness: "201001", // item.LineOfBussiness
            RevenueLine: "202004", // item.RevenueLine
            ProductLine: "203004", // item.ProductLine
            BinAbsEntry: item.U_tl_bincode,
            BranchCode: item.U_tl_bplid || 1,
            WarehouseCode: item.U_tl_whs,
            DocumentLinesBinAllocations: [
              {
                BinAbsEntry: item.U_tl_bincode,
                Quantity: item.U_tl_partallow,
                AllowNegativeQuantity: "tNO",
                BaseLineNumber: 0,
              },
            ],
          })),
        ],
        StockTransfer: [
          data?.allocationData?.map((item: any) => ({
            ItemCode: item.U_tl_itemcode,
            Quantity: item.U_tl_stockallow,
            GrossPrice: item.ItemPrice,
            DiscountPercent: 0,
            TaxCode: "VO10",
            // UoMCode: "L"
            UoMEntry: item.U_tl_uom,
            LineOfBussiness: "201001", // item.LineOfBussiness
            RevenueLine: "202004", // item.RevenueLine
            ProductLine: "203004", // item.ProductLine
            BinAbsEntry: item.U_tl_bincode,
            BranchCode: item.U_tl_bplid || 1,
            WarehouseCode: item.U_tl_whs,
            DocumentLinesBinAllocations: [
              {
                BinAbsEntry: item.U_tl_bincode,
                Quantity: item.U_tl_stockallow,
                AllowNegativeQuantity: "tNO",
                BaseLineNumber: 0,
              },
            ],
          })),
        ],

        OwnUsage: [
          data?.allocationData?.map((item: any) => ({
            ItemCode: item.U_tl_itemcode,
            Quantity: item.U_tl_ownallow,
            GrossPrice: item.ItemPrice,
            DiscountPercent: 0,
            TaxCode: "VO10",
            // UoMCode: "L"
            UoMEntry: item.U_tl_uom,
            LineOfBussiness: "201001", // item.LineOfBussiness
            RevenueLine: "202004", // item.RevenueLine
            ProductLine: "203004", // item.ProductLine
            BinAbsEntry: item.U_tl_bincode,
            BranchCode: item.U_tl_bplid || 1,
            WarehouseCode: item.U_tl_whs,
            DocumentLinesBinAllocations: [
              {
                BinAbsEntry: item.U_tl_bincode,
                Quantity: item.U_tl_ownallow,
                AllowNegativeQuantity: "tNO",
                BaseLineNumber: 0,
              },
            ],
          })),
        ],
        TelaCard: [
          data?.allocationData?.map((item: any) => ({
            ItemCode: item.U_tl_itemcode,
            Quantity: item.U_tl_cardallow,
            GrossPrice: item.ItemPrice,
            DiscountPercent: 0,
            TaxCode: "VO10",
            // UoMCode: "L"
            UoMEntry: item.U_tl_uom,
            LineOfBussiness: "201001", // item.LineOfBussiness
            RevenueLine: "202004", // item.RevenueLine
            ProductLine: "203004", // item.ProductLine
            BinAbsEntry: item.U_tl_bincode,
            BranchCode: item.U_tl_bplid || 1,
            WarehouseCode: item.U_tl_whs,
            DocumentLinesBinAllocations: [
              {
                BinAbsEntry: item.U_tl_bincode,
                Quantity: item.U_tl_cardallow,
                AllowNegativeQuantity: "tNO",
                BaseLineNumber: 0,
              },
            ],
          })),
        ],

        PumpTest: [
          data?.allocationData?.map((item: any) => ({
            ItemCode: item.U_tl_itemcode,
            Quantity: item.U_tl_pumpallow,
            GrossPrice: item.ItemPrice,
            DiscountPercent: 0,
            TaxCode: "VO10",
            // UoMCode: "L"
            UoMEntry: item.U_tl_uom,
            LineOfBussiness: "201001", // item.LineOfBussiness
            RevenueLine: "202004", // item.RevenueLine
            ProductLine: "203004", // item.ProductLine
            BinAbsEntry: item.U_tl_bincode,
            BranchCode: item.U_tl_bplid || 1,
            WarehouseCode: item.U_tl_whs,
            DocumentLinesBinAllocations: [
              {
                BinAbsEntry: item.U_tl_bincode,
                Quantity: item.U_tl_pumpallow,
                AllowNegativeQuantity: "tNO",
                BaseLineNumber: 0,
              },
            ],
          })),
        ],
      };

      await request("POST", "/TL_RETAILSALE", PostPayload)
        .then((res: any) =>
          this.dialog.current?.success(
            "Create Successfully.",
            res?.data?.DocEntry
          )
        )
        .catch((err: any) => this.dialog.current?.error(err.message))
        .finally(() => this.setState({ ...this.state, isSubmitting: false }));
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

  async handlerChangeMenu(index: number) {
    this.setState({ ...this.state, tapIndex: index });
  }

  handleCloseDialog = () => {
    this.setState({ isDialogOpen: false });
  };

  getRequiredFieldsByTab(tabIndex: number): string[] {
    const requiredFieldsMap: { [key: number]: string[] } = {
      0: ["U_tl_pump", "CardCode", "U_tl_attend"],
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
            Consumption
          </MenuButton>
          <MenuButton
            active={this.state.tapIndex === 2}
            onClick={() => this.handleMenuButtonClick(2)}
          >
            <span> Incoming Payment</span>
          </MenuButton>
          <MenuButton
            active={this.state.tapIndex === 3}
            onClick={() => this.handleMenuButtonClick(3)}
          >
            <span> Stock Allocation</span>
          </MenuButton>
          <MenuButton
            active={this.state.tapIndex === 4}
            onClick={() => this.handleMenuButtonClick(4)}
          >
            <span>Card Count</span>
          </MenuButton>
          <MenuButton
            active={this.state.tapIndex === 5}
            onClick={() => this.handleMenuButtonClick(5)}
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
            Please complete all required fields before proceeding to the next
            tab.
          </Alert>
        </Snackbar>
      </>
    );
  };

  FormRender = () => {
    const navigate = useNavigate();
    return (
      <>
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
                        handlerChange={(key, value) =>
                          this.handlerChange(key, value)
                        }
                        edit={this.props?.edit}
                        handlerChangeObject={(value) =>
                          this.handlerChangeObject(value)
                        }
                      />
                    )}
                    {this.state.tapIndex === 2 && (
                      <IncomingPaymentForm
                        data={this.state}
                        edit={this.props?.edit}
                        handlerChange={(key, value) =>
                          this.handlerChange(key, value)
                        }
                      />
                    )}
                    {this.state.tapIndex === 3 && (
                      <StockAllocationForm
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
                    {this.state.tapIndex === 4 && (
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
                    {this.state.tapIndex === 5 && (
                      <ErrorLogForm
                        handlerChangeObject={(value) =>
                          this.handlerChangeObject(value)
                        }
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
                          >
                            <span className="px-3 text-[13px] py-1 text-green-500">
                              {this.props.edit ? "Update" : "Add"}
                            </span>
                          </LoadingButton>
                        </div>
                        {!this.props.edit && (
                          <div className="flex items-center space-x-4">
                            <LoadingButton
                              onClick={this.handlerSubmitPost}
                              sx={{ height: "30px", textTransform: "none" }}
                              className="bg-white"
                              loading={false}
                              size="small"
                              variant="contained"
                              disableElevation
                            >
                              <span className="px-6 text-[13px] py-4 text-white">
                                Post
                              </span>
                            </LoadingButton>
                          </div>
                        )}
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

export default withRouter(Form);
