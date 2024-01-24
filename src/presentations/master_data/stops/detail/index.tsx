import { withRouter } from "@/routes/withRouter";
import { Component } from "react";
import { dateFormat } from "@/utilies";
import MenuButton from "@/components/button/MenuButton";
import LoadingProgress from "@/components/LoadingProgress";
import request from "@/utilies/request";
import DocumentHeader from "@/components/DocumenHeader";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";

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

export default withRouter(StopsDetail);

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
                                <div className="col-span-1 text-gray-700 "> Code</div>
                                <div className="col-span-1 text-gray-900">
                                    {data?.Code ?? "N/A"}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 py-1">
                                <div className="col-span-1 text-gray-700 ">Name</div>
                                <div className="col-span-1 text-gray-900">
                                    {data?.Name ?? "N/A"}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 py-1">
                                <div className="col-span-1 text-gray-700 ">Active</div>
                                <div className="col-span-1 text-gray-900">
                                    {data?.U_active ?? "N/A"}
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2"></div>
                        <div className="col-span-5 ">
                            <div className="grid grid-cols-2 py-1">
                                <div className="col-span-1 text-gray-700">Latitude</div>
                                <div className="col-span-1  text-gray-900">
                                    {data?.U_lat ?? "N/A"}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 py-1">
                                <div className="col-span-1 text-gray-700 ">Longitude</div>
                                <div className="col-span-1 text-gray-900">
                                    {data?.U_lng ?? "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
