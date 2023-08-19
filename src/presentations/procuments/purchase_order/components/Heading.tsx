import FormCard from "@/components/card/FormCard";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { ContactEmployee } from "@/models/BusinessParter";
import TextField from "@mui/material/TextField";

export interface IHeadingFormProps {
  handlerOpenVendor: () => void;
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
  handlerOpenProject?: () => void;
}

export default function HeadingForm({
  handlerOpenVendor,
  data,
  edit,
  handlerChange,
  handlerOpenProject,
}: IHeadingFormProps) {


  return (
    <>
      <FormCard title="Information">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Vendor Code"
              value={data?.CardCode}
              disabled={edit}
              onClick={handlerOpenVendor}
              endAdornment={!edit}
            />
            <MUITextField
              label="Name"
              value={data?.CardName}
              disabled={edit}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Contact Person
              </label>
              <div className="">
                <MUISelect
                  items={data?.ContactPersonList?.map((e: ContactEmployee) => ({
                    id: e.id,
                    name: e.name,
                  }))}
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
                label="Vender Ref.No"
                name="NumAtCard"
                value={data?.NumAtCard}
                onChange={(e) => handlerChange('NumAtCard', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-col gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Currency
              </label>
              <div className="grid grid-col-2 gap-3">
                <TextField
                  size="small"
                  fullWidth
                  className="w-full text-field bg-gray-100"
                  name="DocCurrency"
                  value={data.Currency}
                // disabled
                />
                <div></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              No
            </label>
            <div className="grid grid-cols-2 gap-3">
              <MUISelect
                items={data.SerieLists ?? []}
                aliasvalue="Series"
                aliaslabel="Name"
                name="Series"
                disabled={edit}
                loading={data?.isLoadingSerie}
                value={data?.Series}
                onChange={(e: any) => handlerChange("Series", e.target.value)}
              />
              <TextField
                size="small"
                name="DocNum"
                key={data?.DocNum}
                defaultValue={data?.DocNum}
                disabled={edit}
                placeholder="Document No"
                fullWidth
                className="w-full text-field"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <MUITextField
              label="Status"
              disabled={edit}
              value={data?.DocumentStatus?.replace("bost_", "")}
              name="DocumentStatus"
            />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Posting Date
              </label>
              <div className="">
                <MUIDatePicker
                  error={data?.message?.includes("DocDate")}
                  value={data.DocDate}
                  onChange={(e: any) => handlerChange("docDate", e)}
                  disabled={data.DocumentStatus === "bost_Close" ? true : false}

                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 text-sm">
                <label htmlFor="Code" className="text-gray-500 text-[14px]">
                  Delivery Date
                </label>
                <div className="">
                  <MUIDatePicker
                    value={data.DocDueDate}
                    onChange={(e: any) => handlerChange("DocDueDate", e)}
                    disabled={data.DocumentStatus === "bost_Close" ? true : false}

                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 text-sm">
                <label htmlFor="Code" className="text-gray-500 text-[14px]">
                  Document Date:
                </label>
                <div className="">
                  <MUIDatePicker
                    value={data.TaxDate}
                    onChange={(e: any) => handlerChange("TaxDate", e)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormCard>
    </>
  );
}
