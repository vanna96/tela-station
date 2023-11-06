import telaLogoBig from "@/assets/img/tela-logo-big.png";
import telaLogo from "@/assets/img/tela-logo.png";
import React, { useContext, useState } from "react";
import { FiBarChart2, FiGrid, FiShoppingBag } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { BsCollection } from "react-icons/bs";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { AiOutlineCaretDown, AiOutlineCaretRight } from "react-icons/ai";
import { motion } from "framer-motion";

export default function SideBar(props: any) {
  const navigate = useNavigate();

  const goTo = (route: string) => {
    navigate(route);
  };

  const img = React.useMemo(
    () => (
      <img src={props?.collapse ? telaLogoBig : telaLogo} alt="" className="" />
    ),
    [props.collapse]
  );

  return (
    <motion.aside className="border-r ease-in-out flex flex-col py-4 relative z-20 bg-gradient-to-tr from-green-500 to-green-600">
      {props?.collapse ? (
        <div className="h-15 w-40 transition-all duration-600 scale-100 mr-8 ml-4">
          {img}
        </div>
      ) : (
        <div className="h-14 w-14 transition-all duration-500 scale-75">
          {img}
        </div>
      )}

      <div className="mt-12 grow flex flex-col transition-all duration-600 gap-2 whitespace-nowrap overflow-hidden text-base bg-gradient-to-tr from-green-500 to-green-600">
        <NavButton
          onClick={() => {
            goTo("/dashboard");
          }}
          route="dashboard"
          collapse={props?.collapse}
          icon={<FiGrid />}
          title="Dashboard"
        />
        <NavButton
          onClick={() => {
            goTo("/sale");
          }}
          route="sale"
          collapse={props.collapse}
          icon={<HiOutlineShoppingBag />}
          title="Ordering System"
        >
          <ChildButton
            icon={<HiOutlineShoppingBag />}
            onClick={() => goTo("/sale/fuel-sales")}
            route="fuel-sales"
            collapse={props?.collapse}
            title="Fuel Sales"
          />
          <ChildButton
            icon={<HiOutlineShoppingBag />}
            onClick={() => goTo("/sale/lube-sales")}
            route="lube-sales"
            collapse={props?.collapse}
            title="Lube Sales"
          />
          <ChildButton
            icon={<HiOutlineShoppingBag />}
            onClick={() => goTo("/sale/lpg-sales")}
            route="lpg-sales"
            collapse={props?.collapse}
            title="LPG"
          />

          <ChildButton
            icon={<HiOutlineShoppingBag />}
            onClick={() => goTo("/sale/pump-record")}
            route="pump-record"
            collapse={props?.collapse}
            title="Pump Record"
          />
          <ChildButton
            icon={<HiOutlineShoppingBag />}
            onClick={() => goTo("/sale/morph-price")}
            route="morph-price"
            collapse={props?.collapse}
            title="Morph Price"
          />
        </NavButton>
        <NavButton
          onClick={() => {
            goTo("/banking");
          }}
          route="banking"
          collapse={props.collapse}
          icon={<BsCollection />}
          title="Collection"
        >
          <ChildButton
            icon={<HiOutlineShoppingBag />}
            onClick={() => goTo("/banking/settle-receipt")}
            route="settle-receipt"
            collapse={props?.collapse}
            title="Settle Receipt"
          />
          <ChildButton
            icon={<HiOutlineShoppingBag />}
            onClick={() => goTo("/banking/payment-account")}
            route="payment-account"
            collapse={props?.collapse}
            title="Payment Account"
          />
          <ChildButton
            icon={<HiOutlineShoppingBag />}
            onClick={() => goTo("/banking/direct-account")}
            route="direct-account"
            collapse={props?.collapse}
            title="Direct Account"
          />
        </NavButton>
        <NavButton
          onClick={() => {
            goTo("/expense");
          }}
          route="expense"
          collapse={props.collapse}
          icon={<FiBarChart2 />}
          title="Expense Log"
        >
          <ChildButton
            icon={<HiOutlineShoppingBag />}
            onClick={() => goTo("/expense/log")}
            route="log"
            collapse={props?.collapse}
            title="Log"
          />
          <ChildButton
            icon={<HiOutlineShoppingBag />}
            onClick={() => goTo("/expense/clearance")}
            route="clearance"
            collapse={props?.collapse}
            title="Clearance"
          />
        </NavButton>
      </div>
    </motion.aside>
  );
}

