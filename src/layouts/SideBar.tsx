// sidebar.tsx
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
import { Link } from "react-router-dom";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import colorConfigs from "../configs/colorConfigs";
import sizeConfigs from "../configs/sizeConfigs";
import appRoutes from "./appRoutes";
import telaLogoBig from "@/assets/img/tela-logo-big.png";
import telaLogo from "@/assets/img/tela-logo.png";
import { motion } from "framer-motion";

type RouteType = {
  element: ReactNode;
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
    <motion.aside className="border-r ease-in-out flex flex-col py-4 relative z-20 bg-gradient-to-tr from-green-500 to-green-600">
      {props?.collapse ? (
        <div className=" w-[300px] transition-all duration-600 scale-100 mr-8 ml-4">
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
console.log(item.state)

  return item.sidebarProps && item.path ? (
    <ListItemButton
      component={Link}
      to={item.path}
      sx={{
        "&: hover": {
          backgroundColor: colorConfigs.sidebar.hoverBg,
        },
        // backgroundColor: appState === item.state ? colorConfigs.sidebar.activeBg : "unset",
        paddingY: "10px",
        paddingX: "24px",
      }}
    >
      <ListItemIcon
        className="text-white"
        sx={{
          color: colorConfigs.sidebar.color,
        }}
      >
        {item.sidebarProps.icon && item.sidebarProps.icon}
      </ListItemIcon>
      <div className="text-white">{item.sidebarProps.displayText}</div>
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
  const isOpen = open === item.state;

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
          "&: hover": {
            backgroundColor: colorConfigs.sidebar.hoverBg,
          },
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
        <ListItemText
          disableTypography
          className="text-white"
          primary={
            <Typography sx={{ color: "#ffff", textDecorationColor: "#fff" }}>
              {item.sidebarProps.displayText}
            </Typography>
          }
        />

        <div className="text-white">
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
  return item.sidebarProps && item.path ? (
    <ListItemButton
      component={Link}
      to={item.path}
      sx={{
        "&: hover": {
          backgroundColor: colorConfigs.sidebar.hoverBg,
        },
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
