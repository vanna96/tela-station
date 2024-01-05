import React, { useState, useEffect, ReactNode } from "react";
import {
  Avatar,
  Collapse,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import colorConfigs from "../configs/colorConfigs";
import sizeConfigs from "../configs/sizeConfigs";
import appRoutes from "./appRoutes";
import telaLogoBig from "@/assets/img/tela-logo-big.png";
import telaLogo from "@/assets/img/tela-logo.png";
import { motion } from "framer-motion";

type RouteType = {
  state: string;
  index?: boolean;
  path?: string;
  child?: RouteType[];
  sidebarProps?: {
    displayText: string;
    icon?: ReactNode;
  };
};
const Sidebar = (props: any) => {
  const [open, setOpen] = useState<string | null>(null);

  const handleCollapse = (state: string) => {
    setOpen((prevOpen) => (prevOpen === state ? null : state));
  };
  const img = React.useMemo(
    () => (
      <img src={props?.collapse ? telaLogoBig : telaLogo} alt="" className="" />
    ),
    [props.collapse]
  );

  return (
    <motion.aside className=" ">
      {props?.collapse ? (
        <div className=" w-[280px] transition-all duration-600 scale-100 mr-8 ml-4">
          <div className="box-border px-12 py-4">{img}</div>
        </div>
      ) : (
        <div className=" w-16 transition-all duration-500 scale-100">
          {" "}
          <div className="box-border pl-2 py-4">{img}</div>
        </div>
      )}

      <div>
        {props.collapse ? (
          <List disablePadding>
            {appRoutes.map((route, index) =>
              route.sidebarProps ? (
                route.child ? (
                  <SidebarItemCollapse
                    item={route}
                    key={index}
                    open={open}
                    handleCollapse={handleCollapse}
                  />
                ) : (
                  <SidebarItem item={route} key={index} />
                )
              ) : null
            )}
          </List>
        ) : (
          <>
            <List disablePadding>
              {appRoutes.map((route, index) => (
                <MiniSizeBar item={route} key={index} />
              ))}
            </List>
          </>
        )}
        {/* </Drawer> */}
      </div>
    </motion.aside>
  );
};
const SidebarItem = ({ item }: { item: RouteType }) => {
  const location = useLocation();

  const locationBasePath = location.pathname?.split("/").filter(Boolean)[1];
  const itemBasePath = item.path?.split("/").filter(Boolean)[1];
  const active = locationBasePath === itemBasePath;
  return item.sidebarProps && item.path ? (
    <ListItemButton
      component={Link}
      to={item.path}
      sx={{
        // "&: hover": {
        //   backgroundColor: colorConfigs.sidebar.hoverBg,
        //   textDecorationColor: "white"
        // },
        backgroundColor: active ? colorConfigs.sidebar.activeChild : "unset",
        paddingY: "10px",
        paddingX: "24px",
      }}
    >
      <ListItemIcon
        sx={{
          color: colorConfigs.sidebar.color,
        }}
      >
        {item.sidebarProps.icon && item.sidebarProps.icon}
      </ListItemIcon>
      <div className={active ? "text-yellow-500" : "text-gray-100"}>
        {item.sidebarProps.displayText}
      </div>
    </ListItemButton>
  ) : null;
};

const SidebarItemCollapse = ({
  item,
  open,
  handleCollapse,
}: {
  item: RouteType;
  open: string | null;
  handleCollapse: (state: string) => void;
}) => {
  const location = useLocation();
  const isOpen = open === item.state;
  const active = location.pathname?.split("/")[1] == item.path?.split("/")[1];

  useEffect(() => {
    if (item.child?.some((child: any) => child.state === open)) {
      handleCollapse(item.state);
    }
  }, [item.child, item.state, open, handleCollapse]);

  return item.sidebarProps ? (
    <>
      <ListItemButton
        onClick={() => handleCollapse(item.state)}
        sx={{
          // "&: hover": {
          //   backgroundColor: colorConfigs.sidebar.hoverBg,
          // },
          backgroundColor: active ? colorConfigs.sidebar.activeParent : "unset",
          paddingY: "10px",
          paddingX: "24px",
        }}
      >
        <ListItemIcon
          sx={{
            color: colorConfigs.sidebar.color,
          }}
        >
          <div className={active ? "text-yellow-500" : "text-white"}>
            {item.sidebarProps.icon && item.sidebarProps.icon}
          </div>
        </ListItemIcon>
        <ListItemText
          disableTypography
          className={active ? "text-yellow-500" : "text-white"}
          primary={
            <Typography sx={{ color: "#ffff", textDecorationColor: "#fff" }}>
              {item.sidebarProps.displayText}
            </Typography>
          }
        />

        <div className={active ? "text-yellow-500" : "text-white"}>
          {isOpen ? <ExpandLessOutlinedIcon /> : <ExpandMoreOutlinedIcon />}
        </div>
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto">
        <List>
          {item.child?.map((route, index) =>
            route.sidebarProps ? (
              route.child ? (
                <SidebarItemCollapse
                  item={route}
                  key={index}
                  open={open}
                  handleCollapse={handleCollapse}
                />
              ) : (
                <SidebarItem item={route} key={index} />
              )
            ) : null
          )}
        </List>
      </Collapse>
    </>
  ) : null;
};

const MiniSizeBar = ({ item }: { item: RouteType }) => {
  const active = location.pathname?.split("/")[1] == item.path?.split("/")[1];
  return item.sidebarProps && item.path ? (
    <ListItemButton
      component={Link}
      to={item.path}
      sx={{
        "&: hover": {
          backgroundColor: colorConfigs.sidebar.hoverBg,
        },
        backgroundColor: active ? colorConfigs.sidebar.activeParent : "unset",
        boxSizing: "border-box",
        paddingY: "12px",
        paddingRight: "0px",
        paddingLeft: "20px",
      }}
    >
      <ListItemIcon
        sx={{
          color: colorConfigs.sidebar.color,
        }}
      >
        {item.sidebarProps.icon && item.sidebarProps.icon}
      </ListItemIcon>
    </ListItemButton>
  ) : null;
};

export default Sidebar;
