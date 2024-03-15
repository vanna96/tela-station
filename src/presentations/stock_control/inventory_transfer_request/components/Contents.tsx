import React, { useCallback } from "react";
import MUITextField from "@/components/input/MUITextField";
import { Button, Checkbox, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import ITRModal, { InventoryItemModal } from "./ITRModal";
import UomSelectByItem from "../../components/UomSelectByItem";
import { AiOutlineConsoleSql } from "react-icons/ai";

let itemRef = React.createRef<InventoryItemModal>();

export default function Contents({
  register,
  setValue,
  detail,
  control,
  watch,
}: any) {

  const [selecteds, setSelects] = useState<{ [key: number]: number | undefined }>({});

  const fields = useMemo(() => {
    return watch("StockTransferLines") ?? [];
  }, [watch("StockTransferLines")]);

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const items = { ...selecteds };
    items[index] = event.target.checked ? index : undefined;
    setSelects(items)
  }

  const handleDeleteChecked = () => {
    const state = [...watch('StockTransferLines')];

    const newValues = state.filter((e, index) => !(Object.values(selecteds).includes(index)));
    setValue('StockTransferLines', newValues)
    setSelects({})
  };

  const handlerAddNew = useCallback((items: any[] | any, index: number | undefined) => {
    const state: any = [...watch('StockTransferLines')];


    if (items instanceof Array) {
      for (const item of items) {
        if (state.find((e: any) => e?.ItemCode === item?.ItemCode)) continue;

        state.push({
          ItemCode: item?.ItemCode,
          ItemDescription: item?.ItemName,
          Quantity: undefined,
        })
      }
    } else {
      state[index as number] = {
        ItemCode: items?.ItemCode,
        ItemDescription: items?.ItemName,
        Quantity: state[index as number]?.Quantity,
        UoMCode: undefined,
        UoMAbsEntry: undefined,
      }
    }

    setValue('StockTransferLines', state)
  }, [watch('StockTransferLines')])


  return (
    <>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-5 pb-1">
          <h2>Content</h2>
          {!detail && (
            <Button
              variant="outlined"
              onClick={handleDeleteChecked}
              className="px-4 border-gray-400"
            >
              <span className="px-2 text-xs">Remove</span>
            </Button>
          )}
        </div>
        <div className="w-full  overflow-x-auto">
          <table className="table table-auto border min-w-full shadow-sm bg-white border-[#dadde0]">
            <tr className="border-[1px] border-[#dadde0]">
              <th className="w-[4rem] "></th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Item Code
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Item Description
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Quantity
                <span className="text-red-500 ml-1">{detail ? "" : "*"}</span>
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                UoM
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
                          onChange={(event) => handleCheck(event, index)}
                          checked={selecteds[index] === undefined ? false : true}
                        />
                      )}
                    </td>
                    <td className="pr-4">
                      <MUITextField
                        onClick={() => itemRef.current?.onOpen('single', index)}
                        endAdornment
                        inputProps={{
                          ...register(`StockTransferLines.${index}.ItemCode`, {
                            required: "Item No. is required",
                          }),
                        }}
                      />

                    </td>
                    <td className="pr-4">
                      <MUITextField
                        disabled
                        inputProps={{
                          ...register(`StockTransferLines.${index}.ItemDescription`,
                            {
                              required: false,
                            }
                          ),
                        }}
                      />
                    </td>
                    <td className="pr-4">
                      <MUITextField
                        type="number"
                        inputProps={{
                          ...register(`StockTransferLines.${index}.Quantity`, { required: `Quantity is required at ${index}`, }),

                        }}
                      />
                    </td>
                    <td className="pr-4">
                      <Controller
                        name={`StockTransferLines.${index}.UoMEntry`}
                        rules={
                          {
                            required: 'UoM is required'
                          }
                        }
                        control={control}
                        render={({ field }) => {
                          return (
                            <UomSelectByItem
                              disabled={detail}
                              {...field}
                              onChange={(e) => {
                                setValue(`StockTransferLines.${index}.UoMEntry`, e?.AbsEntry);
                                setValue(`StockTransferLines.${index}.UoMCode`, e?.Code);
                              }}
                              item={e.ItemCode}
                              quantity={e?.Quantity}
                              value={field.value}
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
              onClick={() => itemRef.current?.onOpen('multiple')}
              className="p-1 text-sm hover:shadow-md transition-all duration-300 rounded-md bg-white w-[90px] mt-5 text-center inline-block cursor-pointer border-[1px] shadow-sm"
            >
              Add
            </span>
          )}
        </div>
        <div className="grid grid-cols-5 w-[30%] py-2 float-right mt-10">
          <div className="col-span-1">
            <label htmlFor="Code" className="text-gray-500 ">
              Remarks
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
              inputProps={{ ...register("Comments") }}
            />
          </div>
        </div>
      </div>

      <InventoryItemModal ref={itemRef} onSelectItems={handlerAddNew} />
    </>
  );
}
