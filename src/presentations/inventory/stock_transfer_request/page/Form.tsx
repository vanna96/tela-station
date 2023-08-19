import CoreFormDocument from "@/components/core/CoreFormDocument";
import HeadingForm from "../component/HeadingForm";
import { withRouter } from "@/routes/withRouter";
import ContentForm from "../component/ContentForm";
import { LoadingButton } from "@mui/lab";
import AttachmentForm from "@/components/attachment";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import GLAccount from "../../../../models/GLAccount";
import { UpdateDataSuccess } from "@/utilies/ClientError";
import Formular from "@/utilies/formular";
import VatGroupRepository from "@/services/actions/VatGroupRepository";
import StockTransferRequest from "@/models/StockTransferRequest";
import StockTransferRequestRepository from "@/services/actions/stockTransferRequestRepository";

class StockTransferRequestForm extends CoreFormDocument {
  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
      loading: true,
      documentStatus: "O",
      requriedDate: null,
      docDate: new Date().toISOString(),
      taxDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
    } as any;

    this.handlerRemoveItem = this.handlerRemoveItem.bind(this);
    this.handlerAddItem = this.handlerAddItem.bind(this);
    this.handlerSubmit = this.handlerSubmit.bind(this);
  }

  componentDidMount(): void {
    if (!this.props?.edit) {
      setTimeout(
        () =>
          this.setState({
            ...this.state,
            loading: false,
          }),
        500
      );
    }

    if (this.props.edit) {
      if (this.props.location.state) {
        const routeState = this.props.location.state;
        setTimeout(
          () =>
            this.setState({
              ...this.props.location.state,
              isApproved: routeState?.status === "A",
              loading: false,
            }),
          500
        );
      } else {
        new StockTransferRequestRepository()
          .find(this.props.match.params.id)
          .then((res: any) => {
            this.setState({ ...res, loading: false });
          })
          .catch((e: Error) => {
            this.setState({ message: e.message });
          });
      }
    }

    DocumentSerieRepository.getDocumentSeries(
      StockTransferRequestRepository.documentSerie
    ).then((res: any) => {
      this.setState({ ...this.state, series: res, isLoadingSerie: false });
    });

    if (!this.props.edit) {
      DocumentSerieRepository.getDefaultDocumentSerie(
        StockTransferRequestRepository.documentSerie
      ).then((res: any) => {
        this.setState({
          ...this.state,
          serie: res?.Series,
          docNum: res?.NextNumber,
          isLoadingSerie: false,
        });
      });
    }
  }

  handlerRemoveItem(code: string) {
    let items = [...(this.state.items ?? [])];
    const index = items.findIndex((e: any) => e?.itemCode === code);
    items.splice(index, 1);
    this.setState({ ...this.state, items: items });
  }

  handlerAddItem({ value, record, field }: any) {
    let items = [...(this.state.items ?? [])];
    let item = this.state.items?.find(
      (e: any) => e?.itemCode === record?.itemCode
    );

    if (field === "AccountNo") {
      const account = value as GLAccount;
      item[field] = account.code;
      item["AccountName"] = account.name;
    } else {
      item[field] = value;
    }

    if (
      field === "quantity" ||
      field === "unitPrice" ||
      field === "discountPercent"
    ) {
      const total = Formular.findLineTotal(
        item["quantity"],
        item["unitPrice"],
        item["discountPercent"]
      );
      item["lineTotal"] = total;
    }

    if (field === "purchaseVatGroup")
      item["vatRate"] = new VatGroupRepository().find(value)?.vatRate;

    const index = items.findIndex((e: any) => e?.ItemCode === record.itemCode);
    if (index > 0) items[index] = item;

    this.setState({
      ...this.state,
      items: items,
      docTotal: Formular.findTotalBeforeDiscount(items),
    });
  }

  async handlerSubmit(event: any) {
    event.preventDefault();

    this.setState({ ...this.state, isSubmitting: true });
    const { id } = this.props?.match?.params;

    await new StockTransferRequestRepository()
      .post(this.state, this.props?.edit, id)
      .then((res: any) => {
        const stockTransfer = new StockTransferRequest(res?.data);

        this.props.history.replace(
          this.props.location.pathname?.replace("create", stockTransfer.id),
          stockTransfer
        );
        this.dialog.current?.success("Create Successfully.");
      })
      .catch((e: any) => {
        if (e instanceof UpdateDataSuccess) {
          this.props.history.replace(
            this.props.location.pathname?.replace("/edit", ""),
            {
              ...this.state,
              isSubmitting: false,
              isApproved: this.state.documentStatus === "A",
            }
          );
          this.dialog.current?.success(e.message);
          // const query = this.props.query.query as QueryClient;
          return;
        }
        this.dialog.current?.error(e.message);
      })
      .finally(() => {
        this.setState({ ...this.state, isSubmitting: false });
      });
  }

  FormRender = () => {
    return (
      <>
        <form onSubmit={this.handlerSubmit} className="flex flex-col gap-4">
        <HeadingForm
          data={this.state}
          edit={this.props?.edit}
          handlerOpenVendor={() => {
            this.handlerOpenVendor('customer');
          }}
          handlerChange={(key, value) => this.handlerChange(key, value)}
          handlerOpenProject={() => this.handlerOpenProject()}
        />

        <ContentForm
          edit={this.props?.edit}
          data={this.state}
          handlerAddItem={() => this.handlerOpenItem()}
          handlerRemoveItem={this.handlerRemoveItem}
          handlerChangeItem={this.handlerChangeItems}
          handlerChange={(key, value) => this.handlerChange(key, value)}
        />

          <AttachmentForm />

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

export default withRouter(StockTransferRequestForm);
