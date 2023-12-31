import CoreFormDocument from "@/components/core/CoreFormDocument";
import { withRouter } from "@/routes/withRouter";
import { LoadingButton } from "@mui/lab";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import MenuButton from "@/components/button/MenuButton";
import { FormValidateException } from "@/utilies/error";
import LoadingProgress from "@/components/LoadingProgress";
import GeneralForm from "../components/GeneralForm";
import LogisticForm from "../components/ConsumptionAllocation";
import ContentForm from "../components/ContentForm";
import AttachmentForm from "../components/AttachmentForm";
import AccountingForm from "../components/AccountingForm";
import React from "react";
import { fetchSAPFile, formatDate, getAttachment } from "@/helper/helper";
import request from "@/utilies/request";
import BusinessPartner from "@/models/BusinessParter";
import { arrayBufferToBlob } from "@/utilies";
import shortid from "shortid";
import {
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import { ItemModalComponent } from "@/components/modal/ItemComponentModal";
import useState from "react";
import requestHeader from "@/utilies/requestheader";
import ConsumptionAllocation from "../components/ConsumptionAllocation";
import IncomingPayment from "../components/IncomingPayment";
import PumpData from "../components/PumpData";
import StockAllocation from "../components/StockAllocation";
import StockForm from "../components/StockForm";

class PumpSaleForm extends CoreFormDocument {
  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
      loading: true,
      DocumentDate: new Date(),
      PostingDate: new Date(),
      DueDate: new Date(),
      error: {},
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
      AttachmentList: [],
      VatGroup: "S1",
      type: "sale", // Initialize type with a default value
      lineofBusiness: "",
      warehouseCode: "",
      pumpData: [
        {
          U_tl_pumpcode: "",
          U_tl_itemnum: "",
          U_tl_itemdesc: "",
          U_tl_old_meter: 0,
          U_tl_new_meter: 0,
          con: -1,
        },
      ],
      Services: [],
      IncomingCash: [{ Currency: "KHR" }, { Currency: "USD" }],
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
    console.log(state);
    let seriesList: any = this.props?.query?.find("orders-series");
    const { data: tl_Dispenser }: any = await request("GET", `/TL_Dispenser`);
    state = {
      ...state,
      tl_Dispenser,
    };

    if (!seriesList) {
      seriesList = await DocumentSerieRepository.getDocumentSeries({
        Document: "17",
      });
      this.props?.query?.set("orders-series", seriesList);
    }

    if (this.props.edit) {
      const { id }: any = this.props?.match?.params || 0;
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

          //  `/TL_Dispenser('${data?.Dispenser}')`

          state = {
            ...data,
            tl_Dispenser,

            // Description: data?.Comments,
            // Owner: data?.DocumentsOwner,
            // Currency: data?.DocCurrency,
            Items: data?.DocumentLines?.map((item: any) => {
              return {
                ItemCode: item.ItemCode || null,
                ItemName: item.ItemDescription || item.Name || null,
                Quantity: item.Quantity || null,
                UnitPrice: item.UnitPrice || item.total,
                Discount: item.DiscountPercent || 0,
                VatGroup: item.VatGroup || "",
                GrossPrice: item.GrossPrice,
                TotalGross: item.GrossTotal,
                DiscountPercent: item.DiscountPercent || 0,
                TaxCode: item.VatGroup || item.taxCode || null,
                UoMEntry: item.UomAbsEntry || null,
                WarehouseCode: item?.WarehouseCode || null,
                UomAbsEntry: item?.UoMEntry,
                LineTotal: item.LineTotal,
                VatRate: item.TaxPercentagePerRow,
              };
            }),
            ExchangeRate: data?.DocRate || 1,
            // ShippingTo: data?.ShipToCode || null,
            // BillingTo: data?.PayToCode || null,
            JournalMemo: data?.JournalMemo,
            // PaymentTermType: data?.PaymentGroupCode,
            // ShippingType: data?.TransportationCode,
            // FederalTax: data?.FederalTaxID || null,
            CurrencyType: "B",
            vendor,
            warehouseCode: data?.U_tl_whsdesc,
            DocDiscount: data?.DiscountPercent,
            BPAddresses: vendor?.bpAddress?.map(
              ({ addressName, addressType }: any) => {
                return { addressName: addressName, addressType: addressType };
              }
            ),

            isStatusClose: data?.DocumentStatus === "bost_Close",
            RoundingValue:
              data?.RoundingDiffAmountFC || data?.RoundingDiffAmount,
            Rounding: (data?.Rounding == "tYES").toString(),
            Edit: true,
            PostingDate: data?.DocDate,
            DueDate: data?.DocDueDate,
            DocumentDate: data?.TaxDate,
          };
        })
        .catch((err: any) => console.log(err))
        .finally(() => {
          state["SerieLists"] = seriesList;
          state["loading"] = false;
          state["isLoadingSerie"] = false;
          this.setState(state);
        });
    } else {
      state["SerieLists"] = seriesList;
      // state["DocNum"] = defaultSeries.NextNumber ;
      state["loading"] = false;
      state["isLoadingSerie"] = false;
      this.setState(state);
    }
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

      // if (!data.BPL_IDAssignedToInvoice) {
      //   data["error"] = { BPL_IDAssignedToInvoice: "Branch is Required!" };
      //   throw new FormValidateException("Branch is Required!", 0);
      // }
      if (!data.CardCode) {
        data["error"] = { CardCode: "Vendor is Required!" };
        throw new FormValidateException("Vendor is Required!", 0);
      }
      // if (!data.WarehouseCode) {
      //   data["error"] = { WarehouseCode: "Warehouse is Required!" };
      //   throw new FormValidateException("Warehouse is Required!", 0);
      // }

      if (!data?.DueDate) {
        data["error"] = { DueDate: "End date is Required!" };
        throw new FormValidateException("End date is Required!", 0);
      }

      if (!data?.Items || data?.Items?.length === 0) {
        data["error"] = {
          Items: "Items is missing and must at least one record!",
        };
        throw new FormValidateException("Items is missing", 1);
      } else {
        let hasInvalidGrossPrice = false;

        data.Items.forEach((item: any) => {
          if (!item.hasOwnProperty("GrossPrice") || item.GrossPrice <= 0) {
            hasInvalidGrossPrice = true;
            return;
          }
        });

        if (hasInvalidGrossPrice) {
          data["error"] = {
            Items: "Some items have invalid GrossPrice values!",
          };
          throw new FormValidateException(
            "Some items have invalid GrossPrice values",
            1
          );
        }
      }

      // attachment
      let AttachmentEntry = null;
      const files = data?.AttachmentList?.map((item: any) => item);
      if (files?.length > 0) AttachmentEntry = await getAttachment(files);

      // items

      const warehouseCodeGet = this.state.warehouseCode;
      const DocumentLines = getItem(
        data?.Items || [],
        data?.DocType,
        warehouseCodeGet
      );
      // console.log(this.state.lineofBusiness);
      const isUSD = (data?.Currency || "USD") === "USD";
      const roundingValue = data?.RoundingValue || 0;
      const payloads = {
        // general
        SOSeries: data?.Series,

        DocDate: `${formatDate(data?.PostingDate)}"T00:00:00Z"`,
        DocDueDate: `${formatDate(data?.DueDate || new Date())}"T00:00:00Z"`,
        TaxDate: `${formatDate(data?.DocumentDate)}"T00:00:00Z"`,
        CardCode: data?.CardCode,
        CardName: data?.CardName,
        // CashAccount: data?.CashAccount,

        // DocCurrency: data?.CurrencyType === "B" ? data?.Currency : "",
        // DocRate: data?.ExchangeRate || 0,
        DiscountPercent: data?.DocDiscount,
        ContactPersonCode: data?.ContactPersonCode || null,
        DocumentStatus: data?.DocumentStatus,
        BPLID: data?.BPL_IDAssignedToInvoice ?? 1,
        U_tl_whsdesc: data?.U_tl_whsdesc,
        SalesPersonCode: data?.SalesPersonCode,
        Comments: data?.User_Text,
        U_tl_arbusi: data?.U_tl_arbusi,

        // content
        // DocType: data?.DocType,
        // RoundingDiffAmount: isUSD ? roundingValue : 0,
        // RoundingDiffAmountFC: isUSD ? 0 : roundingValue,
        // RoundingDiffAmountSC: isUSD ? roundingValue : 0,
        // Rounding: data?.Rounding == "true" ? "tYES" : "tNO",
        // DocumentsOwner: data?.Owner || null,
        // DiscountPercent: data?.DocDiscount,
        DocumentLines,

        // logistic
        // ShipToCode: data?.ShippingTo || null,
        PayToCode: data?.PayToCode || null,
        // TransportationCode: data?.ShippingType,
        U_tl_grsuppo: data?.U_tl_grsuppo,
        U_tl_dnsuppo: data?.U_tl_dnsuppo,
        // Address: data?.Address2,

        // accounting
        // FederalTaxID: data?.FederalTax || null,
        // PaymentMethod: data?.PaymentMethod || null,
        // CashDiscountDateOffset: data?.CashDiscount || 0,
        // CreateQRCodeFrom: data?.QRCode || null,
        // PaymentGroupCode: data?.PaymentTermType || null,
        // JournalMemo: data?.JournalRemark,
        // Project: data?.BPProject || null,
        // attachment
        AttachmentEntry,
      };

      if (id) {
        return await request("PATCH", `/Orders(${id})`, payloads)
          .then(
            (res: any) =>
              this.dialog.current?.success("Update Successfully.", id)
          )
          .catch((err: any) => this.dialog.current?.error(err.message))
          .finally(() => this.setState({ ...this.state, isSubmitting: false }));
      }
      await request("POST", "/script/test/PumpSale", payloads)
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
      // 0: ["CardCode", "U_tl_whsdesc"],
      // 1: ["Items"],
      // 2: ["U_tl_dnsuppo", "PayToCode"],
      // 3: [],
    };
    return requiredFieldsMap[tabIndex] || [];
  }

  handlePreviousTab = () => {
    if (this.state.tapIndex > 0) {
      this.handlerChangeMenu(this.state.tapIndex - 1);
    }
  };

  HeaderTaps = () => {
    return (
      <>
        <div className="w-full mt-2">
          <MenuButton active={this.state.tapIndex === 0}>
            <span> Information</span>
          </MenuButton>
          <MenuButton active={this.state.tapIndex === 1}>Pump Data</MenuButton>
          <MenuButton active={this.state.tapIndex === 2}>
            Consumption 
            {/* Allocation */}
          </MenuButton>
          <MenuButton active={this.state.tapIndex === 3}>
            Incoming Payment
          </MenuButton>
          <MenuButton active={this.state.tapIndex === 4}>
            Stock 
            {/* Allocation */}
          </MenuButton>
        </div>

        <div className="sticky w-full bottom-4   ">
          <div className="  p-2 rounded-lg flex justify-end gap-3  ">
            <div className="flex ">
              <Button
                size="small"
                variant="outlined"
                onClick={this.handlePreviousTab}
                disabled={this.state.tapIndex === 0}
                style={{ textTransform: "none" }}
              >
                Previous
              </Button>
            </div>
            <div className="flex items-center">
              <Button
                size="small"
                variant="outlined"
                onClick={this.handleNextTab}
                disabled={this.state.tapIndex === 4}
                style={{ textTransform: "none" }}
              >
                Next
              </Button>

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
                  Please complete all required fields before proceeding to the
                  next tab.
                </Alert>
              </Snackbar>
            </div>
          </div>
        </div>
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
    const getGroupByLineofBusiness = (lineofBusiness: any) => {
      switch (lineofBusiness) {
        case "Oil":
          return 100;
        case "Lube":
          return 101;
        case "LPG":
          return 102;
        default:
          return 0;
      }
    };

    const itemGroupCode = getGroupByLineofBusiness(this.state.lineofBusiness);

    return (
      <>
        <ItemModalComponent
          type="sale"
          group={itemGroupCode}
          onOk={this.handlerConfirmItem}
          ref={this.itemModalRef}
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
                  {/* {this.state.tapIndex === 1 && (
                    <ContentForm
                      data={this.state}
                      handlerAddItem={() => {
                        this.hanndAddNewItem();
                      }}
                      onChangeItemByCode={this.handlerChangeItemByCode}
                      onChange={this.handlerChange}
                      ContentLoading={this.state.ContentLoading}
                    />
                  )} */}
                  {this.state.tapIndex === 1 && (
                    <PumpData
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
                      ContentLoading={this.state.ContentLoading}
                    />
                  )}
                  {this.state.tapIndex === 2 && (
                    <ConsumptionAllocation
                      data={this.state}
                      edit={this.props?.edit}
                      handlerChange={(key, value) => {
                        this.handlerChange(key, value);
                      }}
                    />
                  )}
                  {this.state.tapIndex === 3 && (
                    <IncomingPayment
                      data={this.state}
                      edit={this.props?.edit}
                      handlerChange={(key, value) => {
                        this.handlerChange(key, value);
                      }}
                    />
                  )}

                  {this.state.tapIndex === 4 && (
                    <StockForm
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
                      ContentLoading={this.state.ContentLoading}
                    />
                  )}

                  {/* {this.state.tapIndex === 3 && (
                    <AttachmentForm
                      data={this.state}
                      handlerChange={(key: any, value: any) => {
                        this.handlerChange(key, value);
                      }}
                    />
                  )} */}
                </div>
              </>
            )}
          </div>

          <div className="sticky w-full bottom-4  mt-2 ">
            <div className="backdrop-blur-sm bg-white p-2 rounded-lg shadow-lg z-[1000] flex justify-between gap-3 border drop-shadow-sm">
              <div className="flex ">
                <LoadingButton
                  size="small"
                  sx={{ height: "25px" }}
                  variant="contained"
                  disableElevation
                >
                  <span className="px-3 text-[11px] py-1 text-white">
                    Cancel
                  </span>
                </LoadingButton>
              </div>
              <div className="flex items-center space-x-4">
                <LoadingButton
                  type="submit"
                  sx={{ height: "25px" }}
                  className="bg-white"
                  loading={false}
                  size="small"
                  variant="contained"
                  disableElevation
                >
                  <span className="px-6 text-[11px] py-4 text-white">
                    {this.props.edit ? "Update" : "Save"}
                  </span>
                </LoadingButton>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  };
}

export default withRouter(PumpSaleForm);

const getItem = (items: any, type: any, warehouseCode: any) =>
  items?.map((item: any, index: number) => {
    return {
      ItemCode: item.ItemCode || null,
      Quantity: item.Quantity || null,
      GrossPrice: item.GrossPrice || item.total,
      DiscountPercent: item.DiscountPercent || 0,
      TaxCode: item.VatGroup || item.taxCode || null,
      // UoMCode: item.UomGroupCode || null,
      UoMEntry: item.UomAbsEntry || null,
      LineOfBussiness: item?.LineOfBussiness ? "201001" : "201002",
      RevenueLine: item.revenueLine ?? "202001",
      ProductLine: item.REV ?? "203004",
      BinAbsEntry: item.BinAbsEntry ?? 65,
      WarehouseCode: item?.WarehouseCode || null,
      DocumentLinesBinAllocations: [
        {
          BinAbsEntry: item.BinAbsEntry,
          Quantity: item.UnitsOfMeasurement,
          // AllowNegativeQuantity: "tNO",
          // SerialAndBatchNumbersBaseLine: -1,
          BaseLineNumber: index,
        },
      ],
    };
  });
