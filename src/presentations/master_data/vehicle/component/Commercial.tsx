import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { dateFormat } from "@/utilies";
import { Button, Checkbox } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
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
    let newRow: any = {
      U_Type: null,
      U_Name: null,
    };
    setCommer([...(commer ?? []), newRow]);
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
    let state = [...commer];
    state = state.filter((item, index) => !selected.includes(index));
    setCommer(state);
    setSelected([])
  };

  console.log(selected)

  return (
    <>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-5 pb-1">
          <h2>Commercial</h2>
          {!detail && <Button variant="outlined" onClick={handlerDelete} className="px-4 border-gray-400"><span className="px-2 text-xs">Remove</span></Button>}
        </div>{" "}
        <div>
          <table className="border w-full shadow-sm bg-white border-[#dadde0]">
            <tr className="border-[1px] border-[#dadde0]">
              <th className="w-[4rem]"></th>

              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Type{" "}
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Name{" "}
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Issue Date{" "}
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Expired Date{" "}
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </th>
              <th className="w-[200px] text-left font-normal py-2 text-[14px] text-gray-500">
                Fee{" "}
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </th>
              <th className=" text-left font-normal py-2 text-[14px] text-gray-500">
                Reference{" "}
              </th>
              <th className="w-[100px] font-normal text-center py-2 text-[14px] text-gray-500">
                Status{" "}
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
                <tr key={`row_${index}`}>
                  <td className="py-5 flex justify-center gap-5 items-center">
                    {!detail && <Checkbox key={`row_${index}_row_${e?.U_Type}`} defaultChecked={false} onChange={(event) => onSelectChange(event, index)} />}
                  </td>

                  <td className="pr-4">
                    <Controller
                      name="U_Type"
                      control={control}
                      render={({ field }) => {
                        return (
                          <MUISelect
                            disabled={detail}
                            key={`row_${index}_U_Type_${field.value}`}
                            items={[
                              { label: "Road Tax", value: "Road Tax" },
                              { label: "Check", value: "Check" },
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
                      key={`row_${index}U_Name${e?.U_Name}`}
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
                    {detail ? (
                      <MUITextField
                        disabled={detail}
                        key={`row_${index}U_IssueDate${e?.U_IssueDate}`}
                        placeholder="U_IssueDate"
                        inputProps={{
                          defaultValue: dateFormat(e?.U_IssueDate),
                        }}
                      />
                    ) : (
                      <Controller
                        name="U_IssueDate"
                        control={control}
                        render={({ field }) => {
                          return (
                            <MUIDatePicker
                              disabled={detail}
                              {...field}
                              value={
                                e?.U_IssueDate || staticSelect?.u_IssueDate
                              }
                              key={`row_${index}U_IssueDate_${field.value}`}
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
                    )}
                  </td>
                  <td className="pr-4">
                    {detail ? (
                      <MUITextField
                        disabled={detail}
                        placeholder="U_ExpiredDate"
                        key={`row_${index}U_ExpiredDate${e?.U_ExpiredDate}`}
                        inputProps={{
                          defaultValue: dateFormat(e?.U_ExpiredDate),
                        }}
                      />
                    ) : (
                      <Controller
                        name="U_ExpiredDate"
                        control={control}
                        render={({ field }) => {
                          return (
                            <MUIDatePicker
                              key={`row_${index}U_ExpiredDate${field.value}`}
                              disabled={detail}
                              {...field}
                              value={
                                e?.U_ExpiredDate || staticSelect.u_ExpiredDate
                              }
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
                                handlerChangeCommer(
                                  "U_ExpiredDate",
                                  val,
                                  index
                                );
                              }}
                            />
                          );
                        }}
                      />
                    )}
                  </td>

                  <td className="pr-4">
                    <MUITextField
                      type="number"
                      disabled={detail}
                      placeholder="Fee"
                      key={`row_${index}Fee${e?.U_Fee}`}
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
                      placeholder="Reference"
                      key={`row_${index}Reference${e?.U_Ref}`}
                      inputProps={{
                        defaultValue: e?.U_Ref,
                        onChange: (e: any) =>
                          handlerChangeCommer("U_Ref", e?.target?.value, index),
                      }}
                    />
                  </td>
                  <td className="pr-4 text-center">
                    <span className="text-green-500 text-sm">Active</span>
                  </td>
                </tr>
              );
            })}
          </table>
          {detail ? null : (
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
