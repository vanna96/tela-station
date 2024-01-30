import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { Controller } from "react-hook-form";
export default function Compartment({
  register,
  defaultValue,
  setValue,
  commer,
  setCommer,
  control,
}: any) {
  const [staticSelect, setStaticSelect] = useState({
    u_IssueDate: null,
    u_ExpiredDate: null,
  });
  const addNewRow = () => {
    let newRow: any = {};
    setCommer([...(commer ?? []), newRow]);
  };

  const handlerDelete = (index: number) => {
    if (index) {
      const state: any[] = [...commer];
      state.splice(index, 1);
      setCommer(state);
    } else {
      return;
    }
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
  console.log(staticSelect);

  return (
    <>
      <div>
        <table className="border w-full shadow-sm bg-white border-[#dadde0]">
          <tr className="border-[1px] border-[#dadde0]">
            <th className="w-[100px] "></th>

            <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
              Compart. No
            </th>
            <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
              Volume (Litre)
            </th>
            <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
              Top Hatch
            </th>
            <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
              Bottom Hatch
            </th>
          </tr>
          {commer?.length === undefined && (
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
              <tr key={index}>
                <td className="py-5 flex justify-center gap-5 items-center">
                  <div
                    onClick={() => handlerDelete(index)}
                    className="w-[17px] shadow-lg shadow-[#878484] h-[17px] bg-red-500 rounded-sm text-white flex justify-center items-center cursor-pointer"
                  >
                    -
                  </div>
                  <span className="text-gray-500">{index + 1}</span>
                </td>
                <td className="pr-4">
                  <MUITextField
                    placeholder="Type"
                    inputProps={{
                      defaultValue: e?.U_Type,
                      onChange: (e: any) =>
                        handlerChangeCommer("U_Type", e?.target?.value, index),
                    }}
                  />
                </td>
                <td className="pr-4">
                  <MUITextField
                    placeholder="Name"
                    inputProps={{
                      defaultValue: e?.U_Name,
                      onChange: (e: any) =>
                        handlerChangeCommer("U_Name", e?.target?.value, index),
                    }}
                  />
                </td>
                <td className="pr-4">
                  <MUITextField
                    placeholder="Name"
                    inputProps={{
                      defaultValue: e?.U_Name,
                      onChange: (e: any) =>
                        handlerChangeCommer("U_Name", e?.target?.value, index),
                    }}
                  />
                </td>
                <td className="pr-4">
                  <MUITextField
                    placeholder="Name"
                    inputProps={{
                      defaultValue: e?.U_Name,
                      onChange: (e: any) =>
                        handlerChangeCommer("U_Name", e?.target?.value, index),
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </table>
        <span
          onClick={addNewRow}
          className="p-1 text-sm bg-white w-[90px] mt-5 text-center inline-block cursor-pointer border-[1px] shadow-md"
        >
         + Add
        </span>
      </div>
    </>
  );
}
