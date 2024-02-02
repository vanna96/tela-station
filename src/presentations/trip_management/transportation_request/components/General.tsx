import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { useCookies } from "react-cookie";
import { TextField } from "@mui/material";
import WarehouseAttendTo from "@/components/selectbox/WarehouseAttention";
import MUIDatePicker from "@/components/input/MUIDatePicker";

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
  const BPL = data?.BPL_IDAssignedToInvoice || (cookies.user?.Branch <= 0 && 1);

  const filteredSeries = data?.SerieLists?.filter(
    (series: any) => series?.BPLID === BPL
  );

  const seriesSO =
    data.SerieLists.find((series: any) => series.BPLID === BPL)?.Series || "";

  if (filteredSeries[0]?.NextNumber && data) {
    data.DocNum = filteredSeries[0]?.NextNumber;
  }

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
                  Requester
                </label>
              </div>
              <div className="col-span-3">
                <div className="col-span-3">
                  <WarehouseAttendTo
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
                  Branch
                </label>
              </div>
              <div className="col-span-3">
                <WarehouseAttendTo
                  value={data?.U_Destination}
                  onChange={(e) => {
                    handlerChange("U_Destination", e);
                  }}
                  onBlur={(e: any) => setData({ ...data, U_Destination: e })}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  To Terminal
                </label>
              </div>
              <div className="col-span-3">
                <WarehouseAttendTo
                  value={data?.U_Destination}
                  onChange={(e) => {
                    handlerChange("U_Destination", e);
                  }}
                  onBlur={(e: any) => setData({ ...data, U_Destination: e })}
                />
              </div>
            </div>
          </div>
          <div className="col-span-2"></div>
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
                    // onChange={(e: any) => handlerChange("Series", e.target.value)}
                    // onChange={handleSeriesChange}
                  />
                  <div className="-mt-1">
                    <MUITextField
                      size="small"
                      name="DocNum"
                      value={
                        edit
                          ? data?.DocNum
                          : filteredSeries[0]?.NextNumber ?? ""
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
                  Request Date
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
                    !("DueDate" in data?.error)
                      ? "text-gray-600"
                      : "text-red-500"
                  } `}
                >
                  Expired Date <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <MUIDatePicker
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
                  value={data?.U_Status}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="U_Status"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-4">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Remarks
                </label>
              </div>
              <div className="col-span-3">
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  onChange={(e) => handlerChange("U_Remark", e.target.value)}
                  rows={2}
                  value={data.U_Remark}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
