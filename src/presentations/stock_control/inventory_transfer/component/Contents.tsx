import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { dateFormat } from "@/utilies";
import { Button, Checkbox, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
import { useState } from "react";
import { Controller } from "react-hook-form";
export default function Contents({
  register,
  defaultValue,
  setValue,
  item,
  setItem,
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
    setItem([...(item ?? []), newRow]);
  };

  const handlerChangeCommer = (key: string, value: any, index: number) => {
    const updated = item.map((item: any, idx: number) => {
      if (idx === index) {
        return {
          ...item,
          [key]: value,
        };
      }
      return item;
    });
    setItem(updated);
  };

  const [selected, setSelected] = React.useState<number[]>([]);

  const onSelectChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let state = [...selected];
    const rowIndex = state.findIndex((e) => e === index);

    if (rowIndex >= 0 && !event.target.checked) {
      state = state.filter((e) => e !== index);
    } else {
      state.push(index);
    }

    setSelected(state);
  };

  const handlerDelete = () => {
    if (selected.length === 0) return;
    let state = [...item];
    state = state.filter((item, index) => !selected.includes(index));
    setItem(state);
    setSelected([]);
  };

  return (
    <>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-5 pb-1">
          <h2>Contents</h2>
          {!detail && (
            <Button
              variant="outlined"
              onClick={handlerDelete}
              className="px-4 border-gray-400"
            >
              <span className="px-2 text-xs">Remove</span>
            </Button>
          )}
        </div>
        <div>
          <table className="border w-full shadow-sm bg-white border-[#dadde0]">
            <tr className="border-[1px] border-[#dadde0]">
              <th className="w-[4rem]"></th>

              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Item Code
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Item Name
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                QTY
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                UoM
              </th>
            </tr>
            {item?.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-10 text-[16px] text-gray-400"
                >
                  No Record For Contents
                </td>
              </tr>
            )}
            {item?.map((e: any, index: number) => {
              return (
                <tr key={`row_${index}`}>
                  <td className="py-5 flex justify-center gap-5 items-center">
                    {!detail && (
                      <Checkbox
                        key={`row_${index}_row_${e?.U_Type}`}
                        defaultChecked={false}
                        onChange={(event) => onSelectChange(event, index)}
                      />
                    )}
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
                      placeholder="Item Name"
                      key={`row_${index}U_Name${e?.U_Name}`}
                      inputProps={{
                        defaultValue: e?.U_Name,
                        onBlur: (e: any) =>
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
                        disabled={true}
                        placeholder="Name"
                        key={`row_${index}U_Name${e?.U_Name}`}
                        inputProps={{
                          defaultValue: e?.U_Name,
                          onBlur: (e: any) =>
                            handlerChangeCommer(
                              "U_Name",
                              e?.target?.value,
                              index
                            ),
                        }}
                      />
                    ) : (
                      <MUITextField
                        disabled={detail}
                        placeholder="Name"
                        key={`row_${index}U_Name${e?.U_Name}`}
                        inputProps={{
                          defaultValue: e?.U_Name,
                          onBlur: (e: any) =>
                            handlerChangeCommer(
                              "U_Name",
                              e?.target?.value,
                              index
                            ),
                        }}
                      />
                    )}
                  </td>

                  <td className="pr-4">
                    <MUITextField
                      disabled={detail}
                      placeholder="Reference"
                      key={`row_${index}Reference${e?.U_Ref}`}
                      inputProps={{
                        defaultValue: e?.U_Ref,
                        onBlur: (e: any) =>
                          handlerChangeCommer("U_Ref", e?.target?.value, index),
                      }}
                    />
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
        <div className="grid grid-cols-5 w-[30%] py-2 float-right mt-10">
          <div className="col-span-1">
            <label htmlFor="Code" className="text-gray-500 ">
             Remarks{" "}
            </label>
          </div>
          <div className="col-span-4">
            <TextField
              disabled={detail}
              size="small"
              fullWidth
              multiline
              rows={3}
              name="Comments"
              className="w-full "
              inputProps={{ ...register("Remarks") }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
