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
import CookieBranchSelect from "@/components/selectbox/BranchBPL";
import VendorByBranch from "@/components/input/VendorByBranch";

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
  const filteredSeries = data?.SerieLists?.filter(
    (serie: any) => serie?.BPLID === data?.BPL_IDAssignedToInvoice
  );

  if (filteredSeries[0]?.NextNumber && data) {
    data.DocNum = filteredSeries[0].NextNumber;
  }
  const [cookies] = useCookies(["user"]);

  // Access the user data from cookies.user
  const userData = cookies.user;

  console.log(data?.BPL_IDAssignedToInvoice)
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
              <CookieBranchSelect
                CookieBranch={userData?.Branch}
                onChange={(e) =>
                  handlerChange("BPL_IDAssignedToInvoice", e.target.value)
                }
                value={data?.BPL_IDAssignedToInvoice}
                name="BPL_IDAssignedToInvoice"
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
              <WarehouseByBranch
                Branch={data?.BPL_IDAssignedToInvoice}
                // onChange={(e) => handlerChange("U_tl_whsdesc", e.target.value)}
                value={data?.U_tl_whsdesc}
                onChange={(e) => {
                  handlerChange("U_tl_whsdesc", e.target.value);
                  onWarehouseChange(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 py-1">
            <div className="col-span-2 text-gray-600 ">
              Customer <span className="text-red-500">*</span>
            </div>
            <div className="col-span-3 text-gray-900">
              <VendorByBranch
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
                  onChange={(e: any) => handlerChange("Series", e.target.value)}
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
                required
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
              <SalePerson
                name="SalesPersonCode"
                value={data.SalesPersonCode}
                onChange={(e) =>
                  handlerChange("SalesPersonCode", e.target.value)
                }
              />
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
