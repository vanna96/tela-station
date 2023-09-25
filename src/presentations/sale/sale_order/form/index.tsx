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
import AttachmentForm from "../components/AttachmentForm";
import AccountingForm from "../components/AccountingForm";
import React from "react";
import { fetchSAPFile, formatDate, getAttachment } from "@/helper/helper";
import request from "@/utilies/request";
import BusinessPartner from "@/models/BusinessParter";
import { arrayBufferToBlob } from "@/utilies";
import shortid from "shortid";
import { CircularProgress } from "@mui/material";
import { ItemModalComponent } from "@/components/modal/ItemComponentModal";
import useState from "react";

class SalesOrderForm extends CoreFormDocument {
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
    let seriesList: any = this.props?.query?.find("orders-series");

    if (!seriesList) {
      seriesList = await DocumentSerieRepository.getDocumentSeries({
        Document: "17",
      });
      this.props?.query?.set("orders-series", seriesList);
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
          let AttachmentList: any = [];
          let disabledFields: any = {
            CurrencyType: true,
          };

          if (data?.AttachmentEntry > 0) {
            AttachmentList = await request(
              "GET",
              `/Attachments2(${data?.AttachmentEntry})`
            )
              .then(async (res: any) => {
                const attachments: any = res?.data?.Attachments2_Lines;
                if (attachments.length <= 0) return;

                const files: any = attachments.map(async (e: any) => {
                  const req: any = await fetchSAPFile(
                    `/Attachments2(${data?.AttachmentEntry})/$value?filename='${e?.FileName}.${e?.FileExtension}'`
                  );
                  const blob: any = await arrayBufferToBlob(
                    req.data,
                    req.headers["content-type"],
                    `${e?.FileName}.${e?.FileExtension}`
                  );

                  return {
                    id: shortid.generate(),
                    key: Date.now(),
                    file: blob,
                    Path: "C:/Attachments2",
                    Filename: `${e?.FileName}.${e?.FileExtension}`,
                    Extension: `.${e?.FileExtension}`,
                    FreeText: "",
                    AttachmentDate: e?.AttachmentDate?.split("T")[0],
                  };
                });
                return await Promise.all(files);
              })
              .catch((error) => console.log(error));
          }

          state = {
            ...data,
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
                // UomCode: item.UomCode,
                // UomGroupCode: item.UoMCode || null,
                // UomEntry: item.UoMGroupEntry || null,
                UomEntry: item.UomCode || null,
                WarehouseCode: this.state.warehouseCode,
                // Currency: "AUD",
                LineTotal: item.LineTotal,
                VatRate: item.TaxPercentagePerRow,
              };
            }),
            ExchangeRate: data?.DocRate || 1,
            // ShippingTo: data?.ShipToCode || null,
            // BillingTo: data?.PayToCode || null,
            // JournalRemark: data?.JournalMemo,
            // PaymentTermType: data?.PaymentGroupCode,
            // ShippingType: data?.TransportationCode,
            // FederalTax: data?.FederalTaxID || null,
            CurrencyType: "B",
            vendor,
            DocDiscount: data?.DiscountPercent,
            BPAddresses: vendor?.bpAddress?.map(
              ({ addressName, addressType }: any) => {
                return { addressName: addressName, addressType: addressType };
              }
            ),
            AttachmentList,
            disabledFields,
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
        throw new FormValidateException("Items is missing", 2);
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
        warehouseCodeGet,
        this.state.lineofBusiness
      );
      // console.log(this.state.lineofBusiness);
      const isUSD = (data?.Currency || "USD") === "USD";
      const roundingValue = data?.RoundingValue || 0;
      const payloads = {
        // general
        SOSeries: data?.Series,
        DNSeries: data?.DNSeries,
        INSeries: data?.INSeries,
        DocDate: `${formatDate(data?.PostingDate)}"T00:00:00Z"`,
        DocDueDate: `${formatDate(data?.DueDate || new Date())}"T00:00:00Z"`,
        TaxDate: `${formatDate(data?.DocumentDate)}"T00:00:00Z"`,
        CardCode: data?.CardCode,
        CardName: data?.CardName,
        Comments: data?.User_Text || null,

        // DocCurrency: data?.CurrencyType === "B" ? data?.Currency : "",
        // DocRate: data?.ExchangeRate || 0,
        ContactPersonCode: data?.ContactPersonCode || null,
        DocumentStatus: data?.DocumentStatus,
        BLPID: data?.BPL_IDAssignedToInvoice ?? 1,
        U_tl_whsdesc: data?.U_tl_whsdesc,
        SalesPersonCode: data?.SalesPersonCode,
        User_Text: data?.User_Text,
        U_tl_arbusi: data?.U_tl_arbusi,
        U_tl_sarn: data?.U_tl_sarn || null,

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
        PayToCode: data?.BillingTo || null,
        // TransportationCode: data?.ShippingType,
        U_tl_grsuppo: data?.U_tl_grsuppo,
        U_tl_dnsuppo: data?.U_tl_dnsuppo,
        Address: data?.Address2,

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

      await request("POST", "/script/test/SOSync", payloads)
        .then(
          (res: any) =>
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

  HeaderTaps = () => {
    return (
      <>
        <MenuButton
          active={this.state.tapIndex === 0}
          onClick={() => this.handlerChangeMenu(0)}
        >
          General
        </MenuButton>
        <MenuButton
          active={this.state.tapIndex === 2}
          onClick={() => this.handlerChangeMenu(2)}
        >
          Content
        </MenuButton>
        <MenuButton
          active={this.state.tapIndex === 1}
          onClick={() => this.handlerChangeMenu(1)}
        >
          Logistic
        </MenuButton>
        {/* <MenuButton
          active={this.state.tapIndex === 4}
          onClick={() => this.handlerChangeMenu(4)}
        >
          Accounting
        </MenuButton> */}
        <MenuButton
          active={this.state.tapIndex === 3}
          onClick={() => this.handlerChangeMenu(3)}
        >
          Attachment
        </MenuButton>
      </>
    );
  };

  hanndAddNewItem() {
    if (!this.state?.CardCode) return;
    if (this.state.DocType === "dDocument_Items")
      return this.itemModalRef.current?.onOpen(
        this.state?.CardCode,
        "sale",
        this.state.warehouseCode
      );
  }

  // componentDidUpdate(prevProps: any, prevState: any) {
  //   if (prevState.warehouseCode !== this.state.warehouseCode) {
  //     const DocumentLines = getItem(
  //       this.state?.Items || [],
  //       this.state?.DocType,
  //       this.state.warehouseCode,
  //     );
  //   }
  // }

  FormRender = () => {
    const getGroupByLineofBusiness = (lineofBusiness: any) => {
      switch (lineofBusiness) {
        case "Oil":
          return "100";
        case "Lube":
          return "101";
        case "LPG":
          return "102";
        default:
          return "0";
      }
    };

    const itemGroupCode = getGroupByLineofBusiness(this.state.lineofBusiness);

    return (
      <>
        {itemGroupCode === "100" && (
          <ItemModalComponent
            type="sale"
            group={"100"}
            onOk={this.handlerConfirmItem}
            ref={this.itemModalRef}
          />
        )}
        {itemGroupCode === "101" && (
          <ItemModalComponent
            type="sale"
            group={"101"}
            onOk={this.handlerConfirmItem}
            ref={this.itemModalRef}
          />
        )}
        {itemGroupCode === "102" && (
          <ItemModalComponent
            type="sale"
            group={"102"}
            onOk={this.handlerConfirmItem}
            ref={this.itemModalRef}
          />
        )}{" "}
        {itemGroupCode === "0" && (
          <ItemModalComponent
            type="sale"
            group={"0"}
            onOk={this.handlerConfirmItem}
            ref={this.itemModalRef}
          />
        )}
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

                  {this.state.tapIndex === 1 && (
                    <LogisticForm
                      data={this.state}
                      edit={this.props?.edit}
                      handlerChange={(key, value) => {
                        this.handlerChange(key, value);
                      }}
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
                    />
                  )}

                  {this.state.tapIndex === 3 && (
                    <AttachmentForm
                      data={this.state}
                      handlerChange={(key: any, value: any) => {
                        this.handlerChange(key, value);
                      }}
                    />
                  )}
                  {/* {this.state.tapIndex === 4 && (
                    <AccountingForm
                      data={this.state}
                      edit={this.props?.edit}
                      handlerChange={(key, value) => {
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
                  sx={{ height: "28px" }}
                  variant="contained"
                  disableElevation
                >
                  <span className="px-3 text-[12px] py-1 text-white">
                    Copy To
                  </span>
                </LoadingButton>
              </div>
              <div className="flex items-center">
                <LoadingButton
                  type="submit"
                  sx={{ height: "28px" }}
                  className="bg-white"
                  loading={false}
                  size="small"
                  variant="contained"
                  disableElevation
                >
                  <span className="px-6 text-[12px] py-4 text-white">Save</span>
                </LoadingButton>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  };
}

export default withRouter(SalesOrderForm);

const getItem = (items: any, type: any, warehouseCode: any) =>
  items?.map((item: any) => {
    return {
      ItemCode: item.ItemCode || null,
      ItemDescription: item.ItemName || item.Name || null,
      Quantity: item.Quantity || null,
      UnitPrice: item.UnitPrice || item.total,
      DiscountPercent: item.Discount || 0,
      VatGroup: item.VatGroup || item.taxCode || null,
      // UoMCode: item.UomGroupCode || null,
      UoMEntry: item.UomAbsEntry || null,
      LineOfBussiness: item?.LineOfBussiness ? "201001" : "201002",
      RevenueLine: item.revenueLine ?? "202001",
      ProductLine: item.REV ?? "203004",
      BinAbsEntry: item.BinAbsEntry ?? 65,
      WarehouseCode: item?.WarehouseCode || null,

      // Currency: "AUD",
    };
  });
