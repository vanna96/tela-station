import request, { url } from "@/utilies/request";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import MUITextField from "@/components/input/MUITextField";
import { Backdrop, Button, Checkbox, Skeleton } from "@mui/material";
// import { CircularProgress } from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { IoSearchSharp } from "react-icons/io5";

import FormMessageModal from "@/components/modal/FormMessageModal";
import SelectPage from "./SelectPage";
import SealModal from "./SealModal";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress, {
  circularProgressClasses,
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import OnlyDiaLog from "../transportation_order/OnlyDiaLog";

let dialog = React.createRef<OnlyDiaLog>();
export default function BulkSealAllocationList(props: CircularProgressProps) {
  const [searchValues, setSearchValues] = React.useState({
    tripNumberFrom: "",
    tripNumberTo: "",
  });

  const [openItem, setOpenItem] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentData, setCurrenData] = useState<any[]>([]);
  const [newDataA, setNewdataA] = useState([]);
  const [keys, setKeys] = useState<any>({});
  const [loadData, setLoadData] = useState({});

  const { data, isLoading }: any = useQuery({
    queryKey: ["tl_bulk_seal"],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `/script/test/bulk_seal_allocation`
      )
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    staleTime: Infinity,
    retry: 1,
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
    setCurrenData(data?.slice(startIndex, endIndex) ?? []);
  }, [startIndex, endIndex, data]);

  const selectChangeRow = (event: any, index: number) => {
    const isChecked = event.target.checked;
    const updatedList = [...currentData];
    updatedList[index] = { ...updatedList[index], checked: isChecked };
    const selectedKeys: any = { ...keys };
    selectedKeys[updatedList[index]?.DocNum] = isChecked;
    setKeys(selectedKeys);
    setCurrenData(updatedList);
  };
  
  const getData = () => {
    if (data?.length === 0) return;
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
  console.log(loadData);

  const submitData = async () => {
    if (Object.keys(loadData).length === 0) return;
    setSubmiting(true);
    await request("POST", `/script/test/bulk_seal_allocation`, loadData)
      .then((res: any) => dialog.current?.success("Created Successfully.", 0))
      .catch((err: any) => dialog.current?.error(err.message))
      .finally(() => setSubmiting(false));
  };
  console.log(loadData);

  useEffect(() => {
    submitData();
  }, [loadData]);
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
          <div className="p-5 border shadow-sm ">
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
            <div className="border-t mt-3 ">
              <div className="grow">
                <div className="max-h-[58.5vh] w-full overflow-y-auto">
                  <table className="w-full bg-white">
                    <thead>
                      <tr className="sticky top-0 z-50 shadow-sm border-[1px] border-t-0 border-l-0 border-r-0 font-bold">
                        <th className="w-[70px] text-left  py-2 pl-3 text-[14px] text-gray-500"></th>
                        <th className="w-[150px] text-left  py-2 pl-3 text-[14px]">
                          No
                        </th>
                        <th className="w-[250px] text-left py-2 text-[14px]">
                          Trip Number
                        </th>
                        <th className="w-[250px] text-left py-2 text-[14px]">
                          Driver
                        </th>
                        <th className="w-[250px] text-left py-2 text-[14px]">
                          Vehicle Number
                        </th>
                        <th className="w-[250px] text-left py-2 text-[14px]">
                          Route
                        </th>
                        <th className="w-[250px] text-left py-2 text-[14px]">
                          Document Date
                        </th>
                        <th className="w-[250px] text-left py-2 text-[14px]">
                          Total Seal
                        </th>
                      </tr>
                    </thead>
                    {isLoading ? (
                      <tbody>
                        <tr className="">
                          {/* <td
                            colSpan={8}
                            className="text-center p-10 py-[4.8rem] text-[16px] text-gray-400"
                          >
                            <div className="w-full flex items-center justify-center gap-5">
                              <span>
                                <CircularProgress size={22} color="success" />
                              </span>
                              <span className="text-sm">Loading...</span>
                            </div>
                          </td> */}
                          <td colSpan={8}>
                            <div className="w-full flex pt-[8rem] items-center py-[7rem] flex-col justify-center gap-5">
                              <Box sx={{ position: "relative" }}>
                                <CircularProgress
                                  variant="determinate"
                                  sx={{
                                    color: (theme) =>
                                      theme.palette.grey[
                                        theme.palette.mode === "light"
                                          ? 200
                                          : 800
                                      ],
                                  }}
                                  size={40}
                                  thickness={5}
                                  {...props}
                                  value={100}
                                />
                                <CircularProgress
                                  color="success"
                                  variant="indeterminate"
                                  disableShrink
                                  sx={{
                                    // color: (theme) =>
                                    //   theme.palette.mode === "light"
                                    //     ? "#1a90ff"
                                    //     : "#308fe8",
                                    animationDuration: "650ms",
                                    position: "absolute",
                                    left: 0,
                                    [`& .${circularProgressClasses.circle}`]: {
                                      strokeLinecap: "round",
                                    },
                                  }}
                                  size={40}
                                  thickness={5}
                                  {...props}
                                />
                              </Box>
                              <span className="text-[15px] ml-3 text-gray-500 font-bold">
                                Loading...
                              </span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    ) : currentData?.length == 0 ? (
                      <tbody>
                        <tr>
                          <td
                            colSpan={8}
                            className="text-center pt-[8rem] py-[7rem] text-[16px] text-gray-600"
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
                                <td className="py-[0.25rem] text-left pl-4 ">
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
                                  <div className="bg-red-400 w-[55px] flex items-center justify-center text-white rounded h-[27px]">
                                    <span className="text-[13px]">
                                      {`
                                        ${t?.Remain} / ${t?.Total}
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
          <div className="p-4 pb-8 bg-white border items-center pr-7 flex gap-4 border-t-0 justify-end text-sm rounded-md">
            <div>Row Per page</div>
            <SelectPage
              value={itemsPerPage}
              setValue={(newValue) =>
                handleChangeItemsPerPage({ target: { value: newValue } })
              }
            />
            <div>{currentPage + "-" + currentPage + " of " + totalPages}</div>
            <div className="flex gap-0">
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
      </div>
      <div
        className={`w-full h-full ${
          openLoading ? "block" : "hidden"
        } bg-slate-200 flex items-center justify-center bg-opacity-50 absolute left-0 top-0 rounded-md z-50`}
      >
        <CircularProgress color="success" />{" "}
      </div>
      <OnlyDiaLog ref={dialog} />{" "}
      <div
        className={`w-full h-full ${
          openLoading ? "block" : "hidden"
        } bg-slate-200 flex items-center justify-center bg-opacity-50 absolute left-0 top-0 rounded-md z-50`}
      >
        <CircularProgress color="success" />{" "}
      </div>
      <SealModal
        setLoadData={setLoadData}
        data={newDataA}
        setOpen={setOpenItem}
        open={openItem}
      />
      <Backdrop
        sx={{
          color: "#fff",
          backgroundColor: "rgb(251 251 251 / 60%)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={submiting}
      >
        <div className="flex gap-2 flex-col justify-center items-center">
          <Box sx={{ position: "relative" }}>
            <CircularProgress
              variant="determinate"
              sx={{
                color: (theme) =>
                  theme.palette.grey[
                    theme.palette.mode === "light" ? 200 : 800
                  ],
              }}
              size={40}
              thickness={5}
              {...props}
              value={100}
            />
            <CircularProgress
              color="success"
              variant="indeterminate"
              disableShrink
              sx={{
                animationDuration: "650ms",
                position: "absolute",
                left: 0,
                [`& .${circularProgressClasses.circle}`]: {
                  strokeLinecap: "round",
                },
              }}
              size={40}
              thickness={5}
              {...props}
            />
          </Box>
          <span className="text-[14px] ml-3 text-gray-500 font-bold">
            POSTING ...
          </span>
        </div>
      </Backdrop>
    </>
  );
}
