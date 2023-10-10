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
import AccountTextField from "@/components/input/AccountTextField";
import CashACAutoComplete from "@/components/input/CashAccountAutoComplete";
import CashAccount from '@/components/selectbox/CashAccount';

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

  if (data) {
    data.DNSeries = seriesDN;
    data.INSeries = seriesIN;
    data.Series = seriesSO;
  }
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
                onChange={(e) => handlerChange("BPL_IDAssignedToInvoice", e)}
                value={BPL}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Warehouse
              </label>
            </div>
            <div className="col-span-3">
              <WarehouseAutoComplete
                Branch={data?.BPL_IDAssignedToInvoice ?? 1}
                value={data?.U_tl_whsdesc}
                onChange={(e) => {
                  handlerChange("U_tl_whsdesc", e);
                  onWarehouseChange(e);
                }}
              />
            </div>
          </div>
          <div>
            <input
              hidden
              name="DNSeries"
              value={data.DNSeries}
              onChange={(e) => handlerChange("DNSeries", e.target.value)}
            />
            <input
              hidden
              name="INSeries"
              value={data.INSeries}
              onChange={(e) => handlerChange("INSeries", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-5 py-1">
            <div className="col-span-2 text-gray-600 ">
              Customer <span className="text-red-500">*</span>
            </div>
            <div className="col-span-3 text-gray-900">
              <VendorByBranch
                branch={data?.BPL_IDAssignedToInvoice}
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
              <MUITextField
                value={data?.CardName}
                disabled={edit}
                name="BPName"
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Contact Person
              </label>
            </div>
            <div className="col-span-3">
              <MUISelect
                items={data?.vendor?.contactEmployee?.map(
                  (e: ContactEmployee) => ({
                    id: e.id,
                    name: e.name,
                  })
                )}
                onChange={(e) =>
                  handlerChange("ContactPersonCode", e.target.value)
                }
                value={data?.ContactPersonCode}
                aliasvalue="id"
                aliaslabel="name"
                name="ContactPersonCode"
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
                name="User_Text"
                value={data?.User_Text}
                onChange={(e: any) =>
                  handlerChange("User_Text", e.target.value)
                }
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
                Delivery Date <span className="text-red-500">*</span>
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
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Sale Employee
              </label>
            </div>
            <div className="col-span-3">
              <SalePersonAutoComplete
                value={data.SalesPersonCode}
                onChange={(e) => handlerChange("SalesPersonCode", e)}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Cash Account<span className="text-red-500">{" "}*</span>
              </label>
            </div>
            <div className="col-span-3">
              <CashACAutoComplete
                onChange={(e: any) => handlerChange("CashAccount", e)}
                value={data?.CashAccount}
                disabled={data?.edit}
              />
              {data.CashAccount}
            </div>
          </div>
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-600 ">
                Line of Business
              </label>
            </div>
            <div className="col-span-3">
              <DistributionRuleSelect
                value={data?.U_tl_arbusi}
                onChange={(e) => {
                  handlerChange("U_tl_arbusi", e.target.value);
                  onLineofBusinessChange(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
