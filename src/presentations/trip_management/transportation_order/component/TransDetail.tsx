import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { Button, Checkbox, CircularProgress } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Fragment, useEffect, useState } from "react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import TRModal from "./TRModal";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import request from "@/utilies/request";
import { useQuery } from "react-query";
import StopsRepository from "@/services/actions/StopsRepository";
import React from "react";
import shortid from "shortid";
import { useParams } from "react-router-dom";

export default function TransDetail({
  register,
  defaultValue,
  setValue,
  control,
  detail,
  getValues,
  setValues,
  transDetail,
  setTransDetail,
  setTrans,
  watch,
}: any) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const { id } = useParams();
  const stop: any = useQuery({
    queryKey: ["stops"],
    queryFn: () => new StopsRepository().get(),
    staleTime: Infinity,
  });

  const handleRowClick = (index: number, rowIndex?: number | undefined) => {
    if (
      dataListing2?.length === 0 ||
      dataListing2?.every((e: any) => e?.U_Order === 0)
    ) {
      const newDataListing = [...dataListing];
      newDataListing[index].U_Order = 1;
      setTransDetail([...transDetail, newDataListing]);
    } else {
      let max = dataListing2.reduce((max: any, obj: any) => {
        return obj["U_Order"] > max["U_Order"] ? obj : max;
      }, dataListing2[0]);
      const newDataListing = [...dataListing];
      newDataListing[index].U_Order = max?.U_Order + 1;
      setTransDetail([...transDetail, newDataListing]);
    }
  };

  const handleRowClick2 = (index2: number) => {
    const newDataListing = [...dataListing2];
    newDataListing[index2].U_Order = 0;
    setTransDetail([...transDetail, newDataListing]);
  };

  const dataListing = React.useMemo(() => {
    const temp: any[] = [];
    if (id) {
      for (const item of transDetail as any[]) {
        temp.push(...(item.TL_TO_DETAIL_ROWCollection ?? []));
      }
    } else {
      for (const item of transDetail as any[]) {
        if (item?.U_Type === "S") {
          temp.push(item);
        } else {
          temp.push(...(item.TL_TO_DETAIL_ROWCollection ?? []));
        }
      }
    }
    return temp.filter((e) => e.U_Order === 0);
  }, [transDetail]);

  const dataListing2 = React.useMemo(() => {
    const temp: any[] = [];
    if (id) {
      for (const item of transDetail as any[]) {
        temp.push(...(item.TL_TO_DETAIL_ROWCollection ?? []));
      }
    } else {
      for (const item of transDetail as any[]) {
        if (item?.U_Type === "S") {
          temp.push(item);
        } else {
          temp.push(...(item.TL_TO_DETAIL_ROWCollection ?? []));
        }
      }
    }
    return temp.filter((e) => e.U_Order !== 0);
  }, [dataListing]);

  useEffect(() => {
    if (dataListing2) {
      setTrans(dataListing2);
    }
  }, [transDetail]);

  let currentDate = new Date();
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = "00";
  let currentTime = hours + ":" + minutes + ":" + seconds;

  
  return (
    <>
      <div className="rounded-lg shadow-sm  border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex gap-x-3 items-center mb-5 pb-1">
          <h2 className="mr-3">Transportation Detail</h2>
        </div>{" "}
        {confirm ||
        (id && defaultValue?.U_Status !== "I" && dataListing?.length === 0) ? (
          <div className="w-full">
            <table className="border w-full shadow-sm bg-white border-[#dadde0]">
              <tr className="border-[1px] border-[#dadde0]">
                <th className="w-[100px] text-center font-normal  py-2 text-[14px] text-gray-500">
                  Sequence
                </th>

                <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                  Stops / Drop - Off
                </th>
                <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                  From Location{" "}
                </th>
                <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                  To Location
                </th>
                <th className="text-left font-normal  py-2 text-[14px] text-gray-500">
                  Address
                </th>
                <th></th>
                <th className="w-[200px] text-left font-normal py-2 text-[14px] text-gray-500">
                  Remark
                </th>
              </tr>
              {dataListing2
                ?.sort?.((a: any, b: any) => a?.U_Order - b?.U_Order)
                ?.map((e: any, index: number) => {
                  return (
                    <Fragment key={shortid.generate()}>
                      <tr
                        className={`border-t ${(e?.U_Type === "S" || e?.U_DocType === "S") && "bg-zinc-200"} border-[#dadde0]`}
                      >
                        <td className="py-4 flex justify-center gap-8 items-center">
                          <span
                            className={`${e?.U_Type === "S" || e?.U_DocType === "S" ? "bg-white border border-gray-300" : ""} w-[33px] flex items-center justify-center border rounded-lg raduire text-sm text-black`}
                          >
                            {index + 1}
                          </span>
                        </td>

                        <td className="pr-4">
                          <span className="text-black text-[13.5px] ml-11 font-bold">
                            {e?.U_Type === "S" || e?.U_DocType === "S"
                              ? "Stop"
                              : "Drop-Off"}
                          </span>
                        </td>
                        <td className="pr-4 w-[100px] text-left font-normal  py-2 text-[14px] text-gray-500">
                          {index === 0
                            ? getValues("U_BaseStation")
                            : dataListing2?.at(index - 1)?.U_ShipToCode}
                        </td>
                        <td className="pr-4 w-[100px] text-left font-normal  py-2 text-[14px] text-gray-500">
                          {e.U_Type === "S" ? e?.U_StopCode : e?.U_ShipToCode}
                        </td>
                        <td
                          colSpan={2}
                          className="pr-4 w-[100px] text-left font-normal  py-2 text-[14px] text-gray-500"
                        >
                          {e.U_Type === "S"
                            ? e?.U_Description
                            : e?.U_ShipToAddress}
                        </td>

                        <td colSpan={2} className="pr-4 w-[100px] ">
                          <div
                            className={`${(e?.U_Type === "S" || e?.U_DocType === "S") && "hidden"} text-left font-normal  py-2 text-[14px] text-gray-500`}
                          >
                            {" "}
                            <MUITextField
                              placeholder="Remark"
                              value={e?.Remark}
                            />
                          </div>
                        </td>
                      </tr>
                      {e?.U_Quantity && (
                        <>
                          <tr className="border-t-[1px] border-[#dadde0] ">
                            <th className="w-[120px] "></th>
                            <th className="w-[200px] border-l-[1px]  border-b border-[#dadde0] pl-5 bg-gray-50  text-left font-normal  py-2 text-[14px] text-gray-500">
                              Source Document{" "}
                            </th>

                            <th className="w-[200px] bg-gray-50  border-b border-[#dadde0]  text-left font-normal  py-2 text-[14px] text-gray-500">
                              Document Number{" "}
                            </th>

                            <th className="text-left bg-gray-50  border-b border-[#dadde0]  font-normal  py-2 text-[14px] text-gray-500">
                              Item
                            </th>
                            <th className="w-[200px] bg-gray-50  border-b border-[#dadde0]  text-left font-normal  py-2 text-[14px] text-gray-500">
                              Total Quantity{" "}
                            </th>
                            <th className="w-[200px] bg-gray-50  border-b border-[#dadde0]  text-left font-normal py-2 text-[14px] text-gray-500">
                              Unload Start Time
                            </th>
                            <th className="w-[200px] bg-gray-50  border-b border-[#dadde0]  text-left font-normal py-2 text-[14px] text-gray-500">
                              Unload End Time{" "}
                            </th>
                            <th className="bg-gray-50  border-b border-[#dadde0] "></th>
                          </tr>
                          <tr key={index} className="">
                            <td className="py-6 flex justify-center gap-8 items-center"></td>

                            <td className="pr-4 bg-gray-50 border-l-[1px] border-[#dadde0]">
                              <span className="text-black pr-[60px] flex items-center gap-3 text-[13.5px] w-full justify-center">
                                {e?.U_DocType ?? "N/A"}
                              </span>
                            </td>
                            <td className="pr-4 bg-gray-50">
                              <span className=" text-left font-normal  py-2 text-[14px] text-gray-500">
                                {e?.U_DocNum ?? "N/A"}
                              </span>
                            </td>

                            <td className="pr-4 bg-gray-50 text-left font-normal  py-2 text-[14px] text-gray-500">
                              <input
                                type="text"
                                value={e?.U_ItemCode ?? "N/A"}
                                readOnly
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  outline: "none",
                                }}
                              />
                            </td>
                            <td className="pr-4 bg-gray-50  text-left font-normal  py-2 text-[14px] text-gray-500">
                              {e?.U_Quantity ?? "N/A"}
                            </td>
                            <td className="pr-4 bg-gray-50  text-left font-normal  py-2 text-[14px] text-gray-500">
                              {defaultValue?.CreateTime || currentTime}
                            </td>
                            <td
                              colSpan={2}
                              className="pr-4 bg-gray-50  text-left font-normal  py-2 text-[14px] text-gray-500"
                            >
                              {defaultValue?.UpdateTime}
                            </td>
                          </tr>
                        </>
                      )}
                    </Fragment>
                  );
                })}
            </table>
          </div>
        ) : (
          // table 1
          <div className="flex gap-5">
            <div className="grow">
              <table className="border w-full table-fixed shadow-sm bg-white border-[#dadde0]">
                <thead>
                  <tr className="border-[1px] border-[#dadde0] bg-gray-50">
                    <th className="w-[150px] text-left font-normal  py-2 pl-3 text-[14px] text-gray-500">
                      No
                    </th>

                    <th className="w-[150px] text-left font-normal  py-2 text-[14px] text-gray-500">
                      Type
                    </th>
                    <th className="text-left font-normal  py-2 text-[14px] text-gray-500">
                      Address / ShipTo
                    </th>
                    <th className="w-[160px] text-left font-normal  py-2 text-[14px] text-gray-500">
                      Document .No
                    </th>
                  </tr>
                </thead>
                {loading ? (
                  <tbody>
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center p-10 text-[16px] text-gray-400"
                      >
                        <div className="w-full flex items-center justify-center gap-5">
                          <span>
                            <CircularProgress size={22} color="success" />
                          </span>
                          <span className="text-sm">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ) : dataListing?.length == 0 ? (
                  <tbody>
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center p-10 text-[16px] text-gray-400"
                      >
                        No Record
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  dataListing?.map((t: any, index: number) => {
                    return (
                      <tbody>
                        <>
                          <tr
                            key={t.id}
                            className=" cursor-default border-b "
                            onClick={() => handleRowClick(index)}
                          >
                            <td className="py-3 text-left pl-4 ">
                              <span className="text-gray-500">{index + 1}</span>
                            </td>

                            <td className="pr-4 h-[20px]">
                              <span
                                className={`${t?.U_DocType === "S" || t?.U_Type === "S" ? "text-red-500" : "text-gray-500"} text-[13.5px]`}
                              >
                                {t?.U_DocType === "S" || t?.U_Type === "S"
                                  ? t?.U_ItemCode || t?.U_StopCode
                                  : "Drop-Off"}
                              </span>
                            </td>
                            <td className="pr-4">
                              {" "}
                              <span className="text-gray-500 text-[13.5px]">
                                {t?.U_DocType === "S"
                                  ? t?.U_ItemCode || t?.U_StopCode
                                  : t?.U_ShipToCode}
                              </span>
                            </td>
                            <td className="pr-4">
                              {" "}
                              <span className="text-gray-500 text-[13.5px]">
                                {t?.U_DocNum}
                              </span>{" "}
                            </td>
                          </tr>
                        </>
                      </tbody>
                    );
                  })
                )}
              </table>
            </div>

            <div className="flex items-center justify-center flex-col gap-3">
              <span className="text-gray-400 inline-block border p-[2px]">
                {" "}
                <FaAngleRight />
              </span>
              <span className="text-gray-400 inline-block border p-[2px]">
                <FaAngleLeft />
              </span>
            </div>
            {/* table 2 */}
            <div className="grow">
              <table className="border table-fixed w-full shadow-sm bg-white border-[#dadde0]">
                <thead>
                  <tr className="border-[1px] border-[#dadde0] bg-gray-50">
                    <th className="w-[160px]  text-left font-normal  py-2 pl-3 text-[14px] text-gray-500">
                      No
                    </th>

                    <th className="w-[160px] text-left font-normal  py-2 text-[14px] text-gray-500">
                      Type
                    </th>
                    <th className="text-left font-normal  py-2 text-[14px] text-gray-500">
                      Address / ShipTo
                    </th>
                    <th className="w-[160px] text-left font-normal  py-2 text-[14px] text-gray-500">
                      Document .No
                    </th>
                  </tr>
                </thead>

                {dataListing2?.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center p-10 text-[16px] text-gray-400"
                    >
                      No Record
                    </td>
                  </tr>
                )}
                {dataListing2
                  ?.sort?.((a: any, b: any) => a?.U_Order - b?.U_Order)
                  ?.map((t: any, index: number) => {
                    return (
                      <tbody key={t.id}>
                        <>
                          <tr
                            className=" cursor-default border-b "
                            onClick={() => handleRowClick2(index)}
                          >
                            <td className="py-3 text-left pl-4 ">
                              <span className="text-gray-500">{index + 1}</span>
                            </td>

                            <td className="pr-4 h-[20px]">
                              <span
                                className={`${t?.U_DocType === "S" || t?.U_Type === "S" ? "text-red-500" : "text-gray-500"} text-[13.5px]`}
                              >
                                {t?.U_DocType === "S" || t?.U_Type === "S"
                                  ? t?.U_StopCode || t?.U_ItemCode
                                  : "Drop-Off"}
                              </span>
                            </td>
                            <td className="pr-4">
                              {" "}
                              <span className="text-gray-500 text-[13.5px]">
                                {t?.U_DocType === "S"
                                  ? t?.U_StopCode || t?.U_ItemCode
                                  : t?.U_ShipToCode}
                              </span>
                            </td>
                            <td className="pr-4">
                              {" "}
                              <span className="text-gray-500 text-[13.5px]">
                                {t?.U_DocNum}
                              </span>{" "}
                            </td>
                          </tr>
                        </>
                      </tbody>
                    );
                  })}
              </table>
            </div>
          </div>
        )}
        {confirm ||
        (id &&
          defaultValue?.U_Status !== "I" &&
          dataListing?.length === 0) ? null : (
          <div className="w-full mt-5 text-right">
            <Button
              sx={{ height: "25px" }}
              className="bg-white"
              size="small"
              variant="contained"
              disableElevation
              onClick={() => setConfirm(true)}
            >
              <span className="px-4 text-[11px] py-4 text-white">Confirm</span>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
