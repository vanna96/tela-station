import React from "react";
import {
  HiOutlineEye,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineDocumentAdd,
  HiOutlineChevronDown,
} from "react-icons/hi";
import VendorModal from "../modal/VendorModal";
import BusinessPartner from "../../models/BusinessParter";
import BackButton from "../button/BackButton";
import { Backdrop, CircularProgress } from "@mui/material";
import Modal from "../modal/Modal";
import {
  ToastContainer,
  ToastOptions,
  TypeOptions,
  toast,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VendorModalType } from "../modal/VendorModal";
import FormMessageModal from "../modal/FormMessageModal";
import ContactPersonModal from "@/presentations/master/supplierMasterData/components/ContactPersonModal";
import ProjectModal from "../modal/ProjectModal";
import Project from "@/models/Project";
import BusinessPatners from "@/models/BusinessPartner";
import AddressModal from "@/presentations/master/supplierMasterData/components/AddressesModal";
import shortid from "shortid";
const contextClass: any = {
  success: "bg-blue-600",
  error: "bg-red-600",
  info: "bg-gray-600",
  warning: "bg-orange-400",
  default: "bg-indigo-600",
  dark: "bg-white-600 font-gray-300",
};

type ModelDialog = "success" | "error";

export interface CoreBussinessPartnerState {
  isOpenItem: boolean;
  isOpenAccount: boolean;
  isOpenContactPerson: boolean;
  isOpenAddress: boolean;
  cardCode?: any;
  cardName?: any;
  isOpenProject?: boolean;
  contactEmployees?: any;
  bPAddresses?: any;
  project?: string | undefined | null;
  attachments?: any[];
  attachmentEntry?: null;
  // ContactEmployees: [];
  series: any[];
  serie: any;
  docNum: any;
  isSubmitting: boolean;
  title: string;
  message: string;
  showDialogMessage: boolean;
  collapse: boolean;
  loading: boolean;
  isOpenVendor: boolean;
  vendorType: VendorModalType;
  isLoadingSerie: boolean;
}

export default abstract class CoreBussinessPartnerDocument extends React.Component<
  any,
  CoreBussinessPartnerState
