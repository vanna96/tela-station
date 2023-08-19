import React from "react"
import BackButton from "./button/BackButton"
import {
  HiOutlineEye,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineDocumentAdd,
  HiOutlineChevronDown,
} from "react-icons/hi"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Button, IconButton } from "@mui/material"
import { AiOutlinePushpin } from "react-icons/ai"
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io"
import { ThemeContext } from "@/contexts"
import { FiEdit } from "react-icons/fi"

interface DocumentHeaderComponentProps {
  data: any
  onCopyTo?: (data?: any) => void
  onFirstPage?: () => void
  onLastPage?: () => void
  onPreviousPage?: () => void
  onNextPage?: () => void
  menuTabs: JSX.Element | React.ReactNode
}

const DocumentHeaderComponent: React.FC<DocumentHeaderComponentProps> = (
  props: DocumentHeaderComponentProps
) => {
  const [collapse, setCollapse] = React.useState<boolean>(true)
  const { theme } = React.useContext(ThemeContext)

  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()

  const handlerGoToEdit = () => {
    navigate(location.pathname + "/edit", { state: props.data, replace: true })
  }

  const handlerGoToCreate = () => {
    navigate(location.pathname.replace(`${id}/edit`, "create"))
  }

  const handlerCopyTo = () => {
    if (props.onCopyTo) {
      props.onCopyTo(props.data ?? {})
    }
  }

  const handlerCollapse = () => {
    setCollapse(!collapse)
  }

  const navigateToEdit = () => navigate(location.pathname + "/edit")

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
          {!(location.pathname.includes("edit") || !id) && (
            <IconButton
              size="small"
              sx={{ color: "rgb(59 130 246) !important", marginLeft: "10px" }}
              onClick={navigateToEdit}
            >
              <FiEdit className="text-red-200" />
            </IconButton>
          )}
        </div>
        <div className=" flex gap-3 pr-3"></div>
      </div>
      <div
        className={`w-full  grid grid-cols-2 gap-2 px-6 py-1 transition-all rounded overflow-hidden duration-300 ease-out  ${
          !collapse ? "h-[6rem]" : "h-0"
        }`}
      >
        <div className="w-full text-sm flex gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[#ACACAC] text-sm font-bold">
              Vendor / Customer
            </span>
            <span className="font-bold text-blue-500">{props?.data?.CardCode}</span>
            <span className="font-bold text-blue-500">{props?.data?.CardName}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[#ACACAC] text-sm font-bold">
              Total Payment Due
            </span>
            <span className="font-bold text-blue-500">AUD {2000}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[#ACACAC] text-sm font-bold">Status</span>
            <span className="font-bold text-green-500 uppercase">Open</span>
          </div>
        </div>
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
            className={`flex items-center justify-center w-8 h-8 shadow-md drop-shadow-sm rounded-md p-2 bg-white border `}
            onClick={handlerCollapse}
          >
            {!collapse ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentHeaderComponent
