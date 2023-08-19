import FormCard from "@/components/card/FormCard";
import MUITextField from "@/components/input/MUITextField";
import BuyerSelect from "@/components/selectbox/buyer";
import IndustrySelect from "@/components/selectbox/Industry";
import MUISelect from "@/components/selectbox/MUISelect";
import ShippingType from "@/components/selectbox/ShippingType";
import TerritorySelect from "@/components/selectbox/Territory";
import TextField from "@mui/material/TextField";

export interface IGeneralFormProps {
  handlerOpenProject?: () => void;
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
}

export default function General({
  data,
  edit,
  handlerChange,
  handlerOpenProject,
}: IGeneralFormProps) {
  return (
    <>
      <FormCard title="General">
        <div className="flex flex-col gap-2 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Tel1"
              value={data?.phone1}
              name="Phone1"
              onChange={(e: any) => handlerChange("phone1", e.target.value)}
            />
            <MUITextField
              label="Tel2"
              value={data?.phone2}
              name="Phone2"
              onChange={(e: any) => handlerChange("phone2", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Mobile Phone"
              value={data?.cellular}
              name="Cellular"
              onChange={(e: any) => handlerChange("cellular", e.target.value)}
            />
            <MUITextField
              label="Fax"
              value={data?.fax}
              name="Fax"
              onChange={(e: any) => handlerChange("fax", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="E-Mail"
              value={data?.emailAddress}
              name="EmailAddress"
              onChange={(e: any) =>
                handlerChange("emailAddress", e.target.value)
              }
            />
            <MUITextField
              label="Website"
              name="Website"
              value={data?.website}
              onChange={(e: any) =>
                handlerChange("website", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Shipping Type
              </label>
              <ShippingType
                name="ShippingType"
                value={data?.shippingType}
                onChange={(e) => handlerChange("shippingType", e.target.value)}
              />
            </div>
            <MUITextField
              label="Password"
              value={data?.password}
              name="Password"
              onChange={(e: any) => handlerChange("password", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Factoring Indicator"
              value={data?.indicator}
              name="Indicator"
              onChange={(e: any) => handlerChange("indicator", e.target.value)}
            />
           <MUITextField
              label="Business Partner Project"
              name="ProjectCode"
              value={data?.projectCode}
              endAdornment={true}
              onClick={handlerOpenProject}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Industry
              </label>
              <div className="">
                <IndustrySelect
                  value={data?.industry}
                  onChange={(e) => handlerChange("industry", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Type of Business
              </label>

              <MUISelect
                items={[
                  { name: "Company", value: "cCompany" },
                  { name: "Employee", value: "E" },
                  { name: "Government", value: "cGovernment" },
                  { name: "Private", value: "cPrivate" },
                ]}
                aliaslabel="name"
                aliasvalue="value"
                name="CompanyPrivate"
                value={data?.companyPrivate}
                onChange={(e) =>
                  handlerChange("companyPrivate", e.target.value)
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Alias Name"
              value={data?.aliasName}
              name="AliasName"
              onChange={(e: any) => handlerChange("aliasName", e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Contact Person"
              value={data?.contactPerson}
              disabled
              name="ContactPerson"
              onChange={(e: any) =>
                handlerChange("contactPerson", e.target.value)
              }
            />
            <MUITextField
              label="ID No. 2"
              value={data?.additionalID}
              name="AdditionalID"
              onChange={(e: any) =>
                handlerChange("additionalID", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Unified Federal Tax ID"
              value={data?.unifiedFederalTaxID}
              name="UnifiedFederalTaxID"
              onChange={(e: any) =>
                handlerChange("unifiedFederalTaxID", e.target.value)
              }
            />
            <div className="">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Buyer
              </label>
              <BuyerSelect
                name="SalesPersonCode"
                value={data?.salesPersonCode}
                onChange={(e) =>
                  handlerChange("salesPersonCode", e.target.value)
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Territory
              </label>
              <div className="">
                <TerritorySelect
                  value={data?.territory}
                  onChange={(e) => handlerChange("territory", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Remarks
            </label>
            <div className="">
              <TextField
                size="small"
                multiline
                rows={3}
                fullWidth
                name="Notes"
                value={data?.notes}
                onChange={(e) => handlerChange("notes", e.target.value)}
                />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <MUITextField
              label="GLN"
              value={data?.globalLocationNumber}
              name="GlobalLocationNumber"
              onChange={(e: any) =>
                handlerChange("globalLocationNumber", e.target.value)
              }
            />
          </div>
        </div>
      </FormCard>
    </>
  );
}
