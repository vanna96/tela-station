import telaLogoBig from "@/assets/img/tela-logo-big.png";
import telaLogo from "@/assets/img/tela-logo.png";
import React, { useContext, useState } from "react";
import { FiBarChart2, FiGrid, FiShoppingBag } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { BsCollection } from "react-icons/bs";
import { HiOutlineShoppingBag } from "react-icons/hi";
import {
  AiOutlineCaretDown,
  AiOutlineCaretRight,
  AiOutlineStock,
} from "react-icons/ai";
import { motion } from "framer-motion";
import { MdOutlineStore } from "react-icons/md";

export default function SideBari(props: any) {
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

  const [activeParent, setActiveParent] = useState<string | null>(null);

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
        <DashboardButton
          onClick={() => {
            goTo("/dashboard");
          }}
          route="dashboard"
          collapse={props?.collapse}
          icon={<FiGrid />}
          title="Dashboard"
          isActive={activeParent === "dashboard"} // Pass isActive prop
          setActiveParent={setActiveParent} // Pass setActiveParent prop
        ></DashboardButton>
        <NavButton
          onClick={() => {
            goTo("/master-data");
          }}
          route="master-data"
          collapse={props?.collapse}
          icon={<FiGrid />}
          title="Master Data"
          isActive={activeParent === "master-data"} // Pass isActive prop
          setActiveParent={setActiveParent} // Pass setActiveParent prop
        >
          <ChildButton
            icon={<HiOutlineShoppingBag />}
            onClick={() => goTo("/master-data/dispenser")}
            route="dispenser"
            collapse={props?.collapse}
            title="Dispenser"
          />
          <ChildButton
            icon={<HiOutlineShoppingBag />}
            onClick={() => goTo("/master-data/expense-dictionary")}
            route="expense-dictionary"
            collapse={props?.collapse}
            title="Expense Dictionary"
          />
          <ChildButton
            icon={<HiOutlineShoppingBag />}
            onClick={() => goTo("/master-data/cash-account")}
            route="cash-account"
            collapse={props?.collapse}
            title="Cash Account"
          />
        </NavButton>
        <NavButton
          onClick={() => {
            goTo("/sale");
          }}
          route="sale"
          collapse={props.collapse}
          icon={<HiOutlineShoppingBag />}
          title="Ordering System"
          isActive={activeParent === "sale"} // Pass isActive prop
          setActiveParent={setActiveParent} // Pass setActiveParent prop
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
            goTo("/sale-retail");
          }}
          route="sale-retail"
          collapse={props.collapse}
          icon={<HiOutlineShoppingBag />}
          title="sale-retail"
          isActive={activeParent === "sale-retail"} // Pass isActive prop
          setActiveParent={setActiveParent} // Pass setActiveParent prop
        >
          <ChildButton
            icon={<HiOutlineShoppingBag />}
            onClick={() => goTo("/sale-retail/fuel-sales")}
            route="fuel-sales"
            collapse={props?.collapse}
            title="Fuel Sales"
          />
          <ChildButton
            icon={<HiOutlineShoppingBag />}
            onClick={() => goTo("sale-retail/lube-sales")}
            route="lube-sales"
            collapse={props?.collapse}
            title="Lube Sales"
          />
          <ChildButton
            icon={<HiOutlineShoppingBag />}
            onClick={() => goTo("/sale-retail/lpg-sales")}
            route="lpg-sales"
            collapse={props?.collapse}
            title="LPG"
          />

          <ChildButton
            icon={<HiOutlineShoppingBag />}
            onClick={() => goTo("/sale-retail/sale-order")}
            route="sale-order"
            collapse={props?.collapse}
            title="Sale Order"
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
          isActive={activeParent === "banking"} // Pass isActive prop
          setActiveParent={setActiveParent} // Pass setActiveParent prop
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
          isActive={activeParent === "expense"} // Pass isActive prop
          setActiveParent={setActiveParent} // Pass setActiveParent prop
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

        <NavButton
          onClick={() => {
            goTo("/stock-control");
          }}
          route="stock-control"
          collapse={props.collapse}
          icon={<AiOutlineStock />}
          title="Stock Control"
          isActive={activeParent === "stock-control"} // Pass isActive prop
          setActiveParent={setActiveParent} // Pass setActiveParent prop
        >
          <ChildButton
            icon={<MdOutlineStore />}
            onClick={() => goTo("/stock-control/inventory-transfer-request")}
            route="inventory-transfer-request"
            collapse={props?.collapse}
            title="Inventory Transfer Request"
          />
          <ChildButton
            icon={<MdOutlineStore />}
            onClick={() => goTo("/stock-control/stock-transfer")}
            route="stock-transfer"
            collapse={props?.collapse}
            title="Stock Transfer"
          />
          <ChildButton
            icon={<MdOutlineStore />}
            onClick={() => goTo("/stock-control/good-issue")}
            route="good-issue"
            collapse={props?.collapse}
            title="Good Issue"
          />
          <ChildButton
            icon={<MdOutlineStore />}
            onClick={() => goTo("/stock-control/good-receipt")}
            route="good-receipt"
            collapse={props?.collapse}
            title="Good Receipt"
          />
          <ChildButton
            icon={<MdOutlineStore />}
            onClick={() => goTo("/stock-control/pump-test")}
            route="pump-test"
            collapse={props?.collapse}
            title="Pump Test"
          />
          <ChildButton
            icon={<MdOutlineStore />}
            onClick={() => goTo("/stock-control/fuel-level")}
            route="fuel-level"
            collapse={props?.collapse}
            title="Fuel Level"
          />
        </NavButton>
        <NavButton
          onClick={() => {
            goTo("/trip-management");
          }}
          route="trip-management"
          collapse={props.collapse}
          icon={<AiOutlineStock />}
          title="Trip Management"
          isActive={activeParent === "trip-management"} // Pass isActive prop
          setActiveParent={setActiveParent} // Pass setActiveParent prop
        >
          <ChildButton
            icon={<MdOutlineStore />}
            onClick={() => goTo("/trip-management/transportation-request")}
            route="transportation-request"
            collapse={props?.collapse}
            title="Transportation Request"
          />
          <ChildButton
            icon={<MdOutlineStore />}
            onClick={() => goTo("/trip-management/transportation-order")}
            route="transportation-order"
            collapse={props?.collapse}
            title="Transportation Order"
          />
        </NavButton>
      </div>
    </motion.aside>
  );
}