> {
  dialog = React.createRef<FormMessageModal>();

  protected constructor(props: any) {
    super(props);
    this.state = {
      isLoadingSerie: true,
      collapse: true,
      cardCode: null,
      cardName: null,
      attachmentEntry: null,
      isOpenItem: false,
      isOpenAccount: false,
      isOpenContactPerson: false,
      isOpenAddress: false,
      project: null,
      isOpenProject: false,
      series: [],
      serie: "",
      contactEmployees: [],
      bPAddresses: [],
      docNum: null,
      isSubmitting: false,
      message: "",
      showDialogMessage: false,
      title: "",
      loading: true,
      isOpenVendor: false,
      vendorType: "supplier",
    };

    this.handlerConfirmVendor = this.handlerConfirmVendor.bind(this);
    this.handlerConfirmContactPerson =
      this.handlerConfirmContactPerson.bind(this);
    this.handlerConfirmAddress = this.handlerConfirmAddress.bind(this);
    this.handlerChangeItems = this.handlerChangeItems.bind(this);
    this.handlerDeleteItem = this.handlerDeleteItem.bind(this);
    this.handlerChangeItemss = this.handlerChangeItemss.bind(this);
    this.handlerDeleteItems = this.handlerDeleteItems.bind(this);
  }

  abstract FormRender(): JSX.Element;

  render() {
    return (
      <>
        <ContactPersonModal
          open={this.state.isOpenContactPerson}
          onOk={this.handlerConfirmContactPerson}
          onClose={() => this.handlerCloseContactPerson()}
        />
        <AddressModal
          open={this.state.isOpenAddress}
          onOk={this.handlerConfirmAddress}
          onClose={() => this.handlerCloseAddress()}
          type={"shipTO"}
        />
        <VendorModal
          open={this.state.isOpenVendor}
          onOk={this.handlerConfirmVendor}
          onClose={() => this.handlerCloseVendor()}
          type={this.state.vendorType}
        />
        <ProjectModal
          open={this.state.isOpenProject}
          onClose={() => this.handlerCloseProject()}
          onOk={(project) => this.handlerConfirmProject(project)}
        />

        <ToastContainer
          toastClassName={({ type }: any) =>
            contextClass[type || "default"] +
            " relative flex p-1 min-h-6 rounded-md justify-between overflow-hidden cursor-pointer"
          }
          bodyClassName={() => "text-sm font-white font-med block p-3"}
        />
        <Modal
          title={this.state.title}
          open={this.state.showDialogMessage}
          onClose={() => {}}
          onOk={() => {}}
          widthClass="w-[30rem]"
        >
          <span className="text-sm">{this.state.message}</span>
        </Modal>

        <FormMessageModal ref={this.dialog} />

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.isSubmitting}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <div className="bg-gray-100 flex flex-col  w-full h-full p-4 relative">
          <div className=" rounded-lg px-6 py-4 flex items-center justify-between sticky top-3 gap-3  border-b bg-white shadow-sm xl:text-sm font-bold z-20">
            <div className="flex gap-3 items-center">
              <BackButton />
              <div>Item Master Data</div>
            </div>

            <div className="px-3 flex items-center gap-3">
              <div
                role="button"
                className=" hover:bg-gray-200 rounded-lg p-2 px-3 text-base border hover:text-blue-500"
              >
                <HiOutlineDocumentAdd className="" />
              </div>
              <div
                role="button"
                className=" hover:bg-gray-200 rounded-lg p-2 px-3 text-base border hover:text-blue-500"
              >
                <HiOutlineEye className="" />
              </div>
              <div
                role="button"
                className=" hover:bg-gray-200 rounded-lg p-2 px-3 text-base border hover:text-blue-500"
              >
                <HiChevronDoubleLeft className="" />
              </div>
              <div
                role="button"
                className=" hover:bg-gray-200 rounded-lg p-2 px-3 text-base border hover:text-blue-500"
              >
                <HiChevronLeft className="" />
              </div>
              <div
                role="button"
                className=" hover:bg-gray-200 rounded-lg p-2 px-3 text-base border hover:text-blue-500"
              >
                <HiChevronRight className="" />
              </div>
              <div
                role="button"
                className=" hover:bg-gray-200 rounded-lg p-2 px-3 text-base border hover:text-blue-500"
              >
                <HiChevronDoubleRight className="" />
              </div>
            </div>

            <div
              role="button"
              onClick={() => this.handlerCollapse()}
              className={`hover:border absolute left-[45%] -bottom-4 p-[8px] bg-white hover:bg-gray-200 border shadow rounded-full text-xl text-gray-600 transition-all transform duration-200 delay-100 ${
                this.state.collapse ? "rotate-0" : "rotate-180"
              }`}
            >
              {" "}
              <HiOutlineChevronDown />
            </div>
          </div>

          <div
            className={`w-full p-3 flex justify-between gap-3 stick ${
              this.state.collapse ? "" : "hidden"
            } transition-transform  delay-100 duration-200  my-3 rounded-lg xl:text-sm font-bold bg-white shadow-sm border z-10`}
          >
            <div></div>
            <div className="flex items-center">
              <div
                role="button"
                className={`p-2 px-4 flex flex-col ${
                  false ? "border-b-[3px] border-blue-500" : ""
                }`}
              >
                <span className="">General</span>
              </div>
              <div
                role="button"
                className={`p-2 px-4 flex flex-col ${
                  false ? "border-b-[3px] border-blue-500" : ""
                }`}
              >
                Content
              </div>
              <div
                role="button"
                className={`p-2 px-4 flex flex-col ${
                  false ? "border-b-[3px] border-blue-500" : ""
                }`}
              >
                Attachment
              </div>
            </div>
          </div>

          <div
            className={`grow flex flex-col gap-4 w-full ${
              this.state.collapse ? "" : "mt-4"
            }`}
          >
            <this.FormRender />
            <div className="mt-4"></div>
          </div>
        </div>
      </>
    );
  }

  protected handlerOpenAccount() {
    this.setState({ ...this.state, isOpenAccount: true });
  }
  protected handlerCollapse() {
    this.setState({ ...this.state, collapse: !this.state.collapse });
  }

  protected handlerOpenContactPerson() {
    this.setState({ ...this.state, isOpenContactPerson: true });
  }
  protected handlerConfirmContactPerson(person: any) {
    this.setState({
      ...this.state,
      isOpenContactPerson: false,
      contactEmployees: [
        ...this.state.contactEmployees,
        { ...person, id: shortid.generate() },
      ],
    });
  }
  protected handlerOpenAddress() {
    this.setState({ ...this.state, isOpenAddress: true });
  }
  protected handlerConfirmAddress(address: any) {
    this.setState({
      ...this.state,
      isOpenAddress: false,
      bPAddresses: [
        ...this.state.bPAddresses,
        { ...address, id: shortid.generate() },
      ],
    });
  }
  private handlerCloseAddress() {
    // this.setState({ ...this.state, isOpenItem: false })
  }
  private handlerCloseContactPerson() {
    // this.setState({ ...this.state, isOpenItem: false })
  }

  protected handlerOpenProject() {
    this.setState({ ...this.state, isOpenProject: true });
    console.log(this.state);
    
  }
  private handlerCloseProject() {
    // this.setState({ ...this.state, isOpenProject: false })
  }

  protected handlerConfirmProject(record: Project) {
    this.setState({
      ...this.state,
      project: record.code,
      isOpenProject: false,
    });
  }

  protected handlerChange(key: string, value: any) {
    let temps: any = { ...this.state };
    temps[key] = value;

    this.setState(temps);
  }

  protected toast(message: string, type: TypeOptions) {
    toast(message, {
      position: "top-right",
      type: type,
      theme: "colored",
      icon: false,
    });
  }

  protected showMessage(title: string, message: string) {
    this.setState({
      ...this.state,
      title: title,
      message: message,
      showDialogMessage: true,
      isSubmitting: false,
    });
  }

  protected handlerCloseDialogMessage(cb?: Function) {
    this.setState({
      ...this.state,
      showDialogMessage: false,
    });

    if (cb) {
      cb();
    }
  }
  protected handlerConfirmVendor(record: BusinessPartner) {
    this.setState({
      ...this.state,
      cardCode: record.cardCode,
      cardName: record.cardName,
      isOpenVendor: false,
    });
  }

  protected handlerOpenVendor(type: VendorModalType) {
    this.setState({ ...this.state, isOpenVendor: true, vendorType: type });
  }
  private handlerCloseVendor() {
    // this.setState({ ...this.state, isOpenVendor: false })
  }
  protected handlerChangeItems({ value, record, field }: any) {
    let contactEmployees = [...(this.state.contactEmployees ?? [])];
    let contactEmployee = this.state.contactEmployees?.find(
      (e: any) => e?.cardCode === record?.cardCode
    );
    contactEmployee[field] = value;
    const index = contactEmployees.findIndex(
      (e: any) => e?.CardCode === record.cardCode
    );
    if (index > 0) contactEmployees[index] = contactEmployee;
    this.setState({ ...this.state, contactEmployees });
  }

  protected handlerDeleteItem(code: string) {
    let contactEmployees = [...(this.state.contactEmployees ?? [])];
    const index = contactEmployees.findIndex((e: any) => e?.CardCode === code);
    contactEmployees.splice(index, 1);
    this.setState({ ...this.state, contactEmployees: contactEmployees });
  }

  protected handlerChangeItemss({ value, record, field }: any) {
    let bPAddresses = [...(this.state.bPAddresses ?? [])];
    let bPAddress = this.state.bPAddresses?.find(
      (e: any) => e?.cardCode === record?.cardCode
    );
    bPAddress[field] = value;
    const index = bPAddresses.findIndex(
      (e: any) => e?.CardCode === record.cardCode
    );
    if (index > 0) bPAddresses[index] = bPAddress;
    this.setState({ ...this.state, bPAddresses });
  }

  protected handlerDeleteItems(code: string) {
    let bPAddresses = [...(this.state.bPAddresses ?? [])];
    const index = bPAddresses.findIndex((e: any) => e?.CardCode === code);
    bPAddresses.splice(index, 1);
    this.setState({ ...this.state, bPAddresses: bPAddresses });
  }
}
