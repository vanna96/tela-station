import React, { useCallback } from "react";
import MUITextField from "@/components/input/MUITextField";
import { Button, Checkbox, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import UomSelectByItem from "../../components/UomSelectByItem";
import { AiOutlineConsoleSql } from "react-icons/ai";
import { InventoryItemModal } from "../../components/GetItemModal";
import BinAllocationAutoComplete from "../../components/BinLocationAutoComplete";

let itemRef = React.createRef<InventoryItemModal>();

export default function ContentDetail({
  register,
  setValue,
  detail,
  control,
  watch,
}: any) {
  const fields = useMemo(() => {
    return watch("StockTransferLines") ?? [];
  }, [watch("StockTransferLines")]);


  return (
    <>
      <div className="rounded-lg shadow-sm  border p-6 mt-2 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-5 pb-1">
          <h2>Content</h2>
        </div>
        <div className="w-full">
          <table className="table table-auto border min-w-full shadow-sm bg-white border-[#dadde0]">
            <tr className="border-[1px] border-[#dadde0]">
              <th className="w-[4rem] "></th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Item Code
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Item Description
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Quantity
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                UoM
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                To Bin Code
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
                    <td className="py-2 flex justify-center gap-5 items-center"></td>
                    <td className="pr-4">
                      <MUITextField
                        disabled
                        inputProps={{
                          ...register(`StockTransferLines.${index}.ItemCode`, {
                          }),
                        }}
                      />
                    </td>
                    <td className="pr-4">
                      <MUITextField
                        disabled
                        inputProps={{
                          ...register(
                            `StockTransferLines.${index}.ItemDescription`,
                          ),
                        }}
                      />
                    </td>
                    <td className="pr-4">
                      <MUITextField
                        disabled
                        type="number"
                        inputProps={{
                          ...register(`StockTransferLines.${index}.Quantity`, {
                          }),
                        }}
                      />
                    </td>
                    <td className="pr-4">
                      <Controller
                        name={`StockTransferLines.${index}.UoMEntry`}
                        rules={{
                          required: "UoM is required",
                        }}
                        control={control}
                        disabled
                        render={({ field }) => {
                          return (
                            <UomSelectByItem
                              {...field}
                              item={e.ItemCode}
                              quantity={e?.Quantity}
                              value={field.value}
                            />
                          );
                        }}
                      />
                    </td>
                    <td className="pr-4">
                      <Controller
                        name={`StockTransferLines.${index}.U_tl_toBinId`}
                        control={control}
                        render={({ field }) => <BinAllocationAutoComplete
                          warehouse={watch('ToWarehouse')}
                          disabled={true}
                          {...field}
                          value={field.value ?? watch('U_tl_toBinId')}
                        />}
                      />
                    </td>
                  </tr>
                </>
              );
            })}
          </table>
        </div>
        <div className="grid grid-cols-5 w-[30%] py-2 float-right mt-10">
          <div className="col-span-1">
            <label htmlFor="Code" className="text-gray-500 ">
              Remarks
            </label>
          </div>
          <div className="col-span-4">
            <TextField
              disabled
              size="small"
              fullWidth
              multiline
              rows={3}
              name="Comments"
              className="bg-gray-100"
              inputProps={{ ...register("Comments") }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
