import request, { url } from "@/utilies/request";
import React, { useEffect, useMemo, useState } from "react";
import MUITextField from "@/components/input/MUITextField";
import { Box, Button, CircularProgress, Modal } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { log } from "console";
import { useQuery } from "react-query";
import itemRepository from "@/services/actions/itemRepostory";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import SelectPage from "./SelectPage";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50vw",
  bgcolor: "background.paper",
  p: 4,
};

export default function ITRModal(props: any) {
  const handleClose = () => {
    props?.setOpen(false);
  };
  
    const { data, isLoading } = useQuery({
      queryKey: ["item-modals"],
      queryFn: async () => {
        const response: any = await request(
          "GET",
          `${url}/Items?$select=ItemCode,ItemName,InventoryItem& $filter=InventoryItem eq 'tYES'`
        )
          .then((res: any) => res?.data?.value)
          .catch((e: Error) => {
            throw new Error(e.message);
          });
        return response;
      },
      staleTime:Infinity,
    });
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 
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
  const currentData = data?.slice(startIndex, endIndex);

  const handleGetItem = (event: any) => {
    if (props.onClick) {
      props.onClick(event);
    }
  };
  return (
    <>
      <Modal
        open={props?.open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={style} borderRadius={3}>
          <div className="h-[60vh] overflow-hidden relative flex flex-col">
            <div className="grow">
              {/* <div className="w-[80vw] h-[80vh] px-6 py-2 flex flex-col gap-1 relative bg-white"> */}
              <div className="border-b pb-5 mb-[30px] border-zinc-300 text-black font-bold">
                Items
              </div>
              <div className="max-h-[43.5vh] border w-full overflow-y-auto">
                <table className="border table-fixed w-full shadow-sm bg-white border-[#dadde0]">
                  <thead>
                    <tr className="border-[1px] sticky top-0 border-[#dadde0] font-semibold shadow-sm drop-shadow-md text-black bg-zinc-50">
                      <th className="w-[150px] text-left font-normal  py-2 pl-5 text-[14px] ">
                        NO
                      </th>

                      <th className="w-[160px] text-left font-normal  py-2 text-[14px] ">
                        Item Code
                      </th>
                      <th className="w-[160px] text-left font-normal  py-2 text-[14px] ">
                        Item Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={3}>
                          <div className="flex justify-center items-center flex-col gap-5 h-[38vh]">
                            <CircularProgress color="success" size={30} />{" "}
                            <span className="text-[0.95]">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentData?.map((e: any, index: number) => (
                        <tr
                          className="text-sm cursor-default hover:bg-zinc-50 border-b border-zinc-200"
                          key={index}
                          onClick={()=>handleGetItem(e)}
                        >
                          <td className="pl-5 py-2">
                            <span>
                              {(currentPage - 1) * itemsPerPage + (index + 1)}
                            </span>
                          </td>
                          <td className="">
                            <span>{e?.ItemCode}</span>
                          </td>
                          <td className="">
                            <span>{e?.ItemName}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="h-[70px] bg-white border items-center pr-7 flex gap-5 justify-end text-sm sticky bottom-5">
              <div>Row Per page</div>
              <SelectPage
                value={itemsPerPage}
                setValue={(newValue) =>
                  handleChangeItemsPerPage({ target: { value: newValue } })
                }
              />{" "}
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
        </Box>
      </Modal>
    </>
  );
}