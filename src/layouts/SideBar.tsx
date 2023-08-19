import React from "react"
import { FiGrid, FiShoppingBag } from "react-icons/fi"
import { GiFactory } from "react-icons/gi"
import { MdOutlineDirectionsTransitFilled } from "react-icons/md"
import { HiOutlineDocumentPlus } from "react-icons/hi2"
import { useLocation, useNavigate } from "react-router-dom"
import { BsClipboardData } from "react-icons/bs"
import BigLogo from "@/assets/img/big-logo.png"
import SmallLogo from "@/assets/img/mini-logo.jpg"
import { Divider } from "@mui/material"

export default function SideBar(props: any) {
  const navigate = useNavigate()
  const goTo = (route: string) => navigate(route)
  const img = React.useMemo(
    () => (
      <img src={props?.collapse ? BigLogo : SmallLogo} alt="" className="h-[47px]" />
    ),
    [props.collapse]
  )

  return (
    <aside
      className={`border-r  px-2 transition-min-width duration-200 flex flex-col py-8 relative z-20 ${
        props?.collapse ? "min-w-[13rem] " : "min-w-[4rem] "
      } bg-white text-[#a8a6a6]`}
    >
      {img}
      <div className="mt-8 grow flex flex-col gap-2 whitespace-nowrap overflow-hidden text-base 2xl:text-sm xl:text-[12px]">
        <Divider />
        <NavButton
          onClick={() => goTo("/system-initialize")}
          route="system-initialize"
          collapse={props?.collapse}
          icon={<FiGrid />}
          title="System Initialize"
        />
        <NavButton
          onClick={() => goTo("/master-data")}
          route="master-data"
          collapse={props?.collapse}
          icon={<BsClipboardData />}
          title="Master Data"
        />
        <NavButton
          onClick={() => goTo("/procument")}
          route="procument"
          collapse={props?.collapse}
          icon={<HiOutlineDocumentPlus />}
          title="Procument"
        />
        <NavButton
          onClick={() => goTo("/sale")}
          route="sale"
          collapse={props?.collapse}
          icon={<FiShoppingBag />}
          title="Sale"
        />
        <NavButton
          onClick={() => goTo("/inventory")}
          route="inventory"
          collapse={props?.collapse}
          icon={<GiFactory />}
          title="Inventory"
        />
        <NavButton
          onClick={() => goTo("/logistic")}
          route="logistic"
          collapse={props?.collapse}
          icon={<MdOutlineDirectionsTransitFilled />}
          title="Logistic"
        />
        <NavButton
          onClick={() => goTo("/banking")}
          route="banking"
          collapse={props?.collapse}
          icon={<FiShoppingBag />}
          title="Banking"
        />
      </div>
    </aside>
  )
}

type NavButtonProps = {
  collapse: boolean
  title: string
  route: string
  disable?: boolean
  icon: React.ReactElement
  onClick: () => void
}

export function NavButton(props: NavButtonProps) {
  const location = useLocation()
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
  )
}
