import ExpenseCodeAutoComplete from "@/components/input/ExpenseCode";
import MUITextField from "@/components/input/MUITextField";
import { useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
export default function Expense({
  register,
  defaultValue,
  setValue,
  control,
  detail,
  watch,
  fuel,
  handleChangeFuel,
}: any) {
  const {
    fields: expense,
    remove: removeExpense,
    append: addExpense,
  } = useFieldArray({
    control,
    name: "TL_TO_EXPENSECollection", // name of the array field
  });
  const USD = () => {
    return (
      <div className="text-[14.5px] mt-1 text-gray-500 w-[47px] pr-1 text-center">
        USD
      </div>
    );
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
                  <td className="py-4 flex justify-center gap-8 items-center">
                    <span className="text-black">{index + 1}</span>

                    <div
                      onClick={() => removeExpense(index)}
                      className={`w-[17px] transition-all duration-300 shadow-md shadow-[#878484] h-[17px] ${
                        detail
                          ? "hidden"
                          : "bg-red-500 hover:shadow-lg hover:shadow-[#4d4a4a] cursor-pointer text-white"
                      }  rounded-sm flex justify-center items-center `}
                    >
                      -
                    </div>
                  </td>

                  <td className="pr-4">
                    <Controller
                      name="U_Code"
                      control={control}
                      disabled={detail}
                      render={({ field }) => {
                        return (
                          <ExpenseCodeAutoComplete
                            {...field}
                            onChange={(e) => {
                              setValue(
                                `TL_TO_EXPENSECollection.${index}.U_Code`,
                                e?.Code
                              );
                            }}
                            value={watch("U_Code") || e?.U_Code}
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
                        ...register(
                          `TL_TO_EXPENSECollection.${index}.U_Amount`
                        ),
                        defaultValue: e?.U_Amount,
                      }}
                    />
                  </td>
                  <td colSpan={2} className="pr-4">
                    <MUITextField
                      disabled={detail}
                      placeholder="Description"
                      inputProps={{
                        ...register(
                          `TL_TO_EXPENSECollection.${index}.U_Description`
                        ),
                        defaultValue: e?.U_Description,
                      }}
                    />
                  </td>
                </tr>
              );
            })}
            <tr className={`${detail? "hidden":""}`}>
              <td className="py-6 flex justify-center gap-5 items-center"></td>
              <td className="pr-4 ">
                <Controller
                  name="U_Code"
                  control={control}
                  render={({ field }) => {
                    return (
                      <ExpenseCodeAutoComplete
                      disabled={detail}
                        {...field}
                        onChange={(e: any) => {
                          addExpense({ U_Code: e });
                        }}
                        value={watch("U_Code")}
                      />
                    );
                  }}
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
        </div>
        <table className="border w-full shadow-sm bg-white border-[#dadde0]">
          <tr className="border-[1px] border-[#dadde0]">
            <th className="w-[150px] "></th>
            <th className="w-[250px] text-left font-normal  py-2 text-[14px] text-gray-500">
              Fuel
              <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
            </th>
            <th className="w-[250px] text-left font-normal  py-2 text-[14px] text-gray-500">
              Amount{" "}
              <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
            </th>
            <th className="text-left font-normal  py-2 text-[14px] text-gray-500">
              Description
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
                  <MUITextField
                    disabled={detail}
                    placeholder="Fuel"
                    inputProps={{
                      onChange: (e) => handleChangeFuel(index, e, "U_Fuel"),
                      defaultValue: e?.U_Fuel,
                    }}
                  />
                </td>

                <td className="pr-4">
                  <MUITextField
                    disabled={detail}
                    placeholder="Amount"
                    inputProps={{
                      onChange: (e) =>
                        handleChangeFuel(index, e, "U_FuelAmount"),
                      defaultValue: e?.U_FuelAmount,
                    }}
                  />
                </td>
                <td className="pr-4">
                  <MUITextField
                    disabled={detail}
                    placeholder="Description"
                    inputProps={{
                      onChange: (e) =>
                        handleChangeFuel(index, e, "U_FuelRemark"),
                      defaultValue: e?.U_FuelRemark,
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