type NavButtonProps = {
  collapse: boolean;
  title: string;
  route: string | null;
  disable?: boolean;
  icon: React.ReactElement;
  onClick: () => void;
  isActive: boolean; // Include isActive prop
  setActiveParent?: (route: string | null) => void; // Include setActiveParent prop
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
  const isActive = location.pathname?.split("/")[1] === props.route;
  const hasChildren = React.Children.count(props.children) > 0;

  const toggleExpansion = () => {
    if (props.setActiveParent && isActive !== undefined) {
      if (props.route !== null) {
        props.setActiveParent(
          isActive ? location.pathname?.split("/")[1] : props.route
        );
      }
    }
  };

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
            props.collapse ? "pl-6 pr-10 2xl:px-4" : "pl-[1rem]"
          } ${
            props.isActive
              ? "bg-white text-gray-900"
              : props.isActive
              ? "bg-white text-gray-900"
              : ""
          } transition-transform duration-100 ease-in text-white hover:scale-105 active:scale-95 py-[0.6rem]  items-center gap-4`}
        >
          <span
            className={`${
              props.isActive ? "bg-white text-xl text-gray-900" : ""
            }`}
          >
            {props.icon}
          </span>
          {props.collapse ? (
            <span className={props.isActive ? "text-gray-900" : ""}>
              {props.title}
            </span>
          ) : null}
          {hasChildren && (
            <span className="mr-2">
              <div
                className={`flex items-center text-right  ${
                  props.isActive ? "text-gray-900" : ""
                }`}
              >
                <span className="mr-2">
                  {props.isActive ? (
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
            props.isActive ? "bg-gray-200 text-gray-900" : ""
          }`}
        >
          {props.isActive && props.children}
        </div>
      </motion.div>
    </>
  );
}
export function DashboardButton(props: NavButtonProps) {
  const location = useLocation();
  const isActive = location.pathname?.split("/")[1] === "dashboard";
  const hasChildren = React.Children.count(props.children) > 0;

  const toggleExpansion = () => {
    if (props.setActiveParent && isActive !== undefined) {
      if (props.route !== null) {
        props.setActiveParent(
          isActive ? location.pathname?.split("/")[1] : props.route
        );
      }
    }
  };

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
            props.isActive
              ? "bg-white text-gray-900"
              : isActive
              ? "bg-white text-gray-900"
              : ""
          } transition-transform duration-100 ease-in text-white hover:scale-105 active:scale-95 py-[0.6rem]  items-center gap-4`}
        >
          <span
            className={`${isActive ? "bg-white text-xl text-gray-900" : ""}`}
          >
            {props.icon}
          </span>
          {props.collapse ? (
            <span className={isActive ? "text-gray-900" : ""}>
              {props.title}
            </span>
          ) : null}
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
      {props.collapse && (
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
      )}
    </>
  );
}
