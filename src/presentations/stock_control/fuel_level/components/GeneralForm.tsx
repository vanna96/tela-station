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
import StatusSelect from "@/components/selectbox/Status";

export interface IGeneralFormProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
}

export default function GeneralForm({
  data,
  handlerChange,
  edit,
}: IGeneralFormProps) {
  const [cookies] = useCookies(["user"]);
  const [selectedSeries, setSelectedSeries] = useState("");
  const userData = cookies.user;

  const BPL = data?.BPL_IDAssignedToInvoice || (cookies.user?.Branch <= 0 && 1);

  // const filteredSeries = data?.SerieList?.filter(
  //   (series: any) => series?.BPLID === BPL
  // );

  const filteredSeries = data?.SerieList;
  console.log(filteredSeries[0]);

  // const seriesSO =
  //   data.SerieList.find((series: any) => series.BPLID === BPL)?.Series || "";

  if (filteredSeries[0]?.NextNumber && data) {
    data.DocNum = filteredSeries[0].NextNumber;
  }

  const route = useParams();
  if (data) {
    data.Series = filteredSeries[0]?.Series;
  }

  const { data: sysInfo }: any = useQuery({
    queryKey: ["sysInfo"],
    queryFn: () =>
      request("POST", "CompanyService_GetAdminInfo")
        .then((res: any) => res?.data)
        .catch((err: any) => console.log(err)),
    staleTime: Infinity,
  });

  console.log(data);

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
                onChange={(e) => handlerChange("U_tl_bplid", e)}
                value={BPL}
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
                  items={filteredSeries ?? data.SerieList}
                  aliasvalue="Series"
                  aliaslabel="Name"
                  name="Series"
                  loading={data?.isLoadingSerie}
                  value={edit ? data?.SerieList : filteredSeries[0].Series}
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
                Status
              </label>
            </div>
            <div className="col-span-3">
              <MUISelect
                items={[
                  {
                    Code: "O",
                    Name: "Open",
                  },
                  {
                    Code: "C",
                    Name: "Closed",
                  },
                ]}
                aliasvalue="Code"
                aliaslabel="Name"
                name="Status"
                value={data?.Status}
                onChange={(e) => handlerChange("Status", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
