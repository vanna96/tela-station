import request, { url } from "@/utilies/request";
import React, { useCallback, useMemo, useState } from "react";
import MUITextField from "@/components/input/MUITextField";
import { Backdrop, Box, Button, Checkbox, CircularProgress, Modal } from "@mui/material";
import { useQuery } from "react-query";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import SelectPage from "./SelectPage";
import { debounce, displayTextDate } from "@/lib/utils";
import { getDeliveryToSaleOrder } from "../service/get-sale-order";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60vw",
  bgcolor: "background.paper",
  p: 4,
  height: "80vh",
};

interface DeliveryModalProps {
  onSelect: (items: any) => any;
}

interface GetDeliveryModalState {
  loading: boolean;
  open: boolean;
  cardCode: string | undefined;
  BPLID: number | null | undefined;
  lineOfBusiness: string | undefined | null;
}

export class GetDeliveryModal extends React.Component<
  DeliveryModalProps,
  GetDeliveryModalState
> {
  state = {
    loading: false,
    open: false,
    cardCode: undefined,
    BPLID: undefined,
    lineOfBusiness: undefined,
  } as GetDeliveryModalState;

  onClose() {
    this.setState({
      open: false,
      cardCode: undefined,
      BPLID: undefined,
      lineOfBusiness: undefined,
    });
  }

  onOpen(
    cardCode: string,
    BPLID: number | undefined | null,
    lineOfBusiness: string | undefined | null
  ) {
    if (!cardCode) throw new Error("CardCode is required");

    if (!BPLID) throw new Error("BPLID is required");

    if (!lineOfBusiness) throw new Error("line Of Business is required");

    this.setState({ open: true, cardCode, BPLID, lineOfBusiness });
  }

  async onSelectChangeItems(item: any) {
    this.setState({
      loading: true,
    });
    const response = await getDeliveryToSaleOrder(item?.DocEntry as number);
    this.props.onSelect(response);
    this.setState({
      loading: false,
    });
    this.onClose();
  }

  render() {
    return (
      <ItemOrdersModal
        {...this.state}
        onClose={() => this.onClose()}
        onSelectItems={(items) => this.onSelectChangeItems(items)}
      />
    );
  }
}

const onGetRequest = (
  cardCode: string | undefined,
  BPLID: number | undefined | null,
  lineOfBusiness: string | undefined | null
) => {
  return new Promise(async (resolve, reject) => {
    if (!cardCode || !BPLID || !lineOfBusiness) {
      return resolve([]);
    }

    try {
      const reponse: any = await request(
        "GET",
        `${url}/Orders?$select=DocEntry, DocNum, TaxDate &$filter=BPL_IDAssignedToInvoice eq ${BPLID} and CardCode eq '${cardCode}' and U_tl_arbusi eq '${lineOfBusiness}' and DocumentStatus eq 'bost_Open' and U_tl_sopricelist eq 7`
      );

      if (reponse?.data) resolve(reponse?.data?.value);
    } catch (error) {
      reject(error);
    }
  });
};

export default function ItemOrdersModal(props: {
  open: boolean;
  cardCode: string | undefined;
  BPLID: number | null | undefined;
  lineOfBusiness: string | undefined | null;
  loading:boolean
  onClose: () => void;
  onSelectItems: (items: any[] | any) => void;
}) {
  const key = `BPL_IDAssignedToInvoice eq ${props.BPLID} and CardCode eq '${props.cardCode}' and U_tl_arbusi eq '${props.lineOfBusiness}'`;

  const { data, isLoading } = useQuery({
    queryKey: [`so_` + key],
    queryFn: () =>
      onGetRequest(props.cardCode, props.BPLID, props.lineOfBusiness),
  });

  // console.log(data);

  const [selecteds, setSelects] = useState<{
    [key: string]: string | undefined;
  }>({});
  const [searchText, setSearchText] = useState("");
  // Define a debounced version of the handleChange function
  const debouncedHandleChange = debounce(function (
    this: any,
    newValue: string
  ) {
    setSearchText(newValue);
  },
  500); // Adjust the delay time as needed

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    // setSearchText(newValue);
    // Call the debounced function with the new value
    debouncedHandleChange(newValue);
  };

  const itemsLists = useMemo(() => {
    const list: any[] = (data as any) ?? [];

    if (searchText !== "") {
      return list.filter((e): any =>
        e?.ItemCode?.toLowerCase()?.includes(searchText.toLowerCase())
      );
    }

    return list;
  }, [searchText, data]);

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

  const onSelectChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    code: string
  ) => {
    const items = { ...selecteds };
    items[code] = event.target.checked ? code : undefined;
    setSelects(items);
  };

  const onSubmit = useCallback(() => {
    const values = Object.values(selecteds);
    const items = itemsLists.filter((e) => values.includes(e?.ItemCode));

    props.onSelectItems(items);
  }, [selecteds]);

  return (
    <>
      <Modal
        open={props?.open}
        onClose={props.onClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{ ...style, display: "flex", flexDirection: "column" }}
          borderRadius={3}
        >
          {
            props?.loading &&
            <div className="absolute top-0 left-0 w-full h-full rgba-bg rounded-xl flex justify-center items-center z-50"
          >
            <CircularProgress />
          </div>
          }
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
                    <tr className="border-[1px] sticky top-0 border-[#dadde0] z-10 font-semibold  text-black bg-zinc-50">
                      <th className="w-[4rem] text-left font-normal  py-2 pl-5 text-[14px] ">
                        No
                      </th>

                      <th className=" text-left font-normal  py-2 text-[14px] ">
                        Document Number
                      </th>
                      <th className=" text-left font-normal  py-2 text-[14px] ">
                        Posting Date
                      </th>
                      <th className=" text-left font-normal  py-2 text-[14px] ">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={5}>
                          <div className="flex justify-center items-center flex-col gap-5 h-[38vh]">
                            <CircularProgress color="success" size={30} />{" "}
                            <span className="text-[0.95]">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentData?.map((e: any, index: number) => (
                        <tr
                          className="text-sm cursor-pointer hover:bg-zinc-100 border-b border-zinc-200"
                          key={index}
                          onClick={() => handleGetItem(e)}
                        >
                          <td className="pl-5 py-2">
                            <span>
                              {(currentPage - 1) * itemsPerPage + (index + 1)}
                            </span>
                          </td>
                          <td className="">
                            <span>{e?.DocNum}</span>
                          </td>
                          <td className="">
                            <span>{displayTextDate(e?.TaxDate)}</span>
                          </td>
                          <td className="">
                            <span>{e?.Comments}</span>
                          </td>
                          <td className=""></td>
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
                    className={`${
                      currentPage === totalPages && "text-gray-400"
                    }`}
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
                    className={`${
                      currentPage === totalPages && "text-gray-400"
                    }`}
                  >
                    <LastPageIcon sx={{ width: "22px" }} />
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-3 justify-end">
            <Button size="small" variant="outlined">
              <span className="px-3" onClick={props?.onClose}>
                Close
              </span>
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
