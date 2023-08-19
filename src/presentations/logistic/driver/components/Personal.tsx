import FormCard from "@/components/card/FormCard";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import BuyerSelect from "@/components/selectbox/buyer";
import CountrySelect from "@/components/selectbox/Country";
import MUISelect from "@/components/selectbox/MUISelect";
import { ContactEmployee } from "@/models/BusinessParter";
import TextField from "@mui/material/TextField";

export interface IPersonalProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
}

export default function Personal({
  data,
  edit,
  handlerChange,
}: IPersonalProps) {
  return (
    <>
      <FormCard title="Personal">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="AgreementMethod"
                className="text-gray-500 text-[14px]"
              >
                Gender
              </label>

              <MUISelect
                items={[
                  { name: "Not Specified", value: "E" },
                  { name: "Female", value: "F" },
                  { name: "Male", value: "gt_Male" },
                ]}
                aliaslabel="name"
                aliasvalue="value"
                name="Gender"
                value={data?.gender}
                onChange={(e) => handlerChange("gender", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Date of Birth
              </label>
              <div className="">
                <MUIDatePicker
                  error={data?.message?.includes("TerminationReason")}
                  value={data.terminationReason}
                  onChange={(e: any) => handlerChange("terminationReason", e)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Country/Region Of Bir:
              </label>
              <CountrySelect
                value={data?.countryOfBirth}
                onChange={(e) =>
                  handlerChange("countryOfBirth", e.target.value)
                }
              />
            </div>
            <div>
              <label
                htmlFor="Month"
                className="text-gray-500 text-[14px]"
              >
                Marital Status
              </label>

              <MUISelect
                items={[
                  { name: "Divorced", value: "D" },
                  { name: "Married", value: "mts_Married" },
                  { name: "Not Specified", value: "N" },
                  { name: "Single", value: "S" },
                  { name: "Widowed", value: "w" },
                ]}
                aliaslabel="name"
                aliasvalue="value"
                name="MartialStatus"
                value={data?.martialStatus}
                onChange={(e) => handlerChange("martialStatus", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="No. of Children"
              value={data?.numOfChildren}
              name="NumOfChildren"
              onChange={(e) => handlerChange("numOfChildren", e.target.value)}
            />
            <MUITextField
              label="ID No."
              value={data?.idNumber}
              name="IdNumber"
              onChange={(e) => handlerChange("idNumber", e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Citizenship
              </label>
              <CountrySelect
                value={data?.citizenshipCountryCode}
                onChange={(e) =>
                  handlerChange("citizenshipCountryCode", e.target.value)
                }
              />
            </div>
            <MUITextField
              label="Passport No."
              value={data?.passportNumber}
              name="PassportNumber"
              onChange={(e) => handlerChange("passportNumber", e.target.value)}
            />
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Passport Expiration Date
              </label>
              <div className="">
                <MUIDatePicker
                  error={data?.message?.includes("PassportExpirationDate")}
                  value={data.passportExpirationDate}
                  onChange={(e: any) =>
                    handlerChange("passportExpirationDate", e)
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor="Code" className="text-gray-500 text-[14px]">
                Passport Issue Date
              </label>
              <div className="">
                <MUIDatePicker
                  error={data?.message?.includes("PassportIssueDate")}
                  value={data.passportIssueDate}
                  onChange={(e: any) => handlerChange("passportIssueDate", e)}
                />
              </div>
            </div>
          </div>
          <MUITextField
            label="Passport Issuer"
            value={data?.passportIssuer}
            name="PassportIssuer"
            onChange={(e) => handlerChange("passportIssuer", e.target.value)}
          />
        </div>
      </FormCard>
    </>
  );
}
