import { withRouter } from "@/routes/withRouter";
import { Component } from "react";
import { useMemo } from "react";
import {
  arrayBufferToBlob,
  currencyDetailFormat,
  currencyFormat,
  dateFormat,
} from "@/utilies";
import PreviewAttachment from "@/components/attachment/PreviewAttachment";
import DocumentHeaderComponent from "@/components/DocumenHeaderComponent";
import DocumentHeader from "@/components/DocumenHeader";
import PaymentTermTypeRepository from "../../../../services/actions/paymentTermTypeRepository";
import ShippingTypeRepository from "@/services/actions/shippingTypeRepository";
import ItemGroupRepository from "@/services/actions/itemGroupRepository";
import MenuButton from "@/components/button/MenuButton";
import LoadingProgress from "@/components/LoadingProgress";
import shortid from "shortid";
import request from "@/utilies/request";
import BusinessPartner from "@/models/BusinessParter";
import { fetchSAPFile } from "@/helper/helper";
import MaterialReactTable from "material-react-table";
import { Breadcrumb } from "../../components/Breadcrumn";
import { useNavigate } from "react-router-dom";
import { Checkbox, CircularProgress, darken } from "@mui/material";
import WarehouseRepository from "@/services/warehouseRepository";
import Attachment from "@/models/Attachment";
import UnitOfMeasurementGroupRepository from "@/services/actions/unitOfMeasurementGroupRepository";
import { NumericFormat } from "react-number-format";
import DocumentHeaderDetails from "@/components/DocumentHeaderDetails";
import BranchBPLRepository from "../../../../services/actions/branchBPLRepository";
import SalePersonRepository from "@/services/actions/salePersonRepository";
import UsersRepository from "@/services/actions/usersRepository";
import WarehouseByBranch from "@/components/selectbox/WarehouseByBranch";

class Details extends Component<any, any> {
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
      await request("GET", `TL_FUEL_LEVEL(${id})`)
        .then(async (res: any) => {
          const data: any = res?.data;
          // vendor

          this.setState({
            loading: false,
            ...data,
          });
        })
        .catch((err: any) =>
          this.setState({ isError: true, message: err.message })
        );
    } else {
      this.setState({ ...data, loading: false });
    }
  }

  onTap(index: number) {
    this.setState({ ...this.state, tapIndex: index });
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
              <span>Content</span>
            </MenuButton>
          </div>
        </div>
      </>
    );
  };

  render() {
    return (
      <>
        <DocumentHeader
          data={this.state}
          menuTabs={this.HeaderTabs}
          handlerChangeMenu={this.handlerChangeMenu}
        />

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
                  {this.state.tapIndex === 1 && <Content data={this.state} />}
                </div>
              </div>
            </>
          )}
        </form>
      </>
    );
  }
}

export default withRouter(Details);

function General(props: any) {
  return (
    <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-full">
      <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
        <h2>Basic Information</h2>
      </div>
      {/*  */}
      <div className="py-4 px-8">
        <div className="grid grid-cols-12 ">
          <div className="col-span-5">
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700 ">DocEntry</div>
              <div className="col-span-1 text-gray-900">
                {props.data.DocEntry ?? "N/A"}
              </div>
            </div>
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700 ">Series</div>
              <div className="col-span-1 text-gray-900">
                {props.data.Series}
              </div>
            </div>
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700 ">Branch</div>
              <div className="col-span-1 text-gray-900">
                {new BranchBPLRepository().find(props?.data?.U_tl_bplid)
                  ?.BPLName ?? "N/A"}
              </div>
            </div>
          </div>
          {/*  */}
          <div className="col-span-2"></div>
          {/*  */}
          <div className="col-span-5 ">
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700">DocNum</div>
              <div className="col-span-1  text-gray-900">
                {props.data.DocNum}
              </div>
            </div>
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700 ">Status</div>
              <div className="col-span-1 text-gray-900">
                {props.data.Status == "O" ? "Open" : "Closed"}
              </div>
            </div>
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700 ">Create Date</div>
              <div className="col-span-1 text-gray-900">
                {dateFormat(props.data.CreateDate)}
              </div>
            </div>
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700 ">Update Date</div>
              <div className="col-span-1 text-gray-900">
                {dateFormat(props.data.UpdateDate)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Content(props: any) {
  const { data } = props;

  const itemColumn: any = useMemo(
    () => [
      {
        accessorKey: "U_tl_whscode",
        header: "Warehouse Code",
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        size: 150,
        Cell: ({ cell }: any) => {
          return cell.getValue() + "-" + new WarehouseRepository().find(cell.getValue())?.WarehouseName;
        },
      },
      {
        accessorKey: "U_tl_bincode",
        header: "Bin Code",
        enableClickToCopy: true,
        size: 150,
      },
      {
        accessorKey: "U_tl_volumn",
        header: "Volumn",
        size: 60,
      },
      {
        accessorKey: "U_tl_qty",
        header: "Quantity",
        size: 60,
        Cell: ({ cell }: any) => (
          <NumericFormat
            value={cell.getValue() ?? 0}
            thousandSeparator
            fixedDecimalScale
            disabled
            className="bg-white w-full"
            decimalScale={2}
          />
        ),
      },
      {
        accessorKey: "U_tl_remark",
        header: " Remark",
        size: 60,
      },
    ],
    [data]
  );

  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-full">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
          <h2>Content Information</h2>
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
            data={data?.TL_FUEL_LEVEL_LINESCollection || []}
            muiTableProps={{
              sx: {
                border: "1px solid rgba(211,211,211)",
              },
            }}
            // muiTableHeadCellProps={{
            //   sx: {
            //     border: "1px solid rgba(211,211,211)",
            //   },
            // }}
            // muiTableBodyCellProps={{
            //   sx: {
            //     border: "1px solid rgba(211,211,211)",
            //   },
            // }}
          />
        </div>
      </div>
    </>
  );
}
