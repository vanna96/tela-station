import DocumentNumberAutoComplete from "@/components/input/DocumentNumberAutoComplete";
import MUITextField from "@/components/input/MUITextField";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { FaAngleDown } from "react-icons/fa6";
import { useLocation, useParams } from "react-router-dom";

export default function Compartment({
  register,
  defaultValue,
  setValue,
  commer,
  defaultValues,
  control,
  getValues,
  detail,
  watch,
  compartment,
  document,
  itemCodes
}: any) {
  const [loading, setLoading] = useState(false);
const {id}=useParams()
  const L = () => {
    return <div className="text-lg w-[15px] pl-1 text-center">L</div>;
  };
  const location = useLocation();
  const create = location.pathname?.split("/");
  return (
    <>
      <div className="rounded-lg shadow-sm border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex gap-x-3 items-center mb-5 pb-1">
          <h2 className="mr-3">Compartments</h2>
        </div>
        <div>
          {/* {loading ? (
            <p>Loading...</p>
          ) : compartment.length === 0 ? (
            <p>No records found.</p>
          ) : ( */}
          <table className="border w-full shadow-sm bg-white border-[#dadde0]">
            {/* Table header */}
            <thead>
              <tr className="border-[1px] border-[#dadde0]">
                <th className="w-[100px] "></th>
                <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                  Document Number
                </th>
                <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                  Product
                </th>
                <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                  Volume Litre
                </th>
                <th className="w-[200px] text-left font-normal  py-2 text-[14px] text-gray-500">
                  Comp. Number
                </th>
                <th className="w-[200px] text-left font-normal py-2 text-[14px] text-gray-500">
                  Bottom Hatch
                </th>
                <th className=" text-left font-normal py-2 text-[14px] text-gray-500">
                  Top Hatch
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
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
              ) : compartment?.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center p-10 text-[16px] text-gray-400"
                  >
                    No Record
                  </td>
                </tr>
              ) : (
                compartment.map((e: any, index: number) => (
                  <>
                    <tr key={e?.id}>
                      <td className="py-5 flex justify-center gap-5 items-center">
                        <span className="text-gray-500">{index + 1}</span>
                      </td>
                      <td className="pr-4">
                        <Controller
                          name="U_DocNum"
                          control={control}
                          render={({ field }) => {
                            return (
                              <DocumentNumberAutoComplete
                                disabled={detail || id}
                                document={document}
                                {...field}
                                onChange={(e) => {
                                  setValue(
                                    `TL_TO_COMPARTMENTCollection.${index}.U_DocNum`,
                                    e?.U_DocNum
                                  );
                                  //  setValue(
                                  //    `TL_TO_COMPARTMENTCollection.${index}.U_ItemCode`,
                                  //    e?.U_DocNum
                                  //  );
                                }}
                                value={watch("U_DocNum") || e?.U_DocNum}
                              />
                            );
                          }}
                        />
                      </td>
                      <td className="pr-4">
                        <MUITextField
                          disabled={true}
                          placeholder="Product"
                          inputProps={{
                            value:itemCodes,
                            ...register(
                              `TL_TO_COMPARTMENTCollection.${index}.U_ItemCode`
                            ),
                          }}
                        />
                      </td>
                      <td className="pr-4">
                        <MUITextField
                          disabled={detail || id}
                          placeholder="Volume Litre"
                          inputProps={{
                            defaultValue: e?.U_VOLUME,
                            ...register(
                              `TL_TO_COMPARTMENTCollection.${index}.U_Volume`
                            ),
                          }}
                          startAdornment={L()}
                        />
                      </td>
                      <td className="pr-4">
                        <MUITextField
                          disabled={true}
                          placeholder="Compartment Number"
                          inputProps={{
                            defaultValue: e?.U_CM_NO,
                            ...register(
                              `TL_TO_COMPARTMENTCollection.${index}.U_Compartment`
                            ),
                          }}
                        />
                      </td>
                      <td className="pr-4">
                        <MUITextField
                          disabled={true}
                          placeholder="Bottom Hatch"
                          inputProps={{
                            defaultValue: e?.U_BOTTOM_HATCH,
                            ...register(
                              `TL_TO_COMPARTMENTCollection.${index}.U_BottomHatch`
                            ),
                          }}
                        />
                      </td>
                      <td className="pr-4">
                        <MUITextField
                          disabled={true}
                          placeholder="Top Hatch"
                          inputProps={{
                            defaultValue: e?.U_TOP_HATCH,
                            ...register(
                              `TL_TO_COMPARTMENTCollection.${index}.U_TopHatch`
                            ),
                          }}
                        />
                      </td>
                    </tr>
                    {e?.U_Children?.map((e: any, indexC: number) => {
                      return (
                        <>
                          <tr className="bg-zinc-50 border-t border-[#dadde0]">
                            <th></th>
                            <th className="w-[200px] text-left font-normal  py-2 pt-3 text-[14px] text-gray-500">
                              Seal Number
                            </th>
                            <th
                              colSpan={5}
                              className="w-[200px] text-left font-normal  py-2 pt-3 text-[14px] text-gray-500"
                            >
                              Seal Reference
                            </th>
                          </tr>
                          <tr className="bg-zinc-50">
                            <td></td>
                            <td className="pr-4">
                              <MUITextField
                                disabled={
                                  create?.at(-1) === "create"
                                    ? false
                                    : id && defaultValues?.U_Status === "S"
                                      ? false
                                      : detail || true
                                }
                                className="bg-white"
                                placeholder="Seal Number"
                                inputProps={{
                                  defaultValue: e?.U_SealNumber,
                                  ...register(
                                    `TL_TO_COMPARTMENTCollection.${index}.U_Children.${indexC}.U_SealNumber`
                                  ),
                                }}
                              />
                            </td>
                            <td colSpan={5}>
                              <MUITextField
                                disabled={
                                  create?.at(-1) === "create"
                                    ? false
                                    : id && defaultValues?.U_Status === "S"
                                      ? false
                                      : detail || true
                                }
                                className="bg-white"
                                placeholder="Seal Reference"
                                inputProps={{
                                  defaultValue: e?.U_SealReference,
                                  ...register(
                                    `TL_TO_COMPARTMENTCollection.${index}.U_Children.${indexC}.U_SealReference`
                                  ),
                                }}
                              />
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </>
                ))
              )}
            </tbody>
          </table>
          {/* )} */}
        </div>
      </div>
    </>
  );
}
