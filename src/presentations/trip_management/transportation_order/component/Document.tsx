import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import TRModal from "./TRModal";
import { FaAngleDown } from "react-icons/fa6";

export default function Document({
  register,
  defaultValue,
  setValue,
  control,
  detail,
  document,
  removeDocument
}: any) {
  const [staticSelect, setStaticSelect] = useState({
    u_IssueDate: undefined,
    u_ExpiredDate: undefined,
    u_Type: "",
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  
  return (
    <>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex gap-x-3 items-center mb-5 pb-1">
          <h2 className="mr-3">Source Document</h2>
          <Button
            sx={{ height: "25px" }}
            className="bg-white"
            size="small"
            variant="contained"
            disableElevation
            onClick={handleOpen}
          >
            <span className="px-4 text-[11px] py-4 text-white">+ TR</span>
          </Button>
          <Button
            sx={{ height: "25px" }}
            className="bg-white"
            size="small"
            variant="contained"
            disableElevation
          >
            <span className="px-4 text-[11px] py-4 text-white">+ ITR</span>
          </Button>
        </div>{" "}
        <div>
          <table className="border w-full shadow-sm bg-white border-[#dadde0]">
            <tr className="border-[1px] border-[#dadde0]">
              <th className="w-[100px] "></th>

              <th className="w-[180px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Source Document <span className="text-red-500 ml-1">*</span>
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Document Number{" "}
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Item{" "}
              </th>
              <th className="text-left font-normal  py-2 text-[14px] text-gray-500">
                Ship To <span className="text-red-500 ml-1">*</span>
              </th>
              <th className="w-[200px] text-left font-normal py-2 text-[14px] text-gray-500">
                Delivery Date <span className="text-red-500 ml-1">*</span>
              </th>
              <th className="w-[200px] text-left font-normal py-2 text-[14px] text-gray-500">
                Quantity{" "}
              </th>
              <th className="w-[90px] text-center font-normal py-2 text-[14px] text-gray-500">
                Action{" "}
              </th>
            </tr>
            {document?.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-10 text-[16px] text-gray-400"
                >
                  No Record
                </td>
              </tr>
            )}
            {document?.map((e: any, index: number) => {
              return (
                <tr key={index}>
                  <td className="py-5 flex justify-center gap-5 items-center">
                    <div className={`text-gray-700`}>
                      <FaAngleDown color="gray" />
                    </div>
                    <span className="text-gray-500">{index + 1}</span>
                  </td>

                  <td className="pr-4">
                    <span className="text-gray-500 text-[13.5px]">
                      {e?.Type === "ITR"
                        ? "Inventory Transfer Request"
                        : "Sale Order"}
                    </span>
                  </td>
                  <td className="pr-4">
                    <MUITextField
                      disabled={true}
                      placeholder="Document Number"
                      value={e?.DocNum}
                    />
                  </td>
                  <td className="pr-4">
                    <MUITextField
                      disabled={true}
                      placeholder="Item"
                      value={e?.ItemCode}
                    />
                  </td>
                  <td className="pr-4">
                    <MUITextField
                      disabled={true}
                      placeholder="Ship To"
                      value={e?.ShipToCode}
                    />
                  </td>

                  <td className="pr-4">
                    <MUITextField
                      disabled={true}
                      placeholder="Delivery Date"
                      value={e?.DocDate}
                    />
                  </td>
                  <td className="">
                    <MUITextField
                      disabled={true}
                      placeholder="Quantity"
                      value={(e?.Quantity).toString() + ".00"}
                    />
                  </td>
                  <td className="text-center">
                    <div
                      onClick={() => removeDocument(index)}
                      className={`w-[17px] cursor-pointer mx-auto transition-all duration-300 shadow-md shadow-[#878484] h-[17px] bg-red-500 text-white rounded-sm flex justify-center items-center hover:shadow-lg hover:shadow-slate-600`}
                    >
                      -
                    </div>
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
      <TRModal setValue={setValue} open={open} setOpen={setOpen} />
    </>
  );
}
