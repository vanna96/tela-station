import React, { useState } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { ContactEmployee } from "@/models/BusinessParter";
import { TextField } from "@mui/material";
import { useCookies } from "react-cookie";
import VendorByBranch from "@/components/input/VendorByBranch";
import BranchAutoComplete from "@/components/input/BranchAutoComplete";
import WarehouseAutoComplete from "@/components/input/WarehouseAutoComplete";
import SalePersonAutoComplete from "@/components/input/SalesPersonAutoComplete";
import CurrencyRepository from "@/services/actions/currencyRepository";
import { useQuery } from "react-query";
import request from "@/utilies/request";
import { useParams } from "react-router-dom";
import BinLocationToAsEntry from "@/components/input/BinLocationToAsEntry";
import PriceListAutoComplete from "@/components/input/PriceListAutoComplete";
import { useExchangeRate } from "../../components/hook/useExchangeRate";

export interface IGeneralFormProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
  lineofBusiness: string;
  warehouseCode: string;
  onLineofBusinessChange: (value: any) => void;
  onWarehouseChange: (value: any) => void;
}

export default function GeneralForm({
  data,
  onLineofBusinessChange,
  onWarehouseChange,
  handlerChange,
  edit,
}: IGeneralFormProps) {

  const [cookies] = useCookies(["user"]);
  const [selectedSeries, setSelectedSeries] = useState("");
  const userData = cookies.user;

  const BPL = parseInt(data?.U_tl_bplid) || (cookies.user?.Branch <= 0 && 1);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const yearLastTwoDigits = year.toString().slice(-2); // Get last two digits of the year

  const filteredSeries = data?.SerieLists?.filter(
    (series: any) =>
      series?.BPLID === BPL && parseInt(series.PeriodIndicator) === year
  );
  const seriesSO =
    data.SerieLists.find((series: any) => series.BPLID === BPL)?.Series || "";

  if (filteredSeries[0]?.NextNumber && data) {
    data.DocNum = filteredSeries[0].NextNumber;
  }

  if (filteredSeries[0]?.NextNumber && data) {
    data.DocNum = filteredSeries[0].NextNumber;
  }

  const route = useParams();
  const month = currentDate.getMonth() + 1;
  const formattedMonth = month.toString().padStart(2, "0");
  const formattedDateA = `${yearLastTwoDigits}A${formattedMonth}`;
  const formattedDateB = `${yearLastTwoDigits}B${formattedMonth}`;

  const seriesIncoming = data?.incomingSeries
    ?.filter(
      (series: any) =>
        series?.BPLID === BPL && parseInt(series.PeriodIndicator) === year
    )
    ?.find((series: any) => series.BPLID === BPL)?.Series;

  const seriesINV = (
    data?.invoiceSeries?.find(
      (entry: any) =>
        entry.BPLID === BPL &&
        (entry.Name.startsWith(formattedDateA) ||
          entry.Name.startsWith(formattedDateB))
    ) || {}
  ).Series;
  if (data) {
    data.DNSeries = seriesIncoming;
    data.INSeries = seriesINV;
    data.Series = seriesSO;
    data.U_tl_arbusi = "Lube";
    data.lineofBusiness = "Lube";
  }
  console.log(data);

  const { data: CurrencyAPI }: any = useQuery({
    queryKey: ["Currency"],
    queryFn: () => new CurrencyRepository().get(),
    staleTime: Infinity,
  });

  const a = CurrencyAPI?.map((c: any) => {
    return {
      value: c.Code,
      name: c.Name,
    };
  });
  //test

  const { data: sysInfo }: any = useQuery({
    queryKey: ["sysInfo"],
    queryFn: () =>
      request("POST", "CompanyService_GetAdminInfo")
        .then((res: any) => res?.data)
        .catch((err: any) => console.log(err)),
    staleTime: Infinity,
  });
  const dataCurrency = data?.vendor?.currenciesCollection
    ?.filter(({ Include }: any) => Include === "tYES")
    ?.map(({ CurrencyCode }: any) => {
      return { value: CurrencyCode, name: CurrencyCode };
    });

  useExchangeRate(data?.Currency, handlerChange);
  return (
    <div className="rounded-lg shadow-sm bg-white border p-8 px-14 h-screen">
      <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
        <h2>Basic Information</h2>
      </div>

      <div className="grid grid-cols-12 ">
        <div className="col-span-5 ">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Branch <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="col-span-3">
              <BranchAutoComplete
                BPdata={userData?.UserBranchAssignment}
                onChange={(e) => handlerChange("U_tl_bplid", e)}
                value={BPL}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Warehouse <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="col-span-3">
              <WarehouseAutoComplete
                Branch={parseFloat(data?.U_tl_bplid)}
                value={data?.U_tl_whs}
                onChange={(e) => {
                  handlerChange("U_tl_whs", e);
                  onWarehouseChange(e);
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Bin Location <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="col-span-3">
              <BinLocationToAsEntry
                value={data?.U_tl_bincode}
                Warehouse={data?.U_tl_whs ?? "WH01"}
                onChange={(e) => {
                  handlerChange("U_tl_bincode", e);
                  // onWarehouseChange(e);
                }}
              />
            </div>
          </div>
          <div>
            <input
              hidden
              name="U_tl_arbusi"
              value={data?.U_tl_arbusi}
              // value={getValueBasedOnFactor()}
              onChange={(e) => {
                handlerChange("U_tl_arbusi", e.target.value);
                onLineofBusinessChange(e.target.value);
              }}
            />
          </div>
          <div className="grid grid-cols-5 py-1">
            <div className="col-span-2 text-gray-600 ">
              Customer <span className="text-red-500">*</span>
            </div>
            <div className="col-span-3 text-gray-900">
              <VendorByBranch
                branch={data?.U_tl_bplid}
                vtype="customer"
                onChange={(vendor) => handlerChange("vendor", vendor)}
                key={data?.CardCode}
                error={"CardCode" in data?.error}
                helpertext={data?.error?.CardCode}
                autoComplete="off"
                defaultValue={data?.CardCode}
                name="BPCode"
                endAdornment={!edit}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Name
              </label>
            </div>
            <div className="col-span-3">
              <MUITextField value={data?.CardName} disabled name="BPName" />
            </div>
          </div>

          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Currency
              </label>
            </div>
            <div className="col-span-3  ">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-6">
                  {
                    <MUISelect
                      value={data?.Currency || sysInfo?.SystemCurrency}
                      items={
                        dataCurrency?.length > 0
                          ? CurrencyAPI?.map((c: any) => {
                              return {
                                value: c.Code,
                                name: c.Name,
                              };
                            })
                          : dataCurrency
                      }
                      aliaslabel="name"
                      aliasvalue="value"
                      onChange={(e: any) =>
                        handlerChange("Currency", e.target.value)
                      }
                    />
                  }
                </div>
                <div className="col-span-6 ">
                  {(data?.Currency || sysInfo?.SystemCurrency) !==
                    sysInfo?.SystemCurrency && (
                    <MUITextField
                      value={data?.ExchangeRate || 0}
                      name=""
                      disabled={true}
                      className="-mt-1"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 md:col-span-1"></div>
        <div className="col-span-5 ">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Series <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="col-span-3">
              <div className="grid grid-cols-2 gap-3">
                <MUISelect
                  items={filteredSeries ?? data.SerieLists}
                  aliasvalue="Series"
                  aliaslabel="Name"
                  name="Series"
                  loading={data?.isLoadingSerie}
                  value={edit ? data?.Series : filteredSeries[0]?.Series}
                  disabled={edit}
                  // onChange={(e: any) => handlerChange("Series", e.target.value)}
                  // onChange={handleSeriesChange}
                />
                <div className="-mt-1">
                  <MUITextField
                    size="small"
                    name="DocNum"
                    value={
                      edit ? data?.DocNum : filteredSeries[0]?.NextNumber ?? ""
                    }
                    // value={data?.DocNum}
                    disabled
                    placeholder="Document No"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Posting Date <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="col-span-3">
              <MUIDatePicker
                disabled={data?.isStatusClose || false}
                value={data.U_tl_taxdate}
                onChange={(e: any) => handlerChange("U_tl_taxdate", e)}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label
                htmlFor="Code"
                className={`${
                  !("DueDate" in data?.error) ? "text-gray-600" : "text-red-500"
                } `}
              >
                Delivery Date <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="col-span-3">
              <MUIDatePicker
                error={"DocDueDate" in data?.error}
                helpertext={data?.error["DocDueDate"]}
                disabled={data?.isStatusClose || false}
                value={edit ? data.U_tl_devdate : data.U_tl_devdate ?? null}
                onChange={(e: any) => handlerChange("U_tl_devdate", e)}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Document Date <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="col-span-3">
              <MUIDatePicker
                disabled={edit}
                value={data.U_tl_docdate}
                onChange={(e: any) => handlerChange("U_tl_docdate", e)}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Remark
              </label>
            </div>
            <div className="col-span-3">
              <TextField
                size="small"
                fullWidth
                multiline
                rows={2}
                name="Remark"
                value={data?.Remark}
                onChange={(e: any) => handlerChange("Remark", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
