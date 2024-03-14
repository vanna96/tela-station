import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import UOMSelect from "@/components/selectbox/UnitofMeasurment";
import ItemModal from "@/presentations/trip_management/transportation_order/ItemModal";
import { Button, Checkbox, TextField, easing } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useMemo } from "react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import UomSelect from "../../fuel_level/components/UomSelect";
import FuelLevelWarehouseBinAutoComplete from "../../fuel_level/components/FuelLevelWarehouseBinAutoComplete";
export default function Content({
  register,
  defaultValue,
  setValue,
  compart,
  setCompart,
  detail,
  watch,
  control,
}: any) {
  const [id, setId] = useState(0);
  const [openItem, setOpenItem] = useState(false);
  const [selectIndex, setSelectIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);

  const fields: any[] = useMemo(() => {
    if (!watch("DocumentLines")) return [];
    return watch("DocumentLines");
  }, [watch("DocumentLines")]);

  const onAddDocument = () => {
    const state = [
      ...fields,
      {
        ItemCode: null,
        ItemDescription: null,
        Quantity: null,
        UoMCode: null,
      },
    ];
    setValue("DocumentLines", state);
  };

  const onSelectChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let state = [...selected];
    if (selected.includes(index)) {
      state = state.filter((e) => e !== index);
    } else {
      state.push(index);
    }

    setSelected(state);
  };

  const handlerDelete = () => {
    if (selected.length === 0) return; // [1,2,3,5]

    let state = [...fields];
    state = state.filter((item, index) => !selected.includes(index));
    setValue("DocumentLines", state);
    setSelected([]);
  };

  const onChangeValue = (index: number, field: string, value: any) => {
    const state: any[] = [...(fields ?? [])];
    state[index][field] = value;
    setValue("DocumentLines", state);
  };
  const handleSelectItem = (value: any) => {
    const state = [...fields];
    const index = selectIndex as number;
    state[index] = {
      ...state[index],
      ItemCode: value?.ItemCode,
      ItemDescription: value?.ItemName,
      Quantity: 0,
    };
    setId(value?.UoMGroupEntry);
    setOpenItem(false);
    setValue("DocumentLines", state);
  };
  const handlerchangeBin = (value: any, index: number) => {
    const state = [...fields];
    state[index]["UoMCode"] = value.AbsEntry;
    state[index]["DocumentLinesBinAllocations"] = [
      {
        BinAbsEntry: value?.AbsEntry,
        Quantity: value?.Quantity ?? 0,
        AllowNegativeQuantity: "tNO",
        SerialAndBatchNumbersBaseLine: -1,
        BaseLineNumber: index,
      },
    ];
    setValue("DocumentLines", state);
  };

  return (
    <>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-5 pb-1">
          <h2>Content</h2>
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
        <div className="w-full">
          <table className="border w-full shadow-sm bg-white border-[#dadde0]">
            <tr className="border-[1px] border-[#dadde0]">
              <th className="w-[4rem] "></th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Item. No{" "}
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Item Description
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Quantity{" "}
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                UoM{" "}
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Bin Code{watch("BinCode")}
              </th>
            </tr>
            {fields?.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-10 text-[16px] text-gray-400"
                >
                  No Record
                </td>
              </tr>
            )}
            {fields?.map((e: any, index: number) => {
              return (
                <>
                  <tr key={index}>
                    <td className="py-2 flex justify-center gap-5 items-center">
                      {!detail && (
                        <Checkbox
                          onChange={() => onSelectChange(e, index)}
                          checked={selected.includes(index)}
                        />
                      )}
                    </td>
                    <td className="pr-4">
                      {detail ? (
                        <MUITextField
                          disabled={detail}
                          inputProps={{
                            ...register(`DocumentLines.${index}.ItemCode`, {
                              required: "Item No. is required",
                            }),
                          }}
                        />
                      ) : (
                        <MUITextField
                          disabled={detail}
                          onClick={() => {
                            setSelectIndex(index);
                            setOpenItem(true);
                          }}
                          endAdornment
                          inputProps={{
                            ...register(`DocumentLines.${index}.ItemCode`, {
                              required: "Item No. is required",
                            }),
                          }}
                        />
                      )}
                    </td>
                    <td className="pr-4">
                      <MUITextField
                        disabled
                        inputProps={{
                          ...register(
                            `DocumentLines.${index}.ItemDescription`,
                            {
                              required: "Item Description. is required",
                            }
                          ),
                        }}
                      />
                    </td>
                    <td className="pr-4">
                      <MUITextField
                        disabled={detail}
                        type="number"
                        inputProps={{
                          ...register(`DocumentLines.${index}.Quantity`),
                        }}
                      />
                    </td>
                    <td className="pr-4">
                      <UomSelect
                        onChange={(e) => handlerchangeBin(e, index)}
                        id={id}
                      />
                    </td>
                    <td className="pr-4">
                      <Controller
                        name="BinCode"
                        control={control}
                        render={({ field }) => {
                          return (
                            <FuelLevelWarehouseBinAutoComplete
                              value={field?.value}
                              whsCode={watch("U_tl_whsdesc")}
                              onChange={(e: any) => {
                                handlerchangeBin(e, index);
                              }}
                            />
                          );
                        }}
                      />
                    </td>
                  </tr>
                </>
              );
            })}
          </table>
          {detail ? null : (
            <span
              onClick={onAddDocument}
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
              className={`w-full ${detail && "bg-gray-100"}`}
              inputProps={{ ...register("Remarks") }}
            />
          </div>
        </div>
      </div>
      <ItemModal
        onClick={handleSelectItem}
        setOpen={setOpenItem}
        open={openItem}
      />
    </>
  );
}
