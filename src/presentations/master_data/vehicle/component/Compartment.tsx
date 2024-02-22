import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import { Button, Checkbox } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
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

  const [selected, setSelected] = React.useState<number[]>([]);


  const onSelectChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let state = [...selected];
    const rowIndex = state.findIndex((e) => e === index);

    if (rowIndex >= 0 && !event.target.checked) {
      state = state.filter((e) => e !== index)
    } else {
      state.push(index)
    }

    setSelected(state)
  }


  const handlerDelete = () => {
    if (selected.length === 0) return;
    let state = [...compart];
    state = state.filter((item, index) => !selected.includes(index));
    setCompart(state);
  };

  return (
    <>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-5 pb-1">
          <h2>Compartment</h2>
          <Button variant="outlined" onClick={handlerDelete} className="px-4 border-gray-400"><span className="px-2 text-xs">Remove</span></Button>
        </div>
        <div className="w-full  overflow-x-auto">
          <table className="table table-auto border min-w-full shadow-sm bg-white border-[#dadde0]">
            <tr className="border-[1px] border-[#dadde0]">
              <th className="w-[4rem] "></th>
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
                  <td className=" py-5 flex justify-center gap-5 items-center">
                    <Checkbox key={`row_${index}_row_${e?.U_CM_NO}`} defaultChecked={false} onChange={(event) => onSelectChange(event, index)} />
                  </td>
                  <td className="pr-4">
                    <MUITextField
                      key={`row_${index}_${e?.U_CM_NO}`}
                      type="number"
                      disabled={detail}
                      placeholder="No"
                      inputProps={{
                        defaultValue: e?.U_CM_NO,
                        onBlur: (e: any) =>
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
                      key={`row_${index}_${e?.U_VOLUME}`}
                      disabled={detail}
                      placeholder="Volume"
                      inputProps={{
                        defaultValue: e?.U_VOLUME,
                        onBlur: (e: any) =>
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
                      key={`row_${index}_${e?.U_TOP_HATCH}`}
                      placeholder="Top Hatch"
                      inputProps={{
                        defaultValue: e?.U_TOP_HATCH,
                        onBlur: (e: any) =>
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
                      key={`row_${index}_${e?.U_BOTTOM_HATCH}`}
                      placeholder="Bottom Hatch"
                      inputProps={{
                        defaultValue: e?.U_BOTTOM_HATCH,
                        onBlur: (e: any) =>
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
            null
          ) : (
            <span
              onClick={addNewRow}
              className="p-1 text-sm hover:shadow-md transition-all duration-300 rounded-md bg-white w-[90px] mt-5 text-center inline-block cursor-pointer border-[1px] shadow-sm"
            >
              Add
            </span>
          )}
        </div>
      </div>
    </>
  );
}
