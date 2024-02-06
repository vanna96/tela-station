import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { useCookies } from "react-cookie";
import { TextField } from "@mui/material";
import WarehouseAttendTo from "@/components/selectbox/WarehouseAttention";
import StopsSelect from "@/components/selectbox/StopsSelect";

export interface IGeneralFormProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
  setData?: any;
  detail?: boolean;
}

export default function GeneralForm({
  data,
  handlerChange,
  edit,
  setData,
  detail,
}: IGeneralFormProps) {
  const [cookies, setCookie] = useCookies(["user"]);
  const branchId =
    data?.Branch || cookies?.user?.Branch || (cookies?.user?.Branch < 0 && 1);
  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-6 px-8 h-[calc(100vh-200px)]">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-4">
          <h2>Information</h2>
        </div>
        <div className="grid grid-cols-12 ">
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Base Station
                  <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <div className="col-span-3">
                  <WarehouseAttendTo
                    U_tl_attn_ter={true}
                    value={data?.U_BaseStation}
                    onChange={(e) => {
                      handlerChange("U_BaseStation", e);
                    }}
                    onBlur={(e: any) => setData({ ...data, U_BaseStation: e })}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Destination
                  <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <StopsSelect
                  value={data?.U_Destination}
                  onHandlerChange={(val) => {
                    handlerChange("U_Destination", val?.Code);
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Route Code
                  <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.Code}
                  name="Code"
                  onChange={(e) => handlerChange("Code", e.target.value)}
                  disabled={edit || detail}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Route Name
                  <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.Name}
                  name="Name"
                  onChange={(e) => handlerChange("Name", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Driver Incentive
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.U_Incentive}
                  name="U_Incentive"
                  onChange={(e) => handlerChange("U_Incentive", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="col-span-2"></div>
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Status
                </label>
              </div>
              <div className="col-span-3">
                <MUISelect
                  items={[
                    { id: "Y", name: "Active" },
                    { id: "N", name: "Inactive" },
                  ]}
                  onChange={(e) => handlerChange("U_Status", e.target.value)}
                  value={data?.U_Status || "Y"}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="U_Status"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Latitude" className="text-gray-500 ">
                  Distance (KM)
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.U_Distance}
                  name="U_Distance"
                  type="number"
                  onChange={(e) => handlerChange("U_Distance", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Latitude" className="text-gray-500 ">
                  Travel Hour
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.U_Duration}
                  name="U_Duration"
                  onChange={(e) => handlerChange("U_Duration", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
