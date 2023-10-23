import { withRouter } from "@/routes/withRouter";
import { Component, useContext } from "react";
import { arrayBufferToBlob, dateFormat } from "@/utilies";
import DocumentHeaderComponent from "@/components/DocumenHeaderComponent";
import PaymentTermTypeRepository from "../../../../services/actions/paymentTermTypeRepository";
import MenuButton from "@/components/button/MenuButton";
import LoadingProgress from "@/components/LoadingProgress";
import shortid from "shortid";
import request from "@/utilies/request";
import BusinessPartner from "@/models/BusinessParter";
import { fetchSAPFile, numberWithCommas, sysInfo } from "@/helper/helper";
import { CircularProgress } from "@mui/material";
import CashAccount from "@/components/selectbox/CashAccount";
import MUITextField from "@/components/input/MUITextField";
import PaymentTable from "../components/PaymentTable";
import { useDocumentTotalHook } from "../hook/useDocumentTotalHook";
import PreviewAttachment from "@/components/attachment/PreviewAttachment";
import React from "react";
import ContentComponent from "../components/ContentComponents";
import MaterialReactTable from "material-react-table";
import { APIContext } from "../../context/APIContext";
import { useCookies } from "react-cookie";
import DocumentHeaderDetails from "@/components/DocumentHeaderDetails";

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
      await request("GET", `TL_ExpClear(${id})`)
        .then(async (res: any) => {
          const data: any = res?.data;

          // attachment
          let AttachmentList: any = [];

          if (data?.AttachmentEntry > 0) {
            AttachmentList = await request(
              "GET",
              `/Attachments2(${data?.AttachmentEntry})`
            )
              .then(async (res: any) => {
                const attachments: any = res?.data?.Attachments2_Lines;
                if (attachments.length <= 0) return;

                const files: any = attachments.map(async (e: any) => {
                  const req: any = await fetchSAPFile(
                    `/Attachments2(${data?.AttachmentEntry})/$value?filename='${e?.FileName}.${e?.FileExtension}'`
                  );
                  const blob: any = await arrayBufferToBlob(
                    req.data,
                    req.headers["content-type"],
                    `${e?.FileName}.${e?.FileExtension}`
                  );

                  return {
                    id: shortid.generate(),
                    key: Date.now(),
                    file: blob,
                    Path: "C:/Attachments2",
                    Filename: `${e?.FileName}.${e?.FileExtension}`,
                    Extension: `.${e?.FileExtension}`,
                    FreeText: "",
                    AttachmentDate: e?.AttachmentDate?.split("T")[0],
                  };
                });
                return await Promise.all(files);
              })
              .catch((error) => console.log(error));
          }

          const BPLName = await request(
            "GET",
            `/BusinessPlaces(${parseInt(data?.U_tl_bplid)})?$select=BPLName`
          )
            .then(async (res: any) => res?.data?.BPLName)
            .catch(() => {});

          let result: any = [];
          data?.TL_EXP_CLEAR_LINESCollection?.reduce(function (
            res: any,
            value: any
          ) {
            if (!res[value.U_tl_expcode]) {
              res[value.U_tl_expcode] = {
                ...value,
                U_tl_expcode: value.U_tl_expcode,
                U_tl_linetotal: 0,
              };
              result.push(res[value.U_tl_expcode]);
            }
            res[value.U_tl_expcode].U_tl_linetotal += value.U_tl_linetotal;
            return res;
          }, {});

          this.setState({
            ...data,
            edit: true,
            BPLName: BPLName,
            GLCash: data?.U_tl_cashacct,
            Branch: data?.U_tl_bplid,
            loading: false,
            Items: result || [],
            Logs: data?.TL_EXP_CLEAR_LINESCollection || [],
            refs: data?.TL_EXP_CLEAR_LINESCollection || [],
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

  //   render() {
  //     return (
  //       <>
  //         <div className="w-full px-4 py-2 flex flex-col gap-1 relative bg-white ">
  //           <DocumentHeaderComponent data={this.state} menuTabs />

  //           <div className="w-full h-full flex flex-col gap-4">
  //             {this.state.loading ? (
  //               <div className="grow flex justify-center items-center pb-6">
  //                 <CircularProgress />
  //               </div>
  //             ) : (
  //               <div className="grow w-full h-full  flex flex-col gap-3 px-7 mt-4">
  //                 <div className="grow flex flex-col gap-3 ">
  //                   <div className="bg-white w-full px-8 py-4  ">
  //                     <General data={this.state} />
  //                     <Content data={this.state} />
  //                     <PreviewAttachment
  //                       attachmentEntry={this.state.AttachmentEntry}
  //                     />
  //                   </div>

  //                   <div className="mb-5"></div>
  //                 </div>
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //       </>
  //     )
  //   }
  // }
  async handlerChangeMenu(index: number) {
    this.setState({ ...this.state, tapIndex: index });
  }

  render() {
    return (
      <>
        <DocumentHeaderDetails
          data={this.state}
          type="Expense"
          handlerChangeMenu={(index) => this.handlerChangeMenu(index)}
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
              <div className="grow  px-16 py-4 ">
                {this.state.tapIndex === 0 && <Content data={this.state} />}

                {this.state.tapIndex === 1 && (
                  <PreviewAttachment
                    attachmentEntry={this.state.AttachmentEntry}
                  />
                )}
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
                <div className="col-span-1 text-gray-700 ">Branch</div>
                <div className="col-span-1 text-gray-900">
                  {data?.BPLName ?? "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">Currency</div>
                <div className="col-span-1 text-gray-900">
                  {data?.U_tl_doccur ?? "N/A"}{" "}
                  {data?.ExchangeRate > 1 && ` - ${data?.ExchangeRate}`}
                </div>
              </div>
            </div>
            <div className="col-span-2"></div>
            <div className="col-span-5 ">
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700">DocNum</div>
                <div className="col-span-1  text-gray-900">
                  {props.data.DocNum}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">Posting Date</div>
                <div className="col-span-1 text-gray-900">
                  {dateFormat(props.data.TaxDate)}
                </div>
              </div>
              <div className="grid grid-cols-2 py-1">
                <div className="col-span-1 text-gray-700 ">Document Date</div>
                <div className="col-span-1 text-gray-900">
                  {dateFormat(props.data.DocDate)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Content(props: any) {
  const { data }: any = props;
  const { tlExpDic }: any = React.useContext(APIContext);

  const itemColumns = React.useMemo(
    () => [
      {
        accessorKey: "U_tl_expcode",
        header: "Expense Code",
        visible: true,
        Cell: ({ cell }: any) => (
          <MUITextField
            readOnly={true}
            defaultValue={
              tlExpDic?.find((e: any) => e.Code === cell.getValue())?.Code
            }
          />
        ),
      },
      {
        accessorKey: "ExpenseName",
        header: "Expense Name",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              defaultValue={
                tlExpDic?.find(
                  (e: any) => e.Code === cell.row.original.U_tl_expcode
                )?.Name
              }
              readOnly={true}
            />
          );
        },
      },
      {
        accessorKey: "U_tl_linetotal",
        header: "Amount",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField
              defaultValue={numberWithCommas(cell.getValue(0).toFixed(2))}
              readOnly={true}
            />
          );
        },
      },
      {
        accessorKey: "U_tl_remark",
        header: "Remark",
        visible: true,
        Cell: ({ cell }: any) => {
          return (
            <MUITextField defaultValue={cell.getValue()} readOnly={true} />
          );
        },
      },
    ],
    [data?.Items]
  );

  const itemInvoicePrices =
    data?.Items?.reduce((prev: number, item: any) => {
      return prev + parseFloat(item?.U_tl_linetotal || 0);
    }, 0) ?? 0;

  return (
    <>
      <fieldset className="border border-solid border-gray-300 p-3 mb-6 shadow-md">
        <legend className="text-md px-2 font-bold">Content Information</legend>
        <MaterialReactTable
          columns={itemColumns}
          data={data?.Items ?? []}
          enableRowNumbers={true}
          enableStickyHeader={true}
          enableColumnActions={false}
          enableColumnFilters={false}
          enablePagination={false}
          enableSorting={false}
          enableTopToolbar={false}
          enableColumnResizing={true}
          enableColumnFilterModes={false}
          enableDensityToggle={false}
          enableFilters={false}
          enableFullScreenToggle={false}
          enableGlobalFilter={false}
          enableHiding={true}
          enablePinning={true}
          enableStickyFooter={false}
          enableMultiRowSelection={true}
          state={{}}
          muiTableBodyRowProps={() => ({
            sx: { cursor: "pointer" },
          })}
          enableTableFooter={false}
        />
        <div className="col-span-2">
          <div className="grid grid-cols-2">
            <div className="pl-4 pr-20"></div>
            <div className="pl-20">
              <div className="grid grid-cols-5 mb-4"></div>
              <div className="grid grid-cols-5">
                <div className="col-span-2">
                  <span className="flex items-center pt-1 text-sm">
                    <b>Total Payment Due</b>
                  </span>
                </div>
                <div className="col-span-3">
                  <MUITextField
                    placeholder="0.00"
                    type="text"
                    startAdornment={data?.Currency}
                    readOnly={true}
                    value={numberWithCommas(itemInvoicePrices.toFixed(2))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    </>
  );
}
