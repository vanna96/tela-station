import telaLogoBig from "@/assets/img/tela-logo-big.png";
import telaLogo from "@/assets/img/tela-logo.png";
import React, { useContext, useState } from "react";
import { FiBarChart2, FiGrid, FiShoppingBag } from "react-icons/fi";
import { GiFactory } from "react-icons/gi";
import {
  MdOutlineDirectionsTransitFilled,
  MdOutlineLightMode,
} from "react-icons/md";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BsClipboardData,
  BsCollection,
  BsFuelPumpDiesel,
} from "react-icons/bs";
import { ThemeContext, useThemeContext } from "@/contexts";
import { Collapse } from "@mui/material";
import { AiOutlineStock } from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi";

export default function SideBar(props: any) {
  const navigate = useNavigate();

  const goTo = (route: string) => {
    navigate(route);
  };

  const { theme } = useContext(ThemeContext);

  const img = React.useMemo(
    () => (
      <img src={props?.collapse ? telaLogoBig : telaLogo} alt="" className="" />
    ),
    [props.collapse]
  );

  return (
    // <aside className="border-r transition-transform duration-300 ease-in-out flex flex-col py-4 relative z-20 bg-green-500">
    <aside className="border-r transition-transform duration-300 ease-in-out transition-width flex flex-col py-4 relative z-20 bg-gradient-to-tr from-green-500 to-green-600 ">
      {props?.collapse ? (
        <div className="h-15 w-40  scale-100 mr-8 ml-4 ">{img}</div>
      ) : (
        <div className="h-14 w-14  scale-75 ">{img}</div>
      )}

      <div className="mt-8 grow flex flex-col gap-2 whitespace-nowrap overflow-hidden text-base  bg-gradient-to-tr from-green-500 to-green-600 ">
        <NavButton
          onClick={() => goTo("/system-initialize")}
          route="system-initialize"
          collapse={props?.collapse}
          icon={<FiGrid />}
          title="System Initialize"
        />
        <NavButton
          onClick={() => goTo("/sale")}
          route="sale"
          collapse={props?.collapse}
          icon={<HiOutlineShoppingBag />}
          title="Ordering System"
        />
        <NavButton
          onClick={() => goTo("/banking")}
          route="banking"
          collapse={props?.collapse}
          icon={<BsCollection />}
          title="Collection"
        />
        <NavButton
          onClick={() => goTo("/expense")}
          route="expense"
          collapse={props?.collapse}
          icon={<FiBarChart2 />}
          title="Expense Log"
        />
        {/* <NavButton
          onClick={() => {
            return;
          }}
          route="Stock"
          collapse={props?.collapse}
          icon={<AiOutlineStock />}
          title="Stock Control"
        />
        <NavButton
          onClick={() => {
            return;
          }}
          route="Fuel"
          collapse={props?.collapse}
          icon={<BsFuelPumpDiesel />}
          title="Fuel Dispenser"
        /> */}
      </div>
    </aside>
  );
}

type NavButtonProps = {
  collapse: boolean;
  title: string;
  route: string;
  disable?: boolean;
  icon: React.ReactElement;
  onClick: () => void;
};

export function NavButton(props: NavButtonProps) {
  const location = useLocation();
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <div
        role="button"
        onClick={props.onClick}
        className={`flex text-sm ${
          props.collapse ? "pl-6 pr-10 2xl:px-4" : "pl-[0.9rem]"
        } ${
          location.pathname?.split("/")[1] === props.route
            ? "bg-[#11174910] text-white bg-green-700"
            : ""
        } transition-transform duration-100 ease-in text-white hover:scale-105 active:scale-95  py-[0.6rem] ml-1 mr-1 rounded-md items-center gap-4`}
      >
        <span
          className={`${
            location.pathname?.split("/")[1] === props.route ? "" : ""
          }  text-xl `}
        >
          {props.icon}
        </span>
        {props.collapse ? (
          <span
            className={
              location.pathname?.split("/")[1] === props.route
                ? "text-white"
                : ""
            }
          >
            {props.title}
          </span>
        ) : null}
      </div>
    </>
  );
}
