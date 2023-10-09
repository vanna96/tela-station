import CoreFormDocument from "@/components/core/CoreFormDocument";
import { withRouter } from "@/routes/withRouter";
import { LoadingButton } from "@mui/lab";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import MenuButton from "@/components/button/MenuButton";
import { FormValidateException } from "@/utilies/error";
import LoadingProgress from "@/components/LoadingProgress";

import GeneralForm from "./../components/GeneralForm";
import ContentForm from "./../components/ContentForm";
import AttachmentForm from "../components/AttachmentForm";
import React, { useContext } from "react";
import { ServiceModalComponent } from "../components/ServiceModalComponent";
import { fetchSAPFile, formatDate, getAttachment } from "@/helper/helper";
import request from "@/utilies/request";
import BusinessPartner from "@/models/BusinessParter";
import { arrayBufferToBlob } from "@/utilies";
import shortid from "shortid";
import { APIContext } from "../../context/APIContext";
import { LogsModal } from "../components/LogsModal";
import { Alert, Snackbar, Button } from "@mui/material";

class Form extends CoreFormDocument {
  logsRef = React.createRef<LogsModal>();

  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
      DocType: "rSupplier",
      PaymentonAccount: "tNo",
      DocContentType: "dDocument_Items",
      ContentLoading: false,
      ExchangeRate: 1,
      LineofBusiness: "",
      SalesPersonCode: "",
      Branch: 1,
    } as any;

    this.onInit = this.onInit.bind(this);
    this.handlerRemoveItem = this.handlerRemoveItem.bind(this);
    this.handlerSubmit = this.handlerSubmit.bind(this);
    this.handlerChangeMenu = this.handlerChangeMenu.bind(this);
    this.hanndAddNewItem = this.hanndAddNewItem.bind(this);
    this.hanndResetState = this.hanndResetState.bind(this);
  }

  componentDidMount(): void {
    this.setState({ loading: true });
    this.onInit();
  }

  async onInit() {
    let state: any = { ...this.state };
    let seriesList: any = this.props?.query?.find("return-series");
    let defaultSeries: any = this.props?.query?.find("return-default-series");

    if (!seriesList) {
      seriesList = await DocumentSerieRepository.getDocumentSeries({
        Document: "24",
      });
      this.props?.query?.set("return-series", seriesList);
    }

    if (!defaultSeries) {
      defaultSeries = await DocumentSerieRepository.getDefaultDocumentSerie({
        Document: "24",
      });
      this.props?.query?.set("return-default-series", defaultSeries);
    }

    if (this.props.edit) {
      const { id }: any = this.props?.match?.params || 0;
      await request("GET", `TL_ExpClear(${id})`)
        .then(async (res: any) => {
          const data: any = res?.data;
          // attachment
          let AttachmentList: any = [];

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
          let result: any = [];
          data?.TL_EXP_CLEAR_LINESCollection?.reduce(function (
            res: any,
            value: any
          ) {
            if (!res[value.U_tl_expcode]) {
              res[value.U_tl_expcode] = {
                ...value,
                U_tl_expcode: value.U_tl_expcode,
                U_tl_linetotal: 0,
              };
              result.push(res[value.U_tl_expcode]);
            }
            res[value.U_tl_expcode].U_tl_linetotal += value.U_tl_linetotal;
            return res;
          }, {});
          console.log(data?.U_tl_cashacct);

          state = {
            ...data,
            DocumentStatus: data?.Status === "C" ? "Closed" : "Open",
            GLCash: data?.U_tl_cashacct,
            Branch: data?.U_tl_bplid,
            Items: result || [],
            Logs: data?.TL_EXP_CLEAR_LINESCollection || [],
            refs: data?.TL_EXP_CLEAR_LINESCollection || [],
          };
        })
        .catch((err: any) => console.log(err))
        .finally(() => {
          state["SerieLists"] = seriesList;
          state["Series"] = defaultSeries.Series;
          state["loading"] = false;
          state["isLoadingSerie"] = false;
          this.setState(state);
        });
    } else {
      state["SerieLists"] = seriesList;
      state["Series"] = defaultSeries.Series;
      state["DocNum"] = defaultSeries.NextNumber;
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

  async handlerSubmit(postToERP: boolean, sysInfo: any, tlExpDic: any) {
    const data: any = { ...this.state };

    try {
      this.setState({ ...this.state, isSubmitting: true });
      await new Promise((resolve) => setTimeout(() => resolve(""), 800));
      const { id } = this.props?.match?.params || 0;

      // attachment
      let TL_ATTECHCollection = null;
      const files = data?.AttachmentList?.map((item: any) => item);
      if (files?.length > 0) TL_ATTECHCollection = await getAttachment(files);

      if (postToERP) {
        const seList: any = await DocumentSerieRepository.getDocumentSeries({
          Document: "46",
        });

        var find = seList?.find(
          ({ BPLID, Locked }: any) =>
            BPLID.toString() === data?.Branch.toString() && Locked === "tNO"
        );
      }

      const payload = {
        OGSeries: find?.Series || "",
        // Series: data?.Series || null,
        U_tl_docdate: `${formatDate(
          data?.PostingDate || new Date()
        )}"T00:00:00Z"`,
        U_tl_taxdate: `${formatDate(
          data?.DocumentDate || new Date()
        )}"T00:00:00Z"`,
        U_tl_cashacct: data?.GLCash,
        U_tl_bplid: data?.Branch,
        postToERP,
        U_tl_doccur: data?.Currency || sysInfo?.SystemCurrency,
        TL_EXP_CLEAR_LINESCollection:
          data?.Logs?.map((log: any) => {
            const gl = tlExpDic.find(
              ({ Code }: any) => Code === log.U_tl_expcode
            );
            return {
              LineId: log.LineId,
              U_tl_baseentry: log.U_tl_baseentry || log.DocEntry,
              U_tl_linetotal: log.U_tl_linetotal,
              U_tl_expcode: log.U_tl_expcode,
              U_tl_expdesc: log.U_tl_expdesc,
              U_tl_remark: log.U_tl_remark,
              U_tl_expacct: gl.U_tl_expacct || "",
            };
          }) || [],
      };

      if (id) {
        return await request("PATCH", `/script/test/Clearance(${id})`, payload)
          .then(async (res: any) => {
            data?.LogsEntry?.forEach(async (e: any) => {
              await request("POST", `TL_ExpLog(${e.DocEntry})/Close`, {}).then(
                (res: any) => console.log()
              );
            });
            if (postToERP) {
              await request("POST", `TL_ExpClear(${id})/Close`, {}).then(
                (res: any) => console.log()
              );
            }
            return this.dialog.current?.success("Update Successfully.", id);
          })
          .catch((err: any) => this.dialog.current?.error(err.message))
          .finally(() => this.setState({ ...this.state, isSubmitting: false }));
      }

      console.log(payload);

      await request("POST", "/script/test/Clearance", payload)
        .then(async (res: any) => {
          data?.LogsEntry?.forEach(async (e: any) => {
            await request("POST", `TL_ExpLog(${e.DocEntry})/Close`, {}).then(
              (res: any) => console.log()
            );
          });
          if (postToERP) {
            await request(
              "POST",
              `TL_ExpClear(${res.data?.DocEntry})/Close`,
              {}
            ).then((res: any) => console.log());
          }
          return this.dialog.current?.success(
            "Create Successfully.",
            res.data?.DocEntry
          );
        })
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

  hanndResetState(props: any) {
    this.setState({
      DocType: "rSupplier",
      PaymentonAccount: "tNo",
      DocContentType: "dDocument_Items",
      BPProject: "",
      JournalMemo: "",
      Description: "",
      ContentLoading: "",
      //
      collapse: true,
      CardCode: "",
      CardName: "",
      ContactPersonCode: undefined,
      ContactPersonList: [],
      ShippingType: null,
      Phone: "",
      Email: "",
      Owner: "",
      Buyer: "",
      VendorRef: "",
      DocumentStatus: "Open",
      Remark: "",
      DocumentServiceItemType: "I",
      AttachmentEntry: 0,
      Project: "",
      isOpenItem: false,
      isOpenVendor: false,
      isOpenAccount: false,
      isOpenProject: false,
      PaymentMethod: "",
      PaymentTermType: "",
      Currency: "",
      PriceLists: "",
      SalesPersonCode: "",
      ShipToDefault: "",
      Renewal: false,
      Items: [],
      isSubmitting: false,
      message: "",
      showDialogMessage: false,
      title: "",
      showDistribution: false,
      inWhichDimension: 0,
      vendorType: "customer",
      isApproved: false,
      isOpenRequester: false,
      isOpenRequesterEmployee: false,
      Department: "",
      Branch: "",
      ReqType: 12,
      DocTaxTotal: 0,
      DocTotal: 0,
      DocTotalBeforeDiscount: 0,
      DocDiscountPercent: 0,
      DocDiscountPrice: 0,
      Rounded: false,
      Address: null,
      Address2: null,
      disable: {},
      tapIndex: 0,
      error: {},
      tabErrors: {
        general: false,
        content: false,
        logistic: false,
        attachment: false,
      },
      isDialogOpen: false,
      ...props,
    } as any);
  }

  handleNextTab = () => {
    const currentTab = this.state.tapIndex;
    const requiredFields = this.getRequiredFieldsByTab(currentTab);
    const hasErrors = requiredFields.some((field: any) => {
      if (field === "Items") {
        return (
          !this?.state[field] ||
          this.state[field]?.length === 0 ||
          this.state[field]?.some((field: any) => {
            return field.ExpenseCode === "" || field.Amount === "";
          })
        );
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
      0: ["GLCash"],
      1: ["Items"],
      2: [],
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
        <MenuButton active={this.state.tapIndex === 2}>Attachment</MenuButton>
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

  hanndAddNewItem() {
    // this.serviceRef.current?.onOpen(this.state?.CardCode)
  }

  handlerCopyFrom = async () => {
    if (!this.state?.Branch) return;

    const expLogs = await request(
      "GET",
      `/TL_ExpLog?$filter = Status eq 'O' and U_tl_bplid eq '${this.state?.Branch}'`
    )
      .then((res: any) => res.data?.value || [])
      .catch((err: any) => {});

    this.logsRef.current?.onOpen(expLogs, this.state.refs);
  };

  FormRender = () => {
    let { sysInfo, getPeriod, tlExpDic }: any = useContext(APIContext);
    let BranchIDD: any = this.state?.Branch || "";
    let SerieListsData: any = this.state?.SerieLists || [];

    let prevData = usePrevious({ BranchIDD });
    let serie = this.state?.SerieLists?.find(
      ({ BPLID }: any) => BPLID === BranchIDD
    );

    React.useEffect(() => {
      if (!this.props.edit) {
        if (SerieListsData.length > 0 && prevData?.BranchIDD !== BranchIDD) {
          this.setState({
            ...this.state,
            Series: serie?.Series,
            DocNum: serie?.NextNumber,
            loading: false,
          });
        }
      }

      if (getPeriod && serie && !this.state?.GLCash) {
        this.setState({
          ...this.state,
          GLCash: getPeriod?.AccountforCashReceipt,
          loading: false,
        });
      }
    }, [getPeriod, BranchIDD, serie]);

    return (
      <>
        <LogsModal
          ref={this.logsRef}
          handlerChange={(e: any) =>
            this.setState(Object.assign(this.state, e))
          }
        />
        <form
          id="formData"
          className="h-full w-full flex flex-col gap-4 relative"
        >
          {this.state.loading ? (
            <div className="w-full h-full flex item-center justify-center">
              <LoadingProgress />
            </div>
          ) : (
            <>
              <div className="grow">
                {this.state.tapIndex === 0 && (
                  <GeneralForm
                    hanndResetState={this.hanndResetState}
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

                {this.state.tapIndex === 2 && (
                  <AttachmentForm
                    data={this.state}
                    handlerChange={(key: any, value: any) => {
                      this.handlerChange(key, value);
                    }}
                  />
                )}
              </div>
            </>
          )}

          {this.state?.Status !== "C" && (
            <div className="sticky w-full bottom-4  mt-2 ">
              <div className="backdrop-blur-sm bg-white p-2 rounded-lg shadow-lg z-[1000] flex justify-between gap-3 border drop-shadow-sm">
                <div className="flex ">
                  <LoadingButton
                    size="small"
                    sx={{ height: "25px" }}
                    variant="contained"
                    disableElevation
                    onClick={this.handlerCopyFrom}
                  >
                    <span className="px-3 text-[11px] py-1 text-white">
                      Copy From
                    </span>
                  </LoadingButton>
                </div>
                <div className="flex items-center space-x-4">
                  <LoadingButton
                    sx={{ height: "25px" }}
                    loading={this.state.isSubmitting}
                    size="small"
                    variant="contained"
                    disableElevation
                    onClick={(e: any) =>
                      this.handlerSubmit(true, sysInfo, tlExpDic)
                    }
                  >
                    <span className="px-6 text-[11px] py-4 text-white">
                      Post to ERP
                    </span>
                  </LoadingButton>
                  <LoadingButton
                    sx={{ height: "25px" }}
                    className="bg-white"
                    loading={this.state.isSubmitting}
                    size="small"
                    variant="contained"
                    disableElevation
                    onClick={(e: any) =>
                      this.handlerSubmit(false, sysInfo, tlExpDic)
                    }
                  >
                    <span className="px-6 text-[11px] py-4 text-white">
                      {this.props.edit ? "Update" : "Save"}
                    </span>
                  </LoadingButton>
                </div>
              </div>
            </div>
          )}
        </form>
      </>
    );
  };
}

export default withRouter(Form);

function usePrevious(value: any) {
  const ref: any = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
