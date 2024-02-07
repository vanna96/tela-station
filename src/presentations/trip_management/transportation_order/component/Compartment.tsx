import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { Controller } from "react-hook-form";
export default function Compartment({
  register,
  defaultValue,
  setValue,
  commer,
  setCommer,
  control,
  detail,
}: any) {
  const [staticSelect, setStaticSelect] = useState({
    u_IssueDate: undefined,
    u_ExpiredDate: undefined,
    u_Type: "",
  });

  return (
    <>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex gap-x-3 items-center mb-5 pb-1">
          <h2 className="mr-3">Compartments</h2>
        </div>{" "}
        <div>
          <table className="border w-full shadow-sm bg-white border-[#dadde0]">
            <tr className="border-[1px] border-[#dadde0]">
              <th className="w-[100px] "></th>

              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Document Number{" "}
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Product{" "}
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Volume Litre{" "}
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Comp. Number{" "}
              </th>
              <th className="w-[200px] text-left font-normal py-2 text-[14px] text-gray-500">
                Bottom hatch{" "}
              </th>
              <th className=" text-left font-normal py-2 text-[14px] text-gray-500">
                Top Hatch{" "}
              </th>
            </tr>
            {commer?.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-10 text-[16px] text-gray-400"
                >
                  No Record
                </td>
              </tr>
            )}
            {commer?.map((e: any, index: number) => {
              return (
                <tr key={index}>
                  <td className="py-5 flex justify-center gap-5 items-center">
                    <div
                      className={`w-[17px] transition-all duration-300 shadow-md shadow-[#878484] h-[17px] ${
                        detail
                          ? "bg-gray-100 text-gray-600 "
                          : "bg-red-500 hover:shadow-lg hover:shadow-[#4d4a4a] cursor-pointer text-white"
                      }  rounded-sm flex justify-center items-center `}
                    >
                      -
                    </div>
                    <span className="text-gray-500">{index + 1}</span>
                  </td>

                  <td className="pr-4">
                    <Controller
                      name="U_Type"
                      control={control}
                      render={({ field }) => {
                        return (
                          <MUISelect
                            disabled={detail}
                            items={[
                              { label: "Truck", value: "Truck" },
                              { label: "Train", value: "Train" },
                              { label: "Van", value: "Van" },
                            ]}
                            value={e?.U_Type || staticSelect.u_Type}
                            aliasvalue="value"
                            aliaslabel="label"
                          />
                        );
                      }}
                    />
                  </td>
                  <td className="pr-4">
                    <MUITextField
                      disabled={detail}
                      placeholder="Name"
                      inputProps={{
                        defaultValue: e?.U_Name,
                      }}
                    />
                  </td>
                  <td className="pr-4">
                    <Controller
                      name="U_IssueDate"
                      control={control}
                      render={({ field }) => {
                        return (
                          <MUIDatePicker
                            disabled={detail}
                            {...field}
                            value={e?.U_IssueDate || staticSelect?.u_IssueDate}
                            key={`U_IssueDate_${staticSelect?.u_IssueDate}`}
                          />
                        );
                      }}
                    />
                  </td>
                  <td className="pr-4">
                    <Controller
                      name="U_ExpiredDate"
                      control={control}
                      render={({ field }) => {
                        return (
                          <MUIDatePicker
                            disabled={detail}
                            {...field}
                            value={
                              e?.U_ExpiredDate || staticSelect.u_ExpiredDate
                            }
                            key={`U_ExpiredDate_${staticSelect.u_ExpiredDate}`}
                          />
                        );
                      }}
                    />
                  </td>

                  <td className="pr-4">
                    <MUITextField
                      disabled={detail}
                      placeholder="Fee"
                      inputProps={{
                        defaultValue: e?.U_Fee,
                      }}
                    />
                  </td>
                  <td className="pr-4">
                    <MUITextField
                      disabled={detail}
                      placeholder="Referance"
                      inputProps={{
                        defaultValue: e?.U_Ref,
                      }}
                    />
                  </td>
                </tr>
              );
            })}
            {/* table */}
            <tr>
              <td className="py-5 flex justify-center gap-5 items-center">
                <span className="text-gray-500">1</span>
              </td>
              <td className="pr-4">
                <MUISelect
                  disabled={detail}
                  items={[
                    { label: "Truck", value: "Truck" },
                    { label: "Train", value: "Train" },
                    { label: "Van", value: "Van" },
                  ]}
                  value={staticSelect.u_Type}
                  aliasvalue="value"
                  aliaslabel="label"
                />
              </td>
              <td className="pr-4">
                <MUITextField
                  disabled={detail}
                  placeholder="Amount"
                  inputProps={{}}
                />
              </td>
              <td className="pr-4">
                <MUITextField
                  disabled={detail}
                  placeholder="Description"
                  inputProps={{}}
                />
              </td>
              <td className="pr-4">
                <MUITextField
                  disabled={detail}
                  placeholder="Description"
                  inputProps={{}}
                />
              </td>
              <td className="pr-4">
                <MUITextField
                  disabled={detail}
                  placeholder="Description"
                  inputProps={{}}
                />
              </td>
              <td className="pr-4">
                <MUITextField
                  disabled={detail}
                  placeholder="Description"
                  inputProps={{}}
                />
              </td>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
}
