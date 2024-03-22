import CoreFormDocument from "@/components/core/CoreFormDocument";
import { withRouter } from "@/routes/withRouter";
import { LoadingButton } from "@mui/lab";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import MenuButton from "@/components/button/MenuButton";
import { FormValidateException } from "@/utilies/error";
import LoadingProgress from "@/components/LoadingProgress";
import GeneralForm from "../components/GeneralForm";
import LogisticForm from "../components/LogisticForm";
import ContentForm from "../components/ContentForm";
import AccountingForm from "../components/AccountingForm";
import React, { ReactNode } from "react";
import { fetchSAPFile, formatDate, getAttachment } from "@/helper/helper";
import request from "@/utilies/request";
import BusinessPartner from "@/models/BusinessParter";
import { arrayBufferToBlob } from "@/utilies";
import shortid from "shortid";
import { CircularProgress, Button, Snackbar, Alert } from "@mui/material";
import { ItemModalComponent } from "@/components/modal/ItemComponentModal";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import UnitOfMeasurementGroupRepository from "@/services/actions/unitOfMeasurementGroupRepository";
import IncomingPaymentForm from "../components/IncomingPayment";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import requestHeader from "@/utilies/requestheader";
class LubeForm extends CoreFormDocument {
  LeftSideField?(): JSX.Element | ReactNode {
    return null;
  }

  RightSideField?(): JSX.Element | ReactNode {
    return null;
  }

  HeaderCollapeMenu?(): JSX.Element | ReactNode {
    return null;
  }
  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
      loading: true,
      U_tl_taxdate: new Date(),
      U_tl_docdate: new Date(),
      U_tl_devdate: new Date(),
      Branch: 1,
      error: {},
      BPCurrenciesCollection: [],
      CurrencyType: "L",
      Currency: "USD",
      DocType: "dDocument_Items",
      showCollapse: false,
      ExchangeRate: 1,
      JournalRemark: "",
      BPAddresses: [],
      Rounding: false,
      DocDiscount: 0,
      U_tl_totalbefdis: 0.0,
      U_tl_dispercent: 0.0,
      U_tl_disperamt: 0.0,
      U_tl_tax: 0.0,
      U_tl_doctotal: 0.0,
      RoundingValue: 0,
      AttachmentList: [],
      VatGroup: "S1",
      type: "sale",
      lineofBusiness: "",
      warehouseCode: "",
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
    let seriesList: any = this.props?.query?.find("TL_RETAILSALE_LU-series");

