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
import { arrayBufferToBlob } from "@/utilies";
import shortid from "shortid";
import { Alert, Snackbar, Button } from "@mui/material";

class Form extends CoreFormDocument {
  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
      U_tl_cashtype: "Cash Account",
      U_tl_cashactive: "Y",
      showCollapse: false
    } as any;

    this.onInit = this.onInit.bind(this);
    this.handlerSubmit = this.handlerSubmit.bind(this);
    this.handlerChangeMenu = this.handlerChangeMenu.bind(this);
    this.hanndResetState = this.hanndResetState.bind(this);
  }

  componentDidMount(): void {
    this.setState({ loading: true });
    this.onInit();
  }

  async onInit() {
    let state: any = { ...this.state };

    if (this.props.edit) {
      const { id }: any = this.props?.match?.params || 0;
      await request("GET", `TL_CashAcct('${id}')`)
        .then(async (res: any) => {
          const data: any = res?.data;
          // vendor

          state = {
            ...data,
          };
        })
        .catch((err: any) => console.log(err))
        .finally(() => {
          state["loading"] = false;
          this.setState(state);
        });
    } else {
      state["loading"] = false;
      this.setState(state);
    }
  }

  async handlerSubmit(event: any) {
    event.preventDefault();
    const data: any = { ...this.state };

    try {
      this.setState({ ...this.state, isSubmitting: true });
      await new Promise((resolve) => setTimeout(() => resolve(""), 800));
      const { id } = this.props?.match?.params || 0;

      if (!data.Code) {
        data["error"] = { Code: "Code is Required!" };
        throw new FormValidateException("Code is Required!", 0);
      }

      if (!data.Name) {
        data["error"] = { Name: "Name is Required!" };
        throw new FormValidateException("Name is Required!", 0);
      }
      
      if (!data.U_tl_cashacct) {
        data["error"] = { U_tl_cashacct: "G/L Account is Required!" };
        throw new FormValidateException("G/L Account is Required!", 0);
      }
      
      const payload = {
        Code: data?.Code,
        Name: data?.Name,
        U_tl_cashacct: data?.U_tl_cashacct,
        U_tl_cashtype: data?.U_tl_cashtype,
        U_tl_cashactive: data?.U_tl_cashactive
      };

      if (id) {
        return await request("PATCH", `/TL_CashAcct('${id}')`, payload)
          .then(
            (res: any) =>
              this.dialog.current?.success("Update Successfully.", id)
          )
          .catch((err: any) => this.dialog.current?.error(err.message))
          .finally(() => this.setState({ ...this.state, isSubmitting: false }));
      }

      await request("POST", "/TL_CashAcct", payload)
        .then(
          (res: any) =>
            this.dialog.current?.success(
              "Create Successfully.",
              res?.data?.Code
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

  hanndResetState(props: any) {
    this.setState({
      ...props,
    } as any);
  }

  handleNextTab = () => {
    const currentTab = this.state.tapIndex;
    const requiredFields = this.getRequiredFieldsByTab(currentTab);
  };

  handleCloseDialog = () => {
    this.setState({ isDialogOpen: false });
  };

  getRequiredFieldsByTab(tabIndex: number): string[] {
    const requiredFieldsMap: { [key: number]: string[] } = {};
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
      </>
    );
  };

  FormRender = () => {
    return (
      <>
        <form
          id="formData"
          onSubmit={(e: any) => this.handlerSubmit(e)}
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
              </div>
            </>
          )}
          {this.state.DocumentStatus !== "Closed" && (
            <div className="sticky w-full bottom-4  mt-2 ">
              <div className="backdrop-blur-sm bg-white p-2 rounded-lg shadow-lg z-[1000] flex justify-end gap-3 border drop-shadow-sm">
              <div className="flex ">
                <LoadingButton
                  size="small"
                  sx={{ height: "25px" }}
                  variant="outlined"
                  style={{
                    background: 'white',
                    border: '1px solid red'
                  }}
                  disableElevation
                  onClick={() => window.location.href = '/master-data/cash-account'}
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
          )}
        </form>
      </>
    );
  };
}

export default withRouter(Form);
