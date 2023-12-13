import React, { useState } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import VendorTextField from "@/components/input/VendorTextField"; // Assuming you have this component imported
import { ContactEmployee } from "@/models/BusinessParter";
import WarehouseByBranch from "@/components/selectbox/WarehouseByBranch";
import SalePerson from "@/components/selectbox/SalePerson";
import DistributionRuleSelect from "@/components/selectbox/DistributionRule";
import { TextField } from "@mui/material";
import { useCookies } from "react-cookie";
import VendorByBranch from "@/components/input/VendorByBranch";
import BPLBranchSelect from "@/components/selectbox/BranchBPL";
import BranchAutoComplete from "@/components/input/BranchAutoComplete";
import WarehouseAutoComplete from "@/components/input/WarehouseAutoComplete";
import SalePersonAutoComplete from "@/components/input/SalesPersonAutoComplete";
import CurrencyRepository from "@/services/actions/currencyRepository";
import { useQuery } from "react-query";
import request from "@/utilies/request";
import { useExchangeRate } from "../hook/useExchangeRate";
import BinLocationAutoComplete from "@/components/input/BinLocationAutoComplete";
import { useParams } from "react-router-dom";
import ToBinAutoComplete from "@/components/input/BinLocationTo";
import BinLocationTo from "@/components/input/BinLocationTo";
import WareBinLocationRepository from "@/services/whBinLocationRepository";

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

  const BPL = data?.BPL_IDAssignedToInvoice || (cookies.user?.Branch <= 0 && 1);

  //Filtering SO series
  const filteredSeries = data?.SerieLists?.filter(
    (series: any) => series?.BPLID === BPL
  );

  const seriesSO =
    data.SerieLists.find((series: any) => series.BPLID === BPL)?.Series || "";

  if (filteredSeries[0]?.NextNumber && data) {
    data.DocNum = filteredSeries[0].NextNumber;
  }

  // Finding date and to filter DN and INVOICE series Name
  const currentDate = new Date();
  const year = currentDate.getFullYear() % 100; // Get the last two digits of the year
  const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
  const formattedMonth = month.toString().padStart(2, "0");
  const formattedDateA = `23A${formattedMonth}`;
  const formattedDateB = `23B${formattedMonth}`;

  const seriesDN = (
    data?.dnSeries?.find(
      (entry: any) =>
        entry.BPLID === BPL &&
        (entry.Name.startsWith(formattedDateA) ||
          entry.Name.startsWith(formattedDateB))
    ) || {}
  ).Series;

  const seriesIN = (
    data?.invoiceSeries?.find(
      (entry: any) =>
        entry.BPLID === BPL &&
        (entry.Name.startsWith(formattedDateA) ||
          entry.Name.startsWith(formattedDateB))
    ) || {}
  ).Series;

  const route = useParams();
  const salesType = route["*"];
  const getValueBasedOnFactor = () => {
    switch (salesType) {
      case "fuel-sales/create":
        return "Oil";
      case "lube-sales/create":
        return "Lube";
      case "lpg-sales/create":
        return "LPG";
      default:
        return ""; // Set a default value if needed
    }
  };

  const { data: WarebinItems, isLoading }: any = useQuery({
    queryKey: ["ware-BinLocation"],
    queryFn: () => new WareBinLocationRepository().get(),
    staleTime: Infinity,
  });

  const desiredBinCode = data.BinLocation;
  const filteredData = WarebinItems?.filter(
    (entry: any) => entry.BinCode === desiredBinCode
  );
  const itemCodes = filteredData?.map((entry: any) => entry.ItemCode);

  // console.log(itemCodes);
  if (data) {
    data.DNSeries = seriesDN;
    data.INSeries = seriesIN;
    data.Series = seriesSO;
    data.U_tl_arbusi = getValueBasedOnFactor();
    data.lineofBusiness = getValueBasedOnFactor();
    data.ItemLists = itemCodes;
  }

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
                Branch
              </label>
            </div>
            <div className="col-span-3">
              <BranchAutoComplete
                BPdata={userData?.UserBranchAssignment}
                onChange={(e) => handlerChange("BPL_IDAssignedToInvoice", e)}
                value={BPL}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                From Warehouse<span className="text-red-500">*</span>
              </label>
            </div>
            <div className="col-span-3">
              <WarehouseAutoComplete
                Branch={data?.BPL_IDAssignedToInvoice ?? 1}
                value={data?.FromWarehouse}
                onChange={(e) => {
                  handlerChange("FromWarehouse", e);
                  onWarehouseChange(e);
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                To Warehouse<span className="text-red-500">*</span>
              </label>
            </div>
            <div className="col-span-3">
              <WarehouseAutoComplete
                Branch={data?.BPL_IDAssignedToInvoice ?? 1}
                value={data?.ToWarehouse}
                onChange={(e) => {
                  handlerChange("ToWarehouse", e);
                  onWarehouseChange(e);
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                To Bin Location
              </label>
            </div>
            <div className="col-span-3">
              <BinLocationTo
                value={data?.BinLocation}
                Warehouse={data?.ToWarehouse ?? "WH01"}
                onChange={(e) => {
                  handlerChange("BinLocation", e);
                  console.log(e);
                }}
                // onItemCodeSelect={(itemCode) =>
                //   handlerChange("ItemCode", itemCode)
                // }
              />
            </div>
          </div>
        </div>
        <div className="col-span-2 md:col-span-1"></div>
        <div className="col-span-5 ">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Series
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
                    disabled={edit}
                    placeholder="Document No"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Posting Date
              </label>
            </div>
            <div className="col-span-3">
              <MUIDatePicker
                disabled={data?.isStatusClose || false}
                value={data.PostingDate}
                onChange={(e: any) => handlerChange("PostingDate", e)}
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
                Due Date <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="col-span-3">
              <MUIDatePicker
                error={"DueDate" in data?.error}
                helpertext={data?.error["DueDate"]}
                disabled={data?.isStatusClose || false}
                value={data.DueDate ?? null}
                onChange={(e: any) => handlerChange("DueDate", e)}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Document Date
              </label>
            </div>
            <div className="col-span-3">
              <MUIDatePicker
                disabled={edit && data?.Status?.includes("A")}
                value={data.DocumentDate}
                onChange={(e: any) => handlerChange("DocumentDate", e)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
