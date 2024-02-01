import { withRouter } from "@/routes/withRouter";
import { Component } from "react";
import LoadingProgress from "@/components/LoadingProgress";
import request from "@/utilies/request";
import MUITextField from "@/components/input/MUITextField";
import DocumentHeader from "@/components/DocumenHeader";
import MenuButton from "@/components/button/MenuButton";

class StopsDetail extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      isError: false,
      message: "",
      tapIndex: 0,
    };

    this.fetchData = this.fetchData.bind(this);
    this.onTap = this.onTap.bind(this);
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
      await request("GET", `TL_STOPS('${id}')`)
        .then(async (res: any) => {
          const data: any = res?.data;
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
  async handlerChangeMenu(index: number) {
    this.setState({ ...this.state, tapIndex: index });
  }
  onTap(index: number) {
    this.setState({ ...this.state, tapIndex: index });
  }
  
  HeaderTabs = () => {
    return (
      <>
        <div className="w-full flex justify-between">
          <div className="">
            <MenuButton
              active={this.state.tapIndex === 0}
              onClick={() => this.handlerChangeMenu(0)}
            >
              General
            </MenuButton>
          </div>
        </div>
      </>
    );
  };

  render() {
    console.log(this.state);
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
                <div className="">
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

export default withRouter(StopsDetail);

function renderKeyValue(label: string, value: any) {
  return (
    <div className="grid grid-cols-2 py-2">
      <div className="col-span-1 text-gray-700">{label}</div>
      <div className="col-span-1 text-gray-900">
        <MUITextField disabled value={value ?? "N/A"} />
      </div>
    </div>
  );
}

function General(props: any) {
  return (
    <div className="rounded-lg shadow-sm bg-white border p-6 px-8 h-[calc(100vh-200px)]">
      <div className="font-medium text-xl flex justify-between items-center border-b mb-4">
        <h2>Information</h2>
      </div>
      <div className="">
        <div className="grid grid-cols-12 ">
          <div className="col-span-5">
            {renderKeyValue("Code", props?.data?.Code)}
            {renderKeyValue("Name", props.data.Name)}
            {renderKeyValue(
              "Status",
              props.data.U_active === "Y" ? "Active" : "Inactive"
            )}
          </div>
          <div className="col-span-2"></div>
          <div className="col-span-5">
            {renderKeyValue("Latitude", props.data.U_lat)}
            {renderKeyValue("Longitude", props.data.U_lng)}
          </div>
        </div>
      </div>
    </div>
  );
}
