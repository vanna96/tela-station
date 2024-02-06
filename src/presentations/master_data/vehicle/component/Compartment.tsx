import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { Controller } from "react-hook-form";
export default function Compartment({
  register,
  defaultValue,
  setValue,
  compart,
  setCompart,
  control,
  detail
}: any) {

  const addNewRow = () => {
    let newRow: any = {};
    setCompart([...(compart ?? []), newRow]);
  };

  const handlerDelete = (index: number) => {
    if (index >= 0 && detail !== true) {
      const state: any[] = [...compart];
      state.splice(index, 1);
      setCompart(state);
    } else {
      return;
    }
  };

  const handlerChangeCompart = (key: string, value: any, index: number) => {
    const updated = compart.map((item: any, idx: number) => {
      if (idx === index) {
        return {
          ...item,
          [key]: value,
        };
      }
      return item;
    });
    setCompart(updated);
  };

  return (
    <>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-5 pb-1">
          <h2>Compartment</h2>
        </div>
        <div>
          <table className="border w-full shadow-sm bg-white border-[#dadde0]">
            <tr className="border-[1px] border-[#dadde0]">
              <th className="w-[100px] "></th>

              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Compart. No{" "}
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Volume (Litre){" "}
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Top Hatch{" "}
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Bottom Hatch{" "}
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </th>
            </tr>
            {compart?.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-10 text-[16px] text-gray-400"
                >
                  No Record For Compartment
                </td>
              </tr>
            )}
            {compart?.map((e: any, index: number) => {
              return (
                <tr key={index}>
                  <td className="py-5 flex justify-center gap-5 items-center">
                    <div
                      onClick={() => handlerDelete(index)}
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
                    <MUITextField
                      type="number"
                      disabled={detail}
                      placeholder="No"
                      inputProps={{
                        defaultValue: e?.U_CM_NO,
                        onChange: (e: any) =>
                          handlerChangeCompart(
                            "U_CM_NO",
                            e?.target?.value,
                            index
                          ),
                      }}
                    />
                  </td>
                  <td className="pr-4">
                    <MUITextField
                      type="number"
                      disabled={detail}
                      placeholder="Volume"
                      inputProps={{
                        defaultValue: e?.U_VOLUME,
                        onChange: (e: any) =>
                          handlerChangeCompart(
                            "U_VOLUME",
                            e?.target?.value,
                            index
                          ),
                      }}
                    />
                  </td>
                  <td className="pr-4">
                    <MUITextField
                      type="number"
                      disabled={detail}
                      placeholder="Top Hatch"
                      inputProps={{
                        defaultValue: e?.U_TOP_HATCH,
                        onChange: (e: any) =>
                          handlerChangeCompart(
                            "U_TOP_HATCH",
                            e?.target?.value,
                            index
                          ),
                      }}
                    />
                  </td>
                  <td className="pr-4">
                    <MUITextField
                      type="number"
                      disabled={detail}
                      placeholder="Bottom Hatch"
                      inputProps={{
                        defaultValue: e?.U_BOTTOM_HATCH,
                        onChange: (e: any) =>
                          handlerChangeCompart(
                            "U_BOTTOM_HATCH",
                            e?.target?.value,
                            index
                          ),
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </table>
          {detail ? (
            <span className="p-1 text-sm rounded-md bg-gray-100 text-gray-500 w-[90px] mt-5 text-center inline-block border-[1px] shadow-md">
              + Add
            </span>
          ) : (
            <span
              onClick={addNewRow}
              className="p-1 text-sm hover:shadow-md transition-all duration-300 rounded-md bg-white w-[90px] mt-5 text-center inline-block cursor-pointer border-[1px] shadow-sm"
            >
              + Add
            </span>
          )}
        </div>
      </div>
    </>
  );
}
