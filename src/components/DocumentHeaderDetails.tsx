import React, { useState } from "react";
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
import { dateFormat } from "@/utilies";
import WarehouseRepository from "@/services/warehouseRepository";
import MenuButton from "./button/MenuButton";
import ChartOfAccountsRepository from "@/services/actions/ChartOfAccountsRepository";

interface DocumentHeaderDetailsProps {
  data: any;
  onCopyTo?: (data?: any) => void;
  onFirstPage?: () => void;
  onLastPage?: () => void;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  menuTabs?: JSX.Element | React.ReactNode;
  type?: string;
  handlerChangeMenu: (index: number) => void;
  PaymentAccount?: boolean;
  CashAccount?: boolean;
}

const DocumentHeaderDetails: React.FC<DocumentHeaderDetailsProps> = (
  props: DocumentHeaderDetailsProps
) => {
  const [collapse, setCollapse] = React.useState<boolean>(true);
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

  const navigateToEdit = () => navigate(location.pathname + "/edit");
  const navigateToNextPage = () => {
    if (id !== undefined) {
      const nextID = Number(id) + 1;
      const nextURL = location.pathname.replace(`${id}`, `${nextID}`);
      window.location.href = nextURL;
    } else {
    }
  };
  const navigateToPrevPage = () => {
    if (id !== undefined) {
      const prevID = Number(id) - 1;
      const prevURL = location.pathname.replace(`${id}`, `${prevID}`);
      window.location.href = prevURL;
    } else {
    }
  };

  return (
    <div
      className={`w-full flex flex-col rounded ${
        collapse ? "gap-3" : ""
      } justify-between items-center  sticky top-0 border-y bg-white z-50 px-4  `}
    >
      <div
        className={`w-full flex justify-between px-6 ${
          collapse ? "border-b  py-2" : "pt-2"
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
      </div>
      {props.type === "Sale" && (
        <div className="w-full sticky">
          <Sale data={props.data} CashAccount={props.CashAccount} />
          <div className="w-full flex gap-2 px-12 text-sm  border-y-gray-200  sticky  ">
            <div>
              <MenuButton
                active={props.data.tapIndex === 0}
                onClick={() => props.handlerChangeMenu(0)}
              >
                <span> Content</span>
              </MenuButton>
              <MenuButton
                active={props.data.tapIndex === 1}
                onClick={() => props.handlerChangeMenu(1)}
              >
                Logistic
              </MenuButton>
              <MenuButton
                active={props.data.tapIndex === 2}
                onClick={() => props.handlerChangeMenu(2)}
              >
                Attachment
              </MenuButton>
            </div>
          </div>
        </div>
      )}

      {props.type === "Collection" && (
        <div className={`w-full  `}>
          <Collection data={props.data} />
          <div className="w-full flex gap-2 px-12 text-sm  border-y-gray-200  sticky  ">
            <div>
              <MenuButton
                active={props.data.tapIndex === 0}
                onClick={() => props.handlerChangeMenu(0)}
              >
                <span> Payment Means</span>
              </MenuButton>

              {!props.PaymentAccount && (
                <MenuButton
                  active={props.data.tapIndex === 1}
                  onClick={() => props.handlerChangeMenu(1)}
                >
                  Content
                </MenuButton>
              )}

              <MenuButton
                active={props.data.tapIndex === 2}
                onClick={() => props.handlerChangeMenu(2)}
              >
                Attachment
              </MenuButton>
            </div>
          </div>
        </div>
      )}

      {props.type === "Expense" && (
        <div className={`w-full   `}>
          <Expense data={props.data} />
          <div className="w-full flex gap-2 px-12 text-sm  border-y-gray-200  sticky  ">
            <div>
              <MenuButton
                active={props.data.tapIndex === 0}
                onClick={() => props.handlerChangeMenu(0)}
              >
                <span> Content</span>
              </MenuButton>

              <MenuButton
                active={props.data.tapIndex === 1}
                onClick={() => props.handlerChangeMenu(1)}
              >
                Attachment
              </MenuButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Sale = (props: any) => {
  const { data }: any = props;
  return (
    <>
      <div className=" bg-white  px-12 pb-2 border-b">
        <div className="grid grid-cols-12   w-full">
          <div className="col-span-5  col-start-1">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Customer
                </label>
              </div>
              <div className="col-span-3">{data?.CardCode}</div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Name
                </label>
              </div>
              <div className="col-span-3">{data?.CardName}</div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Branch
                </label>
              </div>
              <div className="col-span-3">{data?.BPLName ?? "N/A"}</div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Warehouse <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                {" "}
                {new WarehouseRepository().find(props?.data?.U_tl_whsdesc)
                  ?.WarehouseName ?? "N/A"}
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Contact Person
                </label>
              </div>
              <div className="col-span-3">
                {props?.data?.vendor?.contactEmployee?.find(
                  (e: any) => e.id == props.data.ContactPersonCode
                )?.name ?? "N/A"}
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Remark
                </label>
              </div>
              <div className="col-span-3">{data?.Comments ?? "N/A"}</div>
            </div>
          </div>
          {/* <div className="col-span-2  bg-green-200"></div> */}
          <div className="col-span-5 col-start-9 ">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Posting Date
                </label>
              </div>

              <div className="col-span-3">{dateFormat(data?.TaxDate)}</div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Delivery Date
                </label>
              </div>
              <div className="col-span-3">{dateFormat(data?.DocDueDate)}</div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Document Date
                </label>
              </div>
              <div className="col-span-3">{dateFormat(data?.DocDate)}</div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Sale Employee
                </label>
              </div>
              <div className="col-span-3">
                {props?.data?.vendor?.contactEmployee?.find(
                  (e: any) => e.id == props.data.ContactPersonCode
                )?.name ?? "N/A"}
              </div>
            </div>
            {props.CashAccount && (
              <div className="grid grid-cols-5 py-2">
                <div className="col-span-2 text-gray-600 ">Cash Account</div>
                <div className="col-span-3 text-gray-900">
                  {props?.data?.ControlAccount ?? "N/A"}

                  {
                    new ChartOfAccountsRepository()?.find(
                      props?.data?.ControlAccount
                    )?.Name
                  }
                </div>
              </div>
            )}

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Line of Business
                </label>
              </div>
              <div className="col-span-3">
                {props?.data?.U_tl_arbusi ?? "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Collection = (props: any) => {
  const { data }: any = props;
  return (
    <>
      <div className=" bg-white  px-12 pb-2 border-b">
        <div className="grid grid-cols-12   w-full">
          <div className="col-span-5  col-start-1">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Customer
                </label>
              </div>
              <div className="col-span-3">{data?.CardCode ?? "N/A"}</div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Name
                </label>
              </div>

              <div className="col-span-3">{data?.CardName}</div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Branch
                </label>
              </div>

              <div className="col-span-3">{data?.BPLName ?? "N/A"}</div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Currency
                </label>
              </div>
              <div className="col-span-3">
                {" "}
                {data?.U_tl_doccur ?? "N/A"}{" "}
                {data?.ExchangeRate > 1 && ` - ${data?.ExchangeRate}`}{" "}
              </div>
            </div>
          </div>

          {/* <div className="col-span-2  bg-green-200"></div> */}
          <div className="col-span-5 col-start-9 ">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  DocNum
                </label>
              </div>
              <div className="col-span-3">{data?.DocNum}</div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Posting Date
                </label>
              </div>
              <div className="col-span-3">{dateFormat(data?.TaxDate)}</div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Document Date
                </label>
              </div>
              <div className="col-span-3">{dateFormat(data?.DocDate)}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Expense = (props: any) => {
  const { data }: any = props;
  return (
    <>
      <div className=" bg-white  px-12 pb-2 border-b">
        <div className="grid grid-cols-12   w-full">
          <div className="col-span-5  col-start-1">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Branch
                </label>
              </div>
              <div className="col-span-3">{data?.BPLName ?? "N/A"}</div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Currency
                </label>
              </div>
              <div className="col-span-3">
                {" "}
                {data?.U_tl_doccur ?? "N/A"}{" "}
                {data?.ExchangeRate > 1 && ` - ${data?.ExchangeRate}`}{" "}
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  DocNum
                </label>
              </div>

              <div className="col-span-3">{data?.DocNum}</div>
            </div>
          </div>

          {/* <div className="col-span-2  bg-green-200"></div> */}
          <div className="col-span-5 col-start-9 ">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Posting Date
                </label>
              </div>
              <div className="col-span-3">{dateFormat(data?.TaxDate)}</div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Document Date
                </label>
              </div>
              <div className="col-span-3">{dateFormat(data?.DocDate)}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentHeaderDetails;
function handlerChangeMenu(index: any, number: any) {
  throw new Error("Function not implemented.");
}
