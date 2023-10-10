import React from "react";
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

interface DocumentHeaderComponentProps {
  data: any;
  onCopyTo?: (data?: any) => void;
  onFirstPage?: () => void;
  onLastPage?: () => void;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  menuTabs: JSX.Element | React.ReactNode;
}

const DocumentHeaderComponent: React.FC<DocumentHeaderComponentProps> = (
  props: DocumentHeaderComponentProps
) => {
  const [collapse, setCollapse] = React.useState<boolean>(true);
  const { theme } = React.useContext(ThemeContext);

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const handlerGoToEdit = () => {
    navigate(location.pathname + "/edit", { state: props.data, replace: true });
  };

  // const handlerGoToCreate = () => {

  //   const url = location.pathname.replace(`${id}/edit`, "create");
  //   window.location.href = url;
  // };

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
            {location.pathname.split("/")[2].replace("-", " ")} -{" "}
            {props?.data?.DocNum}
          </h1>
          {props.data.DocumentStatus === "bost_Close" ||
            (!(location.pathname.includes("edit") || !id) && (
              <div className="">
                <Button
                  variant="outlined"
                  size="small"
                  // sx={{ color: "rgb(59 130 246) !important", marginLeft: "10px" }}
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
        className={`w-full  grid grid-cols-2 gap-2 px-6 py-1 transition-all rounded overflow-hidden duration-300 ease-out  ${
          !collapse ? "h-[6rem]" : "h-0"
        }`}
      >
        <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
          <div className="col-span-3">
            <div className="flex flex-col gap-2">
              <span className="text-gray-600 text-base font-medium">
                Customer Code
              </span>
              <span className="font-medium text-green-700">
                {props?.data?.CardCode}
              </span>
            </div>
          </div>
          <div className="col-span-3">
            <div className="flex flex-col gap-2">
              <span className="text-gray-600 text-base font-medium">Name</span>
              <span className="font-medium text-green-700">
                {props?.data?.CardName}
              </span>
            </div>
          </div>
          <div className="col-span-3">
            <div className="flex flex-col gap-2">
              <span className="text-gray-600 text-base font-medium">
                Status
              </span>
              <span className="font-medium text-green-700">
                {props?.data?.DocumentStatus?.split("bost_")}
              </span>
            </div>
          </div>
          <div className="col-span-3">
            <div className="flex flex-col gap-2">
              <span className="text-gray-600 text-base font-medium">Total</span>
              <span className="font-medium text-green-700">
                {props?.data?.DocTotal}
                {props?.data?.DocCurrency}
              </span>
            </div>
          </div>
        </div>

        {!location.pathname.includes("create") && (
          <div className="grid grid-cols-12 gap-3 mb-5 mt-2 mx-1 rounded-md bg-white ">
            <div className="col-span-5"></div>
            <div className="col-span-7">
              <div className="grid grid-cols-7">
                <div className="col-span-2  mt-3">
                  <Button variant="outlined" className="text-green">
                    <span className="text-green-600 mr-1">
                      <BiLeftArrow />
                    </span>
                    Prev
                  </Button>
                </div>
                <div className="col-span-3 text-center ">
                  <div className="flex flex-col gap-2">
                    <span className="text-gray-600 text-base font-medium">
                      Doc. Number
                    </span>
                    <span className="font-medium text-green-700">
                      {props?.data?.DocNum ??
                        props?.data?.NextNum ??
                        "Document Number"}
                    </span>
                  </div>
                </div>
                <div className="col-span-2 mt-3">
                  <Button variant="outlined" onClick={navigateToNextPage}>
                    Next
                    <div>
                      <BiRightArrow className="text-green-600 ml-1  " />
                    </div>
                  </Button>
                </div>
              </div>
            </div>
            {/* <div className="col-span-2">
              <Button variant="contained"> + New</Button>
            </div> */}
          </div>
        )}
      </div>
      <div
        className={`w-full flex gap-2 px-4 text-sm border-t border-t-gray-200 py-0 sticky ${
          collapse ? "mt-0" : ""
        }`}
      >
        {props?.menuTabs}
        <div className="absolute -top-[16px] w-full flex justify-center gap-2">
          <div
            title="btn-collapse"
            role="button"
            className={`flex items-center justify-center w-6 h-6 shadow-md drop-shadow-sm rounded-md p-2 bg-slate-200 border `}
            onClick={handlerCollapse}
          >
            <div className="opacity-20">
              {!collapse ? <IoIosArrowUp /> : <BsArrowDownShort />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentHeaderComponent;
