import FormCard from "@/components/card/FormCard";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import BranchSelect from "@/components/selectbox/Branch";
import BuyerSelect from "@/components/selectbox/buyer";
import DepartmentSelect from "@/components/selectbox/Department";
import MUISelect from "@/components/selectbox/MUISelect";
import ManagerSelect from "@/components/selectbox/Manager";
import PositionSelect from "@/components/selectbox/Position";
import UsersSelect from "@/components/selectbox/UserCode";
import { ContactEmployee } from "@/models/BusinessParter";
import { Checkbox } from "@mui/material";
import TextField from "@mui/material/TextField";
import BusinessPartnerGroupsSelect from "@/components/selectbox/BusinessPartnerGroups";
import CurrencySelect from "@/components/selectbox/Currency";

export interface IHeadingFormProps {
  //   handlerOpenVendor: () => void;
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
}

export default function Heading({
  data,
  edit,
  handlerChange,
}: IHeadingFormProps) {
  return (
    <>
      <FormCard title="Information">
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              No
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* <MUISelect
                // items={data.series ?? []}
                aliasvalue="Series"
                aliaslabel="Name"
                name="Series"
                disabled={edit}
                loading={data?.isLoadingSerie}
                value={data?.series}
                onChange={(e: any) => handlerChange("series", e.target.value)}
              /> */}
               <MUITextField
                name="CardCode"
                value={data?.cardCode}
                disabled={edit}
                onChange={(e: any) => handlerChange("cardCode", e.target.value)}
              />

              <MUITextField
                name="CardCode"
                value={data?.cardCode}
                disabled={edit}
                onChange={(e: any) => handlerChange("cardCode", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Name"
              value={data?.cardName}
              name="CardName"
              onChange={(e: any) => handlerChange("cardName", e.target.value)}
            />
            <MUITextField
              label="Foreign Name:"
              value={data?.cardForeignName}
              name="CardForeignName"
              onChange={(e: any) =>
                handlerChange("cardForeignName", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Group
              </label>
              <BusinessPartnerGroupsSelect
                value={data?.groupCode}
                onChange={(e) => handlerChange("groupCode", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Currency
              </label>
              <div className="">
                <CurrencySelect
                  value={data?.currency}
                  onChange={(e) => handlerChange("currency", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Federal Tax ID"
              value={data?.federalTaxID}
              name="FederalTaxID"
              onChange={(e: any) =>
                handlerChange("federalTaxID", e.target.value)
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Account Balance"
              value={data?.currentAccountBalance}
              disabled
              name="CurrentAccountBalance"
              onChange={(e: any) =>
                handlerChange("currentAccountBalance", e.target.value)
              }
            />
            <MUITextField
              label="Goods Receipt POs"
              value={data?.openDeliveryNotesBalance}
              disabled
              name="OpenDeliveryNotesBalance"
              onChange={(e: any) =>
                handlerChange("openDeliveryNotesBalance", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Purchase Orders:"
              disabled
              value={data?.openOrdersBalance}
              name="OpenOrdersBalance"
              onChange={(e: any) =>
                handlerChange("openOrdersBalance", e.target.value)
              }
            />
          </div>
        </div>
      </FormCard>
    </>
  );
}
