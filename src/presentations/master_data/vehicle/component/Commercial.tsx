import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { Controller } from "react-hook-form";
export default function Commercial({
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
              Type
            </th>
            <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
              Name
            </th>
            <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
              Issue Date
            </th>
            <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
              Expire Date
            </th>
            <th className="w-[200px] text-left font-normal py-2 text-[14px] text-gray-500">
              Fee
            </th>
            <th className=" text-left font-normal py-2 text-[14px] text-gray-500">
              Referance
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
                  <span>{index + 1}</span>
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
                  <Controller
                    name="U_IssueDate"
                    control={control}
                    render={({ field }) => {
                      return (
                        <MUIDatePicker
                          {...field}
                          value={staticSelect?.u_IssueDate}
                          key={`U_IssueDate_${staticSelect?.u_IssueDate}`}
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
                  {/* <DatePicker
                    onChange={(value: any) => {
                      if (value) {
                        handlerChangeCommer(
                          "U_IssueDate",
                          value?.toISOString(),
                          index
                        );
                      }
                    }}
                  
                  /> */}
                </td>
                <td className="pr-4">
                  {/* <DatePicker
                    onChange={(value: any) => {
                      if (value) {
                        handlerChangeCommer(
                          "U_ExpiredDate",
                          value?.toISOString(),
                          index
                        );
                      }
                    }}
  
                    key={e?.U_ExpiredDate}
                  /> */}
                  <Controller
                    name="U_ExpiredDate"
                    control={control}
                    render={({ field }) => {
                      return (
                        <MUIDatePicker
                          {...field}
                          value={staticSelect.u_ExpiredDate}
                          key={`U_ExpiredDate_${staticSelect.u_ExpiredDate}`}
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
                            handlerChangeCommer("U_ExpiredDate", val, index);
                          }}
                        />
                      );
                    }}
                  />
                </td>

                <td className="pr-4">
                  <MUITextField
                    placeholder="Fee"
                    inputProps={{
                      defaultValue: e?.U_Fee,
                      onChange: (e: any) =>
                        handlerChangeCommer("U_Fee", e?.target?.value, index),
                    }}
                  />
                </td>
                <td className="pr-4">
                  <MUITextField
                    placeholder="Referance"
                    inputProps={{
                      defaultValue: e?.U_Ref,
                      onChange: (e: any) =>
                        handlerChangeCommer("U_Ref", e?.target?.value, index),
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </table>
        <span
          onClick={addNewRow}
          className="p-1 bg-white w-[90px] mt-5 text-center inline-block cursor-pointer border-[1px] shadow-sm"
        >
          Add
        </span>
      </div>
    </>
  );
}
