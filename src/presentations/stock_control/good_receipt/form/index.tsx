import CoreFormDocument from "@/components/core/CoreFormDocument";
import { withRouter } from "@/routes/withRouter";
import { LoadingButton } from "@mui/lab";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import MenuButton from "@/components/button/MenuButton";
import { FormValidateException } from "@/utilies/error";
import LoadingProgress from "@/components/LoadingProgress";
import GeneralForm from "../components/GeneralForm";
import ContentForm from "../components/ContentForm";
import AttachmentForm from "../components/AttachmentForm";
import { fetchSAPFile, formatDate, getAttachment } from "@/helper/helper";
import request from "@/utilies/request";
import BusinessPartner from "@/models/BusinessParter";
import { arrayBufferToBlob } from "@/utilies";
import shortid from "shortid";
import { CircularProgress, Button, Snackbar, Alert } from "@mui/material";
import { ItemModalComponent } from "@/components/modal/ItemComponentModal";
import useState from "react";
import requestHeader from "@/utilies/requestheader";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";

class Form extends CoreFormDocument {
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

      tabErrors: {
        // Initialize error flags for each tab
        general: false,
        content: false,
        logistic: false,
        attachment: false,
      },
      isDialogOpen: false,
    } as any;

    this.onInit = this.onInit.bind(this);
    this.handlerRemoveItem = this.handlerRemoveItem.bind(this);
    this.handlerSubmit = this.handlerSubmit.bind(this);
    this.handlerChangeMenu = this.handlerChangeMenu.bind(this);
    this.hanndAddNewItem = this.hanndAddNewItem.bind(this);
    this.handleModalItem = this.handleModalItem.bind(this);
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
  handleModalItem = () => {};

  async onInit() {
    let state: any = { ...this.state };
    let seriesList: any = this.props?.query?.find("good-receipt-series");

    if (!seriesList) {
      seriesList = await DocumentSerieRepository.getDocumentSeries({
        Document: "59",
      });
      this.props?.query?.set("good-receipt-series", seriesList);
    }

    if (this.props.edit) {
      const { id }: any = this.props?.match?.params || 0;
      await request("GET", `InventoryGenExits(${id})`)
        .then(async (res: any) => {
          const data: any = res?.data;
          // vendor

          // attachment
          let AttachmentList: any = [];
          let disabledFields: any = {
            CurrencyType: true,
          };

          if (data?.AttachmentEntry > 0) {
            AttachmentList = await requestHeader(
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
            warehouseCode: data?.U_tl_whsdesc,
            DocDiscount: data?.DiscountPercent,

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

      if (!data.warehouseCode) {
        data["error"] = { CardCode: "Warehouse is Required!" };
        throw new FormValidateException("Warehouse is Required!", 0);
      }

      if (!data?.DueDate) {
        data["error"] = { DueDate: "End date is Required!" };
        throw new FormValidateException("End date is Required!", 0);
      }

      if (!data?.Items || data?.Items?.length === 0) {
        data["error"] = {
          Items: "Items is missing and must at least one record!",
        };
        throw new FormValidateException("Items is missing", 1);
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
        Series: data?.Series,
        DocDate: `${formatDate(data?.PostingDate)}"T00:00:00Z"`,
        DocDueDate: `${formatDate(data?.DueDate || new Date())}"T00:00:00Z"`,
        TaxDate: `${formatDate(data?.DocumentDate)}"T00:00:00Z"`,

        // DocCurrency: data?.CurrencyType === "B" ? data?.Currency : "",
        // DocRate: data?.ExchangeRate || 0,
        DiscountPercent: data?.DocDiscount,
        ContactPersonCode: data?.ContactPersonCode || null,
        DocumentStatus: data?.DocumentStatus,
        BPL_IDAssignedToInvoice: data?.BPL_IDAssignedToInvoice ?? 1,
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
        return await request("PATCH", `/InventoryGenExits(${id})`, payloads)
          .then(
            (res: any) =>
              this.dialog.current?.success("Update Successfully.", id)
          )
          .catch((err: any) => this.dialog.current?.error(err.message))
          .finally(() => this.setState({ ...this.state, isSubmitting: false }));
      }
      await request("POST", "/InventoryGenExits", payloads)
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
      0: ["warehouseCode"],
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
        <MenuButton active={this.state.tapIndex === 0}>General</MenuButton>
        <MenuButton active={this.state.tapIndex === 1}>Content</MenuButton>
        {/* <MenuButton active={this.state.tapIndex === 2}>Logistic</MenuButton>
        <MenuButton active={this.state.tapIndex === 3}>Attachment</MenuButton> */}
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
                disabled={this.state.tapIndex === 1}
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
    if (!this.state?.warehouseCode) {
      // Notify the user to enter the warehouse code
      alert("Please enter the warehouse code");
      return;
    }
    if (this.state.DocType === "dDocument_Items")
      return this.itemModalRef.current?.onOpen(
        this.state?.CardCode,
        "sale",
        this.state?.warehouseCode,
        this.state?.Currency
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
          // onOk={(items) => {
          //   if (items.length) {
          //     let items: any = this.state?.Items?.map(
          //       (item: any, index: number) => {
          //         if (index.toString() === this.state?.Items.toString()) {
          //           return {
          //             ...item,
          //             ...items[0],
          //             itemCode: items[0]?.ItemCode,
          //             ItemDescription: items[0]?.ItemDescription,
          //             uom: items[0]?.UomName,
          //           };
          //         }
          //         return item;
          //       }
          //     );

          //     this.handlerChange("Items", items);
          //   }
          // }}
          onOk={this.handlerConfirmItem}
          ref={this.itemModalRef}
          // multipleSelect={false}
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
                    <PumpData
                      data={this.state}
                      edit={this.props?.edit}
                      handlerChange={(key, value) => {
                        this.handlerChange(key, value);
                      }}
                      handlerAddItem={(e: any) => {
                        this.handlerChange("pumpIndex", e);
                        this.hanndAddNewItem();
                      }}
                    />
                  )} */}
                  {this.state.tapIndex === 1 && (
                    <ContentForm
                      ContentLoading={this.state.ContentLoading}
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
                  {/* {this.state.tapIndex === 2 && (
                    <LogisticForm
                      data={this.state}
                      edit={this.props?.edit}
                      handlerChange={(key, value) => {
                        this.handlerChange(key, value);
                      }}
                    />
                  )} */}

                  {this.state.tapIndex === 3 && (
                    <AttachmentForm
                      data={this.state}
                      handlerChange={(key: any, value: any) => {
                        this.handlerChange(key, value);
                      }}
                    />
                  )}

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
