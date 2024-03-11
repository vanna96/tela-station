import request, { url } from "@/utilies/request";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import MUITextField from "@/components/input/MUITextField";
import { Button, Checkbox } from "@mui/material";
import { CircularProgress } from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { IoSearchSharp } from "react-icons/io5";

import FormMessageModal from "@/components/modal/FormMessageModal";
import SelectPage from "./SelectPage";
import SealModal from "./SealModal";
let dialog = React.createRef<FormMessageModal>();
export default function BulkSealAllocationList() {
  const [searchValues, setSearchValues] = React.useState({
    tripNumberFrom: "",
    tripNumberTo: "",
  });

  const [openItem, setOpenItem] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentData, setCurrenData] = useState<any[]>([]);
  const [newDataA, setNewdataA] = useState([]);
  const [keys, setKeys] = useState<any>({});
  const { data }: any = useQuery({
    queryKey: ["tl-to"],
    queryFn: async () => {
      const response: any = await request("GET", `/TL_TO`)
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    staleTime: Infinity,
  });

  const totalPages = isNaN(data?.length)
    ? 0
    : Math.ceil(data.length / itemsPerPage);
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

  useEffect(() => {
    setCurrenData(data?.slice(startIndex, endIndex));
  }, [startIndex, endIndex, data]);

  const selectChangeRow = (event: any, index: number) => {
    const isChecked = event.target.checked;
    const updatedList = [...currentData];
    updatedList[index] = { ...updatedList[index], checked: isChecked };
    const selectedKeys: any = { ...keys };
    selectedKeys[updatedList[index]?.DocNum] = isChecked;
    setKeys(selectedKeys);
    setCurrenData(updatedList);
    console.log(keys);
  };
  const getData = () => {
    setOpenItem(true);
    let ids: any[] = [];
    for (const [key, value] of Object.entries(keys)) {
      if (value) ids.push(parseInt(key));
    }
    const filteredObjects = data.filter((item: any) =>
      ids.includes(item.DocNum)
    );
    setNewdataA(filteredObjects);
  };
  return (
    <>
      <div className="w-full h-full px-6 py-2 flex flex-col gap-1 relative bg-red-40">
        <div className="grow">
          <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2">
            <h3 className="text-base 2xl:text-base xl:text-base ">
              Trip Management / Seal Number Allocations{" "}
            </h3>
          </div>
          <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
            <div className="col-span-10 mt-5">
              <div className="grid grid-cols-12  space-x-4">
                <div className="col-span-3 2xl:col-span-3">
                  <MUITextField
                    type="string"
                    placeholder="Trip number from"
                    className="bg-white"
                    autoComplete="off"
                    value={searchValues.tripNumberFrom}
                    onChange={(e) =>
                      setSearchValues({
                        ...searchValues,
                        tripNumberFrom: e.target.value,
                      })
                    }
                    startAdornment={<IoSearchSharp size={20} />}
                  />
                </div>

                <div className="col-span-3 2xl:col-span-3">
                  <MUITextField
                    type="string"
                    placeholder="Trip number to"
                    className="bg-white"
                    autoComplete="off"
                    value={searchValues.tripNumberTo}
                    onChange={(e) =>
                      setSearchValues({
                        ...searchValues,
                        tripNumberTo: e.target.value,
                      })
                    }
                    startAdornment={<IoSearchSharp size={20} />}
                  />
                </div>

                <div className="col-span-3 pl-5 items-end mb-[5px] flex 2xl:col-span-3">
                  <Button
                    style={{ height: "30px" }}
                    variant="contained"
                    size="small"
                    // onClick={getDocument}
                  >
                    <span className="text-[11px] p-3 inline-block text-white">
                      Load Document
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 border shadow-sm h-[68vh] rounded">
            {" "}
            <div className="">
              <span className="mb-6 text-[1rem] inline-block mr-5">
                Select All Trips to be allocate
              </span>
              <Button
                style={{ height: "30px" }}
                variant="contained"
                size="small"
                onClick={getData}
              >
                <span className="text-[11px] p-3 inline-block text-white">
                  Auto Allocations
                </span>
              </Button>
            </div>
            <div className="border ">
              <div className="grow">
                <div className="max-h-[58.5vh] w-full overflow-y-auto">
                  <table className="w-full shadow-sm bg-white">
                    <thead>
                      <tr className="sticky top-0 z-50 shadow-sm border-[1px] border-[#dadde0] border-t-0 border-l-0 border-r-0 bg-gray-50">
                        <th className="w-[70px] text-left font-normal  py-2 pl-3 text-[14px] text-gray-500"></th>
                        <th className="w-[150px] text-left font-normal  py-2 pl-3 text-[14px] text-gray-500">
                          No
                        </th>
                        <th className="w-[250px] text-left font-normal  py-2 text-[14px] text-gray-500">
                          Trip Number
                        </th>
                        <th className="w-[250px] text-left font-normal  py-2 text-[14px] text-gray-500">
                          Driver
                        </th>
                        <th className="w-[250px] text-left font-normal  py-2 text-[14px] text-gray-500">
                          Vehicle Number
                        </th>
                        <th className="w-[250px] text-left font-normal  py-2 text-[14px] text-gray-500">
                          Route
                        </th>
                        <th className="w-[250px] text-left font-normal  py-2 text-[14px] text-gray-500">
                          Document Date
                        </th>
                        <th className="w-[250px] text-left font-normal  py-2 text-[14px] text-gray-500">
                          Total Seal
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
                    ) : currentData?.length == 0 ? (
                      <tbody>
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center p-10 py-[5rem] text-[16px] text-gray-400"
                          >
                            No Record
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      currentData?.map((t: any, index: number) => {
                        return (
                          <tbody>
                            <>
                              <tr
                                key={index}
                                className="text-sm cursor-default border-b "
                              >
                                <td className="py-[0.27rem] text-left pl-4 ">
                                  <span className="text-gray-500">
                                    <Checkbox
                                      onChange={(e) =>
                                        selectChangeRow(e, index)
                                      }
                                      checked={keys[t.DocNum] || false}
                                      className=""
                                      size="small"
                                    />
                                  </span>
                                </td>
                                <td className="text-left pl-4 ">
                                  <span className="text-gray-500">
                                    {(currentPage - 1) * itemsPerPage +
                                      (index + 1)}
                                  </span>
                                </td>
                                <td className="text-left pl-4 ">
                                  <span className="text-gray-500">
                                    {" "}
                                    {t?.DocNum}
                                  </span>
                                </td>
                                <td className="text-left pl-4 ">
                                  <span className="text-gray-500">
                                    {t?.U_DriverName}
                                  </span>
                                </td>
                                <td className="text-left pl-4 ">
                                  <span className="text-gray-500">
                                    {t?.U_VehicleName}
                                  </span>
                                </td>
                                <td className="text-left pl-4 ">
                                  <span className="text-gray-500">
                                    {t?.U_Route}
                                  </span>
                                </td>
                                <td className="text-left pl-4 ">
                                  <span className="text-gray-500">
                                    {t?.CreateDate?.split("T")?.at(0)}
                                  </span>
                                </td>
                                <td className="text-left pl-4 ">
                                  <div className="bg-red-400 w-[55px] flex items-center justify-center text-white rounded h-[29px]">
                                    <span className="">
                                      {`
                                        ${
                                          t?.TL_TO_COMPARTMENTCollection?.filter(
                                            (e: any) => {
                                              return (
                                                (e?.U_SealNumber ||
                                                  e?.U_SealReference) !== null
                                              );
                                            }
                                          )?.length
                                        }/ ${
                                          t?.TL_TO_COMPARTMENTCollection?.length
                                        }
                                      `}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            </>
                          </tbody>
                        );
                      })
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[70px] bg-white border items-center pr-7 flex gap-5 justify-end text-sm sticky bottom-5">
          <div>Row Per page</div>
          <SelectPage
            value={itemsPerPage}
            setValue={(newValue) =>
              handleChangeItemsPerPage({ target: { value: newValue } })
            }
          />
          <div>{currentPage + "-" + currentPage + " of " + totalPages}</div>
          <div className="flex gap-1">
            <button
              disabled={currentPage === 1}
              onClick={handleFirstPage}
              className="text-gray-600 cursor-pointer transition hover:bg-zinc-100 duration-300 p-1 rounded-full"
            >
              {" "}
              <span className={`${currentPage === 1 && "text-gray-400"}`}>
                {" "}
                <FirstPageIcon sx={{ width: "22px" }} />
              </span>
            </button>
            <button
              disabled={currentPage === 1}
              onClick={handlePrevPage}
              className="text-gray-600 cursor-pointer transition hover:bg-zinc-100 duration-300 p-1 rounded-full"
            >
              <span className={`${currentPage === 1 && "text-gray-400"}`}>
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
              className="text-gray-600 cursor-pointer transition hover:bg-zinc-200 duration-300 p-1 rounded-full"
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
      <div
        className={`w-full h-full ${
          openLoading ? "block" : "hidden"
        } bg-slate-200 flex items-center justify-center bg-opacity-50 absolute left-0 top-0 rounded-md z-50`}
      >
        <CircularProgress color="success" />{" "}
      </div>
      <FormMessageModal ref={dialog} />
      <div
        className={`w-full h-full ${
          openLoading ? "block" : "hidden"
        } bg-slate-200 flex items-center justify-center bg-opacity-50 absolute left-0 top-0 rounded-md z-50`}
      >
        <CircularProgress color="success" />{" "}
      </div>
      <SealModal data={newDataA} setOpen={setOpenItem} open={openItem} />
      {/* <GenerateToModal
        branch={branchAss}
        document={document}
        stockStatus={stockStatus}
        open={open}
        setOpen={setOpen}
      /> */}
    </>
  );
}