type NavButtonProps = {
  collapse: boolean;
  title: string;
  route: string;
  disable?: boolean;
  icon: React.ReactElement;
  onClick: () => void;
  children?: React.ReactNode;
};

type ChildButtonProps = {
  collapse: boolean;
  title: string;
  route: string;
  disable?: boolean;
  icon?: React.ReactElement;
  onClick: () => void;
};

export function NavButton(props: NavButtonProps) {
  const location = useLocation();

  const hasChildren = React.Children.count(props.children) > 0;

  const [isExpanded, setIsExpanded] = useState(false);
  function toggleExpansion() {
    setIsExpanded(!isExpanded);
  }

  const isActive = location.pathname.startsWith(props.route);
  const isDashboard = location.pathname?.split("/")[1] === "dashboard";

  return (
    <>
      <motion.div className="bg-transparent">
        <div
          role="button"
          onClick={() => {
            props.onClick();
            if (hasChildren) {
              toggleExpansion(); // Allow multiple parents to be open
            }
          }}
          className={`flex text-base ${
            props.collapse ? "pl-6 pr-10 2xl:px-4" : "pl-[0.9rem]"
          } ${
            isDashboard
              ? "bg-white text-gray-900"
              : isExpanded
              ? "bg-white text-gray-900"
              : ""
          } transition-transform duration-100 ease-in text-white hover:scale-105 active:scale-95 py-[0.6rem]  items-center gap-4`}
        >
          <span
            className={`${
              isDashboard || isExpanded ? "bg-white text-xl text-gray-900" : ""
            }`}
          >
            {props.icon}
          </span>
          {props.collapse ? (
            <span className={isDashboard || isExpanded ? "text-gray-900" : ""}>
              {props.title}
            </span>
          ) : null}
          {hasChildren && (
            <span className="mr-2">
              <div
                className={`flex items-center text-right ${
                  isDashboard || isExpanded ? "text-gray-900" : ""
                }`}
              >
                <span className="mr-2">
                  {isExpanded ? (
                    <AiOutlineCaretDown />
                  ) : (
                    <AiOutlineCaretRight />
                  )}
                </span>
              </div>
            </span>
          )}
        </div>
        <div
          className={`bg-white text-gray-900 ${
            isDashboard || isExpanded ? "bg-gray-200 text-gray-900" : ""
          }`}
        >
          {isExpanded && props.children}
        </div>
      </motion.div>
    </>
  );
}

export function ChildButton(props: ChildButtonProps) {
  const location = useLocation();

  const isActive = location.pathname?.split("/")[2] === props.route;
  const parentIsActive = location.pathname?.split("/")[1] === props.route;

  return (
    <>
      <div
        role="button"
        onClick={props.onClick}
        className={`flex text-sm${
          props.collapse ? "mt-1 pl-9 pr-10 2xl:px-4" : "pl-[0.9rem]"
        } ${
          parentIsActive || isActive ? "bg-gray-200 mx-4 text-gray-900" : ""
        } transition-transform duration-100 ease-in text-gray-900 hover:scale-105 active:scale-95 py-[0.6rem] ml-1 mr-1 rounded-md items-center gap-4`}
      >
        <span
          className={`${
            parentIsActive || isActive ? "text-xl text-gray-900" : ""
          }`}
        >
          {props.icon}
        </span>
        {props.collapse ? (
          <span className={parentIsActive || isActive ? "text-gray-900" : ""}>
            {props.title}
          </span>
        ) : null}
      </div>
    </>
  );
}
