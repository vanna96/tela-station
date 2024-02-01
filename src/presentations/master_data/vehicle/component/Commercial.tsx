import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { Controller } from "react-hook-form";
export default function Commercial({
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
  const addNewRow = () => {
    let newRow: any = {};
    setCommer([...(commer ?? []), newRow]);
  };

  const handlerDelete = (index: number) => {
    if (index >= 0 && detail !== true) {
      const state: any[] = [...commer];
      state.splice(index, 1);
      setCommer(state);
    } else {
      return;
    }
  };

  const handlerChangeCommer = (key: string, value: any, index: number) => {
    const updated = commer.map((item: any, idx: number) => {
      if (idx === index) {
        return {
          ...item,
          [key]: value,
        };
      }
      return item;
    });
    setCommer(updated);
  };
  console.log(staticSelect);

  return (
    <>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-5 pb-1">
          <h2>Commercial</h2>
        </div>{" "}
        <div>
          <table className="border w-full shadow-sm bg-white border-[#dadde0]">
            <tr className="border-[1px] border-[#dadde0]">
              <th className="w-[100px] "></th>

              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Type
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Name
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Issue Date
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Expire Date
              </th>
              <th className="w-[200px] text-left font-normal py-2 text-[14px] text-gray-500">
                Fee
              </th>
              <th className=" text-left font-normal py-2 text-[14px] text-gray-500">
                Referance
              </th>
            </tr>
            {commer?.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-10 text-[16px] text-gray-400"
                >
                  No Record For Commercial
                </td>
              </tr>
            )}
            {commer?.map((e: any, index: number) => {
              return (
                <tr key={index}>
                  <td className="py-5 flex justify-center gap-5 items-center">
                    <div
                      onClick={() => handlerDelete(index)}
                      className={`w-[17px] shadow-lg shadow-[#878484] h-[17px] ${
                        detail
                          ? "bg-gray-100 text-gray-600 "
                          : "bg-red-500 cursor-pointer text-white"
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
                            onChange={(e: any) => {
                              handlerChangeCommer(
                                "U_Type",
                                e?.target?.value,
                                index
                              ),
                                setStaticSelect({
                                  ...staticSelect,
                                  u_Type: e.target.value,
                                });
                            }}
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
                        onChange: (e: any) =>
                          handlerChangeCommer(
                            "U_Name",
                            e?.target?.value,
                            index
                          ),
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
                            onChange={(e: any) => {
                              const val =
                                e.toLowerCase() ===
                                "Invalid Date".toLocaleLowerCase()
                                  ? ""
                                  : e;
                              setStaticSelect({
                                ...staticSelect,
                                u_IssueDate: e,
                              });
                              handlerChangeCommer("U_IssueDate", val, index);
                            }}
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
                            onChange={(e: any) => {
                              const val =
                                e.toLowerCase() ===
                                "Invalid Date".toLocaleLowerCase()
                                  ? ""
                                  : e;
                              setStaticSelect({
                                ...staticSelect,
                                u_ExpiredDate: e,
                              });
                              handlerChangeCommer("U_ExpiredDate", val, index);
                            }}
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
                        onChange: (e: any) =>
                          handlerChangeCommer("U_Fee", e?.target?.value, index),
                      }}
                    />
                  </td>
                  <td className="pr-4">
                    <MUITextField
                      disabled={detail}
                      placeholder="Referance"
                      inputProps={{
                        defaultValue: e?.U_Ref,
                        onChange: (e: any) =>
                          handlerChangeCommer("U_Ref", e?.target?.value, index),
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </table>
          {detail ? (
            <span className="p-1 text-sm bg-gray-100 text-gray-500 w-[90px] mt-5 text-center inline-block border-[1px] shadow-md">
              + Add
            </span>
          ) : (
            <span
              onClick={addNewRow}
              className="p-1 text-sm bg-white w-[90px] mt-5 text-center inline-block cursor-pointer border-[1px] shadow-md"
            >
              + Add
            </span>
          )}
        </div>
      </div>
    </>
  );
}
