import FormCard from "@/components/card/FormCard";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import CountrySelect from "@/components/selectbox/Country";
import MUISelect from "@/components/selectbox/MUISelect";
import { ContactEmployee } from "@/models/BusinessParter";
import TextField from "@mui/material/TextField";

export interface IAddressFormProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
}

export default function Address({
  data,
  edit,
  handlerChange,
}: IAddressFormProps) {
  return (
    <>
      <FormCard title="Address">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Street"
              value={data?.workStreet}
              name="WorkStreet"
              onChange={(e) => handlerChange("workStreet", e.target.value)}
            />
            <MUITextField
              label="Street No"
              value={data?.workStreetNumber}
              name="WorkStreetNumber"
              onChange={(e) =>
                handlerChange("workStreetNumber", e.target.value)
              }
            />
            <MUITextField
              label="Block"
              value={data?.workBlock}
              name="WorkBlock"
              onChange={(e) => handlerChange("workBlock", e.target.value)}
            />
            <MUITextField
              label="Building/Floor/Room"
              value={data?.workBuildingFloorRoom}
              name="WorkBuildingFloorRoom"
              onChange={(e) =>
                handlerChange("workBuildingFloorRoom", e.target.value)
              }
            />
            <MUITextField
              label="Zip Code"
              value={data?.workZipCode}
              name="WorkZipCode"
              onChange={(e) => handlerChange("workZipCode", e.target.value)}
            />
            <MUITextField
              label="City"
              value={data?.workCity}
              name="WorkCity"
              onChange={(e) => handlerChange("workCity", e.target.value)}
            />
            <MUITextField
              label="Country"
              value={data?.workCountryCode}
              name="WorkCountry"
              onChange={(e) => handlerChange("workCountryCode", e.target.value)}
            />
            <MUITextField
              label="State"
              value={data?.workStateCode}
              name="WorkState"
              onChange={(e) => handlerChange("workStateCode", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Country/Region
            </label>
            <CountrySelect
              value={data?.workCountryCode}
              onChange={(e) => handlerChange("workCountryCode", e.target.value)}
            />
          </div>
        </div>
        {/* Home */}
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <MUITextField
              label="Street"
              value={data?.homeStreet}
              name="HomeStreet"
              onChange={(e) => handlerChange("homeStreet", e.target.value)}
            />
            <MUITextField
              label="Street No"
              value={data?.homeStreetNumber}
              name="HomeStreetNumber"
              onChange={(e) =>
                handlerChange("homeStreetNumber", e.target.value)
              }
            />
            <MUITextField
              label="Block"
              value={data?.homeBlock}
              name="HomeBlock"
              onChange={(e) => handlerChange("homeBlock", e.target.value)}
            />
            <MUITextField
              label="Building/Floor/Room"
              value={data?.homeBuildingFloorRoom}
              name="HomeBuildingFloorRoom"
              onChange={(e) =>
                handlerChange("homeBuildingFloorRoom", e.target.value)
              }
            />
            <MUITextField
              label="Zip Code"
              value={data?.homeZipCode}
              name="HomeZipCode"
              onChange={(e) => handlerChange("homeZipCode", e.target.value)}
            />
            <MUITextField
              label="City"
              value={data?.homeCity}
              name="homeCity"
              onChange={(e) => handlerChange("homeCity", e.target.value)}
            />
            <MUITextField
              label="Country"
              value={data?.homeCountry}
              name="HomeCountry"
              onChange={(e) => handlerChange("homeCountry", e.target.value)}
            />
            <MUITextField
              label="State"
              value={data?.homeState}
              name="HomeState"
              onChange={(e) => handlerChange("homeState", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <label htmlFor="Code" className="text-gray-500 text-[14px]">
              Country/Region
            </label>
            <CountrySelect
              value={data?.homeCountry}
              onChange={(e) => handlerChange("homeCountry", e.target.value)}
            />
          </div>
        </div>
      </FormCard>
    </>
  );
}
