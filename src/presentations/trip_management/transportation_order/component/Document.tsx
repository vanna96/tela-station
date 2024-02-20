import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { Button, Checkbox } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import TRModal from "./TRModal";
import { FaAngleDown } from "react-icons/fa6";
import { dateFormat } from "@/utilies";

export default function Document({
  register,
  defaultValue,
  setValue,
  control,
  detail,
  transDetail,
}: any) {
  const [staticSelect, setStaticSelect] = useState({
    u_IssueDate: undefined,
    u_ExpiredDate: undefined,
    u_Type: "",
  });
  const { fields: document, remove: removeDocument } = useFieldArray({
    control,
    name: "Document",
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
            <span className="px-4 text-[11px] py-4 text-white">
              Load Document
            </span>
          </Button>
          {/* <Button
            sx={{ height: "25px" }}
            className="bg-white"
            size="small"
            variant="contained"
            disableElevation
          >
            <span className="px-4 text-[11px] py-4 text-white">+ ITR</span>
          </Button> */}
        </div>{" "}
        <div>
          <table className="border w-full shadow-sm bg-white border-[#dadde0]">
            <tr className="border-[1px] border-[#dadde0]">
              <th className="w-[100px] "></th>

              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Source Document
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                Document Number{" "}
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                To Branch
              </th>
              <th className="text-left font-normal  py-2 text-[14px] text-gray-500">
                To Warehouse
              </th>
              <th className="w-[200px] text-left font-normal py-2 text-[14px] text-gray-500">
                Items
              </th>
              <th className="w-[200px] text-left font-normal py-2 text-[14px] text-gray-500">
                Quantity{" "}
              </th>
              <th className="w-[100px] text-center font-normal py-2 text-[14px] text-gray-500">
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
                <>
                  <tr key={e?.id} className="border-t border-[#dadde0]">
                    <td className="py-5 flex justify-center gap-8 items-center">
                      <div className={`text-gray-700 `}>
                        <FaAngleDown color="gray" />
                      </div>
                      <span className="text-black">{index + 1}</span>
                    </td>

                    <td className="pr-4">
                      <span className="text-black text-[13.5px] ml-11">
                        {e?.U_Type}
                      </span>
                    </td>
                    <td className="pr-4">
                      <MUITextField
                        disabled={true}
                        placeholder="Document Number"
                        value={e?.U_DocNum}
                      />
                    </td>
                    <td className="pr-4">
                      <MUITextField
                        disabled={true}
                        placeholder="To Branch"
                        value={e?.U_BPLName}
                      />
                    </td>
                    <td className="pr-4">
                      <MUITextField
                        disabled={true}
                        placeholder="To Warehouse"
                        value={e?.U_Terminal}
                      />
                    </td>

                    <td className="pr-4">
                      <MUITextField
                        disabled={true}
                        placeholder="Items"
                        value={e?.U_TotalItem}
                      />
                    </td>
                    <td className="">
                      <MUITextField
                        disabled={true}
                        placeholder="Quantity"
                        value={e?.U_TotalQuantity}
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
                  {e?.TL_TO_DETAIL_ROWCollection &&
                    e?.TL_TO_DETAIL_ROWCollection?.map((c: any, indexc: number) => {
                      return (
                        <>
                          <tr
                            className="border-t-[1px] border-[#dadde0] "
                            key={indexc}
                          >
                            <th className="w-[120px] "></th>
                            <th className="w-[200px] border-l-[1px]  border-b border-[#dadde0] pl-5 bg-gray-50  text-left font-normal  py-2 text-[14px] text-gray-500">
                              Source Type{" "}
                            </th>

                            <th className="w-[200px] bg-gray-50  border-b border-[#dadde0]  text-left font-normal  py-2 text-[14px] text-gray-500">
                              Document Number{" "}
                            </th>

                            <th className="text-left bg-gray-50  border-b border-[#dadde0]  font-normal  py-2 text-[14px] text-gray-500">
                              Ship To
                            </th>
                            <th className="w-[200px] bg-gray-50  border-b border-[#dadde0]  text-left font-normal  py-2 text-[14px] text-gray-500">
                              Item{" "}
                            </th>
                            <th className="w-[200px] bg-gray-50  border-b border-[#dadde0]  text-left font-normal py-2 text-[14px] text-gray-500">
                              Delivery Date
                            </th>
                            <th className="w-[200px] bg-gray-50  border-b border-[#dadde0]  text-left font-normal py-2 text-[14px] text-gray-500">
                              Qty{" "}
                            </th>
                            <th className="bg-gray-50  border-b border-[#dadde0] "></th>
                          </tr>
                          <tr key={index} className="">
                            <td className="py-6 flex justify-center gap-8 items-center"></td>

                            <td className="pr-4 bg-gray-50 border-l-[1px] border-[#dadde0]">
                              <span className="text-black flex items-center gap-3 text-[13.5px] ml-1">
                                <Checkbox
                                  className=""
                                  disabled={true}
                                  checked={true}
                                />
                                {c?.U_DocType}
                              </span>
                            </td>
                            <td className="pr-4 bg-gray-50">
                              <MUITextField
                                disabled={true}
                                placeholder="Document Number"
                                value={c?.U_DocNum}
                              />
                            </td>

                            <td className="pr-4 bg-gray-50">
                              <MUITextField
                                disabled={true}
                                placeholder="Ship To"
                                value={c?.U_ShipToCode}
                              />
                            </td>
                            <td className="pr-4 bg-gray-50">
                              <MUITextField
                                disabled={true}
                                placeholder="Item"
                                value={c?.U_ItemCode}
                              />
                            </td>
                            <td className="pr-4 bg-gray-50">
                              <MUITextField
                                disabled={true}
                                placeholder="Delivery Date"
                                value={dateFormat(c?.U_DeliveryDate)}
                              />
                            </td>
                            <td colSpan={2} className="bg-gray-50">
                              <MUITextField
                                disabled={true}
                                placeholder="Qty"
                                value={c?.U_Quantity}
                              />
                            </td>
                          </tr>
                        </>
                      );
                    })}

                </>
              );
            })}
          </table>
        </div>
      </div>
      <TRModal
        document={document}
        setValue={setValue}
        open={open}
        setOpen={setOpen}
        transDetail={transDetail}
      />
    </>
  );
}
