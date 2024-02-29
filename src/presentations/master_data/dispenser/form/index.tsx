import CoreFormDocument from "@/components/core/CoreFormDocument";
import { withRouter } from "@/routes/withRouter";
import { LoadingButton } from "@mui/lab";
import MenuButton from "@/components/button/MenuButton";
import { FormValidateException } from "@/utilies/error";
import GeneralForm from "../components/GeneralForm";
import request from "@/utilies/request";
import { CircularProgress, Button, Snackbar, Alert } from "@mui/material";
import { ItemModalComponent } from "@/components/modal/ItemComponentModal";
import PumpData from "../components/PumpData";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import UnitOfMeasurementGroupRepository from "@/services/actions/unitOfMeasurementGroupRepository";
import { motion } from "framer-motion";
import { ItemBinModal } from "@/components/modal/ItemBinModal";
import { RefObject, createRef } from "react";
class DispenserForm extends CoreFormDocument {
  itemBinModalRef: RefObject<ItemBinModal> = createRef();
  constructor(props: any) {
    super(props);
    this.itemBinModalRef = createRef();
    this.state = {
      ...this.state,
      loading: true,
      showCollapse: false,
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
      U_tl_bplid: 1 || "1",
      type: "sale", // Initialize type with a default value
      warehouseCode: "",
      tabErrors: {
        // Initialize error flags for each tab
        general: false,
        content: false,
        logistic: false,
        attachment: false,
      },
      isDialogOpen: false,
      Status: "New",
      lineofBusiness: "Oil",
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

    if (this.props.edit) {
      const { id }: any = this.props?.match?.params || 0;

      await request("GET", `TL_Dispenser('${id}')`)
        .then(async (res: any) => {
          const data: any = res?.data;
          state = {
            PumpCode: data?.Code,
            PumpName: data?.Name,
            NumOfPump: data?.U_tl_pumpnum,
            SalesPersonCode: data?.U_tl_empid,
            lineofBusiness: data?.U_tl_type,
            Status: data?.U_tl_status,
            Attendant1: data?.U_tl_attend1,
            Attendant2: data?.U_tl_attend2,
            U_tl_bplid: data?.U_tl_bplid,
            U_tl_whs: data?.U_tl_whs,
            PumpData: await Promise.all(
              (data?.TL_DISPENSER_LINESCollection || []).map(async (e: any) => {
                const UoMGroupEntry = await request(
                  "GET",
                  `Items('${e?.U_tl_itemnum}')?$select=UoMGroupEntry`
                );
                const UoMGroup = UoMGroupEntry;
                const uomGroups: any =
                  await new UnitOfMeasurementGroupRepository().get();

                const uoms = await new UnitOfMeasurementRepository().get();
                const uomGroup: any = uomGroups.find(
                  (row: any) => row.AbsEntry === UoMGroup?.data?.UoMGroupEntry
                );
                let uomLists: any[] = [];
                uomGroup?.UoMGroupDefinitionCollection?.forEach((row: any) => {
                  const itemUOM = uoms.find(
                    (record: any) => record?.AbsEntry === row?.AlternateUoM
                  );
                  if (itemUOM) {
                    uomLists.push(itemUOM);
                  }
                });
                //
                let item: any = {
                  pumpCode: e?.U_tl_pumpcode,
                  itemCode: e?.U_tl_itemnum,
                  UomAbsEntry: e?.U_tl_uom,
                  UomLists: uomLists,
                  registerMeeting: e?.U_tl_reg_meter,
                  updateMetering: e?.U_tl_upd_meter,
                  status: e?.U_tl_status,
                  LineId: e?.LineId,
                  binCode: e?.U_tl_bincode,
                };

                if (e?.U_tl_itemnum) {
                  const itemResponse: any = await request(
                    "GET",
                    `Items('${e?.U_tl_itemnum}')?$select=ItemName`
                  ).then((res: any) => res?.data);
                  item.ItemDescription = itemResponse?.ItemName;
                }
                return item;
              })
            ),
            Edit: true,
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

      if (!data.PumpCode) {
        data["error"] = { PumpCode: "Pump Code is Required!" };
        throw new FormValidateException("Pump Code is Required!", 0);
      }

      if (!data?.PumpName) {
        data["error"] = { PumpName: "Pump Name is Required!" };
        throw new FormValidateException("Pump Name is Required!", 0);
      }

      if (!data?.NumOfPump) {
        data["error"] = { NumOfPump: "Number Of Pump is Required!" };
        throw new FormValidateException("Number Of Pump is Required!", 0);
      }

      if (!data?.PumpData || data?.PumpData?.length === 0) {
        data["error"] = {
          PumpData: "Pump Data is missing and must at least one record!",
        };
        throw new FormValidateException("PumpData is missing", 1);
      }

      let DISPENSER_LINESCollection = this.state?.PumpData?.map((e: any) => {
        let status = "";
        const registerM =
          parseFloat(
            (e?.registerMeeting ?? "0.00").toString().replace(/,/g, "")
          ) || 0;
        const updateM =
          parseFloat(
            (e?.updateMetering ?? "0.00").toString().replace(/,/g, "")
          ) || 0;

        if (registerM <= 0 && updateM <= 0) status = "New";
        if (registerM > 0) status = "Initialized";
        if (updateM > 0) status = "Active";
        if (e?.status == "Inactive") status = "Inactive";

        return {
          U_tl_pumpcode: e?.pumpCode,
          U_tl_itemnum: e?.itemCode,
          U_tl_uom: e?.UomAbsEntry,
          U_tl_reg_meter: registerM,
          U_tl_upd_meter: updateM,
          U_tl_status: status,
          U_tl_bincode: e?.binCode,
        };
      });

      let status = this.state?.Status;
      let statusCondition =
        DISPENSER_LINESCollection?.filter(
          (p: any) => (p.U_tl_reg_meter || 0) > 0 || p?.U_tl_upd_meter || 0 > 0
        ).length > 0
          ? "Active"
          : "New";

      if (status !== "Inactive") status = statusCondition;

      const payloads = {
        Code: this.state?.PumpCode,
        Name: this.state?.PumpName,
        U_tl_pumpnum: this.state?.NumOfPump,
        U_tl_bplid: `${this.state?.U_tl_bplid}`,
        U_tl_whs: data?.U_tl_whs,
        U_tl_type: this.state?.lineofBusiness,
        U_tl_status: status,
        TL_DISPENSER_LINESCollection: DISPENSER_LINESCollection,
      };

      if (id) {
        return await request("PATCH", `/TL_Dispenser('${id}')`, payloads)
          .then((res: any) =>
            this.dialog.current?.success("Update Successfully.", id)
          )
          .catch((err: any) => this.dialog.current?.error(err.message))
          .finally(() => this.setState({ ...this.state, isSubmitting: false }));
      }

      await request("POST", "/TL_Dispenser", payloads)
        .then(async (res: any) => {
          if ((res && res.status === 200) || 201) {
            return this.dialog.current?.success(
              "Create Successfully.",
              res.data?.Code
            );
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
  handleCloseDialog = () => {
    // Close the dialog
    this.setState({ isDialogOpen: false });
  };

  getRequiredFieldsByTab(tabIndex: number): string[] {
    const requiredFieldsMap: { [key: number]: string[] } = {
      0: ["PumpCode", "PumpName", "NumOfPump", "lineofBusiness", "U_tl_whs"],
      // 1: ["Items"]
    };
    return requiredFieldsMap[tabIndex] || [];
  }

  HeaderTaps = () => {
    return (
      <>
        <div className="w-full mt-2">
          <MenuButton
            active={this.state.tapIndex === 0}
            onClick={() => this.handleMenuButtonClick(0)}
          >
            General
          </MenuButton>
          <MenuButton
            active={this.state.tapIndex === 1}
            onClick={() => this.handleMenuButtonClick(1)}
          >
            Nozzle
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
          type="inventory"
          group={itemGroupCode}
          onOk={(items) => {
            if (items.length) {
              let pumpData: any = this.state?.PumpData?.map(
                (item: any, index: number) => {
                  if (index.toString() === this.state?.pumpIndex.toString()) {
                    return {
                      ...item,
                      ...items[0],
                      itemCode: items[0]?.ItemCode,
                      ItemDescription: items[0]?.ItemDescription,
                      uom: items[0]?.UomName,
                    };
                  }
                  return item;
                }
              );

              this.handlerChange("PumpData", pumpData);
            }
          }}
          ref={this.itemModalRef}
          multipleSelect={false}
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
                        handlerChange={(key, value) => {
                          this.handlerChange(key, value);
                        }}
                        handlerChangeObject={(value: any) =>
                          this.handlerChangeObject(value)
                        }
                      />
                    )}
                    {this.state.tapIndex === 1 && (
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
                    )}

                    <div className="sticky w-full bottom-4  mt-2 ">
                      <div className="backdrop-blur-sm bg-white p-2 rounded-lg shadow-lg z-[1000] flex justify-end gap-3 border drop-shadow-sm">
                        <div className="flex ">
                          <LoadingButton
                            size="small"
                            sx={{ height: "25px" }}
                            variant="outlined"
                            style={{
                              background: "white",
                              border: "1px solid red",
                            }}
                            disableElevation
                            onClick={() =>
                              (window.location.href = "/master-data/pump")
                            }
                          >
                            <span className="px-3 text-[11px] py-1 text-red-500">
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
                              {this.props.edit ? "Update" : "Add"}
                            </span>
                          </LoadingButton>
                        </div>
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

export default withRouter(DispenserForm);
