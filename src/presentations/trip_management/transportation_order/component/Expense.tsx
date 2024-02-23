import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import StopsSelect from "@/components/selectbox/StopsSelect";
import { Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
export default function Expense({
  register,
  defaultValue,
  setValue,
  control,
  detail,
}: any) {
  const [staticSelect, setStaticSelect] = useState({
    u_IssueDate: undefined,
    u_ExpiredDate: undefined,
    u_Type: "",
  });
   const { fields: expense, remove: removeExpense, append:addExpense } = useFieldArray({
     control,
     name: "TL_TO_EXPENSECollection", // name of the array field
   });
  const [fuel, setFuel] = useState([])
   const USD = () => {
     return <div className="text-[14.5px] mt-1 text-gray-500 w-[47px] pr-1 text-center">USD</div>;
   };
  return (
    <>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex gap-x-3 items-center mb-3 pb-1">
          <h2 className="mr-3">Expense</h2>
        </div>{" "}
        <div>
          <table className="border w-full shadow-sm bg-white border-[#dadde0]">
            <tr className="border-[1px] border-[#dadde0]">
              <th className="w-[150px] "></th>

              <th className="w-[250px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Expense Code{" "}
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </th>
              <th className="w-[250px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Amount{" "}
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </th>
              <th className=" text-left font-normal  py-2 text-[14px] text-gray-500">
                Desciption{" "}
              </th>
            </tr>
            {expense?.map((e: any, index: number) => {
              return (
                <tr key={index}>
                  <td className="py-5 flex justify-center gap-8 items-center">
                    <span className="text-black">{index + 1}</span>

                    <div
                      onClick={() => removeExpense()}
                      className={`w-[17px] transition-all duration-300 shadow-md shadow-[#878484] h-[17px] ${
                        detail
                          ? "bg-gray-100 text-gray-600 "
                          : "bg-red-500 hover:shadow-lg hover:shadow-[#4d4a4a] cursor-pointer text-white"
                      }  rounded-sm flex justify-center items-center `}
                    >
                      -
                    </div>
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
                      startAdornment={USD()}
                      disabled={detail}
                      placeholder="Amount"
                      inputProps={{
                        defaultValue: e?.U_Name,
                      }}
                    />
                  </td>
                  <td colSpan={2} className="pr-4">
                    <MUITextField
                      disabled={detail}
                      placeholder="Description"
                      inputProps={{
                        defaultValue: e?.U_Ref,
                      }}
                    />
                  </td>
                </tr>
              );
            })}
            <tr>
              <td className="py-5 flex justify-center gap-5 items-center"></td>
              <td className="pr-4 ">
                <StopsSelect
                onHandlerChange={()=>addExpense({})}
                />
              </td>
              <td className="pr-4">
                <MUITextField
                  disabled={detail}
                  placeholder="Amount"
                  inputProps={{}}
                  startAdornment={USD()}
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
        <div className="font-medium text-lg mt-[50px] flex gap-x-3 items-center mb-3 pb-1">
          <h2 className="mr-3">Fuel Expense</h2>
        </div>{" "}
        <table className="border w-full shadow-sm bg-white border-[#dadde0]">
          <tr className="border-[1px] border-[#dadde0]">
            <th className="w-[150px] "></th>

            <th className="w-[250px] text-left font-normal  py-2 text-[14px] text-gray-500">
              Fuel{" "}
              <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
            </th>
            <th className="w-[250px] text-left font-normal  py-2 text-[14px] text-gray-500">
              Quantity{" "}
              <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
            </th>
            <th className="text-left font-normal  py-2 text-[14px] text-gray-500">
              Description{" "}
              <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
            </th>
          </tr>
          {fuel?.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="text-center p-10 text-[16px] text-gray-400"
              >
                No Record For Document
              </td>
            </tr>
          )}
          {fuel?.map((e: any, index: number) => {
            return (
              <tr key={index}>
                <td className="py-5 flex justify-center gap-5 items-center">
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
                          value={e?.U_ExpiredDate || staticSelect.u_ExpiredDate}
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
        </table>
      </div>
    </>
  );
}
