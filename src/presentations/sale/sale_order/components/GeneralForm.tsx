import React from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import VendorTextField from "@/components/input/VendorTextField"; // Assuming you have this component imported
import { ContactEmployee } from "@/models/BusinessParter";
import BPLBranchSelect from "@/components/selectbox/BranchBPL";
import WarehouseByBranch from "@/components/selectbox/WarehouseByBranch";
import SalePerson from "@/components/selectbox/SalePerson";
import DistributionRuleSelect from "@/components/selectbox/DistributionRule";
import { TextField } from "@mui/material";

export interface IGeneralFormProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
  lineofBusiness: string;
  onLineofBusinessChange: (value: any) => void;
}

export default function GeneralForm({
  data,
  onLineofBusinessChange,
  handlerChange,
  edit,
}: IGeneralFormProps) {
  const filteredSeries = data?.SerieLists?.filter(
    (serie: any) => serie?.BPLID === data?.Branch
  );

  if (filteredSeries[0]?.NextNumber && data) {
    data.DocNum = filteredSeries[0].NextNumber;
  }

  return (
    <div className="rounded-lg shadow-sm bg-white border p-8 px-8 h-screen">
      <div className="font-medium text-xl flex justify-between items-center border-b mb-6">
        <h2>Basic Information</h2>
      </div>
      <div className="grid grid-cols-2">
        <div className="pl-4 pr-20">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Customer <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="col-span-3">
              <VendorTextField
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
        </div>
        <div className="pl-20">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
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
                  value={filteredSeries[0]?.Series}
                  disabled={edit}
                  onChange={(e: any) => handlerChange("Series", e.target.value)}
                />
                <div className="-mt-1">
                  <MUITextField
                    size="small"
                    name="DocNum"
                    value={filteredSeries[0]?.NextNumber ?? ""}
                    // value={data?.DocNum}
                    disabled={edit}
                    placeholder="Document No"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  */}
      <div className="grid grid-cols-2">
        <div className="pl-4 pr-20">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
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
        </div>
        <div className="pl-20">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
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
        </div>
      </div>
      {/*  */}

      <div className="grid grid-cols-2">
        <div className="pl-4 pr-20">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
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
        </div>
        <div className="pl-20">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label
                htmlFor="Code"
                className={`${
                  !("DueDate" in data?.error) ? "text-gray-500" : "text-red-500"
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
        </div>
      </div>
      {/*  */}

      <div className="grid grid-cols-2">
        <div className="pl-4 pr-20">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Branch
              </label>
            </div>
            <div className="col-span-3">
              <BPLBranchSelect
                onChange={(e) => handlerChange("Branch", e.target.value)}
                value={data?.Branch}
                name="Branch"
              />
            </div>
          </div>
        </div>
        <div className="pl-20">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
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
      {/*  */}
      <div className="grid grid-cols-2">
        <div className="pl-4 pr-20">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Warehouse
              </label>
            </div>
            <div className="col-span-3">
              <WarehouseByBranch
                Branch={data?.Branch}
                onChange={(e) => handlerChange("Warehouse", e.target.value)}
                value={data?.Warehouse}
              />
            </div>
          </div>
        </div>
        <div className="pl-20">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
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
        </div>
      </div>
      {/*  */}
      <div className="grid grid-cols-2">
        <div className="pl-4 pr-20">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
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
        <div className="pl-20">
          <div className="grid grid-cols-5 py-2">
            <div className="col-span-2">
              <label htmlFor="Code" className="text-gray-500 ">
                Line of Business
              </label>
            </div>
            <div className="col-span-3">
              <DistributionRuleSelect
                value={data.LineofBusiness}
                onChange={(e) => {
                  handlerChange("LineofBusiness", e.target.value);
                  onLineofBusinessChange(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {/*  */}
    </div>
  );
}
