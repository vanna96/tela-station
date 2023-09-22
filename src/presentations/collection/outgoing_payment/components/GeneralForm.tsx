import FormCard from "@/components/card/FormCard"
import MUIDatePicker from "@/components/input/MUIDatePicker"
import MUITextField from "@/components/input/MUITextField"
import VendorTextField from "@/components/input/VendorTextField"
import BPAddress from "@/components/selectbox/BPAddress"
import BPProject from "@/components/selectbox/BPProject"
import MUISelect from "@/components/selectbox/MUISelect"
import { ContactEmployee } from "@/models/BusinessParter"
import TextField from "@mui/material/TextField"
import React from "react"

export interface IGeneralFormProps {
  handlerChange: (key: string, value: any) => void
  data: any
  handlerOpenProject?: () => void
  edit?: boolean
  hanndResetState?: any
}

export default function GeneralForm({
  data,
  handlerChange,
  edit,
  hanndResetState,
}: IGeneralFormProps) {
  const isNotAccount = ["rSupplier", "rCustomer"].includes(
    data?.DocType.toString()
  ) as boolean

  return (
    <>
      <FormCard title="Information">
        <div className="flex flex-col gap-2">
          <div className="clearfix"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Document Type
              </label>
              <div className="">
                <MUISelect
                  items={[
                    {
                      id: "rCustomer",
                      name: "Customer",
                    },
                    {
                      id: "rAccount",
                      name: "Account",
                    },
                    {
                      id: "rSupplier",
                      name: "Vendor",
                    },
                  ]}
                  onChange={(e) => hanndResetState({ DocType: e.target.value })}
                  value={data?.DocType}
                  aliasvalue="id"
                  aliaslabel="name"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {isNotAccount && (
              <VendorTextField
                vtype={`${data?.DocType.replace("r", "").toLowerCase()}`}
                onChange={(vendor) => handlerChange("vendor", vendor)}
                key={data?.CardCode}
                error={"CardCode" in data?.error}
                helpertext={data?.error?.CardCode}
                required
                label={`${data?.DocType.replace("r", "")} Code`}
                autoComplete="off"
                defaultValue={data?.CardCode}
                disabled={data?.DocType === "rAccount"}
                name="BPCode"
                endAdornment={!edit}
              />
            )}
            {isNotAccount && (
              <MUITextField
                required
                label={`${data?.DocType.replace("r", "")} Name`}
                value={data?.CardName}
                disabled={edit}
              />
            )}
          </div>

          {isNotAccount && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 text-sm">
                <label htmlFor="Code" className="text-gray-500 text-[14px]">
                  Contact Person
                </label>
                <div className="">
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

              <div className="flex flex-col gap-1 text-sm">
                <div className="flex flex-col gap-1 text-sm">
                  <label
                    htmlFor="SettlementProbability"
                    className="text-gray-500 text-[14px]"
                  >
                    Ship From
                  </label>
                  <div className="">
                    <BPAddress
                      name="BillingTo"
                      type="bo_BillTo"
                      data={data}
                      value={data.BillingTo}
                      disabled={data?.isStatusClose || false}
                      onChange={(e) => handlerChange("BillingTo", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <MUITextField
                label="Journal Remark"
                value={data?.JournalMemo}
                onChange={(e) => handlerChange("JournalMemo", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Project
              </label>
              <div className="">
                <BPProject
                  name="BPProject"
                  value={data.BPProject}
                  onChange={(e) => handlerChange("BPProject", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Remarks
              </label>
              <div className="">
                <TextField
                  size="small"
                  multiline
                  rows={4}
                  fullWidth
                  onBlur={(e) => handlerChange("Description", e.target.value)}
                  name="Description"
                  className="w-full"
                  defaultValue={data?.Description}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="clearfix"></div>
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="series">
              Series <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 ">
              <MUISelect
                items={data.SerieLists ?? []}
                aliasvalue="Series"
                aliaslabel="Name"
                name="Series"
                loading={data?.isLoadingSerie}
                value={data?.Series === "" ? "M" : data?.Series}
                disabled={edit}
                onChange={(e: any) => handlerChange("Series", e.target.value)}
              />
              <div className="-mt-1">
                <MUITextField
                  size="small"
                  name="DocNum"
                  value={data?.DocNum}
                  disabled={edit}
                  placeholder="Document No"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Posting Date
              </label>
              <div className="">
                <MUIDatePicker
                  disabled={data?.isStatusClose || false}
                  value={data.PostingDate}
                  onChange={(e: any) => handlerChange("PostingDate", e)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <label
                htmlFor="Code"
                className={`${
                  !("DueDate" in data?.error) ? "text-gray-500" : "text-red-500"
                } text-[14px]`}
              >
                Due Date <span className="text-red-500">*</span>
              </label>
              <div className="">
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
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Document Date
              </label>
              <div className="">
                <MUIDatePicker
                  disabled={edit && data?.Status?.includes("A")}
                  value={data.DocumentDate}
                  onChange={(e: any) => handlerChange("DocumentDate", e)}
                />
              </div>
            </div>
          </div>
        </div>
      </FormCard>
    </>
  )
}