    if (!seriesList) {
      seriesList = await DocumentSerieRepository.getDocumentSeries({
        Document: "TL_RETAILSALE_LU",
      });
      this.props?.query?.set("TL_RETAILSALE_LU-series", seriesList);
    }
    let incomingSeries: any = this.props?.query?.find("incomingSeries-series");
    if (!incomingSeries) {
      incomingSeries = await DocumentSerieRepository.getDocumentSeries({
        Document: "24",
      });
      this.props?.query?.set("dn-series", incomingSeries);
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
      await request("GET", `TL_RETAILSALE_LU(${id})`)
        .then(async (res: any) => {
          const data: any = res?.data;
          // vendor
          const vendor: any = await request(
            "GET",
            `/BusinessPartners('${data?.U_tl_cardcode}')`
          )
            .then((res: any) => new BusinessPartner(res?.data, 0))
            .catch((err: any) => console.log(err));

          // attachment
          let disabledFields: any = {
            CurrencyType: true,
          };
          state = {
            ...data,
            seriesList,
            vendor,
            CardCode: data.U_tl_cardcode,
            CardName: data.U_tl_cardname,
            warehouseCode: data.U_tl_whs,
            lob: data.U_tl_arbusi,
            Currency: data.U_tl_doccur,
            cashBankData: data?.TL_RETAILSALE_LU_INCollection?.filter(
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

            checkNumberData: data?.TL_RETAILSALE_LU_INCollection?.filter(
              (e: any) => e.U_tl_paytype === "Check"
            )?.map((item: any) => ({
              U_tl_acccheck: item.U_tl_acccheck,
              U_tl_amtcheck: item?.U_tl_amtcheck || 0,
              U_tl_paytype: item?.U_tl_paytype,
              U_tl_paycur: item?.U_tl_paycur,
              U_tl_checkdate: item?.U_tl_checkdate,
              U_tl_checkbank: item?.U_tl_checkbank,
            })),

            couponData: data?.TL_RETAILSALE_LU_INCollection?.filter(
              (e: any) => e.U_tl_paytype === "Coupon"
            )?.map((item: any) => ({
              U_tl_acccoupon: item.U_tl_acccoupon,
              U_tl_accbank: item?.U_tl_accbank,
              U_tl_amtcoupon: item?.U_tl_amtcoupon || 0,
              U_tl_paytype: item?.U_tl_paytype,
              U_tl_paycur: item?.U_tl_paycur,
            })),
            Items: await Promise.all(
              (data?.TL_RETAILSALE_LU_COCollection || []).map(
                async (item: any) => {
                  let apiResponse: any;

                  if (item.U_tl_itemCode) {
                    try {
                      const response = await request(
                        "GET",
                        `/Items('${item.U_tl_itemCode}')?$select=UoMGroupEntry, ItemPrices`
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
                    ItemCode: item.U_tl_itemCode || null,
                    ItemName: item.U_tl_itemname || null,
                    Quantity: item.U_tl_qty || null,
                    UnitPrice:
                      item.GrossPrice / (1 + item.TaxPercentagePerRow / 100),
                    Discount: item.DiscountPercent || 0,
                    GrossPrice: item.U_tl_price,
                    TotalGross: item.GrossTotal,
                    TotalUnit: item.LineTotal,
                    LineTotal: item.U_tl_amount,
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
                    BPAddresses: vendor?.bpAddress?.map(
                      ({ addressName, addressType }: any) => {
                        return {
                          addressName: addressName,
                          addressType: addressType,
                        };
                      }
                    ),
                    // AttachmentList,
                    disabledFields,
                    isStatusClose: data?.DocumentStatus === "bost_Close",
                    RoundingValue:
                      data?.RoundingDiffAmountFC || data?.RoundingDiffAmount,
                    Rounding: (data?.Rounding == "tYES").toString(),
                    Edit: true,
                    // PostingDate: data?.DocDate,
                    // DueDate: data?.DocDueDate,
                    // DocumentDate: data?.TaxDate,
                  };
                }
              )
            ),
          };
        })
        .catch((err: any) => console.log(err))
        .finally(() => {
          state["SerieLists"] = seriesList;
          state["loading"] = false;
          state["isLoadingSerie"] = false;
          state["incomingSeries"] = incomingSeries;
          state["invoiceSeries"] = invoiceSeries;
          this.setState(state);
        });
    } else {
      state["SerieLists"] = seriesList;
      state["loading"] = false;
      state["isLoadingSerie"] = false;
      state["incomingSeries"] = incomingSeries;
      state["invoiceSeries"] = invoiceSeries;
      this.setState(state);
    }
  }
  createPayload() {
    const data: any = { ...this.state };
    const payload = {
      Series: data?.Series,
      U_tl_bplid: data?.U_tl_bplid,
      U_tl_whs: data?.U_tl_whs,
      U_tl_bincode: data?.U_tl_bincode,
      U_tl_cardcode: data?.CardCode,
      U_tl_cardname: data?.CardName,
      U_tl_doccur: data?.Currency,
      U_tl_rate: data?.ExchangeRate,
      U_tl_taxdate: data?.U_tl_taxdate,

      U_tl_docdate: data?.U_tl_docdate,
      U_tl_devdate: data?.U_tl_devdate,
      U_tl_totalbefdis: data?.U_tl_totalbefdis,
      U_tl_dispercent: data?.U_tl_dispercent,
      U_tl_disperamt: data?.U_tl_disperamt,
      U_tl_tax: data?.U_tl_tax,
      U_tl_doctotal: data?.U_tl_doctotal,
      Remark: data?.Remark,
      TL_RETAILSALE_LU_COCollection: data?.Items?.map((item: any) => ({
        U_tl_itemCode: item.ItemCode,
        U_tl_itemname: item.ItemName,
        U_tl_qty: item.Quantity,
        U_tl_uom: item.UomAbsEntry,
        U_tl_dispercent: item.DiscountPercent,
        U_tl_price: item.GrossPrice,
        U_tl_amount: item.LineTotal,
      })),
      TL_RETAILSALE_LU_INCollection: [
        ...data?.checkNumberData,
        ...data?.cashBankData,
        ...data?.couponData,
      ],
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
          field: "U_tl_whs",
          message: "Warehouse is Required!",
          getTabIndex: () => 0,
        },

        {
          field: "CardCode",
          message: "Customer is Required!",
          getTabIndex: () => 0,
        },
        {
          field: "Series",
          message: "Series is Required!",
          getTabIndex: () => 0,
        },
        {
          field: "U_tl_devdate",
          message: "Delivery date is Required!",
          getTabIndex: () => 0,
        },
        {
          field: "U_tl_taxdate",
          message: "Posting date is Required!",
          getTabIndex: () => 0,
        },
        {
          field: "U_tl_docdate",
          message: "Document date is Required!",
          getTabIndex: () => 0,
        },
        {
          field: "Items",
          message: "Items is missing and must have at least one record!",
          isArray: true,
          getTabIndex: () => 1,
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

      if (id) {
        return await request("PATCH", `/TL_RETAILSALE_LU(${id})`, payload)
          .then((res: any) =>
            this.dialog.current?.success("Update Successfully.", id)
          )
          .catch((err: any) => this.dialog.current?.error(err.message))
          .finally(() => this.setState({ ...this.state, isSubmitting: false }));
      }
      await request("POST", "/TL_RETAILSALE_LU", payload)
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
          field: "U_tl_whs",
          message: "Warehouse is Required!",
          getTabIndex: () => 0,
        },

        {
          field: "CardCode",
          message: "Customer is Required!",
          getTabIndex: () => 0,
        },
        {
          field: "Series",
          message: "Series is Required!",
          getTabIndex: () => 0,
        },
        {
          field: "U_tl_devdate",
          message: "Delivery date is Required!",
          getTabIndex: () => 0,
        },
        {
          field: "U_tl_taxdate",
          message: "Posting date is Required!",
          getTabIndex: () => 0,
        },
        {
          field: "U_tl_docdate",
          message: "Document date is Required!",
          getTabIndex: () => 0,
        },
        {
          field: "Items",
          message: "Items is missing and must have at least one record!",
          isArray: true,
          getTabIndex: () => 1,
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
          const response = await request("POST", "/TL_RETAILSALE_LU", payload);
          docEntry = response.data.DocEntry;
          this.setState({
            docEntry,
            isFirstAttempt: false,
            disableBranch: true,
          });
        } else {
          docEntry = this.state.docEntry; // Assign docEntry from state
          await request("PATCH", `/TL_RETAILSALE_LU(${docEntry})`, payload);
        }
      } else {
        docEntry = data.DocEntry; // Assign docEntry from props
        await request("PATCH", `/TL_RETAILSALE_LU(${docEntry})`, payload);
      }

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

      const PostPayload = {
        app_url: import.meta.env.VITE_APP_URL,
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

        DocumentLines: DocumentLines?.length > 0 ? DocumentLines : [],
      };

      await requestHeader("POST", "/script/test/LubeCashSales", PostPayload);
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
      0: ["CardCode", "Series", "U_tl_bplid", "U_tl_whs", "U_tl_bincode"],
      1: ["Items"],
      2: [],
      3: [],
    };
    return requiredFieldsMap[tabIndex] || [];
  }

  handlePreviousTab = () => {
    if (this.state.tapIndex > 0) {
      this.handlerChangeMenu(this.state.tapIndex - 1);
    }
  };
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
    console.log(this.state);
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
            Contents
          </MenuButton>
          <MenuButton
            active={this.state.tapIndex === 2}
            onClick={() => this.handleMenuButtonClick(2)}
          >
            <span> Incoming Payment</span>
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
    const itemGroupCode = 101;

    // const priceList = parseInt(this.state.U_tl_sopricelist);
    const priceList = 13;
    const navigate = useNavigate();
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
                        lineofBusiness={this.state.lineofBusiness}
                        warehouseCode={this.state.warehouseCode}
                        onWarehouseChange={this.handleWarehouseChange}
                        onLineofBusinessChange={this.handleLineofBusinessChange}
                      />
                    )}
                    {this.state.tapIndex === 1 && (
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
                    {this.state.tapIndex === 2 && (
                      <IncomingPaymentForm
                        data={this.state}
                        edit={this.props?.edit}
                        handlerChange={(key, value) => {
                          this.handlerChange(key, value);
                        }}
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

export default withRouter(LubeForm);

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
