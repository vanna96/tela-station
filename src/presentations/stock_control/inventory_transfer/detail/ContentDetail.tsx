import React, { useCallback } from "react";
import MUITextField from "@/components/input/MUITextField";
import { Button, Checkbox, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import ITRModal, { InventoryItemModal } from "../../components/GetItemModal";
import UomSelectByItem, { calculateUOM } from "../../components/UomSelectByItem";
import { AiOutlineConsoleSql } from "react-icons/ai";
import { QueryCache, QueryClient, useQueryClient } from "react-query";
import BinAllocationAutoComplete from "../../components/BinLocationAutoComplete";


let itemRef = React.createRef<InventoryItemModal>();

export default function ContentDetail({
  register,
  setValue,
  detail,
  control,
  watch,
  edit
}: any) {

  const [selecteds, setSelects] = useState<{ [key: number]: number | undefined }>({});

  const fields = useMemo(() => {
    return watch('StockTransferLines') ?? [];
  }, [watch('StockTransferLines')])


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
          WarehouseCode: watch('ToWarehouese'),
          UseBaseUnits: "tNO",
          FromWarehouseCode: watch('FromWarehouese'),
          StockTransferLinesBinAllocations: [
            {
              BinAbsEntry: watch('U_tl_fromBinId'),
              Quantity: undefined,
              AllowNegativeQuantity: "tNO",
              SerialAndBatchNumbersBaseLine: -1,
              BinActionType: "batFromWarehouse"
            },
            {
              BinAbsEntry: watch('U_tl_toBinId'),
              Quantity: undefined,
              AllowNegativeQuantity: "tNO",
              SerialAndBatchNumbersBaseLine: -1,
              BinActionType: "batToWarehouse"
            }
          ]

        })
      }
    } else {
      state[index as number] = {
        ItemCode: items?.ItemCode,
        ItemDescription: items?.ItemName,
        Quantity: state[index as number]?.Quantity,
        UoMCode: undefined,
        UoMAbsEntry: undefined,
        UseBaseUnits: "tNO",
        WarehouseCode: watch('ToWarehouese'),
        FromWarehouseCode: watch('FromWarehouese'),
        StockTransferLinesBinAllocations: [...state[index as number]?.StockTransferLinesBinAllocations]
      }
    }

    setValue('StockTransferLines', state)
  }, [watch('StockTransferLines')])


  const queryCache = new QueryCache({
    onError: (error) => {
      console.log(error)
    },
    onSuccess: (data) => {
      console.log(data)
    },
  })

  const queryClient = useQueryClient()

  const onChangeQuantity = (event: any, code: string | undefined, uomId: number | undefined, index: number) => {
    if (event?.target?.value === '' || !event?.target?.value) return;

    const query: any = queryClient.getQueryData([`uom_group_lists_${code}`]);
    if (!query) return;

    const selectedUoM = query?.UoMGroupDefinitionCollection?.find((e: any) => e.AlternateUoM === uomId);
    if (!selectedUoM) return;

    const qty = calculateUOM(selectedUoM.BaseQuantity, selectedUoM.AlternateQuantity, Number(event?.target?.value) ?? 0)
    setValue(`StockTransferLines.${index}.StockTransferLinesBinAllocations.0.Quantity`, qty);
    setValue(`StockTransferLines.${index}.StockTransferLinesBinAllocations.1.Quantity`, qty);
  }

  return (
    <>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
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
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">From Bin Code </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">To Bin Code</th>
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
                    </td>
                    <td className="pr-4">
                      <MUITextField
                        onClick={() => itemRef.current?.onOpen('single', index)}
                        disabled
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
                        disabled
                        inputProps={{
                          ...register(`StockTransferLines.${index}.Quantity`, { required: `Quantity is required at ${index}`, }),
                          onBlur: (event) => onChangeQuantity(event, e?.ItemCode, e?.UoMEntry, index)

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
                              disabled
                              {...field}
                              onChange={(e) => {
                                console.log(e)
                                setValue(`StockTransferLines.${index}.UoMEntry`, e?.AbsEntry);
                                setValue(`StockTransferLines.${index}.UoMCode`, e?.Code);
                                setValue(`StockTransferLines.${index}.StockTransferLinesBinAllocations.0.Quantity`, e?.Quantity);
                                setValue(`StockTransferLines.${index}.StockTransferLinesBinAllocations.1.Quantity`, e?.Quantity);
                              }}
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
                        name={`StockTransferLines.${index}.StockTransferLinesBinAllocations.0.BinAbsEntry`}
                        rules={
                          {
                            required: 'From bin code is required'
                          }
                        }
                        control={control}
                        render={({ field }) => <BinAllocationAutoComplete
                          warehouse={watch('FromWarehouse')}
                          disabled={true}
                          {...field}
                          value={field.value}
                          onChange={(value) => {
                            console.log(field.value)
                            setValue(`StockTransferLines.${index}.StockTransferLinesBinAllocations.0.BinAbsEntry`, value?.AbsEntry);
                          }}
                        />}
                      />
                    </td>
                    <td className="pr-4">

                      <Controller
                        name={`StockTransferLines.${index}.StockTransferLinesBinAllocations.1.BinAbsEntry`}
                        rules={
                          {
                            required: 'To bin code is required'
                          }
                        }
                        control={control}
                        render={({ field }) => <BinAllocationAutoComplete
                          warehouse={watch('ToWarehouse')}
                          disabled={true}
                          {...field}
                          value={field.value}
                          onChange={(value) => {
                            setValue(`StockTransferLines.${index}.StockTransferLinesBinAllocations.1.BinAbsEntry`, value?.AbsEntry);
                          }}
                        />}
                      />
                    </td>
                  </tr>
                </>
              );
            })}
          </table>
        </div>
        <div className="grid grid-cols-5 w-[50%] py-2 float-right mt-10">
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

      <InventoryItemModal ref={itemRef} onSelectItems={handlerAddNew} />
    </>
  );
}
