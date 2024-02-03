import CoreFormDocument from "@/components/core/CoreFormDocument";
import { withRouter } from "@/routes/withRouter";
import { LoadingButton } from "@mui/lab";
import MenuButton from "@/components/button/MenuButton";
import { FormValidateException } from "@/utilies/error";
import LoadingProgress from "@/components/LoadingProgress";
import GeneralForm from "../components/GeneralForm";
import React, { useContext } from "react";

import { fetchSAPFile, formatDate, getAttachment } from "@/helper/helper";
import request from "@/utilies/request";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import BusinessPartner from "@/models/BusinessParter";
import { Alert, Button, CircularProgress, Snackbar } from "@mui/material";
import Consumption from "../components/Consumption";
import StockAllocationForm from "../components/StockAllocation";
import IncomingPaymentForm from "../components/IncomingPayment";
import { useNavigate } from "react-router-dom";

class Form extends CoreFormDocument {
  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
      showCollapse: false,
      nozzleData: [],
      allocationData: [],
      cashBankData: [{ type: "cash", currency: "USD", amount: 0 }],
      checkNumberData: [
        {
          check_no: "",
          check_date: new Date(),
          bank: "",
          check_amount: 0,
        },
      ],
    } as any;

    this.onInit = this.onInit.bind(this);
    this.handlerSubmit = this.handlerSubmit.bind(this);
    this.handlerChangeMenu = this.handlerChangeMenu.bind(this);
  }

  componentDidMount(): void {
    this.setState({ loading: true });
    this.onInit();
  }

  async onInit() {
    let state: any = { ...this.state };

    let seriesList = await DocumentSerieRepository.getDocumentSeries({
      Document: "TL_RetailSale",
    });

    if (this.props.edit) {
      const { id }: any = this.props?.match?.params || 0;
      console.log(id);
      await request("GET", `TL_RetailSale(${id})`)
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
          console.log(vendor);
          console.log(this.props.edit);

          state = {
            ...data,
            vendor,
            seriesList,
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
        Series: data?.Series,
        CardCode: data?.CardCode,
        CardName: data?.CardName,
        U_tl_bplid: data?.U_tl_bplid,
        U_tl_pump: data?.U_tl_pump,
        U_tl_cardcode: data?.CardCode,
        U_tl_cardname: data?.CardName,
        U_tl_shiftcode: data?.U_tl_shift_code,
        // U_tl_docdate: "2024-01-24T00:00:00Z",
        // U_tl_docduedate: "2024-01-24T00:00:00Z",
        // U_tl_taxdate: "2024-01-24T00:00:00Z",
        //Consumption
        TL_RETAILSALE_CONHCollection: data?.TL_RETAILSALE_CONHCollection,
        //Stock Allocation Collection
        TL_RETAILSALE_STACollection: data?.TL_RETAILSALE_STACollection,
        //  incoming payment
        TL_RETAILSALE_INCCollection: data?.TL_RETAILSALE_INCCollection,
      };

      if (id) {
        return await request("PATCH", `/TL_RetailSale('${id}')`, payload)
          .then((res: any) =>
            this.dialog.current?.success("Update Successfully.", id)
          )
          .catch((err: any) => this.dialog.current?.error(err.message))
          .finally(() => this.setState({ ...this.state, isSubmitting: false }));
      }

      await request("POST", "/TL_RetailSale", payload)
        .then((res: any) =>
          this.dialog.current?.success("Create Successfully.", res?.data?.Code)
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

  handlePreviousTab = () => {
    if (this.state.tapIndex > 0) {
      this.handlerChangeMenu(this.state.tapIndex - 1);
    }
  };

  HeaderTaps = () => {
    return (
      <>
        <div className="w-full flex justify-start">
          <MenuButton active={this.state.tapIndex === 0}>
            <span className="flex">Basic Information</span>
          </MenuButton>
          <MenuButton active={this.state.tapIndex === 1}>
            Consumption
          </MenuButton>
          <MenuButton active={this.state.tapIndex === 2}>
            <span> Incoming Payment</span>
          </MenuButton>
          <MenuButton active={this.state.tapIndex === 3}>
            <span> Stock Allocation</span>
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
                disabled={this.state.tapIndex === 3}
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
                    <Consumption
                      data={this.state}
                      handlerChange={this.handlerChange}
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

                  {this.state.tapIndex === 3 && (
                    <StockAllocationForm
                      data={this.state}
                      edit={this.props?.edit}
                      handlerChange={(key, value) => {
                        this.handlerChange(key, value);
                      }}
                    />
                  )}

                  <div className="sticky w-full bottom-4  mt-2 ">
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
                      {this.props.edit && (
                        <div>
                          <LoadingButton
                            variant="outlined"
                            size="small"
                            sx={{ height: "30px", textTransform: "none" }}
                            disableElevation
                          >
                            <span className="px-3 text-[13px] py-1 text-green-500">
                              Add
                            </span>
                          </LoadingButton>
                        </div>
                      )}

                      <div className="flex items-center space-x-4">
                        <LoadingButton
                          type="submit"
                          sx={{ height: "30px", textTransform: "none" }}
                          className="bg-white"
                          loading={false}
                          size="small"
                          variant="contained"
                          disableElevation
                        >
                          <span className="px-6 text-[13px] py-4 text-white">
                            {this.props.edit ? "Update" : "Post"}
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
