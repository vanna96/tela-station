import { withRouter } from "@/routes/withRouter";
import { Component } from "react";
import { dateFormat } from "@/utilies";
import MenuButton from "@/components/button/MenuButton";
import LoadingProgress from "@/components/LoadingProgress";
import request from "@/utilies/request";
import DocumentHeader from "@/components/DocumenHeader";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import MUITextField from "@/components/input/MUITextField";

class FormDetail extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      showCollapse: false,
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
      await request("GET", `TL_PUMP_ATTEND('${id}')`)
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
        <DocumentHeader data={this.state} menuTabs={this.HeaderTabs} HeaderCollapeMenu={<></>} />

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
      {/*  "U_tl_fname" : "fname",
   "U_tl_lname" : "lname",
   "U_tl_gender" : "Female",
   "U_tl_dob" : "2024-01-05T00:00:00Z",
   "U_tl_tel1" : "123213123",
   "U_tl_tel2" : "1321331312",
   "U_tl_bplid" : "1",
   "U_tl_numid" : "123131311",
   "U_tl_sdate" : "2024-01-05T00:00:00Z",
   "U_tl_edate" : "2024-01-05T00:00:00Z",
   "U_tl_address" : "efwafwe",
   "U_tl_status" : "y" */}
      <div className="overflow-auto w-full bg-white shadow-lg border p-4 rounded-lg mb-6">
        <h2 className="col-span-2 border-b pb-2 mb-4 font-bold text-lg">
          General
        </h2>
        <div className="py-4 px-8">
          <div className="grid grid-cols-12 ">
            <div className="col-span-5">
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 "> Code</div>
                <div className="col-span-1 text-gray-900">
                  <MUITextField
                    value={data?.Code ?? "N/A"}
                    name="U_tl_fname"
                    disabled={true}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 "> First Name</div>
                <div className="col-span-1 text-gray-900">

                  <MUITextField
                    value={data?.U_tl_fname ?? "N/A"}
                    name="U_tl_fname"
                    disabled={true}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 "> Last Name</div>
                <div className="col-span-1 text-gray-900">

                  <MUITextField
                    value={data?.U_tl_lname ?? "N/A"}
                    name="U_tl_fname"
                    disabled={true}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">Gender</div>
                <div className="col-span-1 text-gray-900">

                  <MUITextField
                    value={data?.U_tl_gender ?? "N/A"}
                    name="U_tl_fname"
                    disabled={true}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 "> Date of Birth </div>
                <div className="col-span-1 text-gray-900">

                  <MUITextField
                    value={dateFormat(data?.U_tl_dob) || "N/A"}
                    name="U_tl_fname"
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
                    value={data.U_tl_status === "y"
                      ? "Active"
                      : "Inactive"}
                    name="U_tl_fname"
                    disabled={true}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">Branch </div>
                <div className="col-span-1 text-gray-900">

                  <MUITextField
                    value={new BranchBPLRepository().find(data?.U_tl_bplid)?.BPLName ??
                      "N/A"}
                    name="U_tl_fname"
                    disabled={true}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">No. ID Card</div>
                <div className="col-span-1 text-gray-900">

                  <MUITextField
                    value={data.U_tl_numid ?? "N/A"}
                    name="U_tl_fname"
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 mt-8">
            <div className="col-span-5">
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 "> Mobile 1</div>
                <div className="col-span-1 text-gray-900">

                  <MUITextField
                    value={data?.U_tl_tel1 ?? "N/A"}
                    name="U_tl_fname"
                    disabled={true}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 "> Mobile 2</div>
                <div className="col-span-1 text-gray-900">

                  <MUITextField
                    value={data?.U_tl_tel2 ?? "N/A"}
                    name="U_tl_fname"
                    disabled={true}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">
                  Residential Address
                </div>
                <div className="col-span-1 text-gray-900">

                  <MUITextField
                    value={data?.U_tl_address ?? "N/A"}
                    name="U_tl_fname"
                    disabled={true}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-2"></div>
            <div className="col-span-5 ">
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">Joined Date</div>
                <div className="col-span-1 text-gray-900">

                  <MUITextField
                    value={dateFormat(data?.U_tl_sdate) || "N/A"}
                    name="U_tl_fname"
                    disabled={true}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">Terminated Date</div>
                <div className="col-span-1 text-gray-900">

                  <MUITextField
                    value={dateFormat(data?.U_tl_edate) || "N/A"}
                    name="U_tl_fname"
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
