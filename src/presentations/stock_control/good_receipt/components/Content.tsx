import MUITextField from "@/components/input/MUITextField";
import { Button, Checkbox, TextField } from "@mui/material";
import React, { useCallback, useMemo } from "react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import UomSelectByItem, {
  calculateUOM,
} from "../../components/UomSelectByItem";
import FuelLevelWarehouseBinAutoComplete from "../../fuel_level/components/FuelLevelWarehouseBinAutoComplete";
import { useParams } from "react-router-dom";
import { InventoryItemModal } from "../../components/GetItemModal";
import { useQueryClient } from "react-query";

let itemRef = React.createRef<InventoryItemModal>();

export default function Content({
  register,
  setValue,
  detail,
  watch,
  control,
}: any) {
  const { id }: any = useParams();
  const [selected, setSelected] = useState<number[]>([]);
  const fields: any[] = useMemo(() => {
    if (!watch("DocumentLines")) return [];
    return watch("DocumentLines");
  }, [watch("DocumentLines")]);

  const handlerAddNew = useCallback(
    (items: any[] | any, index: number | undefined) => {
      const state: any = [...fields];

      if (items instanceof Array) {
        for (const item of items) {
          if (state.find((e: any) => e?.ItemCode === item?.ItemCode)) continue;

          state.push({
            ItemCode: item?.ItemCode,
            ItemDescription: item?.ItemName,
            Quantity: undefined,
            WarehouseCode: watch("U_tl_whsdesc"),
            UseBaseUnits: "tNO",
            CostingCode: item?.LineOfBusiness,
            CostingCode2: watch("U_ti_revenue"),
            CostingCode3: item?.ProductLine,
            AccountCode: watch("AccountCode"),
          });
        }
      } else {
        state[index as number] = {
          ItemCode: items?.ItemCode,
          ItemDescription: items?.ItemName,
          Quantity: state[index as number]?.Quantity,
          UoMCode: undefined,
          UoMAbsEntry: undefined,
          CostingCode: items?.LineOfBusiness,
          CostingCode2: watch("U_ti_revenue"),
          CostingCode3: items?.ProductLine,
          AccountCode: watch("AccountCode"),
          DocumentLinesBinAllocations: [],
        };
      }

      setValue("DocumentLines", state);
    },
    [watch("DocumentLines")]
  );

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

  const handlerchangeBin = (e: any, index: number) => {
    setValue(
      `DocumentLines[${index}].DocumentLinesBinAllocations[${0}].BinAbsEntry`,
      e?.AbsEntry
    );
    setValue(
      `DocumentLines[${index}].DocumentLinesBinAllocations[${0}].BaseLineNumber`,
      index
    );
    setValue(
      `DocumentLines[${index}].DocumentLinesBinAllocations[${0}].AllowNegativeQuantity`,
      "tNO"
    );
    setValue(
      `DocumentLines[${index}].DocumentLinesBinAllocations[${0}].SerialAndBatchNumbersBaseLine`,
      -1
    );
  };

  const queryClient = useQueryClient();
  console.log(queryClient.getQueryData([`uom_group_lists`]));

  const onChangeQuantity = (
    event: any,
    code: string | undefined,
    uomId: number | undefined,
    index: number
  ) => {
    if (event?.target?.value === "" || !event?.target?.value) return;

    const query: any = queryClient.getQueryData([`uom_group_lists_${code}`]);

    if (!query) return;

    const selectedUoM = query?.UoMGroupDefinitionCollection?.find(
      (e: any) => e.AlternateUoM === uomId
    );
    if (!selectedUoM) return;

    const qty = calculateUOM(
      selectedUoM.BaseQuantity,
      selectedUoM.AlternateQuantity,
      Number(event?.target?.value) ?? 0
    );
    setValue(
      `DocumentLines.${index}.DocumentLinesBinAllocations.0.Quantity`,
      qty
    );
  };

  return (
    <>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-5 pb-1">
          <h2>Content</h2>
          {!id && (
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
                Unit Price{" "}
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                UoM{" "}
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Bin Code
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
                      {!id && (
                        <Checkbox
                          onChange={() => onSelectChange(e, index)}
                          checked={selected.includes(index)}
                        />
                      )}
                    </td>
                    <td className="pr-4">
                      {id ? (
                        <MUITextField
                          disabled={id}
                          inputProps={{
                            ...register(`DocumentLines.${index}.ItemCode`, {
                              required: "Item No. is required",
                            }),
                          }}
                        />
                      ) : (
                        <MUITextField
                          disabled={id}
                          onClick={() =>
                            itemRef.current?.onOpen("single", index)
                          }
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
                          ...register(`DocumentLines.${index}.ItemDescription`),
                        }}
                      />
                    </td>
                    <td className="pr-4">
                      <MUITextField
                        disabled={id}
                        type="number"
                        inputProps={{
                          ...register(`DocumentLines.${index}.Quantity`, {
                            required: "Quantity is required",
                          }),
                          onBlur: (event) =>
                            onChangeQuantity(
                              event,
                              e?.ItemCode,
                              e?.UoMEntry,
                              index
                            ),
                        }}
                      />
                    </td>
                    <td className="pr-4">
                      <MUITextField
                        disabled={id}
                        type="number"
                        inputProps={{
                          ...register(`DocumentLines.${index}.UnitPrice`),
                        }}
                      />
                    </td>
                    <td className="pr-4">
                      <Controller
                        name={`DocumentLines.${index}.UoMCode`}
                        control={control}
                        render={({ field }) => {
                          return (
                            <>
                              <UomSelectByItem
                                disabled={id}
                                item={e.ItemCode}
                                quantity={e?.Quantity}
                                onChange={(ev: any) => {
                                  console.log(ev);
                                  setValue(
                                    `DocumentLines[${index}].UoMCode`,
                                    ev?.Code
                                  );
                                  setValue(
                                    `DocumentLines[${index}].UoMEntry`,
                                    ev?.AbsEntry
                                  );
                                  setValue(
                                    `DocumentLines[${index}].UseBaseUnits`,
                                    "tNO"
                                  );
                                  setValue(
                                    `DocumentLines[${index}].DocumentLinesBinAllocations[${0}].Quantity`,
                                    ev?.Quantity
                                  );
                                }}
                                value={e?.UoMEntry}
                              />
                            </>
                          );
                        }}
                      />
                    </td>
                    <td className="pr-4">
                      <Controller
                        name={`DocumentLines[${index}].DocumentLinesBinAllocations[${0}].BinAbsEntry`}
                        control={control}
                        render={({ field }) => {
                          return (
                            <FuelLevelWarehouseBinAutoComplete
                              disabled={id}
                              value={watch(
                                `DocumentLines[${index}].DocumentLinesBinAllocations[${0}].BinAbsEntry`
                              )}
                              whsCode={watch("U_tl_whsdesc")}
                              onChange={(e: any) => {
                                handlerchangeBin(e, index);
                              }}
                              excludes={[]}
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
          {id ? null : (
            <span
              onClick={() => itemRef.current?.onOpen("multiple")}
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
              inputProps={{ ...register("Comments") }}
            />
          </div>
        </div>
      </div>
      <InventoryItemModal ref={itemRef} onSelectItems={handlerAddNew} />
    </>
  );
}
