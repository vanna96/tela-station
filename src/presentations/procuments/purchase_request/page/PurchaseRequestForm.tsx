import CoreFormDocument from "@/components/core/CoreFormDocument";
import PurchaseRequest from "@/models/PurchaseRequest";
import HeadingForm from "../components/HeadingForm";
import { withRouter } from "@/routes/withRouter";
import ContentForm from "../components/ContentForm";
import { LoadingButton } from "@mui/lab";
import { FormEventHandler } from "react";
import AttachmentForm from "../components/AttachmentForm";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import GLAccount from "../../../../models/GLAccount";
import { UpdateDataSuccess } from "@/utilies/ClientError";
import Formular from "@/utilies/formular";
import VatGroupRepository from "@/services/actions/VatGroupRepository";
import { CircularProgress } from "@mui/material";
import PurchaseRequestRepository from "../repository/purchaseRequestRepository";

class PurchaseRequestForm extends CoreFormDocument {
  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
      loading: true,
      DocType: "dDocument_Items",
      DocumentStatus: "O",
      RequriedDate: null,
      DocDate: new Date().toISOString(),
      TaxDate: new Date().toISOString(),
      DocDueDate: new Date().toISOString(),
    } as any;

    this.handlerRemoveItem = this.handlerRemoveItem.bind(this);
    this.handlerAddItem = this.handlerAddItem.bind(this);
    this.handlerSubmit = this.handlerSubmit.bind(this);
    this.onInit = this.onInit.bind(this);
  }

  componentDidMount(): void {
    this.setState({ ...this.state, loading: true });
    this.onInit();

    DocumentSerieRepository.getDocumentSeries(PurchaseRequestRepository.documentSerie).then((res: any) => {
      this.setState({ ...this.state, SerieLists: res, isLoadingSerie: false });
    });

    if (!this.props.edit) {
      DocumentSerieRepository.getDefaultDocumentSerie(
        PurchaseRequestRepository.documentSerie
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
      let state: any = this.props.query.find('pr-id-' + id);
      let disables: any = {};

      if (!state) {
        await new PurchaseRequestRepository()
          .find(this.props.match.params.id)
          .then((res: any) => {
            state = res;
            this.props.query.set('pr-id-' + id, res);
          }).catch(e => {
            console.log(e)
            this.setState({ message: 'Data no found.' });
            return;
          })
      }

      disables['ReqType'] = state?.DocumentStatus !== 'Open';
      disables['CardCode'] = state?.DocumentStatus !== 'Open';
      disables['CardName'] = state?.DocumentStatus !== 'Open';
      disables['RequesterBranch'] = state?.DocumentStatus !== 'Open';
      disables['RequesterDepartment'] = state?.DocumentStatus !== 'Open';
      disables['RequesterEmail'] = state?.DocumentStatus !== 'Open';
      disables['DocDate'] = state?.DocumentStatus !== 'Open';
      disables['DocDueDate'] = state?.DocumentStatus !== 'Open';
      disables['TaxDate'] = state?.DocumentStatus !== 'Open';
      disables['RequriedDate'] = state?.DocumentStatus !== 'Open';
      disables['DocumentLine'] = state?.DocumentStatus !== 'Open';
      this.setState({ ...state, disable: disables, loading: false });
    } else {
      setTimeout(
        () =>
          this.setState({
            ...this.state,
            loading: false,
            ReqType: 12,
            CardCode: this.props?.user?.UserCode,
            CardName: this.props?.user?.UserName,
            Branch: this.props?.user?.Branch,
            Department: this.props?.user?.Department,
            Email: this.props?.user?.Email,
          }),
        500
      );
    }

  }

  handlerRemoveItem(code: string) {
    let items = [...(this.state.Items ?? [])];
    const index = items.findIndex((e: any) => e?.itemCode === code);
    items.splice(index, 1);
    this.setState({ ...this.state, Items: items });
  }

  handlerAddItem({ value, record, field }: any) {
    let items = [...(this.state.Items ?? [])];
    let item = this.state.Items?.find((e: any) => e?.ItemCode === record?.ItemCode);

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
      Items: items,
      DocTotal: Formular.findTotalBeforeDiscount(items),
    });
  }


  async handlerSubmit(event: any) {
    event.preventDefault();

    this.setState({ ...this.state, isSubmitting: true });
    const { id } = this.props?.match?.params;
    await new PurchaseRequestRepository()
      .post(new PurchaseRequest(this.state).toJson(this.props?.edit), this.props?.edit, id)
      .then((res: any) => {
        const purchaseRequest: any = new PurchaseRequest(res?.data);

        this.props.history.replace(
          this.props.location.pathname?.replace("create", purchaseRequest.DocEntry),
          purchaseRequest
        );

        const payloads = new PurchaseRequest(this.state);
        this.props.query.set('pr-id-' + id, payloads);
        this.dialog.current?.success("Create Successfully.");
      })
      .catch((e: any) => {
        if (e instanceof UpdateDataSuccess) {
          this.props.history.replace(
            this.props.location.pathname?.replace("/edit", ""),
            {
              ...this.state,
              isSubmitting: false,
              isApproved: this.state.DocumentStatus === "A",
            }
          );

          const payloads = new PurchaseRequest(this.state);
          this.props.query.set('pr-id-' + id, payloads);
          this.dialog.current?.success(e.message);
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
        <form onSubmit={this.handlerSubmit} className="w-full h-full flex flex-col gap-4">
          {this.state.loading ? <div className='h-full w-full flex items-center justify-center'><CircularProgress /></div> : <>
            <HeadingForm
              edit={this.props?.edit}
              data={this.state}
              handlerOpenRequester={() => {
                const { ReqType }: any = this.state;
                if (ReqType == 12) {
                  this.handlerOpenRequester();
                } else {
                  this.handlerOpenRequesterEmployee();
                }
              }}
              handlerChange={(key, value) => this.handlerChange(key, value)}
            />

            <ContentForm
              data={this?.state}
              handlerAddItem={() => this.handlerOpenItem()}
              handlerRemoveItem={this.handlerRemoveItem}
              handlerChangeItem={this.handlerChangeItems}
              handlerChange={(key, value) => this.handlerChange(key, value)}
            // handlerOpenGLAccount={() => this.handlerOpenGLAccount()}
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
                    <span className="px-3 text-[11px] py-1">Save </span>
                  </LoadingButton>
                </div>
              </div>
            </div>
          </>
          }
        </form>
      </>
    );
  };
}

export default withRouter(PurchaseRequestForm);
