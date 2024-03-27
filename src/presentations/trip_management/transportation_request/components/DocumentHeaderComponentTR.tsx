import React, { useMemo, useState } from "react";
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
import { useQuery } from "react-query";
import request from "@/utilies/request";
import PriceListRepository from "@/services/actions/pricelistRepository";
import { formatNumberWithoutRounding } from "@/utilies/formatNumber";
interface DocumentHeaderComponentProps {
  leftSideField: JSX.Element | React.ReactNode;
  rightSideField: JSX.Element | React.ReactNode;
  data: any;
  onCopyTo?: (data?: any) => void;
  onFirstPage?: () => void;
  onLastPage?: () => void;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  menuTabs: JSX.Element | React.ReactNode;
  HeaderCollapeMenu?: JSX.Element | React.ReactNode;
  collapse: boolean;
  status?:string
}

const DocumentHeaderComponentTR: React.FC<DocumentHeaderComponentProps> = (
  props: DocumentHeaderComponentProps
) => {
  
  const [collapse, setCollapse] = React.useState<boolean>(props?.collapse);
  const { theme } = React.useContext(ThemeContext);

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

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

  const navigateToEdit = () => navigate(location.pathname + `/edit?status=${props?.status}`);

 
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
        <div className="flex gap-2 items-center">
          <h1 className="text-md  capitalize">
            {props?.data?.headerText ?? formattedText} - {props?.data?.DocNum}
          </h1>
          {props.data.DocumentStatus === "bost_Close" ||
            (!(location.pathname.includes("edit") || !id) && (
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
        {/* left side fields  */}

        {/* {props?.leftSideField} */}

        {/* right side fields */}
        {/* {props?.rightSideField} */}

        {props?.HeaderCollapeMenu}
      </div>
      <div
        className={`w-full flex gap-2 px-4 text-sm border-t-gray-200 py-0 sticky ${
          !collapse ? "mt-0" : ""
        } ${props?.data.showCollapse ? `border-t` : `mt-[-22px]`}`}
      >
        {props?.menuTabs}
        {props?.data.showCollapse && (
          <div className="absolute -top-[12px] w-full flex justify-center gap-2 cursor-pointer hover:cursor-pointer">
            <div
              title="btn-collapse"
              role="button"
              className={`flex items-center justify-center w-7 h-7 rounded-full p-2 bg-white border border-green-400 cursor-pointer hover:cursor-pointer`}
              onClick={handlerCollapse}
            >
              <div className="mb-1">
                {collapse ? (
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

export default DocumentHeaderComponentTR;

