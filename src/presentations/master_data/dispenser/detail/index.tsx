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
import ContentComponent from "../../morph_price/components/ContentComponents";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import SalePersonRepository from "@/services/actions/salePersonRepository";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";

class DeliveryDetail extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      isError: false,
      message: "",
      tapIndex: 0,
      Status: "New",
      showCollapse: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.onTap = this.onTap.bind(this);
  }

  componentDidMount(): void {
    this.fetchData();
  }

  async fetchData() {
    let state: any = { ...this.state };
    const { id } = this.props.match.params;
    const data = this.props.query.find("pa-id-" + id);
    this.setState({ ...this.state, loading: true });
    await new Promise((resolve) => setTimeout(() => resolve(""), 800));

    if (!data) {
      const { id }: any = this.props?.match?.params || 0;
      await request("GET", `TL_Dispenser('${id}')`)
        .then(async (res: any) => {
          const data: any = res?.data;
          state = {
            PumpCode: data?.Code,
            PumpName: data?.Name,
            NumOfPump: data?.U_tl_pumpnum,
            SalesPersonCode: data?.U_tl_empid,
            lineofBusiness: data?.U_tl_type,
            Status: data?.U_tl_status,
            U_tl_attend1 : data?.U_tl_attend1,
            U_tl_attend2: data?.U_tl_attend2,
            U_tl_bplid: data?.U_tl_bplid,
            PumpData: await Promise.all(
              (data?.TL_DISPENSER_LINESCollection || []).map(async (e: any) => {
                const uom = new UnitOfMeasurementRepository().find(e?.U_tl_uom);                                
                let item: any = {
                  pumpCode: e?.U_tl_pumpcode,
                  itemCode: e?.U_tl_itemnum,
                  UomAbsEntry: e?.U_tl_uom,
                  uom: uom?.Name,
                  registerMeeting: e?.U_tl_reg_meter,
                  updateMetering: e?.U_tl_upd_meter,
                  status: e?.U_tl_status,
                  LineId: e?.LineId,
                };
                
                if (e?.U_tl_itemnum) {
                  const itemResponse: any = await request('GET', `Items('${e?.U_tl_itemnum}')?$select=ItemName`).then((res:any) => res?.data);
                  item.ItemDescription = itemResponse?.ItemName;
                }
                return item;
              })
            ),
            Edit: true,
          };
        })
        .catch((err: any) => console.log(err))
        .finally(() => {
          state["loading"] = false;
          state["isLoadingSerie"] = false;
          this.setState(state);
        });
    } else {
      this.setState({ ...data, loading: false });
    }
  }

  navigateToSalesOrder = () => {
    const { history } = this.props;
    history.push("/sale/sales-order");
  };

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
              <span>Nozzle</span>
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

export default withRouter(DeliveryDetail);

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
              <div className="col-span-1 text-gray-700 ">Branch</div>
              <div className="col-span-1 text-gray-900">
                { new BranchBPLRepository().find(1)?.BPLName }
              </div>
            </div>
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700 ">Pump Code</div>
              <div className="col-span-1 text-gray-900">
                { props?.data?.PumpCode ?? "N/A" }
              </div>
            </div>
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700 ">Pump Name</div>
              <div className="col-span-1 text-gray-900">
                { props?.data?.PumpName ?? "N/A" }
              </div>
            </div>
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700 ">Number of Pump</div>
              <div className="col-span-1 text-gray-900">
                {props.data?.NumOfPump}
              </div>
            </div>
          </div>
          {/*  */}
          <div className="col-span-2"></div>
          {/*  */}
          <div className="col-span-5 ">
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700">Type</div>
              <div className="col-span-1  text-gray-900">
                {props.data?.lineofBusiness}
              </div>
            </div>
            <div className="grid grid-cols-2 py-2">
              <div className="col-span-1 text-gray-700">Status</div>
              <div className="col-span-1  text-gray-900">
                {props.data?.Status}
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
  console.log(data?.PumpData);
  
  const itemColumn: any = useMemo(
    () => [
      {
        accessorKey: "pumpCode",
        header: "Nozzle Code",
      },
      {
        accessorKey: "itemCode",
        header: "Item Code", //uses the default width from defaultColumn prop
        visible: true,
        size: 120,
      },
      {
        accessorKey: "ItemDescription",
        header: "Item Name",
      },
      {
        accessorKey: "uom",
        header: "UOM",
      },
      {
        accessorKey: "registerMeeting",
        header: "Register Meeting",
      },
      {
        accessorKey: "updateMetering",
        header: "Update Metering",
      },
      {
        accessorKey: "status",
        header: "Status"
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
            data={data?.PumpData || []}
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