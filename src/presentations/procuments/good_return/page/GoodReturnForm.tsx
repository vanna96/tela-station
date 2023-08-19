import CoreFormDocument from "@/components/core/CoreFormDocument";
import { withRouter } from "@/routes/withRouter";
import ContentForm from "../component/ContentForm";
import { LoadingButton } from "@mui/lab";
import DocumentSerieRepository from "@/services/actions/documentSerie";
import GoodReturnRepository from "@/services/actions/goodReturnRepository";
import GLAccount from "@/models/GLAccount";
import { CircularProgress } from "@mui/material";
import { UpdateDataSuccess } from "../../../../utilies/ClientError";
import GoodReturn from "../../../../models/GoodReturn";
import { QueryClient, useMutation } from "react-query";
import HeadingForm from "../component/HeadingForm";
import AccountingForm from "../component/AccountingForm";
import LogisticsForm from "../component/LogisticsForm";
import AttachmentForm from "@/components/attachment";

class GoodReturnForm extends CoreFormDocument {
  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
      loading: true,

      DocType: 'dDocument_Items',
      DocumentStatus: 'bost_Open',
      DocDate: new Date().toISOString(),
      DocDueDate: null,
      TaxDate: new Date().toISOString(),
      TransportationCode: 1,
      PaymentTerms: -1,
      PaymentMethod: "Outgoing BT",
      SalesPersonCode: -1,
      StartFrom: "Y"


    } as any;

    this.handlerRemoveItem = this.handlerRemoveItem.bind(this);
    this.handlerSubmit = this.handlerSubmit.bind(this);
  }

  componentDidMount(): void {
    if (!this.props?.edit) {
      setTimeout(() => this.setState({ ...this.state, loading: false }), 500);
    }

    if (this.props.edit) {
      if (this.props.location.state) {
        const routeState = this.props.location.state;
        setTimeout(() => this.setState({ ...this.props.location.state, loading: false, }), 500)
      } else {
        // const dd = this.props.query.queryProvider.getQueryData('items');

        new GoodReturnRepository()
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
      GoodReturnRepository.documentSerie
    ).then((res: any) => {
      this.setState({ ...this.state, SerieLists: res, isLoadingSerie: false });
    });

    if (!this.props.edit) {
      DocumentSerieRepository.getDefaultDocumentSerie(
        GoodReturnRepository.documentSerie
      ).then((res: any) => {
        this.setState({
          ...this.state,
          Series: res?.Series,
          DocNum: res?.NextNumber,
        });
      });
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
    this.setState({ ...this.state, isSubmitting: true });
    const { id } = this.props?.match?.params;
    const payloads = new GoodReturn(this.state).toJson(this.props?.edit);
    console.log(payloads);
    await new GoodReturnRepository()
      .post(payloads, this.props?.edit, id)
      .then((res: any) => {
        const procumentData = new GoodReturn(res?.data);
        this.props.history.replace(
          this.props.location.pathname?.replace(
            "create",
            procumentData.DocEntry
          ),
          procumentData
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
            }
          );
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
    return <>
      <form onSubmit={this.handlerSubmit} className='h-full w-full flex flex-col gap-4'>
        {this.state.loading ? <div className='h-full w-full flex items-center justify-center'><CircularProgress /></div> : <>


          <HeadingForm
            data={this.state}
            edit={this.props?.edit}
            handlerOpenVendor={() => {
              this.handlerOpenVendor('supplier');
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
          <LogisticsForm
            data={this.state}
            handlerChange={(key, value) => this.handlerChange(key, value)}
            edit={this.props?.edit}
          />
          <AccountingForm
            edit={this.props.edit}
            data={this.state}
            handlerChange={(key, value) => this.handlerChange(key, value)}
            handlerOpenProject={() => this.handlerOpenProject()}

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
  };
}

export default withRouter(GoodReturnForm);
