import React, { useState, useEffect, ReactNode, useContext } from "react";
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
import { NavLink, useLocation, Link, matchPath } from "react-router-dom";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import colorConfigs from "../configs/colorConfigs";
import sizeConfigs from "../configs/sizeConfigs";
import appRoutes from "./appRoutes";
import telaLogoBig from "@/assets/img/tela-logo-big.png";
import telaLogo from "@/assets/img/tela-logo.png";
import { motion } from "framer-motion";
import { AuthorizationContext, Role } from "@/contexts/useAuthorizationContext";

type RouteType = {
  state: string;
  index?: boolean;
  path?: string;
  roles?: Role[];
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

  const { getRoleCode } = useContext(AuthorizationContext);

  return (
    <motion.aside className=" ">
      {props?.collapse ? (
        <div className=" w-[280px] md:w-[200px] xl:w-[220px] transition-all duration-600 scale-100 mr-8 ml-4">
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
            {appRoutes.map((route, index) => {
              if (!route.roles?.includes(getRoleCode as Role)) return null;

              return route.sidebarProps ? (
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
              ) : null;
            })}
          </List>
        ) : (
          <>
            <List disablePadding>
              {appRoutes.map((route, index) => {
                if (!route.roles?.includes(getRoleCode as Role)) return null;

                return <MiniSizeBar item={route} key={index} />;
              })}
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
  const pathSegments = location.pathname?.split("/").filter(Boolean);

  let locationBasePath;
  if (pathSegments?.[0] === "wholesale") {
    locationBasePath = pathSegments?.[2];
  } else {
    locationBasePath = pathSegments?.[1];
  }

  // const itemBasePath = item.path?.split("/").filter(Boolean)[1];
  let active;

  // if (pathSegments?.[0] === "wholesale") {
  //   active = locationBasePath === item.state;
  // } else {
  //   active = locationBasePath === itemBasePath;
  // }
  active = locationBasePath === item.state;

  return item.sidebarProps && item.path ? (
    <ListItemButton
      component={Link}
      to={item.path}
      sx={{
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
      <List component="div" disablePadding>
        {item.child?.map((childItem, index) => (
          <SidebarItem key={index} item={childItem} />
        ))}
      </List>
    </ListItemButton>
  ) : null;
};
// const SidebarItem = ({ item }: { item: RouteType }) => {
//   const location = useLocation();
//   const pathSegments = location.pathname?.split("/").filter(Boolean);
//   console.log(pathSegments);

//   let locationBasePath;
//   if (pathSegments?.[0] === "wholesale" && pathSegments?.[1] === "sale-order") {
//     locationBasePath = pathSegments?.[2]; // Get the last segment after '/wholesale/sale-order/'
//   } else {
//     locationBasePath = pathSegments?.[1];
//   }

//   console.log(locationBasePath);
//   console.log(item.state);
//   const active = locationBasePath === item.state;
//   console.log(active);
//   const childActive = true;
//   return item.sidebarProps && item.path ? (
//     <ListItemButton
//       component={Link}
//       to={item.path}
//       sx={{
//         backgroundColor: active ? colorConfigs.sidebar.activeChild : "unset",
//         paddingY: "10px",
//         paddingX: "24px",
//       }}
//     >
//       <ListItemIcon
//         sx={{
//           color: colorConfigs.sidebar.color,
//         }}
//       >
//         {item.sidebarProps.icon && item.sidebarProps.icon}
//       </ListItemIcon>
//       <div className={active ? "text-yellow-500" : "text-gray-100"}>
//         {item.sidebarProps.displayText}
//       </div>
//       <List component="div" disablePadding>
//         {item.child?.map((childItem, index) => (
//           <SidebarItem key={index} item={childItem} />
//         ))}
//       </List>
//     </ListItemButton>
//   ) : null;
// };

// const SidebarItem = ({ item }: { item: RouteType }) => {
//   const location = useLocation();
//   const locationBasePath = location.pathname?.split("/").filter(Boolean)[1];
//   const itemBasePath = item.path?.split("/").filter(Boolean)[1];
//   const active =
//     locationBasePath === itemBasePath ||
//     (itemBasePath === "sale-order" &&
//       location.pathname?.startsWith(item.path || ""));
//   console.log(item.path);
//   const isWholesale = itemBasePath === "sale-order";
//   console.log(itemBasePath);
//   console.log(isWholesale);
//   const shouldRenderChild = !isWholesale || active;

//   return item.sidebarProps && item.path && shouldRenderChild ? (
//     <ListItemButton
//       component={Link}
//       to={item.path}
//       sx={{
//         backgroundColor:
//           active && !isWholesale ? colorConfigs.sidebar.activeChild : "unset",
//         paddingY: "10px",
//         paddingX: "24px",
//       }}
//     >
//       <ListItemIcon
//         sx={{
//           color: colorConfigs.sidebar.color,
//         }}
//       >
//         {item.sidebarProps.icon && item.sidebarProps.icon}
//       </ListItemIcon>
//       <div className={"text-gray-100"}>{item.sidebarProps.displayText}</div>
//       {item.child && (
//         <List component="div" disablePadding>
//           {item.child.map((childItem, index) => (
//             <SidebarItem key={index} item={childItem} />
//           ))}
//         </List>
//       )}
//     </ListItemButton>
//   ) : null;
// };

// const SidebarItemCollapse = ({
//   item,
//   open,
//   handleCollapse,
// }: {
//   item: RouteType;
//   open: string | null;
//   handleCollapse: (state: string) => void;
// }) => {
//   const location = useLocation();
//   const isOpen = open === item.state;
//   const active = location.pathname === item.path;
//   // const active = location.pathname?.split("/")[3] == item.path?.split("/")[1];
//   // const active = location.pathname.startsWith(item.path);
//   // console.log(location.pathname?.split("/")[3]);
//   // console.log(item.path?.split("/")[1]);
//   // console.log(item.state);
//   console.log(location.pathname);
//   console.log(item.path);

//   useEffect(() => {
//     if (item.child?.some((child: any) => child.state === open)) {
//       handleCollapse(item.state);
//     }
//   }, [item.child, item.state, open, handleCollapse]);

//   const { getRoleCode } = useContext(AuthorizationContext);
//   const [openItem, setOpenItem] = useState<string | null>(null);
//   const handleToggle = (state: string) => {
//     setOpenItem((prevOpenItem) => (prevOpenItem === state ? null : state));
//   };

//   console.log(item);
//   return item.sidebarProps ? (
//     <>
//       <ListItemButton
//         onClick={() => handleCollapse(item.state)}
//         sx={{
//           // "&: hover": {
//           //   backgroundColor: colorConfigs.sidebar.hoverBg,
//           // },
//           backgroundColor: active ? colorConfigs.sidebar.activeParent : "unset",
//           paddingY: "10px",
//           paddingX: "24px",
//         }}
//       >
//         <ListItemIcon
//           sx={{
//             color: colorConfigs.sidebar.color,
//           }}
//         >
//           <div className={active ? "text-yellow-500" : "text-white"}>
//             {item.sidebarProps.icon && item.sidebarProps.icon}
//           </div>
//         </ListItemIcon>
//         <ListItemText
//           disableTypography
//           className={active ? "text-yellow-500" : "text-white"}
//           primary={
//             <Typography sx={{ color: "#ffff", textDecorationColor: "#fff" }}>
//               {item.sidebarProps.displayText}
//             </Typography>
//           }
//         />

//         <div className={active ? "text-yellow-500" : "text-white"}>
//           {isOpen ? <ExpandLessOutlinedIcon /> : <ExpandMoreOutlinedIcon />}
//         </div>
//       </ListItemButton>
//       <Collapse in={isOpen} timeout="auto">
//         <List>
//           {item.child?.map((route, index) => {
//             if (!route.roles?.includes(getRoleCode as Role)) return null;

//             return route.sidebarProps ? (
//               route.child ? (
//                 <SidebarItemCollapse
//                   item={route}
//                   key={index}
//                   open={openItem}
//                   handleCollapse={handleToggle}
//                 />
//               ) : (
//                 <SidebarItem item={route} key={index} />
//               )
//             ) : null;
//           })}
//         </List>
//       </Collapse>
//     </>
//   ) : null;
// };

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
  const { getRoleCode } = useContext(AuthorizationContext);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const handleToggle = (state: string) => {
    setOpenItem((prevOpenItem) => (prevOpenItem === state ? null : state));
  };

  const isActive = (path: string) => {
    return !!matchPath({ path, end: false }, location.pathname);
  };
  const active = location.pathname === item.path;
  const isParentActive = isActive(item.path || "");
  const hasActiveChild = item.child?.some((child: RouteType) =>
    isActive(child.path || "")
  );

  return item.sidebarProps ? (
    <>
      <ListItemButton
        component={NavLink}
        to={item.path || ""}
        end={!item.child}
        onClick={() => handleCollapse(item.state)}
        sx={{
          backgroundColor:
            isParentActive || hasActiveChild
              ? colorConfigs.sidebar.activeParent
              : "unset",
          paddingY: "10px",
          paddingX: "24px",
        }}
      >
        <ListItemIcon
          sx={{
            color: colorConfigs.sidebar.color,
          }}
        >
          <div className={"text-white"}>
            {item.sidebarProps.icon && item.sidebarProps.icon}
          </div>
        </ListItemIcon>
        <ListItemText
          disableTypography
          className={"text-white"}
          primary={
            <Typography sx={{ color: "#ffff", textDecorationColor: "#fff" }}>
              {item.sidebarProps.displayText}
            </Typography>
          }
        />
        <div className={"text-white"}>
          {isOpen ? <ExpandLessOutlinedIcon /> : <ExpandMoreOutlinedIcon />}
        </div>
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto">
        <List>
          {item.child?.map((route, index) => {
            if (!route.roles?.includes(getRoleCode as Role)) return null;

            return route.sidebarProps ? (
              route.child ? (
                <SidebarItemCollapse
                  item={route}
                  key={index}
                  open={openItem}
                  handleCollapse={handleToggle}
                />
              ) : (
                <SidebarItem item={route} key={index} />
              )
            ) : null;
          })}
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
