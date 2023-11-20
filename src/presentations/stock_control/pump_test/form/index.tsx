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
import React from "react";
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
  }

  componentDidMount(): void {
    this.setState({ loading: true });
    this.onInit();
  }

  async onInit() {
    let state: any = { ...this.state };

    if (this.props.edit) {
      const { id }: any = this.props?.match?.params || 0;
      await request("GET", `tl_PumpTest(${id})`)
        .then(async (res: any) => {
          const data: any = res?.data;

          state = {
            ...data,
            
            Items: data?.TL_PUMP_TEST_LINESCollection?.map((item: any) => {
              return {
                U_tl_pumpcode: item.U_tl_pumpcode,
                U_tl_itemnum: item.U_tl_itemnum,
                U_tl_itemdesc: item.U_tl_itemdesc,
                U_tl_old_meter: item.U_tl_old_meter,
                U_tl_new_meter: item.U_tl_new_meter,
                U_tl_testby: item.U_tl_testby,
              };
            }),
          };
        })
        .catch((err: any) => console.log(err))
        .finally(() => {
          state["loading"] = false;
          state["isLoadingSerie"] = false;
          this.setState(state);
        });
    } else {
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

      if (!data?.Items || data?.Items?.length === 0) {
        data["error"] = {
          Items: "Items is missing and must at least one record!",
        };
        throw new FormValidateException("Items is missing", 1);
      }

      // attachment

      const payloads = {
        // general
        // Series: data?.Series
        // Remark: data?.Remark
        U_tl_bplid: data?.U_tl_bplid,
        TL_PUMP_TEST_LINESCollection: data?.Items,
      };

      if (id) {
        return await request("PATCH", `/tl_PumpTest(${id})`, payloads)
          .then(
            (res: any) =>
              this.dialog.current?.success("Update Successfully.", id)
          )
          .catch((err: any) => this.dialog.current?.error(err.message))
          .finally(() => this.setState({ ...this.state, isSubmitting: false }));
      }
      await request("POST", "/tl_PumpTest", payloads)
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
  

    return (
      <>
        {/* <ItemModalComponent
          type="sale"
          group={itemGroupCode}
          onOk={this.handlerConfirmItem}
          ref={this.itemModalRef}
        /> */}
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
                      ContentLoading={this.state.ContentLoading}
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

const getItem = (items: any, ) =>
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
