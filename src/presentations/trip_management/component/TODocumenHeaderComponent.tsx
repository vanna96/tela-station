import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { MdEdit } from "react-icons/md";
import { IoCreate } from "react-icons/io5";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";

interface TODocumenHeaderComponentProps {
  leftSideField: JSX.Element | React.ReactNode;
  rightSideField: JSX.Element | React.ReactNode;
  data: any;
  menuTabs: JSX.Element | React.ReactNode;
  HeaderCollapeMenu?: JSX.Element | React.ReactNode;
  status: string | undefined,
  edit: boolean | undefined
}

const TODocumenHeaderComponent: React.FC<TODocumenHeaderComponentProps> = (
  props: TODocumenHeaderComponentProps
) => {
  const [collapse, setCollapse] = React.useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const handlerGoToCreate = () => {
    navigate('/trip-management/transportation-order/create')
  };


  const handlerCollapse = () => {
    setCollapse(!collapse);
  };

  const navigateToEdit = () => navigate(location.pathname + `/edit?status=${props.status}`);

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
      className={`w-full flex flex-col rounded ${!collapse ? "gap-3" : ""
        } justify-between items-center  sticky top-0 border-y bg-white z-50 px-4  `}
    >
      <div
        className={`w-full flex justify-between px-6 ${!collapse ? "border-b  py-2" : "pt-2"
          } border-b-gray-200 z-50 px-0`}
      >
        <div className="flex gap-2 items-center">
          <h1 className="text-md  capitalize">
            {props?.data?.headerText ?? formattedText} - {props?.data?.DocNum}
          </h1>
          {(props.status !== 'C' || props?.edit) && (
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
          )}
          {(props?.edit || id) && (
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
        className={`w-full  grid grid-cols-2 duration-300 ease-in overflow-hidden  ${collapse ? "h-[10rem]" : "h-0"
          }`}
      >
        {props?.HeaderCollapeMenu}
      </div>
      <div
        className={`w-full flex gap-2 px-4 text-sm border-t-gray-200 py-0 sticky ${!collapse ? "mt-0" : ""
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

export default TODocumenHeaderComponent;


