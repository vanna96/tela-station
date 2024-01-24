import { withRouter } from "@/routes/withRouter";
import { Component, useMemo } from "react";
import { dateFormat } from "@/utilies";
import MenuButton from "@/components/button/MenuButton";
import LoadingProgress from "@/components/LoadingProgress";
import request from "@/utilies/request";
import DocumentHeader from "@/components/DocumenHeader";
import MaterialReactTable from "material-react-table";

class RouteDetail extends Component<any, any> {
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
      await request("GET", `TL_ROUTE('${id}')`)
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

            <MenuButton
              active={this.state.tapIndex === 1}
              onClick={() => this.handlerChangeMenu(1)}
            >
              <span>Expense</span>
            </MenuButton>

            <MenuButton
              active={this.state.tapIndex === 2}
              onClick={() => this.handlerChangeMenu(2)}
            >
              <span>Sequence</span>
            </MenuButton>
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
              <div className="relative">
                <div className="grow  px-16 py-4 ">
                  {this.state.tapIndex === 1 && <Expense data={this.state} />}
                </div>
              </div>
              <div className="relative">
                <div className="grow  px-16 py-4 ">
                  {this.state.tapIndex === 2 && <Sequence data={this.state} />}
                </div>
              </div>
            </>
          )}
        </form>
      </>
    );
  }
}

export default withRouter(RouteDetail);

function General(props: any) {
  const { data }: any = props;
  console.log(data);
  
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
                <div className="col-span-1 text-gray-700 ">Base Station</div>
                <div className="col-span-1 text-gray-900">
                  {data?.U_BaseStation ?? "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">Destination</div>
                <div className="col-span-1 text-gray-900">
                  {data?.U_Destination ?? "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">Route Code</div>
                <div className="col-span-1 text-gray-900">
                  {data?.Code ?? "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">Route Name</div>
                <div className="col-span-1 text-gray-900">
                  {data?.Name ?? "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">
                  Driver Incentive
                </div>
                <div className="col-span-1 text-gray-900">
                  {data?.U_Incentive ?? "N/A"}
                </div>
              </div>
            </div>
            <div className="col-span-2"></div>
            <div className="col-span-5 ">
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700">Status</div>
                <div className="col-span-1  text-gray-900">
                  {data?.U_Status === "Y" ? "Yes" : "No"}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">Distance</div>
                <div className="col-span-1 text-gray-900">
                  {data?.U_Distance ?? "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">Travel Hour</div>
                <div className="col-span-1 text-gray-900">
                  {data?.U_Duration ?? "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">Extra Remarks</div>
                <div className="col-span-1 text-gray-900">
                  {data?.U_Remark ?? "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
function Expense(props: any) {
  const { data } = props;

  const itemColumn: any = useMemo(
    () => [
      {
        accessorKey: "Code",
        header: "Expense Code", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 150,
      },
      {
        accessorKey: "U_Description",
        header: "Description",
        enableClickToCopy: true,
        size: 200,
      },
      {
        accessorKey: "U_Amount",
        header: "Expense Amount",
        size: 60,
        Cell: ({ cell }: any) => cell.getValue(),
      },
    ],
    [data]
  );

  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-full">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
          <h2>Expense</h2>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
          <MaterialReactTable
            enableColumnActions={false}
            enableColumnFilters={false}
            enablePagination={false}
            enableSorting={false}
            enableBottomToolbar={false}
            enableTopToolbar={false}
            muiTableBodyRowProps={{ hover: false }}
            columns={itemColumn}
            data={data?.TL_RM_EXPENSCollection || []}
            muiTableProps={{
              sx: {
                border: "1px solid rgba(211,211,211)",
              },
            }}
          />
        </div>
      </div>
    </>
  );
}

function Sequence(props: any) {
    const { data } = props;
  
    const itemColumn: any = useMemo(
      () => [
        {
          accessorKey: "U_Code",
          header: "Stops", //uses the default width from defaultColumn prop
          enableClickToCopy: true,
          enableFilterMatchHighlighting: true,
          size: 150,
        },
        {
          accessorKey: "U_Distance",
          header: "Distance",
          enableClickToCopy: true,
          size: 200,
        },
        {
          accessorKey: "U_Duration",
          header: "Travel Duration",
          size: 60,
          Cell: ({ cell }: any) => cell.getValue(),
        },
        {
            accessorKey: "U_Stop_Duration",
            header: "Stops Duration",
            size: 60,
            Cell: ({ cell }: any) => cell.getValue(),
          },
      ],
      [data]
    );
  
    return (
      <>
        <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-full">
          <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
            <h2>Sequence</h2>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
            <MaterialReactTable
              enableColumnActions={false}
              enableColumnFilters={false}
              enablePagination={false}
              enableSorting={false}
              enableBottomToolbar={false}
              enableTopToolbar={false}
              muiTableBodyRowProps={{ hover: false }}
              columns={itemColumn}
              data={data?.TL_RM_SEQUENCECollection || []}
              muiTableProps={{
                sx: {
                  border: "1px solid rgba(211,211,211)",
                },
              }}
            />
          </div>
        </div>
      </>
    );
  }
