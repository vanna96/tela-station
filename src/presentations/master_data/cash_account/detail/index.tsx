import { withRouter } from "@/routes/withRouter";
import { Component, useContext } from "react";
import { arrayBufferToBlob, dateFormat } from "@/utilies";
import MenuButton from "@/components/button/MenuButton";
import LoadingProgress from "@/components/LoadingProgress";
import shortid from "shortid";
import request from "@/utilies/request";
import { fetchSAPFile, numberWithCommas, sysInfo } from "@/helper/helper";
import DocumentHeader from "@/components/DocumenHeader";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import ChartOfAccountsRepository from "@/services/actions/ChartOfAccountsRepository";
import GLAccountRepository from "@/services/actions/GLAccountRepository";
import MUITextField from "@/components/input/MUITextField";

class FormDetail extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      isError: false,
      message: "",
      tapIndex: 0,
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount(): void {
    this.fetchData();
  }

  async fetchData() {
    const { id } = this.props.match.params;
    const data = this.props.query.find("pa-id-" + id);
    this.setState({ ...this.state, loading: true });
    await new Promise((resolve) => setTimeout(() => resolve(""), 800));

    if (!data) {
      const { id }: any = this.props?.match?.params || 0;
      await request("GET", `TL_CashAcct('${id}')`)
        .then(async (res: any) => {
          const data: any = res?.data;

          // attachment

          this.setState({
            ...data,
            edit: true,
            loading: false,
          });
        })
        .catch((err: any) =>
          this.setState({ isError: true, message: err.message })
        );
    } else {
      this.setState({ ...data, loading: false });
    }
  }

  HeaderTabs = () => {
    return (
      <>
        <div className="w-full flex justify-between">
          <div className="">
            <MenuButton active={this.state.tapIndex === 0}>General</MenuButton>
          </div>
        </div>
      </>
    );
  };

  render() {
    return (
      <>
        <DocumentHeader data={this.state} menuTabs={this.HeaderTabs} />

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
              <div className="relative">
                <div className="grow  px-16 py-4 ">
                  {this.state.tapIndex === 0 && <General data={this.state} />}
                </div>
              </div>
            </>
          )}
        </form>
      </>
    );
  }
}

export default withRouter(FormDetail);

function General(props: any) {
  const { data }: any = props;
  return (
    <>
      <div className="overflow-auto w-full bg-white shadow-lg border p-4 rounded-lg mb-6">
        <h2 className="col-span-2 border-b pb-2 mb-4 font-bold text-lg">
          General
        </h2>
        <div className="py-4 px-8">
          <div className="grid grid-cols-12 ">
            <div className="col-span-5">
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">Cash Account Type</div>
                <div className="col-span-1 text-gray-900">
                  <MUITextField
                    value={data?.U_tl_cashtype ?? "N/A"}
                    name="U_tl_cashacct"
                    disabled={true}
                />
                </div>
              </div>
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">Cash Code</div>
                <div className="col-span-1 text-gray-900">
                  <MUITextField
                    value={data?.Code ?? "N/A"}
                    name="U_tl_cashacct"
                    disabled={true}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">G/L Account Code </div>
                <div className="col-span-1 text-gray-900">
                  <MUITextField
                    value={data?.U_tl_cashacct ?? "N/A"}
                    name="U_tl_cashacct"
                    disabled={true}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">G/L Account Name </div>
                <div className="col-span-1 text-gray-900">
                  <MUITextField
                    value={new GLAccountRepository().find(data?.U_tl_cashacct)?.Name ??
                      "N/A"}
                    name="U_tl_cashacct"
                    disabled={true}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">Description</div>
                <div className="col-span-1 text-gray-900">
                  <MUITextField
                    value={data?.Name}
                    name="U_tl_cashacct"
                    disabled={true} 
                  />
                </div>
              </div>
            </div>
            <div className="col-span-2"></div>
            <div className="col-span-5 ">
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700">Status</div>
                <div className="col-span-1  text-gray-900">
                  <MUITextField
                    value={data?.U_tl_cashactive === "Y" ? "Active" : "Inactive"}
                    name="U_tl_cashacct"
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
