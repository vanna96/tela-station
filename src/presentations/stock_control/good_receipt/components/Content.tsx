import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import ItemModal from "@/presentations/trip_management/transportation_order/ItemModal";
import { Button, Checkbox, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

export default function Content({
  register,
  defaultValue,
  setValue,
  compart,
  setCompart,
  detail,
  control,
}: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "test",
  });
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [openItem, setOpenItem] = useState(false);

  const handleCheck = (index: number) => {
    const selectedIndex = selectedItems.indexOf(index);
    if (selectedIndex === -1) {
      setSelectedItems([...selectedItems, index]);
    } else {
      const updatedSelectedItems = [...selectedItems];
      updatedSelectedItems.splice(selectedIndex, 1);
      setSelectedItems(updatedSelectedItems);
    }
  };

  const handleDeleteChecked = () => {
    selectedItems.forEach((index) => remove(index));
    setSelectedItems([]);
  };

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
                Bin Code{" "}
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
                <tr key={index}>
                  <td className="py-2 flex justify-center gap-5 items-center">
                    {!detail && (
                      <Checkbox
                        onChange={() => handleCheck(index)}
                        checked={selectedItems.includes(index)}
                      />
                    )}
                  </td>
                  <td className="pr-4">
                    <MUITextField
                      onClick={() => setOpenItem(true)}
                      endAdornment
                    />
                  </td>
                  <td className="pr-4">
                    <MUITextField disabled />
                  </td>
                  <td className="pr-4">
                    <MUITextField />
                  </td>
                  <td className="pr-4">
                    <MUITextField />
                  </td>
                  <td className="pr-4">
                    <MUITextField />
                  </td>
                </tr>
              );
            })}
          </table>
          {detail ? null : (
            <span
              onClick={() => append({})}
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
      <ItemModal setOpen={setOpenItem} open={openItem} />
    </>
  );
}
