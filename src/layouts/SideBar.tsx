// import React from "react";
// import { FiBarChart2, FiGrid, FiShoppingBag } from "react-icons/fi";
// import { HiOutlineShoppingBag } from "react-icons/hi2";
// import { useLocation, useNavigate } from "react-router-dom";
// import { BsCollection, BsFuelPumpDiesel } from "react-icons/bs";
// import BigLogo from "@/assets/img/big-logo.png";
// import SmallLogo from "@/assets/img/mini-logo.jpg";
// import { Divider } from "@mui/material";
// import { AiOutlineStock } from "react-icons/ai";

// export default function SideBar(props: any) {
//   const navigate = useNavigate();
//   const goTo = (route: string) => navigate(route);
//   const img = React.useMemo(
//     () => (
//       <img
//         src={props?.collapse ? BigLogo : SmallLogo}
//         alt=""
//         className="h-[47px] w-30"
//       />
//     ),
//     [props.collapse]
//   );

//   return (
//     <aside
//       className={`border-r  px-2 transition-min-width duration-200 flex flex-col py-8 relative z-20 ${
//         props?.collapse ? "min-w-[13rem] " : "min-w-[4rem] "
//       } bg-white text-[#a8a6a6]`}
//     >
//       {img}
//       <div className="mt-8 grow flex flex-col gap-2 whitespace-nowrap overflow-hidden text-base 2xl:text-sm xl:text-[12px]">
//         <Divider />
//         <NavButton
//           onClick={() => goTo("/system-initialize")}
//           route="system-initialize"
//           collapse={props?.collapse}
//           icon={<FiGrid />}
//           title="System Initialize"
//         />
//         <NavButton
//           onClick={() => goTo("/sale")}
//           route="sale"
//           collapse={props?.collapse}
//           icon={<HiOutlineShoppingBag />}
//           title="Ordering System"
//         />
//         <NavButton
//           onClick={() => goTo("/banking")}
//           route="banking"
//           collapse={props?.collapse}
//           icon={<BsCollection />}
//           title="Collection"
//         />
//         <NavButton
//           onClick={() => {
//             return;
//           }}
//           route="Expense"
//           collapse={props?.collapse}
//           icon={<FiBarChart2 />}
//           title="Expense Log"
//         />
//         <NavButton
//           onClick={() => {
//             return;
//           }}
//           route="Stock"
//           collapse={props?.collapse}
//           icon={<AiOutlineStock />}
//           title="Stock Control"
//         />
//         <NavButton
//           onClick={() => {
//             return;
//           }}
//           route="Fuel"
//           collapse={props?.collapse}
//           icon={<BsFuelPumpDiesel />}
//           title="Fuel Dispenser"
//         />
//       </div>
//     </aside>
//   );
// }

// type NavButtonProps = {
//   collapse: boolean;
//   title: string;
//   route: string;
//   disable?: boolean;
//   icon: React.ReactElement;
//   onClick: () => void;
// };

// export function NavButton(props: NavButtonProps) {
//   const location = useLocation();
//   return (
//     <div
//       role="button"
//       onClick={props.onClick}
//       className={`flex text-sm ${
//         props.collapse ? "pl-6 pr-10 2xl:px-4" : "pl-[0.9rem]"
//       } ${
//         location.pathname?.split("/")[1] === props.route
//           ? `bg-[#11174910] text-system-color`
//           : ""
//       }  transition-all duration-300  py-[0.6rem]  text-[#a8a6a6] rounded-lg items-center gap-4 `}
//     >
//       <span
//         className={`${
//           location.pathname?.split("/")[1] === props.route ? "" : ""
//         }  text-xl `}
//       >
//         {props.icon}
//       </span>
//       {props.collapse ? (
//         <span
//           className={
//             location.pathname?.split("/")[1] === props.route
//               ? "text-system-color"
//               : ""
//           }
//         >
//           {props.title}
//         </span>
//       ) : null}
//     </div>
//   );
// }

import BigLogo from "@/assets/img/big-logo.png";
import SmallLogo from "@/assets/img/mini-logo.jpg";
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
      <img
        src={props?.collapse ? BigLogo : SmallLogo}
        alt=""
        className="h-[47px] h-[47px]"
      />
    ),
    [props.collapse]
  );

  return (
    <aside
      className={`border-r  px-2 transition-all duration-300 flex flex-col py-8 relative z-20  ${
        theme === "light"
          ? "bg-white text-[#a8a6a6]"
          : "bg-white text-[#a8a6a6]"
      }  `}
    >
      {/* <h1 className="text-2xl 2xl:text-xl xl:text-lg font-bold uppercase text-center whitespace-nowrap overflow-hidden text-inherit  ">
      </h1> */}
      {props?.collapse ? (
        <div className="h-min-14 w-34">{img}</div>
      ) : (
        <div className="h-12 w-12">{img}</div>
      )}

      <div className="mt-8 grow flex flex-col gap-2 whitespace-nowrap overflow-hidden text-base 2xl:text-sm xl:text-[12px]">
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
          onClick={() => {
            return;
          }}
          route="Expense"
          collapse={props?.collapse}
          icon={<FiBarChart2 />}
          title="Expense Log"
        />
        <NavButton
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
        />
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
    <div
      role="button"
      onClick={props.onClick}
      className={`flex text-sm ${
        props.collapse ? "pl-6 pr-10 2xl:px-4" : "pl-[0.9rem]"
      } ${
        location.pathname?.split("/")[1] === props.route
          ? `bg-[#11174910] text-system-color`
          : ""
      }  transition-all duration-300  py-[0.6rem]  text-[#a8a6a6] rounded-lg items-center gap-4 `}
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
              ? "text-system-color"
              : ""
          }
        >
          {props.title}
        </span>
      ) : null}
    </div>
  );
}
