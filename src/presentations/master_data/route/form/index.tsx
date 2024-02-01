import CoreFormDocument from "@/components/core/CoreFormDocument";
import { withRouter } from "@/routes/withRouter";
import { LoadingButton } from "@mui/lab";
import MenuButton from "@/components/button/MenuButton";
import { FormValidateException } from "@/utilies/error";
import LoadingProgress from "@/components/LoadingProgress";
import request from "@/utilies/request";
import GeneralForm from "../components/General";
import React, { useContext } from "react";
import { ServiceModalComponent } from "@/presentations/collection/outgoing_payment/components/ServiceModalComponent";
import ContentForm from "../components/ExpenseTable";
import Sequence from "../components/Sequence";
import Left from "../components/LeftHeader";
import Right from "../components/RightHeader";
import DataTable from "../components/DataTable";

class RouteForm extends CoreFormDocument {

  serviceRef = React.createRef<ServiceModalComponent>();

  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
      Code: null,
      Name: null,
      U_BaseStation: null,
      U_Destination: null,
      U_Distance: null,
      U_Duration: null,
      headerRoute: true,

    } as any;

    this.onInit = this.onInit.bind(this);
    this.handlerSubmit = this.handlerSubmit.bind(this);
    this.handlerChangeMenu = this.handlerChangeMenu.bind(this);
    this.hanndResetState = this.hanndResetState.bind(this);
    this.handlerRemoveItem = this.handlerRemoveItem.bind(this);
    this.hanndAddNewItem = this.hanndAddNewItem.bind(this);
  }

  RightSideField?(): JSX.Element | React.ReactNode {
    return <div></div>;
  }
  HeaderCollapeMenu?(): JSX.Element | React.ReactNode {
    return (
      <>
        <div>
          <Left data={this.state}/>
        </div>
        <div>
          <Right data={this.state}/>
        </div>
      </>
    );
  }
  LeftSideField?() {
    return <div></div>;
  }

  componentDidMount(): void {
    this.setState({ loading: true });
    this.onInit();
  }

  async onInit() {
    let state: any = { ...this.state };

    if (this.props.edit) {
      const { id }: any = this.props?.match?.params || 0;
      await request("GET", `TL_ROUTE('${id}')`)
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

    if (this.props.detail) {
      const { id }: any = this.props?.match?.params || 0;
      await request("GET", `TL_ROUTE('${id}')`)
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
      if (!data.U_BaseStation) {
        data["error"] = { U_BaseStation: "Base Station is Required!" };
        throw new FormValidateException("Base Station is Required!", 0);
      }
      if (!data.U_Destination) {
        data["error"] = { U_Destination: "Destination is Required!" };
        throw new FormValidateException("Destination is Required!", 0);
      }
      if (!data.Code) {
        data["error"] = { Code: "Route Code is Required!" };
        throw new FormValidateException("Route Code is Required!", 0);
      }
      if (!data.Name) {
        data["error"] = { Name: "Route Name is Required!" };
        throw new FormValidateException("Route Name is Required!", 0);
      }
      const payload = {
        Code: data?.Code,
        Name: data?.Name,
        U_BaseStation: data?.U_BaseStation,
        U_Destination: data?.U_Destination,
        U_Distance: data?.U_Distance,
        U_Duration: data?.U_Duration,
        U_Incentive: data?.U_Incentive,
        U_Status: data?.U_Status,
        U_Remark: data?.U_Remark,
        TL_RM_EXPENSCollection: data.TL_RM_EXPENSCollection,
        TL_RM_SEQUENCECollection: data.TL_RM_SEQUENCECollection,
      };

      if (id) {
        return await request("PATCH", `/TL_ROUTE('${id}')`, payload)
          .then((res: any) =>
            this.dialog.current?.success("Update Successfully.", id)
          )
          .catch((err: any) => this.dialog.current?.error(err.message))
          .finally(() => this.setState({ ...this.state, isSubmitting: false }));
      }

      await request("POST", "/TL_ROUTE", payload)
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

  hanndResetState(props: any) {
    this.setState({
      ...props,
    } as any);
  }
  handlerRemoveItem(code: string) {
    let items = [...(this.state.Items ?? [])];
    const index = items.findIndex((e: any) => e?.Code === code);
    items.splice(index, 1);
    this.setState({ ...this.state, Items: items });
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
        <MenuButton
          active={this.state.tapIndex === 0}
          onClick={() => this.handlerChangeMenu(0)}
        >
          General
        </MenuButton>
        <MenuButton
          active={this.state.tapIndex === 1}
          onClick={() => this.handlerChangeMenu(1)}
        >
          Expense
        </MenuButton>
        <MenuButton
          active={this.state.tapIndex === 2}
          onClick={() => this.handlerChangeMenu(2)}
        >
          Sequence
        </MenuButton>
      </>
    );
  };
  hanndAddNewItem() {
    // this.serviceRef.current?.onOpen(this.state?.CardCode)
  }
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
                    data={this.state}
                    setData={this.setState}
                    edit={this.props?.edit}
                    detail={this.props?.detail}
                    handlerChange={(key, value) =>
                      this.handlerChange(key, value)
                    }
                  />
                )}
                {this.state.tapIndex === 1 && (
                  <ContentForm
                    data={this.state}
                    detail={this.props?.detail}
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
                  <Sequence
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
              </div>
            </>
          )}
          {this.state.DocumentStatus !== "Closed" && (
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
          )}
        </form>
      </>
    );
  };
}

export default withRouter(RouteForm);
