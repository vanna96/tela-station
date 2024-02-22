import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import { Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { FaAngleDown } from "react-icons/fa6";
import TRModal from "./ModalTR";
import React from "react";
import { dateFormat } from "@/utilies";
import { FaAngleRight } from "react-icons/fa6";

export default function Document({
  register,
  defaultValue,
  setValue,
  document,
  control,
  detail,
  getValues,
  appendDocument,
  removeDocument,
}: any) {
  const [open, setOpen] = useState(false);
  const [sS, setSS] = useState({ deliver: "", deliverC: "" });

  const handleOpen = () => {
    setOpen(true);
  };

  // const addNewChild = (index: any) => {
  //   const parents: any[] = [...getValues("TL_TR_ROWCollection")];
  //   console.log(parents);

  //   const child = {
  //     ...parents[index],
  //     U_Quantity: null,
  //     U_ShipToCoe: null,
  //     U_DeliveryDate: null,
  //     U_SourceDocEntry: getValues(
  //       `TL_TR_ROWCollection.${index}.U_SourceDocEntry`
  //     ),
  //   };

  //   if (!parents[index]?.U_Children) {
  //     parents[index] = {
  //       ...parents[index],
  //       U_Children: [{ ...parents[index] }, child],
  //     };
  //   } else {
  //     parents[index]["U_Children"] = [...parents[index]["U_Children"], child];
  //   }
  //   // const children = [
  //   //   ...olds,
  //   //   olds?.length === 0 ? {},{}, : {
  //   //     value: "This is child",
  //   //   }
  //   // ];
  //   // parents[index] = { ...parents[index], U_Children: children };
  //   setValue("TL_TR_ROWCollection", parents);
  // };
  const addNewChilds = (index: number) => {
    const parents = [...getValues("TL_TR_ROWCollection")];
    if (!parents[index]["U_Children"]) {
      parents[index]["U_Children"] = [];
    }
    const newChild = {
      ...parents[index],
      U_Quantity: null,
      U_ShipToCode: null,
      U_DeliveryDate: null,
      LineId: undefined,
      U_ParentEntry: parents[index]?.U_SourceDocEntry,
    };
    const newChild1 = {
      ...parents[index],
      U_Quantity: null,
      U_ShipToCode: null,
      U_DeliveryDate: null,
      LineId: undefined,
      U_ParentEntry: parents[index]?.U_SourceDocEntry,
    };
    delete newChild["U_Children"];
    parents[index]["U_Children"] = [
      ...parents[index]["U_Children"],
      newChild,
      newChild1,
    ];
    setValue("TL_TR_ROWCollection", parents);
  };

  const addNewChild = (index: number) => {
    const parents = [...getValues("TL_TR_ROWCollection")];
    if (!parents[index]["U_Children"]) {
      parents[index]["U_Children"] = [];
    }
    const newChild = {
      ...parents[index],
      U_Quantity: null,
      U_ShipToCode: null,
      U_DeliveryDate: null,
      LineId: undefined,
      U_ParentEntry: parents[index]?.U_SourceDocEntry,
    };
    delete newChild["U_Children"];
    parents[index]["U_Children"] = [...parents[index]["U_Children"], newChild];
    setValue("TL_TR_ROWCollection", parents);
  };

  const handleDelete = (parentIndex: number, childIndex: number) => {
    const parents = [...getValues("TL_TR_ROWCollection")];
    if (parents[parentIndex]["U_Children"]) {
      // Filter out the child to be deleted from the U_Children array
      parents[parentIndex]["U_Children"] = parents[parentIndex][
        "U_Children"
      ].filter((_: any, index: any) => index !== childIndex);

      setValue("TL_TR_ROWCollection", parents);
    }
  };

  return (
    <>
      <div className="ml-3">
        <div className={`${detail && "hidden"}`}>
          <Button
            sx={{ height: "30px" }}
            className="bg-white"
            size="small"
            variant="contained"
            disableElevation
            onClick={handleOpen}
          >
            <span className="text-[12px] p-4 inline-block text-white">
              Load Document
            </span>
          </Button>
        </div>
      </div>
      <div className="rounded-lg shadow-sm border pt-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex gap-x-3 items-center mb-5 pb-1">
          <h2 className="mr-3">Source Document</h2>
        </div>
        <div>
          <table className="w-full border-[#dadde0]">
            <thead>
              <tr className="border-[1px] border-[#dadde0]">
                <th className="w-[100px] "></th>
                <th className="w-[180px] text-left font-normal py-2 text-[14px] text-gray-500">
                  Source Document <span className="text-red-500 ml-1">*</span>
                </th>
                <th className="w-[200px] text-left font-normal py-2 text-[14px] text-gray-500">
                  Document Number{" "}
                </th>
                <th className="w-[200px] text-left font-normal py-2 text-[14px] text-gray-500">
                  Item{" "}
                </th>
                <th className="text-left font-normal py-2 text-[14px] text-gray-500">
                  Ship To <span className="text-red-500 ml-1">*</span>
                </th>
                <th className="w-[200px] text-left font-normal py-2 text-[14px] text-gray-500">
                  Delivery Date <span className="text-red-500 ml-1">*</span>
                </th>
                <th className="w-[200px] text-left font-normal py-2 text-[14px] text-gray-500">
                  Quantity{" "}
                </th>
                <th
                  className={`w-[90px] text-center font-normal py-2 text-[14px] text-gray-500 ${detail && "hidden"}`}
                >
                  Action{" "}
                </th>
              </tr>
            </thead>
            <tbody>
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
                    <tr key={index}>
                      <td className="py-5 flex justify-center gap-5 items-center">
                        <div className={`text-gray-700`}>
                          {!e?.U_Children || e?.U_Children?.length === 0 ? (
                            <FaAngleRight color="gray" />
                          ) : (
                            <FaAngleDown color="gray" />
                          )}
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
                          defaultValue={e?.U_DocNum}
                          inputProps={{
                            ...register(`TL_TR_ROWCollection.${index}.DocNum`),
                          }}
                        />
                      </td>
                      <td className="pr-4">
                        <MUITextField
                          disabled={true}
                          placeholder="Item"
                          defaultValue={e?.U_ItemCode}
                          inputProps={{
                            ...register(
                              `TL_TR_ROWCollection.${index}.U_ItemCode`
                            ),
                          }}
                        />
                      </td>
                      {detail ? (
                        <td className="pr-4">
                          <MUITextField
                            onClick={() => addNewChilds(index)}
                            placeholder="Ship To"
                            inputProps={{
                              ...register(
                                `TL_TR_ROWCollection.${index}.U_ShipToCode`,
                                { require: "Ship To is required" }
                              ),
                            }}
                            defaultValue={e?.U_ShipToCode}
                            disabled={true}
                          />
                        </td>
                      ) : (
                        <td className="pr-4">
                          {" "}
                          <MUITextField
                            onClick={() => addNewChilds(index)}
                            placeholder="Ship To"
                            inputProps={{
                              ...register(
                                `TL_TR_ROWCollection.${index}.U_ShipToCode`
                              ),
                            }}
                            defaultValue={e?.U_ShipToCode}
                            endAdornment={
                              e?.U_Children?.length === 0 || !e?.U_Children
                                ? true
                                : false
                            }
                            disabled={
                              e?.U_Children?.length === 0 || !e?.U_Children
                                ? false
                                : true
                            }
                          />
                        </td>
                      )}

                      <td className="pr-4 pb-1">
                        {detail ? (
                          <MUITextField
                            placeholder="Delivery Date"
                            defaultValue={dateFormat(e?.U_DeliveryDate)}
                            disabled={true}
                          />
                        ) : (
                          <Controller
                            name="U_DeliveryDate"
                            control={control}
                            render={({ field }) => {
                              return (
                                <MUIDatePicker
                                  {...field}
                                  onChange={(e) => {
                                    if (e !== null) {
                                      const val =
                                        e.toLowerCase() ===
                                        "Invalid Date".toLocaleLowerCase()
                                          ? ""
                                          : e;
                                      setValue(
                                        `TL_TR_ROWCollection.${index}.U_DeliveryDate`,
                                        `${val == "" ? "" : val}`
                                      );
                                      setSS({ ...sS, deliver: val });
                                    }
                                  }}
                                  value={sS?.deliver || e?.U_DeliveryDate}
                                />
                              );
                            }}
                          />
                        )}
                      </td>
                      <td className="">
                        <MUITextField
                          disabled={true}
                          inputProps={{
                            ...register(
                              `TL_TR_ROWCollection.${index}.U_Quantity`
                            ),
                          }}
                          placeholder="Quantity"
                          defaultValue={e?.U_Quantity}
                        />
                      </td>
                      <td className={`text-center ${detail && "hidden"}`}>
                        <div
                          onClick={() => removeDocument(index)}
                          className={`w-[17px] cursor-pointer mx-auto transition-all duration-300 shadow-md shadow-[#878484] h-[17px] bg-red-500 text-white rounded-sm flex justify-center items-center hover:shadow-lg hover:shadow-slate-600`}
                        >
                          -
                        </div>
                      </td>
                    </tr>

                    {e?.U_Children?.map((child: any, childIndex: number) => (
                      <>
                        <tr key={`${index}_child_${childIndex}`}>
                          <td className="pr-4"></td>
                          <td className="pr-4"></td>
                          <td className="pr-4"></td>
                          <td className="pr-4"></td>
                          <td className="pr-4">
                            <div className="pb-2">
                              <MUITextField
                                placeholder="Ship To"
                                defaultValue={child?.U_ShipToCode}
                                disabled={detail}
                                inputProps={{
                                  ...register(
                                    `TL_TR_ROWCollection.${index}.U_Children.${childIndex}.U_ShipToCode`,
                                    { required: "Ship To is required" }
                                  ),
                                }}
                              />
                            </div>
                          </td>
                          <td className="pr-4 pb-2">
                            {/* <MUITextField
                              placeholder="Delivery Date"
                              name="TL_TR_Collections.${index}.U_Children.${index}.U_DeliveryDate"
                              defaultValue={child?.U_DeliveryDate}
                            /> */}
                            {detail ? (
                              <MUITextField
                                placeholder="Delivery Date"
                                defaultValue={dateFormat(child?.U_DeliveryDate)}
                                disabled={true}
                              />
                            ) : (
                              <Controller
                                // rules={{
                                //   required: "Delivery Date is required",
                                // }}
                                name="U_DeliveryDate"
                                control={control}
                                render={({ field }) => {
                                  return (
                                    <MUIDatePicker
                                      {...field}
                                      onChange={(e) => {
                                        if (e !== null) {
                                          const val =
                                            e.toLowerCase() ===
                                            "Invalid Date".toLocaleLowerCase()
                                              ? ""
                                              : e;
                                          setValue(
                                            `TL_TR_ROWCollection.${index}.U_Children.${childIndex}.U_DeliveryDate`,
                                            `${val == "" ? "" : val}`
                                          );
                                          setSS({ ...sS, deliverC: val });
                                        }
                                      }}
                                      value={
                                        sS?.deliverC || child?.U_DeliveryDate
                                      }
                                    />
                                  );
                                }}
                              />
                            )}
                          </td>
                          <td className="">
                            <MUITextField
                              placeholder="Quantity"
                              disabled={detail}
                              inputProps={{
                                ...register(
                                  `TL_TR_ROWCollection.${index}.U_Children.${childIndex}.U_Quantity`
                                ),
                              }}
                              defaultValue={child?.U_Quantity}
                            />
                          </td>
                          <td className={`text-center ${detail && "hidden"}`}>
                            <div
                              onClick={() => handleDelete(index, childIndex)}
                              className={`w-[17px] cursor-pointer mx-auto transition-all duration-300 shadow-md shadow-[#878484] h-[17px] bg-red-500 text-white rounded-sm flex justify-center items-center hover:shadow-lg hover:shadow-slate-600`}
                            >
                              -
                            </div>
                          </td>
                        </tr>
                      </>
                    ))}
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      {e.U_Children && e.U_Children.length > 0 ? (
                        <td colSpan={4} className="">
                          <div className={`pt-1 ${detail && "hidden"}`}>
                            <Button
                              onClick={() => addNewChild(index)}
                              sx={{ height: "25px" }}
                              className="bg-white"
                              size="small"
                              variant="outlined"
                              disableElevation
                            >
                              <span className="inline-block w-[80px]">Add</span>
                            </Button>
                          </div>
                        </td>
                      ) : null}
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <TRModal
        setValue={setValue}
        document={document}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
