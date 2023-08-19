import CoreFormDocument from "@/components/core/CoreFormDocument";
import HeadingForm from "../components/Heading";
import ContentForm from "../components/Content";
import { withRouter } from "@/routes/withRouter";
import { LoadingButton } from "@mui/lab";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import LogisticForm from "../components/Logistic";
import AccounttingForm from "../components/Accountting";
import { UpdateDataSuccess } from "@/utilies/ClientError";
import PurchaseOrders from "../../../../models/PurchaseOrder";
import PurchaseOrderRepository from "../repository";
import PurchaseOrder from "../model";


class PurchaseOrderForm extends CoreFormDocument {
  HeaderTaps(): JSX.Element {
    throw new Error("Method not implemented.");
  }
  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
      DocDueDate: null,
    } as any;
    this.handlerRemoveItem = this.handlerRemoveItem.bind(this);
    this.handlerChangeItems = this.handlerChangeItems.bind(this);
    this.handlerSubmit = this.handlerSubmit.bind(this);
    this.onInit = this.onInit.bind(this);
  }

  componentDidMount(): void {
    this.setState({ ...this.state, vendorType: 'customer' })

    if (!this.props?.edit) {
      setTimeout(() => this.setState({ ...this.state, loading: false }), 500);
    }

    this.onInit();

    DocumentSerieRepository.getDocumentSeries(
      PurchaseOrderRepository.documentSerie
    ).then((res: any) => {
      this.setState({ ...this.state, SerieLists: res, isLoadingSerie: false });
    });

    if (!this.props.edit) {
      DocumentSerieRepository.getDefaultDocumentSerie(
        PurchaseOrderRepository.documentSerie
      ).then((res: any) => {
        this.setState({
          ...this.state,
          Series: res?.Series,
          DocNum: res?.NextNumber,
          isLoadingSerie: false,
        });
      });
    }
  }

  async onInit() {
    if (this.props.edit) {
      const { id } = this.props.match.params;
      let state: any = this.props.query.find('po-id-' + id);
      let disables: any = {};

      if (!state) {
        await new PurchaseOrderRepository().find(id).then(async (res: any) => {
          state = res;
          this.props.query.set('po-id-' + id, res);
        });
      }

      disables['DocumentLine'] = state?.Status === 'Close' || state?.Status === 'Cancel';
      this.setState({ ...state, disable: disables, loading: false });
    }

  }

  handlerRemoveItem(code: string) {
    let items = [...this.state.Items ?? []];
    const index = items.findIndex((e: any) => e?.ItemCode === code);
    items.splice(index, 1)
    this.setState({ ...this.state, Items: items })
  }

  async handlerSubmit(event: any) {
    event.preventDefault();

    this.setState({ ...this.state, isSubmitting: true });
    const { id } = this.props?.match?.params
    const payloads = new PurchaseOrder(this.state).toJson(this.props.edit);
    await new PurchaseOrderRepository().post(payloads, this.props?.edit, id).then((res: any) => {
      const purchaseOrder = new PurchaseOrder(res?.data)
      this.props.history.replace(this.props.location.pathname?.replace('create', purchaseOrder.DocEntry), purchaseOrder);
      this.props.query.set('po-id-' + id, purchaseOrder);
      this.dialog.current?.success("Create Successfully.");
    }).catch((e: any) => {
      if (e instanceof UpdateDataSuccess) {
        this.props.history.replace(this.props.location.pathname?.replace('/edit', ''), { ...this.state, isSubmitting: false, isApproved: this.state.DocumentStatus === 'A' });
        this.dialog.current?.success(e.message);
        this.props.query.set('po-id-' + id, new PurchaseOrder(this.state));
        return;
      }
      this.dialog.current?.error(e.message);
    }).finally(() => {
      this.setState({ ...this.state, isSubmitting: false })
    });
  }

  FormRender = () => {
    return (
      <>
        <form onSubmit={this.handlerSubmit} className="flex flex-col gap-4">
          <HeadingForm
            data={this.state}
            edit={this.props?.edit}
            handlerOpenVendor={() => this.handlerOpenVendor("supplier")}
            handlerChange={(key, value) => this.handlerChange(key, value)}
          />
          <ContentForm
            edit={this.props?.edit}
            data={this.state}
            handlerAddItem={() => this.handlerOpenItem()}
            handlerRemoveItem={this.handlerDeleteItem}
            handlerChangeItem={this.handlerChangeItems}
            handlerChange={(key, value) => this.handlerChange(key, value)}
          />
          <LogisticForm
            data={this.state}
            handlerChange={(key, value) => this.handlerChange(key, value)}
          />
          <AccounttingForm
            edit={this.props?.edit}
            data={this.state}
            handlerChange={(key, value) => this.handlerChange(key, value)}
            handlerOpenProject={() => this.handlerOpenProject()}
          />
          {/* <AttachmentForm /> */}

          <div className="sticky w-full bottom-4  mt-2">
            <div className="backdrop-blur-sm bg-slate-700 p-2 rounded-lg shadow z-[1000] flex justify-between gap-3 border">
              <div className="flex ">
                <LoadingButton
                  size="small"
                  sx={{ height: "25px" }}
                  variant="contained"
                  disableElevation
                >
                  <span className="px-3 text-[11px] py-1">Copy To</span>
                </LoadingButton>
              </div>
              <div className="flex items-center">
                <LoadingButton
                  type="submit"
                  sx={{ height: "25px" }}
                  className="bg-white"
                  loading={false}
                  size="small"
                  variant="contained"
                  disableElevation
                >
                  <span className="px-3 text-[11px] py-1">Save & New</span>
                </LoadingButton>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  };
}

export default withRouter(PurchaseOrderForm);
