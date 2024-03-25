import MUITextField from "@/components/input/MUITextField";
import { Button, Checkbox } from "@mui/material";
import { Fragment, useMemo, useState } from "react";
import TRModal from "./TRModal";
import { FaAngleDown } from "react-icons/fa6";
import { dateFormat } from "@/utilies";
import { TOCollections } from "../../type";

export default function Document(props: any) {

  const documents: TOCollections[] = useMemo(() => {
    if (!props?.watch('TL_TO_ORDERCollection')) return []

    return props?.watch('TL_TO_ORDERCollection')?.filter((e: any) => e?.U_Type !== 'S') ?? [];
  }, [props?.watch('TL_TO_ORDERCollection')])


  const onRemoveLine = (index: number) => {
    const state = [...documents];
    state.splice(index, 1);
    props?.setValue('TL_TO_ORDERCollection', state)
  }


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
            onClick={() => props?.dialog.current?.onOpen()}
          >
            <span className="px-4 text-[11px] py-4 text-white">
              Load Document
            </span>
          </Button>
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
                <span className={`${false ? "hidden" : ""}`}>Action</span>{" "}
              </th>
            </tr>
            {documents.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center p-10 text-[16px] text-gray-400"
                >
                  No Record
                </td>
              </tr>
            )}
            {documents?.map((e: any, index: number) => {
              return (
                <Fragment key={e?.id}>
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
                    <td colSpan={false ? 2 : undefined} className="">
                      <MUITextField
                        disabled={true}
                        placeholder="Quantity"
                        value={e?.U_TotalQuantity}
                      />
                    </td>
                    <td className="text-center">
                      <div
                        onClick={() => onRemoveLine(index)}
                        className={`w-[17px]  cursor-pointer mx-auto transition-all duration-300 shadow-md shadow-[#878484] h-[17px] bg-red-500 text-white rounded-sm flex justify-center items-center hover:shadow-lg hover:shadow-slate-600`}
                      >
                        -
                      </div>
                    </td>
                  </tr>
                  {e?.TL_TO_DETAIL_ROWCollection &&
                    e?.TL_TO_DETAIL_ROWCollection?.map(
                      (c: any, indexc: number) => {
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
                      }
                    )}
                </Fragment>
              );
            })}
          </table>
        </div>
      </div>
    </>
  );
}
