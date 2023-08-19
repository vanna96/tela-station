import FormCard from "@/components/card/FormCard"
import MUIDatePicker from "@/components/input/MUIDatePicker"
import MUITextField from "@/components/input/MUITextField"
import VendorTextField from "@/components/input/VendorTextField"
import MUISelect from "@/components/selectbox/MUISelect"
import Owner from "@/components/selectbox/Owner"
import SalePerson from "@/components/selectbox/SalePerson"
import ShippingType from "@/components/selectbox/ShippingType"
import { ContactEmployee } from "@/models/BusinessParter"
import TextField from "@mui/material/TextField"

export interface IGeneralFormProps {
  handlerChange: (key: string, value: any) => void
  data: any
  handlerOpenProject?: () => void
  edit?: boolean
}

export default function GeneralForm({
  data,
  handlerChange,
  handlerOpenProject,
  edit,
}: IGeneralFormProps) {
  return (
    <>
      <FormCard title="Information">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <VendorTextField
              vtype={"customer"}
              onChange={(vendor) => handlerChange("vendor", vendor)}
              key={data?.CardCode}
              error={"CardCode" in data?.error}
              helpertext={data?.error?.CardCode}
              required
              label="Customer Code"
              autoComplete="off"
              defaultValue={data?.CardCode}
              disabled={edit}
              name="BPCode"
              endAdornment={!edit}
            />
            <MUITextField
              required
              label="Customer Name"
              value={data?.CardName}
              disabled={edit}
              name="BPName"
            />
          </div>

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
              <MUITextField
                label="Customer Ref.No"
                value={data?.NumAtCard}
                name=""
                onBlur={(e) => handlerChange("NumAtCard", e.target.value)}
              />
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
                Return Date <span className="text-red-500">*</span>
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

            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Sales Employee
              </label>
              <div className="">
                <SalePerson
                  name="SalesPersonCode"
                  value={data.SalesPersonCode}
                  onChange={(e) => handlerChange("SalesPersonCode", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Owner
              </label>
              <div className="">
                <Owner
                  name="Owner"
                  value={data.Owner}
                  onChange={(e) => handlerChange("Owner", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </FormCard>
    </>
  )
}
