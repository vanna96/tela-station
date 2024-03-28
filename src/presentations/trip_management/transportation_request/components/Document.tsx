import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import { Button, Checkbox } from "@mui/material";
import { Controller } from "react-hook-form";
import { FaAngleDown } from "react-icons/fa6";
import TRModal from "./ModalTR";
import { dateFormat } from "@/utilies";
import { FaAngleRight } from "react-icons/fa6";
import ShipToAutoComplete from "@/components/input/ShipToAutoComplete";
import { useParams } from "react-router-dom";

export type TRSourceDocument = {
  U_SourceDocEntry: number;
  // SourceId: string;
  U_SourceLineId: number;
  U_DocNum: number;
  U_Type: string;
  U_BPLId: number;
  U_BPLName: string;
  U_CardCode: string;
  U_CardName: string;
  U_DeliveryDate: string;
  U_ShipToCode: null | string;
  U_ItemCode: string;
  U_ShipToAddress: null | string;
  U_ItemName: string | undefined;
  U_Quantity: number;
  U_UomCode: string;
  U_UomAbsEntry: number;
  U_Status?: string | undefined;
  U_Reference?: string | any;
  U_Children?: any[] | any;
};

export default function Document({
  register,
  setValue,
  document,
  control,
  detail,
  getValues,
  open,
  setOpen,
  watch,
  removeDocument,
}: any) {
  const { id } = useParams();
  const handleOpen = () => {
    setOpen(true);
  };

  const addNewChilds = (index: number) => {
    const parents = [...getValues("TL_TR_ROWCollection")];
    if (!parents[index]["U_Children"]) {
      parents[index]["U_Children"] = [];
    }
    const newChild = {
      ...parents[index],
      U_Quantity: 0,
      U_ShipToCode: null,
      U_DeliveryDate: null,
      LineId: undefined,
      U_Status: "O",
      U_ParentEntry: parents[index]?.U_SourceDocEntry,
    };
    const newChild1 = {
      ...parents[index],
      U_Quantity: 0,
      U_ShipToCode: null,
      U_DeliveryDate: null,
      LineId: undefined,
      U_Status: "O",
      U_ParentEntry: parents[index]?.U_SourceDocEntry,
    };
    delete newChild["U_Children"];
    delete newChild1["U_Children"];
    parents[index]["U_Children"] = [
      ...parents[index]["U_Children"],
      newChild,
      newChild1,
    ];
    setValue("TL_TR_ROWCollection", parents);
  };

  const addNewChild = (index: number) => {
    const parents = [...getValues("TL_TR_ROWCollection")];
    const newChild = {
      ...parents[index],
      U_Quantity: 0,
      U_ShipToCode: null,
      U_DeliveryDate: null,
      LineId: undefined,
      U_Children: undefined,
      U_Status: "O",
      U_ParentEntry: parents[index]?.U_SourceDocEntry,
    };
    parents[index]["U_Children"] = [...parents[index]["U_Children"], newChild];
    setValue("TL_TR_ROWCollection", parents);
  };
  // IS PATENT CHECKED
  const isParentSelected = (index: number) => {
    const parents = [...getValues("TL_TR_ROWCollection")];
    if (parents[index].U_Children?.length > 0) {
      return parents[index].U_Children?.every((e: any) => e?.checked);
    } else if (
      !parents[index].U_Children ||
      parents[index].U_Children?.length === 0
    ) {
      return parents[index]?.checked;
    }
  };
  // SELECT PATENT
  const selectParent = (event: any, index: number) => {
    let arr = [...getValues("TL_TR_ROWCollection")];
    arr[index] = {
      ...arr[index],
      checked: event?.target?.checked,
      U_Children:
        arr[index]?.U_Children?.map((e: any) => ({
          ...e,
          checked: event.target?.checked,
        })) ?? [],
    };
    setValue("TL_TR_ROWCollection", arr);
  };
  // SELECT CHILD
  const selectChangeChild = (event: any, pIndex: number, cIndex: number) => {
    let temps: any[] = [...getValues("TL_TR_ROWCollection")];

    temps[pIndex]["U_Children"][cIndex] = {
      ...temps[pIndex]["U_Children"][cIndex],
      checked: event.target.checked,
    };
    
    setValue("TL_TR_ROWCollection", temps);
  };
  //REMOVE
  const removeItems = () => {
    let newItem = [...getValues("TL_TR_ROWCollection")];
    newItem = newItem
      ?.filter((e) => !e?.checked)
      ?.map((e) => ({
        ...e,
        U_Children: e?.U_Children?.filter((c: any) => !c?.checked),
      }));
    setValue("TL_TR_ROWCollection", newItem);
  };

  return (
    <>
      <div className="ml-3"></div>
      <div className="rounded-lg shadow-sm border pt-6 pb-6 ml-3 px-8 h-full">
        <div className="font-medium text-lg flex gap-x-3 items-center mb-5 pb-1 justify-between">
          <div className="flex items-center justify-center">
            <h2 className="mr-3">Source Document</h2>
            <div className={`${detail && "hidden"}`}>
              <Button
                sx={{ height: "25px" }}
                className="bg-white"
                size="small"
                variant="contained"
                disableElevation
                onClick={handleOpen}
              >
                <span className="text-[11px] p-3 inline-block text-white">
                  Load Document
                </span>
              </Button>
            </div>
          </div>

          <Button
            variant="outlined"
            onClick={removeItems}
            className="px-4 border-gray-400"
          >
            <span className="px-2 text-xs">Remove</span>
          </Button>
        </div>
        <div>
          <table className="w-full border border-[#dadde0]">
            <thead>
              <tr className="border-[1px] border-[#dadde0]">
                <th className="w-[40px] "></th>
                <th className="w-[40px] "></th>
                <th className="w-[180px] text-left font-normal py-2 text-[14px] text-gray-500">
                  Source Document{" "}
                  <span className={`${detail && "hidden"} text-red-500`}>
                    *
                  </span>
                </th>
                <th className="w-[180px] text-left font-normal py-2 text-[14px] text-gray-500">
                  Document Number{" "}
                </th>
                <th className="w-[180px] text-left font-normal py-2 text-[14px] text-gray-500">
                  Item{" "}
                </th>
                <th className="w-[180px] text-left font-normal py-2 text-[14px] text-gray-500">
                  Ship To{" "}
                  <span className={`${detail && "hidden"} text-red-500`}>
                    *
                  </span>
                </th>
                <th className="w-180px] text-left font-normal py-2 text-[14px] text-gray-500">
                  Delivery Date{" "}
                  <span className={`${detail && "hidden"} text-red-500`}>
                    *
                  </span>
                </th>
                <th className="w-[180px] text-left font-normal py-2 text-[14px] text-gray-500">
                  Quantity{" "}
                  <span className={`${detail && "hidden"} text-red-500`}>
                    *
                  </span>
                </th>
                {/* <th
                  className={`w-[90px] text-center font-normal py-2 text-[14px] text-gray-500 ${detail && "hidden"}`}
                >
                  Action{" "}
                </th> */}
              </tr>
            </thead>
            <tbody>
              {document && document?.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center p-10 text-[16px] text-gray-400"
                  >
                    No Record
                  </td>
                </tr>
              )}
              {document?.map((e:any, index: number) => {
                return (
                  <>
                    <tr key={index}>
                      <td className="pl-3">
                        <span className="text-gray-500">
                          <Checkbox
                            onChange={(c) => selectParent(c, index)}
                            checked={e?.checked ?? false}
                            className=""
                            size="small"
                          />
                        </span>
                      </td>
                      <td className="py-3 flex justify-center gap-5 items-center">
                        <div className={`text-gray-700`}>
                          {!e?.U_Children || e?.U_Children?.length === 0 ? (
                            <FaAngleRight color="gray" />
                          ) : (
                            <FaAngleDown color="gray" />
                          )}
                        </div>
                      </td>
                      <td className="pr-4">
                        <span className="text-gray-500 text-[13.5px]">
                          {e?.U_Type === "ITR"
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
                      {detail || watch("U_Status") === "C" ? (
                        <td className="pr-4">
                          <MUITextField
                            onClick={() => addNewChilds(index)}
                            placeholder="Ship To"
                            inputProps={{
                              ...register(
                                `TL_TR_ROWCollection.${index}.U_ShipToCode`
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
                                `TL_TR_ROWCollection.${index}.U_ShipToCode`,
                                { require: "Ship To is required" }
                              ),
                            }}
                            defaultValue={e?.U_ShipToCode}
                            endAdornment={
                              e?.U_Children?.length === 0 || !e?.U_Children
                                ? true
                                : false
                            }
                            disabled={
                              e?.U_Type === "ITR"
                                ? true
                                : e?.U_Children?.length === 0 || !e?.U_Children
                                  ? false
                                  : true
                            }
                          />
                        </td>
                      )}

                      <td className="pr-4">
                        {detail ||
                        e?.U_Children?.length > 0 ||
                        watch("U_Status") === "C" ? (
                          <MUITextField
                            placeholder="Delivery Date"
                            value={dateFormat(e?.U_DeliveryDate)}
                            disabled={true}
                            inputProps={{
                              ...register(
                                `TL_TR_ROWCollection.${index}.U_DeliveryDate`
                              ),
                            }}
                          />
                        ) : (
                          <Controller
                            rules={{
                              required: "Delivery Date is required",
                            }}
                            name={`TL_TR_ROWCollection.${index}.U_DeliveryDate`}
                            control={control}
                            render={({ field }) => {
                              return (
                                <MUIDatePicker
                                  {...field}
                                  onChange={(d) => {
                                    if (d !== null) {
                                      const val =
                                        d.toLowerCase() ===
                                        "Invalid Date".toLocaleLowerCase()
                                          ? ""
                                          : d;
                                      setValue(
                                        `TL_TR_ROWCollection.${index}.U_DeliveryDate`,
                                        `${val == "" ? "" : val}`
                                      );
                                    }
                                  }}
                                  value={
                                    watch(
                                      `TL_TR_ROWCollection.${index}.U_DeliveryDate`
                                    ) || e?.U_DeliveryDate
                                  }
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
                      {/* <td
                        className={`text-center ${(detail || watch("U_Status") === "C" || e?.U_Children?.length > 0) && "hidden"}`}
                      >
                        <div
                          onClick={() => removeDocument(index)}
                          className={`w-[17px] cursor-pointer mx-auto transition-all duration-300 shadow-md shadow-[#878484] h-[17px] bg-red-500 text-white rounded-sm flex justify-center items-center hover:shadow-lg hover:shadow-slate-600`}
                        >
                          -
                        </div>
                      </td> */}
                    </tr>

                    {e?.U_Children?.map((child: any, childIndex: number) => {
                      return (
                        <>
                          <tr
                            className=""
                            key={`${childIndex}_child_${childIndex}`}
                          >
                            <td className="">
                              <span className="text-gray-500 ml-[11px]">
                                <Checkbox
                                  onChange={(e) =>
                                    selectChangeChild(e, index, childIndex)
                                  }
                                  checked={child?.checked ?? false}
                                  className=""
                                  size="small"
                                />
                              </span>
                            </td>
                            <td className="pr-4"></td>
                            <td className="pr-4"></td>
                            <td className="pr-4"></td>
                            <td className="pr-4">
                              <div className="pb-2">
                                {e?.U_Type === "ITR" ||
                                child?.U_Status === "C" ||
                                watch("U_Status") === "C" ||
                                detail ? (
                                  <MUITextField
                                    placeholder="Delivery Date"
                                    value={e?.U_ShipToCode}
                                    disabled={true}
                                    inputProps={{
                                      ...register(
                                        `TL_TR_ROWCollection.${index}.U_Children.${childIndex}.U_ShipToCode`
                                      ),
                                    }}
                                  />
                                ) : (
                                  <Controller
                                    rules={{
                                      required: "Ship To is required",
                                    }}
                                    name={`TL_TR_ROWCollection.${index}.U_Children.${childIndex}.U_ShipToCode`}
                                    control={control}
                                    render={({ field }) => {
                                      return (
                                        <ShipToAutoComplete
                                          cardCode={e?.U_CardCode}
                                          {...field}
                                          onChange={(e: any) => {
                                            setValue(
                                              `TL_TR_ROWCollection.${index}.U_Children.${childIndex}.U_ShipToCode`,
                                              e?.AddressID
                                            );
                                          }}
                                          value={child?.U_ShipToCode}
                                        />
                                      );
                                    }}
                                  />
                                )}
                              </div>
                            </td>
                            <td className="pr-4 pb-2">
                              {detail ||
                              child?.U_Status === "C" ||
                              watch("U_Status") === "C" ? (
                                <MUITextField
                                  placeholder="Delivery Date"
                                  defaultValue={dateFormat(
                                    child?.U_DeliveryDate
                                  )}
                                  disabled={true}
                                />
                              ) : (
                                <Controller
                                  rules={{
                                    required: "Delivery Date is required",
                                  }}
                                  name={`TL_TR_ROWCollection.${index}.U_Children.${childIndex}.U_DeliveryDate`}
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
                                          }
                                        }}
                                        value={
                                          watch(
                                            `TL_TR_ROWCollection.${index}.U_Children.${childIndex}.U_DeliveryDate`
                                          ) || child?.U_DeliveryDate
                                        }
                                      />
                                    );
                                  }}
                                />
                              )}
                            </td>
                            <td className="">
                              <MUITextField
                                type="number"
                                placeholder="Quantity"
                                disabled={
                                  detail ||
                                  child?.U_Status === "C" ||
                                  watch("U_Status") === "C"
                                }
                                inputProps={{
                                  ...register(
                                    `TL_TR_ROWCollection.${index}.U_Children.${childIndex}.U_Quantity`
                                  ),
                                }}
                                defaultValue={child?.U_Quantity}
                              />
                            </td>
                            {/* <td
                              className={`text-center ${(child?.U_Status === "C" || detail || watch("U_Status") === "C") && "hidden"}`}
                            >
                              <div
                                onClick={() => handleDelete(index, childIndex)}
                                className={`w-[17px] cursor-pointer mx-auto transition-all duration-300 shadow-md shadow-[#878484] h-[17px] bg-red-500 text-white rounded-sm flex justify-center items-center hover:shadow-lg hover:shadow-slate-600`}
                              >
                                -
                              </div>
                            </td> */}
                          </tr>
                        </>
                      );
                    })}
                    <tr className="">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      {e.U_Children && e.U_Children.length > 0 ? (
                        <td colSpan={4} className="">
                          <div
                            className={`mb-[5.5px] ${(watch("U_Status") === "C" || detail) && "hidden"}`}
                          >
                            <Button
                              onClick={() => addNewChild(index)}
                              sx={{ height: "25px" }}
                              className="bg-white"
                              size="small"
                              variant="outlined"
                              disableElevation
                            >
                              <span className="inline-block w-[80px]">
                                + Add
                              </span>
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
        watch={watch}
        setValue={setValue}
        document={document}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
