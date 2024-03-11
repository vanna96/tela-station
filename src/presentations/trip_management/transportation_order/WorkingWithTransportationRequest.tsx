import request, { url } from "@/utilies/request";
import React, { Fragment, useEffect, useState } from "react";
import { useQuery } from "react-query";
import MUITextField from "@/components/input/MUITextField";
import { Button, Checkbox } from "@mui/material";
import MUISelect from "@/components/selectbox/MUISelect";
import { FaAngleDown } from "react-icons/fa";
import { dateFormat } from "@/utilies";
import { LoadingButton } from "@mui/lab";
import GenerateToModal from "./GenerateToModal";
import BaseStationAutoComplete from "@/components/input/BaseStationAutoComplete";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import { CircularProgress } from "@mui/material";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useLocation, useNavigate } from "react-router-dom";
import FormMessageModal from "@/components/modal/FormMessageModal";
import ItemModal from "./ItemModal";
import { FaDatabase } from "react-icons/fa";
import SelectPage from "../bulk_seal_allocation/SelectPage";
import OnlyDiaLog from "./OnlyDiaLog";

let dialog = React.createRef<OnlyDiaLog>();
export default function WorkingWithTransportationRequest() {
  const [searchValues, setSearchValues] = React.useState({
    Terminal: "",
    Item: "",
    StartDate: "",
  });
  const [open, setOpen] = useState(false);
  const [openItem, setOpenItem] = useState(false);
  const [document, setDocument] = useState<any>([]);
  const [stockStatus, setStockStatus] = useState<any[]>([]);
  const [toggledChildren, setToggledChildren] = useState<number[]>([]);
  const [openLoading, setOpenLoading] = useState(false);
  const [selectedData, setSelectedData] = useState([]);

  const route = useNavigate();
  const toggleChild = (index: number) => {
    if (toggledChildren.includes(index)) {
      setToggledChildren(toggledChildren.filter((i) => i !== index));
    } else {
      setToggledChildren([...toggledChildren, index]);
    }
  };

  const { data }: any = useQuery({
    queryKey: ["SalesPersons"],
    queryFn: async () => {
      const response: any = await request("GET", `/SalesPersons`)
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    cacheTime: 0,
    staleTime: 0,
  });
  const branchAss: any = useQuery({
    queryKey: ["branchAss"],
    queryFn: () => new BranchBPLRepository().get(),
    staleTime: Infinity,
  });
  const getDocument = async () => {
    setOpenLoading(true);
    const payload = {
      Terminal: searchValues?.Terminal,
      StartDate: searchValues?.StartDate,
      ItemCode: searchValues?.Item,
    };
    await request("POST", `/script/test/get-tr-documents`, payload).then(
      (res: any) => {
        setDocument(res?.data?.Documents ?? []);
        getBin(res?.data?.Items as any[], res?.data?.DefaultBinId);
      }
    );
  };

  const getBin = async (items: any[], binId: number) => {
    let bin: any[] = [...items];
    let index = 0;
    for (const item of items) {
      const res: any = await request(
        "GET",
        `/sml.svc/GETBIN?$filter=WhsCode eq '${searchValues.Terminal}' and ItemCode eq '${item?.ItemCode}' and BinID eq ${binId}`
      );

      bin[index]["QuantityOnHand"] = res?.data?.value?.at(0)?.OnHandQty ?? 0;
      index++;
    }

    setStockStatus(bin);
    setOpenLoading(false);
  };

  useEffect(() => {
    if (document) {
      setToggledChildren(document?.map((d: any, i: number) => i));
    }
  }, [document]);

  useEffect(() => {
    if (document) setCurrentData(document?.slice(startIndex, endIndex));
  }, [document]);
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(document?.length / itemsPerPage);
  const handleFirstPage = () => setCurrentPage(1);
  const handlePrevPage = () => setCurrentPage(currentPage - 1);
  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handleChangeItemsPerPage = (e: any) => {
    const newItemsPerPage = parseInt(e.target.value);
    setCurrentPage(1);
    setItemsPerPage(newItemsPerPage);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [currentData, setCurrentData] = useState<any>([]);
  // const currentData = document?.slice(startIndex, endIndex);
  const isParentSelected = (index: number) =>
    currentData[index].TL_TR_ROWCollection?.every((e: any) => e?.checked);

  const selectParent = (event: any, index: number) => {
    let arr = [...currentData];
    arr[index]["TL_TR_ROWCollection"] = arr[index].TL_TR_ROWCollection.map(
      (e: any) => ({
        ...e,
        checked: event.target?.checked,
      })
    );
    setCurrentData(arr);
  };

  const selectChangeChild = (event: any, pIndex: number, cIndex: number) => {
    let temps: any[] = [...currentData];
    console.log(cIndex, pIndex);

    temps[pIndex]["TL_TR_ROWCollection"][cIndex] = {
      ...temps[pIndex]["TL_TR_ROWCollection"][cIndex],
      checked: event.target.checked,
    };

    setCurrentData(temps);
  };
  const handleOpenGenerateto = () => {
    for (const item of stockStatus) {
      if (item?.OrderQuantity > item?.QuantityOnHand) {
        dialog.current?.error(
          `Inventory quantity falls into negative on '${item?.ItemCode}'.` ??
            "Oops, something went wrong!",
          "Invalid Value"
        );
        return;
      }
    }
    setOpen(true);
    const filteredData = currentData
      .map((e: any) => ({
        ...e,
        TL_TR_ROWCollection: e.TL_TR_ROWCollection.filter(
          (c: any) => c.checked
        ),
      }))
      .filter((e: any) => e.TL_TR_ROWCollection.length > 0);
    setSelectedData(filteredData);
  };

  return (
    <>
      <div className="w-full h-full px-6 py-2 flex flex-col gap-1 relative bg-red-40">
        <div className="grow">
          <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2">
            <h3 className="text-base 2xl:text-base xl:text-base ">
              Trip Management / Working Transportation Request{" "}
            </h3>
          </div>
          <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
            <div className="col-span-10">
              <div className="grid grid-cols-12  space-x-4">
                <div className="col-span-3 2xl:col-span-3">
                  <div className="">
                    <label
                      htmlFor="Code"
                      className="text-gray-500 text-[14.1px] mb-[0.5px] inline-block"
                    >
                      Terminal
                    </label>
                  </div>
                  <BaseStationAutoComplete
                    value={searchValues?.Terminal}
                    onChange={(e: any) => {
                      setSearchValues({
                        ...searchValues,
                        Terminal: e,
                      });
                    }}
                  />
                </div>

                <div className="col-span-3 2xl:col-span-3">
                  <MUITextField
                    type="string"
                    label="Items"
                    className="bg-white"
                    autoComplete="off"
                    value={searchValues.Item}
                    onChange={(e) =>
                      setSearchValues({
                        ...searchValues,
                        Item: e.target.value,
                      })
                    }
                    endAdornment
                    onClick={() => setOpenItem(true)}
                  />
                </div>
                <div className="col-span-3 2xl:col-span-3">
                  <div className="-mt-1">
                    <label
                      htmlFor="Code"
                      className="text-gray-500 text-[14.1px] inline-block"
                    >
                      Delivery Date
                    </label>
                  </div>
                  <MUIDatePicker
                    value={searchValues?.StartDate}
                    onChange={(e: any) => {
                      const val =
                        e.toLowerCase() === "Invalid Date".toLocaleLowerCase()
                          ? ""
                          : e;
                      setSearchValues({
                        ...searchValues,
                        StartDate: val ? val : "",
                      });
                    }}
                  />
                </div>
                <div className="col-span-3 pl-5 items-end mb-[5px] flex 2xl:col-span-3">
                  <Button
                    style={{ height: "30px" }}
                    variant="contained"
                    size="small"
                    onClick={getDocument}
                  >
                    <span className="text-[11px] p-3 inline-block text-white">
                      Load Document
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {currentData?.length === 0 && stockStatus?.length === 0 ? (
            <div className="w-full h-[60vh] rounded border flex flex-col justify-center items-center gap-4 shadow-sm">
              <span className="text-gray-300 text-[50px] ">
                {" "}
                <FaDatabase />
              </span>
              <h3 className="font-bold text-md">No Data Available</h3>
              <span className="text-sm text-gray-500">
                There is no data to show you right now !
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-[2.2rem] mt-5 mx-2 anime">
              {/* table 2 */}
              <div className="col-span-1">
                <div className="grow">
                  <span className="text-[14px] font-semibold mb-4 inline-block">
                    Stock Status
                  </span>
                  <table className="border table-fixed w-full shadow-sm bg-white border-[#dadde0]">
                    <thead>
                      <tr className="border-[1px] border-[#dadde0] font-semibold text-black bg-zinc-50">
                        <th className="w-[200px] text-left font-normal  py-2 pl-5 text-[14px] ">
                          Item NO
                        </th>

                        <th className="w-[200px] text-left font-normal  py-2 text-[14px] ">
                          Total. Order
                        </th>
                        <th className="w-[200px] text-left font-normal  py-2 text-[14px] ">
                          Stock on hand
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockStatus?.map((e: any, index: number) => (
                        <tr
                          className="text-sm border-b border-zinc-200"
                          key={index}
                        >
                          <td className="py-3 pl-5">
                            <span>{e?.ItemCode}</span>
                          </td>
                          <td
                            className={
                              e?.OrderQuantity > e.QuantityOnHand
                                ? "text-red-500"
                                : ""
                            }
                          >
                            <span>{Number(e?.OrderQuantity)?.toFixed(2)}</span>
                          </td>
                          <td>
                            <span
                              className={`${index === 4 && "text-red-500"}`}
                            >
                              {e?.QuantityOnHand}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-span-1">
                {" "}
                <div className="grid grid-cols-4 gap-7">
                  <div>
                    <span className="text-[14px] font-semibold mb-4 inline-block">
                      No. TR
                    </span>
                    <div className="h-[8rem] border-[2px] bg-zinc-50 rounded flex justify-center items-center font-bold text-[1.6rem]">
                      {document?.length}
                    </div>
                  </div>
                  <div>
                    <span className="text-[14px] font-semibold mb-4 inline-block">
                      No. Item
                    </span>
                    <div className="h-[8rem] border-[2px] bg-zinc-50 rounded flex justify-center items-center font-bold text-[1.6rem]">
                      {stockStatus?.length}
                    </div>
                  </div>
                </div>
              </div>
              {/* Table Document*/}
              <div className="col-span-2">
                <div className="grow">
                  {" "}
                  <div className="max-h-[52vh] border w-full overflow-y-auto">
                    <table className="w-full shadow-sm bg-white">
                      <tr className="sticky top-0 z-50 bg-white shadow-sm drop-shadow-sm ">
                        <th className="w-[90px] text-right font-normal  py-2 text-[14px] text-gray-500">
                          No
                        </th>

                        <th className="w-[230px] border-r text-center font-normal  py-2 text-[14px] text-gray-500">
                          Document Number
                        </th>
                        <th className="w-[230px]  border-r text-center font-normal  py-2 text-[14px] text-gray-500">
                          Requester{" "}
                        </th>
                        <th className="w-[230px]  border-r text-center font-normal  py-2 text-[14px] text-gray-500">
                          Branch
                        </th>
                        <th className=" border-r text-center font-normal  py-2 text-[14px] text-gray-500">
                          To Terminal
                        </th>
                        <th
                          colSpan={2}
                          className="  border-r text-center font-normal py-2 text-[14px] text-gray-500"
                        >
                          Requested Date
                        </th>
                      </tr>
                      {currentData?.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center p-10 text-[16px] text-gray-400"
                          >
                            No Record
                          </td>
                        </tr>
                      )}
                      {currentData &&
                        currentData?.map((e: any, index: number) => {
                          return (
                            <Fragment key={e?.id}>
                              <tr
                                key={index}
                                className="border-t text-[14px] border-[#dadde0]"
                              >
                                <td
                                  className={` py-2 flex justify-between items-center`}
                                >
                                  <div
                                    onClick={() => toggleChild(index)}
                                    className={`text-gray-700 cursor-pointer border-zinc-400 border pt-1 p-[0.15rem] py-[0.09rem] rounded-full ml-7`}
                                  >
                                    <FaAngleDown
                                      className={`${toggledChildren.includes(index) ? "" : "-rotate-90"}`}
                                      color="black"
                                    />
                                  </div>
                                  <span className="text-black">
                                    {index + 1}
                                  </span>
                                </td>

                                <td className="pr-4 border-r text-center">
                                  <span className="text-black">
                                    {e?.DocNum}
                                  </span>
                                </td>
                                <td className="pr-4 border-r text-center">
                                  <span>
                                    {data?.find(
                                      (r: any) =>
                                        r?.SalesEmployeeCode === e?.U_Requester
                                    )?.SalesEmployeeName || (
                                      <CircularProgress size={"18px"} />
                                    )}
                                  </span>
                                </td>
                                <td className="pr-4 border-r text-center">
                                  <span>
                                    {branchAss?.data?.find(
                                      (b: any) => b?.BPLID === e?.U_Branch
                                    )?.BPLName || (
                                      <CircularProgress size={"18px"} />
                                    )}
                                  </span>
                                </td>

                                <td className="pr-4 border-r text-center">
                                  <span>{e?.U_Terminal}</span>
                                </td>
                                <td
                                  colSpan={2}
                                  className="pr-4 border-r text-center"
                                >
                                  <span>{e?.U_RequestDate?.split("T")[0]}</span>
                                </td>
                              </tr>
                              {toggledChildren.includes(index) &&
                                e?.TL_TR_ROWCollection && (
                                  <tr className="border-t-[1px] text-black border-[#dadde0] text-[14px]">
                                    <th className="w-[90px] "></th>
                                    <th className="w-[200px] border-l-[1px] border-b border-[#dadde0] pl-[2px] font-normal">
                                      <span className="text-black bg-gray-50 font-bold flex items-center gap-3 text-[13.5px] ml-1">
                                        <Checkbox
                                          className=""
                                          size="small"
                                          checked={isParentSelected(index)}
                                          onChange={(e) =>
                                            selectParent(e, index)
                                          }
                                        />
                                        Source Type{" "}
                                      </span>
                                    </th>

                                    <th className="w-[200px] bg-gray-50 border-b border-[#dadde0] text-left font-bold py-1">
                                      Document Number{" "}
                                    </th>

                                    <th className="text-left bg-gray-50 border-b border-[#dadde0] font-bold">
                                      Ship To
                                    </th>
                                    <th className="w-[200px] bg-gray-50 border-b border-[#dadde0] text-left font-bold">
                                      Item{" "}
                                    </th>
                                    <th className="w-[200px] bg-gray-50 border-b border-[#dadde0] text-left font-bold">
                                      Delivery Date
                                    </th>
                                    <th className="w-[200px] bg-gray-50 border-b border-[#dadde0] text-left font-bold">
                                      Qty{" "}
                                    </th>
                                    <th className="border-b bg-gray-50 border-[#dadde0] "></th>
                                  </tr>
                                )}
                              {toggledChildren.includes(index) &&
                                e?.TL_TR_ROWCollection &&
                                e?.TL_TR_ROWCollection?.map(
                                  (c: any, indexc: number) => {
                                    return (
                                      <>
                                        <tr
                                          key={indexc}
                                          className="text-[14px]"
                                        >
                                          <td className="py-2 flex justify-center gap-8 items-center"></td>

                                          <td className="pr-4 border-b bg-gray-50 border-l-[1px] border-[#dadde0]">
                                            <span className="text-black flex items-center gap-3 text-[13.5px] ml-1">
                                              <Checkbox
                                                className=""
                                                size="small"
                                                checked={c?.checked ?? false}
                                                onChange={(e) =>
                                                  selectChangeChild(
                                                    e,
                                                    index,
                                                    indexc
                                                  )
                                                }
                                              />
                                              {c?.U_Type}
                                            </span>
                                          </td>
                                          <td className="pr-4 border-b bg-gray-50">
                                            <span>{c?.U_DocNum}</span>
                                          </td>

                                          <td className="pr-4 border-b bg-gray-50">
                                            <span>{c?.U_ShipToCode}</span>
                                          </td>
                                          <td className="pr-4 border-b bg-gray-50">
                                            <span>{c?.U_ItemCode}</span>
                                          </td>
                                          <td className="pr-4 border-b bg-gray-50">
                                            <span>
                                              {dateFormat(c?.U_DeliveryDate)}
                                            </span>
                                          </td>
                                          <td
                                            colSpan={2}
                                            className="bg-gray-50 border-b"
                                          >
                                            <span>{c?.U_Quantity}</span>
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
                    <div className="h-[70px] items-center pr-5 flex gap-5 justify-end text-sm bg-white border-t sticky bottom-0">
                      <div>Row Per page</div>
                      <SelectPage
                        value={itemsPerPage}
                        setValue={(newValue) =>
                          handleChangeItemsPerPage({
                            target: { value: newValue },
                          })
                        }
                      />{" "}
                      <div>
                        {currentPage + "-" + currentPage + " of " + totalPages}
                      </div>
                      <div className="flex gap-1">
                        <button
                          disabled={currentPage === 1}
                          onClick={handleFirstPage}
                          className="text-gray-600 cursor-pointer transition hover:bg-zinc-100 duration-300 p-1 rounded-full"
                        >
                          {" "}
                          <span
                            className={`${currentPage === 1 && "text-gray-400"}`}
                          >
                            {" "}
                            <FirstPageIcon sx={{ width: "22px" }} />
                          </span>
                        </button>
                        <button
                          disabled={currentPage === 1}
                          onClick={handlePrevPage}
                          className="text-gray-600 cursor-pointer transition hover:bg-zinc-100 duration-300 p-1 rounded-full"
                        >
                          <span
                            className={`${currentPage === 1 && "text-gray-400"}`}
                          >
                            <KeyboardArrowLeftIcon sx={{ width: "22px" }} />
                          </span>
                        </button>
                        <button
                          disabled={currentPage === totalPages}
                          onClick={handleNextPage}
                          className="text-gray-600 cursor-pointer transition hover:bg-zinc-100 duration-300 p-1 rounded-full"
                        >
                          <span
                            className={`${currentPage === totalPages && "text-gray-400"}`}
                          >
                            <KeyboardArrowRightIcon sx={{ width: "22px" }} />
                          </span>
                        </button>
                        <button
                          disabled={currentPage === totalPages}
                          onClick={handleLastPage}
                          className="text-gray-600 cursor-pointer transition hover:bg-zinc-100 duration-300 p-1 rounded-full"
                        >
                          <span
                            className={`${currentPage === totalPages && "text-gray-400"}`}
                          >
                            <LastPageIcon sx={{ width: "22px" }} />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="sticky bottom-4  mt-2 ">
          <div className="backdrop-blur-sm bg-white p-2 rounded-lg shadow-lg z-[1000] flex justify-end gap-3 border drop-shadow-sm">
            <div className="flex">
              <LoadingButton
                size="small"
                sx={{ height: "25px" }}
                variant="outlined"
                style={{
                  background: "white",
                  border: "1px solid red",
                }}
                disableElevation
                onClick={() => route("/trip-management/transportation-order")}
              >
                <span className="px-3 text-[11px] py-1 text-red-500">
                  Cancel
                </span>
              </LoadingButton>
            </div>
            <div className="flex items-center space-x-4">
              {document?.length === 0 && stockStatus?.length === 0 ? (
                <LoadingButton
                  type="submit"
                  sx={{
                    height: "25px",
                    backgroundColor: "silver",
                    "&:hover": {
                      backgroundColor: "silver",
                    },
                  }}
                  className="bg-white"
                  size="small"
                  variant="contained"
                  disableElevation
                >
                  <span className="px-6 text-[11px] py-4 text-white">
                    Generate TO
                  </span>
                </LoadingButton>
              ) : (
                <LoadingButton
                  type="submit"
                  sx={{ height: "25px" }}
                  className="bg-white"
                  size="small"
                  variant="contained"
                  disableElevation
                  onClick={handleOpenGenerateto}
                >
                  <span className="px-6 text-[11px] py-4 text-white">
                    Gnerate TO
                  </span>
                </LoadingButton>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`w-full h-full ${
          openLoading ? "block" : "hidden"
        } bg-slate-200 flex items-center justify-center bg-opacity-50 absolute left-0 top-0 rounded-md z-50`}
      >
        <CircularProgress color="success" />{" "}
      </div>
      <OnlyDiaLog ref={dialog} />
      <ItemModal
        onClick={(e: any) => {
          setSearchValues({ ...searchValues, Item: e?.ItemCode });
          setOpenItem(false);
        }}
        setOpen={setOpenItem}
        open={openItem}
      />
      <GenerateToModal
        setOpenLoading={setOpenLoading}
        branch={branchAss}
        document={document}
        stockStatus={stockStatus}
        open={open}
        setOpen={setOpen}
        dialog={dialog}
        payload={selectedData}
      />
    </>
  );
}
