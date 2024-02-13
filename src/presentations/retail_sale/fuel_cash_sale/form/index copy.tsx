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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

class Form extends CoreFormDocument {
  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
      showCollapse: false,
      nozzleData: [],
      U_tl_bplid: 1,
      dispenserData: [],
      U_tl_docdate: new Date(),
      allocationData: [],
      stockAllocationData: [],
      cashBankData: [
        {
          U_tl_paytype: "cash",
          U_tl_paycur: "USD",
          U_tl_amtcash: 0,
          U_tl_amtbank: 0,
        },
      ],
      checkNumberData: [
        {
          U_tl_acccheck: "111122",
          U_tl_checkdate: new Date(),
          U_tl_checkbank: "",
          U_tl_amtcheck: 0,
        },
      ],
      couponData: [
        {
          U_tl_acccoupon: "11233",
          U_tl_amtcoupon: 0,
          U_tl_couponcurr: "USD",
          // U_tl_totalusd: 0,
          // U_tl_totalkhr: 0,
          // U_tl_over: 0,
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
            CardCode: data.U_tl_cardcode,
            CardName: data.U_tl_cardname,
            seriesList,
            nozzleData: data.TL_RETAILSALE_CONHCollection,
            // ?.map((item: any) => ({
            //   U_tl_pumpcode: item.U_tl_nozzlecode,
            //   U_tl_itemnum: item.U_tl_itemcode,
            //   U_tl_itemdesc: item.U_tl_itemname,
            //   U_tl_uom: item.U_tl_uom,
            //   new_meter: item.U_tl_nmeter,
            //   U_tl_upd_meter: item.U_tl_ometer,
            //   U_tl_cmeter: item.U_tl_cmeter,

            //   U_tl_cardallow: item.U_tl_cardallow,
            //   U_tl_cashallow: item.U_tl_cashallow,
            //   U_tl_ownallow: item.U_tl_ownallow,
            //   U_tl_partallow: item.U_tl_partallow,
            //   U_tl_pumpallow: item.U_tl_pumpallow,
            //   U_tl_stockallow: item.U_tl_stockallow,
            //   U_tl_totalallow: item.U_tl_totalallow,
            // })),
            allocationData: data.TL_RETAILSALE_CONHCollection,
            // ?.map(
            //   (item: any) => ({
            //     U_tl_pumpcode: item.U_tl_nozzlecode,
            //     U_tl_itemnum: item.U_tl_itemcode,
            //     U_tl_itemdesc: item.U_tl_itemname,
            //     U_tl_uom: item.U_tl_uom,
            //     new_meter: item.U_tl_nmeter,
            //     U_tl_upd_meter: item.U_tl_ometer,
            //     U_tl_cmeter: item.U_tl_cmeter,

            //     U_tl_cardallow: item.U_tl_cardallow,
            //     U_tl_cashallow: item.U_tl_cashallow,
            //     U_tl_ownallow: item.U_tl_ownallow,
            //     U_tl_partallow: item.U_tl_partallow,
            //     U_tl_pumpallow: item.U_tl_pumpallow,
            //     U_tl_stockallow: item.U_tl_stockallow,
            //     U_tl_totalallow: item.U_tl_totalallow,
            //   })
            // ),
            stockAllocationData: data?.TL_RETAILSALE_STACollection?.map(
              (item: any) => ({
                U_tl_bplid: item.U_tl_bplid,
                U_tl_itemcode: item.U_tl_itemcode,
                U_tl_itemname: item.U_tl_itemname,
                U_tl_qtyaloc: item.U_tl_qtyaloc,
                U_tl_qtycon: item.U_tl_qtycon,
                U_tl_qtyopen: item.U_tl_qtyopen,
                U_tl_remark: item.U_tl_remark,
                U_tl_uom: item.U_tl_uom,
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
        Series: data?.Series,
        U_tl_bplid: data?.U_tl_bplid,
        U_tl_pump: data?.U_tl_pump,
        U_tl_cardcode: data?.CardCode,
        U_tl_cardname: data?.CardName,
        U_tl_shiftcode: data?.U_tl_shift_code,
        U_tl_docdate: new Date(),
        U_tl_docduedate: new Date(),
        U_tl_taxdate: new Date(),
        //Consumption
        TL_RETAILSALE_CONHCollection: data?.nozzleData
          ?.filter((e: any) => e.U_tl_nmeter > 0)
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
        //Stock Allocation Collection
        TL_RETAILSALE_STACollection: data?.stockAllocationData,
        //  incoming payment
        TL_RETAILSALE_INCCollection: data?.TL_RETAILSALE_INCCollection,
      };

      if (id) {
        return await request("PATCH", `/TL_RetailSale(${id})`, payload)
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

  handleCloseDialog = () => {
    this.setState({ isDialogOpen: false });
  };

  getRequiredFieldsByTab(tabIndex: number): string[] {
    const requiredFieldsMap: { [key: number]: string[] } = {
      0: ["U_tl_pump", "CardCode"],
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
                  {this.state.tapIndex === 0 && (
                    <GeneralForm
                      data={this.state}
                      edit={this.props?.edit}
                      handlerChange={(key, value) =>
                        this.handlerChange(key, value)
                      }
                      handlerChangeObject={(value: any) =>
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
                      handlerChangeObject={(value: any) =>
                        this.handlerChangeObject(value)
                      }
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
                      onChange={(key, value) => {
                        this.handlerChange(key, value);
                      }}
                    />
                  )}
                  {this.state.tapIndex === 4 && (
                    <CardCount
                      handlerChangeObject={(value: any) =>
                        this.handlerChangeObject(value)
                      }
                      data={this.state}
                      edit={this.props?.edit}
                      onChange={(key, value) => {
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
