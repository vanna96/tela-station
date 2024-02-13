import React from "react";
import BusinessPartner from "../../models/BusinessParter";
import { Backdrop, CircularProgress } from "@mui/material";
import FormMessageModal from "../modal/FormMessageModal";
import DocumentHeaderComponent, {
  StatusCustomerBranchCurrencyInfoLeftSide,
  TotalSummaryRightSide,
} from "../DocumenHeaderComponent";
import { VendorModalType } from "../modal/VendorModal";

export interface NonCoreDcumentState {
  collapse: boolean;
  CardCode?: any;
  CardName?: any;
  Currency?: string | undefined | null;
  PriceLists?: string | undefined | null;
  Series: any;
  DocNum: any;
  isSubmitting: boolean;
  title: string;
  message: string;
  showDialogMessage: boolean;
  disable: any;
  error: any;
  SerieLists: any[];
  tapIndex: number;
  ContentLoading?: any;
  isDialogOpen: boolean;
  isLoadingSerie: boolean;
  isOpenVendor: boolean;
  vendorType: VendorModalType;
  VendorRef?: string | undefined | null;
}

export default abstract class NonCoreDcument extends React.Component<
  any,
  NonCoreDcumentState
> {
  dialog = React.createRef<FormMessageModal>();

  protected constructor(props: any) {
    super(props);
    this.state = {
      collapse: false,
      CardCode: "",
      CardName: "",
      Currency: "",
      PriceLists: "",
      Series: "",
      DocNum: "",
      isSubmitting: false,
      title: "",
      message: "",
      showDialogMessage: false,
      disable: "",
      isOpenVendor: false,
      vendorType: "customer",
      error: "",
      SerieLists: [],
      tapIndex: 0,
      ContentLoading: "",
      isDialogOpen: false,
      isLoadingSerie: true,
    };

    this.handlerChange = this.handlerChange.bind(this);
    this.handlerChangeObject = this.handlerChangeObject.bind(this);
  }

  abstract FormRender(): JSX.Element;

  abstract HeaderTaps(): JSX.Element;

  abstract LeftSideField?(): JSX.Element | React.ReactNode;

  abstract RightSideField?(): JSX.Element | React.ReactNode;

  abstract HeaderCollapeMenu?(): JSX.Element | React.ReactNode;

  render() {
    return (
      <div className="grow flex flex-col">
        <FormMessageModal ref={this.dialog} />

        <Backdrop
          sx={{
            color: "#fff",
            backgroundColor: "rgb(251 251 251 / 60%)",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={this.state.isSubmitting}
        >
          <CircularProgress />
        </Backdrop>

        <div className="flex flex-col w-full  grow ">
          <DocumentHeaderComponent
            data={this.state}
            menuTabs={<this.HeaderTaps />}
            HeaderCollapeMenu={
              this.HeaderCollapeMenu?.() ?? (
                <>
                  <StatusCustomerBranchCurrencyInfoLeftSide data={this.state} />
                  <TotalSummaryRightSide data={this.state} />
                </>
              )
            }
            leftSideField={
              <>
                {this.LeftSideField?.() ?? (
                  <StatusCustomerBranchCurrencyInfoLeftSide data={this.state} />
                )}
              </>
            }
            rightSideField={
              this.RightSideField?.() ?? (
                <TotalSummaryRightSide data={this.state} />
              )
            }
          />
          <div className={`grow  flex flex-col px-4 py-3 gap-2 w-full `}>
            <this.FormRender />
            <div className="mt-4"></div>
          </div>
        </div>
      </div>
    );
  }

  protected handlerCollapse() {
    this.setState({ ...this.state, collapse: !this.state.collapse });
  }

  protected handlerChange(key: string, value: any) {
    let temps: any = { ...this.state };
    temps[key] = value;

    // if (key in this.state.error) {
    //   temps["error"] = {};
    // }

    switch (key) {
      case "vendor":
        const vendor = value as BusinessPartner;
        temps["CardCode"] = vendor.cardCode;
        temps["CardName"] = vendor.cardName;
        temps["isOpenVendor"] = false;
        temps["Currency"] = vendor.defaultCurrency || vendor.currency;
        temps["PriceLists"] = vendor.priceLists;

        break;

      case "Series":
        const document = this.state.SerieLists.find(
          (e: any) => e.Series === value
        );
        temps["DocNum"] = document?.NextNumber;
        break;

        const total = parseFloat(value) > DocTotalBeforeDiscount;
        DocDiscountPercent = total
          ? 100
          : (value / DocTotalBeforeDiscount) * 100;
        temps["DocDiscountPercent"] =
          DocDiscountPercent >= 10
            ? DocDiscountPercent
            : DocDiscountPercent / 10;
        temps["DocDiscountPrice"] = total ? 0 : value;
        temps = this.findTotalVatRate(temps);
        break;
      default:
        break;
    }
    this.setState(temps);
  }

  protected handlerChangeObject(value: Record<string, any>) {
    this.setState({ ...this.state, ...value });
  }
}
