import request, { url } from "@/utilies/request";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import MUITextField from "@/components/input/MUITextField";
import { Box, Button, Checkbox, CircularProgress, Modal } from "@mui/material";
import { useQuery } from "react-query";
import itemRepository from "@/services/actions/itemRepostory";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import SelectPage from "../inventory_transfer/components/SelectPage";
import { SearchIcon } from "lucide-react";
import { debounce } from "@/lib/utils";
import { AiOutlineConsoleSql } from "react-icons/ai";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60vw",
  bgcolor: "background.paper",
  p: 4,
  height: '80vh',
};

type ModalType = 'single' | 'multiple';
interface InventoryItemModalProps {
  onSelectItems: (items: any[] | any, index: number | undefined) => any,
}

interface InventoryItemModalState {
  open: boolean,
  index: undefined | number,
  type: ModalType
};

export class InventoryItemModal extends React.Component<InventoryItemModalProps, InventoryItemModalState> {
  state = { open: false, index: undefined, type: 'multiple' } as InventoryItemModalState;


  onClose() {
    this.setState({ open: false, index: undefined });
  }

  onOpen(type: ModalType, index?: number | undefined) {
    this.setState({ open: true, index: index, type: type });
  }

  onSelectChangeItems(items: any[]) {
    this.props.onSelectItems(items, this.state.index)
    this.setState({ open: false, index: undefined })

  }

  render() {
    return <GetItemModal type={this.state.type ?? 'multiple'} open={this.state.open} onClose={() => this.onClose()} onSelectItems={(items) => this.onSelectChangeItems(items)} />
  }
}


export default function GetItemModal(props: { open: boolean, onClose: () => void, onSelectItems: (items: any[] | any) => void, type: ModalType }) {
  const { data, isLoading } = useQuery({
    queryKey: ["item-inventory"],
    queryFn: () => request("GET", `${url}/Items?$select=ItemCode,ItemName,InventoryItem,UoMGroupEntry & $filter=InventoryItem eq 'tYES'`),
    staleTime: 0,
  });

  const [selecteds, setSelects] = useState<{ [key: string]: string | undefined }>({});
  const [searchText, setSearchText] = useState('');
  // Define a debounced version of the handleChange function
  const debouncedHandleChange = debounce(function (this: any, newValue: string) {
    setSearchText(newValue);
  }, 500); // Adjust the delay time as needed

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    // setSearchText(newValue);
    // Call the debounced function with the new value
    debouncedHandleChange(newValue);
  };


  const itemsLists = useMemo(() => {
    const list: any[] = (data as any)?.data?.value ?? [];

    if (searchText !== '') {
      return list.filter((e): any => e?.ItemCode?.toLowerCase()?.includes(searchText.toLowerCase()))
    }

    return list;
  }, [searchText, data])

  const [currentPage, setCurrentPage] = useState<any>(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = isNaN(itemsLists?.length)
    ? 0
    : Math.ceil(itemsLists.length / itemsPerPage);


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
  const currentData = itemsLists?.slice(startIndex, endIndex);

  const handleGetItem = (event: any) => {
    if (!props.onSelectItems) return;

    props.onSelectItems(event);
  };



  const onSelectChange = (event: React.ChangeEvent<HTMLInputElement>, code: string) => {
    const items = { ...selecteds };
    items[code] = event.target.checked ? code : undefined;
    setSelects(items)
  }


  const onSubmit = useCallback(() => {
    const values = Object.values(selecteds)
    const items = itemsLists.filter((e) => values.includes(e?.ItemCode));

    props.onSelectItems(items);
  }, [selecteds])


  // useEffect(() => {
  //   return () => {
  //     console.log('')
  //   }
  // }, [])

  return (
    <>
      <Modal
        open={props?.open}
        onClose={props.onClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, display: 'flex', flexDirection: 'column' }} borderRadius={3}  >
          <div className="grow overflow-hidden relative flex flex-col">
            <div className="grow">
              {/* <div className="w-[80vw] h-[80vh] px-6 py-2 flex flex-col gap-1 relative bg-white"> */}
              <div className="text-lg pb-5   text-black font-bold flex justify-between">
                <h2>Items</h2>

                <div className="w-[16rem]">
                  <MUITextField placeholder="Code" onChange={handleChange} />
                </div>
              </div>
              <div className="max-h-[49vh]  border-t w-full overflow-y-auto">
                <table className="border table-fixed w-full shadow-sm bg-white border-[#dadde0]">
                  <thead>
                    <tr className="border-[1px] sticky top-0 border-[#dadde0] z-10 font-semibold shadow-sm drop-shadow-md text-black bg-zinc-50">
                      {props.type === 'multiple' && <th className="w-[1rem]"></th>}
                      <th className="w-[2rem] text-left font-normal  py-2 pl-5 text-[14px] ">
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
                          onClick={props.type === 'multiple' ? undefined : () => handleGetItem(e)}
                        >
                          {props.type === 'multiple' && <td className=""><Checkbox checked={selecteds[e?.ItemCode] ? true : false} onChange={(event) => onSelectChange(event, e?.ItemCode)} /></td>}
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
            <div className="h-[3rem] bg-white border items-center pr-7 flex gap-5 justify-end text-sm sticky bottom-5">
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

          {props.type === 'multiple' && <div className="flex gap-2 mt-3 justify-end">
            <Button size="small" variant="outlined"  ><span className="px-3" onClick={props?.onClose}>Close</span></Button>
            <Button size="small" variant="contained" ><span className="px-3" onClick={onSubmit}>Ok</span></Button>
          </div>}
        </Box>

      </Modal>
    </>
  );
}