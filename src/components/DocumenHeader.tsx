import React, { useMemo } from "react";
import BackButton from "./button/BackButton";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import { AiOutlinePushpin } from "react-icons/ai";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { ThemeContext } from "@/contexts";
import { BsArrowDownShort, BsArrowUp } from "react-icons/bs";
import { TbArrowLeftBar, TbEditCircle } from "react-icons/tb";
import { BiEdit, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { IoCreate } from "react-icons/io5";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import { useDocumentTotalHook } from "@/hook";
import { NumericFormat } from "react-number-format";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowCircleDownRoundedIcon from "@mui/icons-material/ArrowCircleDownRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";

interface DocumentHeaderProps {
  data: any;
  onCopyTo?: (data?: any) => void;
  onFirstPage?: () => void;
  onLastPage?: () => void;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  menuTabs?: (props: any) => JSX.Element;
  type?: string;
  handlerChangeMenu?: (index: number) => void;
  HeaderCollapeMenu?: any;
  headerText?: string;
}

const DocumentHeader: React.FC<DocumentHeaderProps> = (
  props: DocumentHeaderProps
) => {
  const [collapse, setCollapse] = React.useState<boolean>(props?.collapse);
  const { theme } = React.useContext(ThemeContext);

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isStatusClose = props.data.U_tl_status === "Close";
  const handlerGoToEdit = () => {
    navigate(location.pathname + "/edit", { state: props.data, replace: true });
  };

  const handlerGoToCreate = () => {
    if (location.pathname.includes("/edit")) {
      const url = location.pathname.replace(`${id}/edit`, "create");
      window.location.href = url;
    } else if (location.pathname.includes("/")) {
      const url = location.pathname.replace(`${id}`, "create");
      window.location.href = url;
    } else {
      window.location.href = "/"; // Replace with your desired "create" route
    }
  };

  const handlerCopyTo = () => {
    if (props.onCopyTo) {
      props.onCopyTo(props.data ?? {});
    }
  };

  const handlerCollapse = () => {
    setCollapse(!collapse);
  };

  const navigateToEdit = () => navigate(location.pathname + "/edit");
  const navigateToNextPage = () => {
    if (id !== undefined) {
      const nextID = Number(id) + 1;
      const nextURL = location.pathname.replace(`${id}`, `${nextID}`);
      window.location.href = nextURL;
    } else {
      // Handle the case where id is undefined
      // Maybe log an error or show a message to the user
    }
  };
  const navigateToPrevPage = () => {
    if (id !== undefined) {
      const prevID = Number(id) - 1;
      const prevURL = location.pathname.replace(`${id}`, `${prevID}`);
      window.location.href = prevURL;
    } else {
      // Handle the case where id is undefined
      // Maybe log an error or show a message to the user
    }
  };
  const pathSegments: string = location.pathname
    .split("/")[2]
    .replace("-", " ");

  const formattedText: string = pathSegments
    .split("-")
    .map((segment: string) => {
      const lowerCaseSegment: string = segment.toLowerCase();
      return lowerCaseSegment === "lpg"
        ? "LPG"
        : `${segment.charAt(0).toUpperCase()}${segment.slice(1).toLowerCase()}`;
    })
    .join(" ");

  // Capitalize the first letter of the entire string
  const finalFormattedText =
    formattedText.charAt(0).toUpperCase() + formattedText.slice(1);

  const [discount, setDiscount] = React.useState(props?.data?.DocDiscount || 0);
  const [docTotal, docTaxTotal] = useDocumentTotalHook(
    props.data.Items ?? [],
    props.data.DocDiscount,
    1
  );

  const discountAmount = useMemo(() => {
    const dataDiscount: number = props?.data?.DocDiscount || discount;
    if (dataDiscount <= 0) return 0;
    if (dataDiscount > 100) return 100;
    return docTotal * (dataDiscount / 100);
  }, [discount, props?.data?.DocDiscount]);

  let TotalPaymentDue =
    docTotal - (docTotal * props.data.DocDiscount) / 100 + docTaxTotal || 0;
  return (
    <div
      className={`w-full flex flex-col rounded ${
        !collapse ? "gap-3" : ""
      } justify-between items-center  sticky top-0 border-y bg-white z-50 px-4  `}
    >
      <div
        className={`w-full flex justify-between px-6 ${
          !collapse ? "border-b  py-2" : "pt-2"
        } border-b-gray-200 z-50 px-0`}
      >
        <div className="flex gap-2 items-center mb-2">
          <h1 className="text-md  capitalize">
            {props?.headerText ?? finalFormattedText} - {props?.data?.DocNum}
          </h1>
          {props.data.DocumentStatus === "bost_Close" ||
            (!isStatusClose && !(location.pathname.includes("edit") || !id) && (
              <div className="">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={navigateToEdit}
                  endIcon={<MdEdit />}
                >
                  Edit
                </Button>
              </div>
            ))}
          {(location.pathname.includes("edit") || id) && (
            <Button
              variant="outlined"
              size="small"
              // sx={{ color: "rgb(59 130 246) !important", marginLeft: "10px" }}
              onClick={handlerGoToCreate}
              endIcon={<IoCreate />}
            >
              Create
            </Button>
          )}
        </div>
        <div className=" flex gap-3 pr-3"></div>
      </div>
      <div
        className={`w-full  grid grid-cols-2 duration-300 ease-in overflow-hidden  ${
          collapse ? "h-[10rem]" : "h-0"
        }`}
      >
        {props?.HeaderCollapeMenu ?? (
          <>
            <div className=" grid grid-cols-1 text-left w-full px-12">
              <div className="col-span-5  col-start-1">
                <div className="grid grid-cols-7 py-2">
                  <div className="col-span-2 ">
                    <label htmlFor="Code" className="text-gray-600 ">
                      Status
                    </label>
                  </div>
                  <div className="col-span-4 ">
                    {" "}
                    <span className="text-green-500">{"OPEN"}</span>
                  </div>
                </div>
                <div className="grid grid-cols-7 py-2">
                  <div className="col-span-2">
                    <label htmlFor="Code" className="text-gray-600 ">
                      Customer
                    </label>
                  </div>
                  <div className="col-span-4">
                    {props.data?.CardCode} {" - "} {props.data.CardName}
                  </div>
                </div>
                <div className="grid grid-cols-7 py-2">
                  <div className="col-span-2">
                    <label htmlFor="Code" className="text-gray-600 ">
                      Branch
                    </label>
                  </div>
                  <div className="col-span-4">
                    {new BranchBPLRepository().find(
                      props?.data?.BPL_IDAssignedToInvoice || 1
                    )?.BPLName ?? "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-7 py-2">
                  <div className="col-span-2">
                    <label htmlFor="Code" className="text-gray-600 ">
                      Currency
                    </label>
                  </div>
                  <div className="col-span-4">
                    <span>
                      {props?.data?.Currency || 1}
                      {" - "} {props.data.ExchangeRate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 px-12 text-right w-full">
              <div className="col-span-5  col-start-3">
                <div className="grid grid-cols-7 py-2">
                  <div className="col-span-3">
                    <label htmlFor="Code" className="text-gray-600 ">
                      <span> Total Before Discount</span>
                    </label>
                  </div>
                  <div className="col-span-4">
                    {props.data?.Currency}{" "}
                    {
                      <NumericFormat
                        value={docTotal}
                        thousandSeparator
                        fixedDecimalScale
                        disabled
                        className="bg-white w-1/2"
                        decimalScale={2}
                      />
                    }
                  </div>
                </div>
                <div className="grid grid-cols-7 py-2">
                  <div className="col-span-3">
                    <label htmlFor="Code" className="text-gray-600 ">
                      Discount
                    </label>
                  </div>
                  <div className="col-span-4">
                    {props.data?.Currency}{" "}
                    {/* {props.data?.DocDiscount ?? 0} */}
                    <NumericFormat
                      value={discountAmount}
                      thousandSeparator
                      fixedDecimalScale
                      disabled
                      className="bg-white w-1/2"
                      decimalScale={2}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-7 py-2">
                  <div className="col-span-3">
                    <label htmlFor="Code" className="text-gray-600 ">
                      Tax
                    </label>
                  </div>
                  <div className="col-span-4">
                    {props.data?.Currency}{" "}
                    <NumericFormat
                      value={docTaxTotal}
                      thousandSeparator
                      fixedDecimalScale
                      disabled
                      className="bg-white w-1/2"
                      decimalScale={2}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-7 py-2">
                  <div className="col-span-3">
                    <label htmlFor="Code" className="text-gray-600 ">
                      Total
                    </label>
                  </div>
                  <div className="col-span-4">
                    {" "}
                    {props.data?.Currency}{" "}
                    <NumericFormat
                      value={TotalPaymentDue}
                      thousandSeparator
                      fixedDecimalScale
                      disabled
                      className="bg-white w-1/2"
                      decimalScale={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div
        className={`w-full flex gap-2 px-4 text-sm border-t border-t-gray-200 py-0 sticky ${
          !collapse ? "mt-0" : ""
        }`}
      >
        {props?.menuTabs && props?.menuTabs(props)}
        {props?.data?.showCollapse && (
          <div className="absolute -top-[9px] w-full flex justify-center gap-2 cursor-pointer hover:cursor-pointer">
            <div
              title="btn-collapse"
              role="button"
              className={`flex items-center justify-center w-7 h-7 shadow-md drop-shadow-sm rounded-full p-2 bg-slate-100 border cursor-pointer hover:cur`}
              onClick={handlerCollapse}
            >
              <div className="">
                {!collapse ? (
                  <ArrowUpwardRoundedIcon
                    style={{ fontSize: "15px", color: "#16a34a" }}
                  />
                ) : (
                  <ArrowDownwardRoundedIcon
                    style={{ fontSize: "15px", color: "#16a34a" }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentHeader;
