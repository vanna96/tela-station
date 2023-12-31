import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import { useCookies } from "react-cookie";
import { Backdrop, Button, Chip, CircularProgress } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { HiMenu } from "react-icons/hi";
import Avatar from "@mui/material/Avatar";
import LogoutIcon from "@mui/icons-material/Logout";

export default function App() {
  const [cookies]: any = useCookies(["sessionId"]);
  const navigate = useNavigate();

  if (!cookies.sessionId) return <Navigate to={"/login"} />;

  const [collapse, setCollapse] = React.useState(
    localStorage.getItem("menu_collapse") === "true"
  );
  const [loading, setLoading] = React.useState(false);

  const signOut = () => {
    setLoading(true);
    localStorage.clear();
    sessionStorage.removeItem("REACT_QUERY_OFFLINE_CACHE");
    setTimeout(() => {
      setLoading(true);

      navigate("/login");
    }, 800);
  };

  const collapseChange = () => {
    const val = !collapse;
    setCollapse(val);
    localStorage.setItem("menu_collapse", val.toString());
  };

  const userName: string = (cookies?.user?.UserName || "")
    .split(" ")
    .map((n: any) => n[0])
    .join(".");

  return (
    <>
      <Backdrop
        sx={{ color: "white", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={() => {}}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div
        className={` w-full flex gap-0 transition-all duration-300 bg-white`}
      >
        <div className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-600 to-green-700 backdrop-blur-xl">
          <SideBar collapse={collapse} />
        </div>

        <div className="grow flex flex-col overflow-auto relative">
          <div
            className={`sticky z-50 top-0 px-2 pr-4 py-1 w-full shadow flex justify-between items-center bg-white`}
          >
            <div>
              <IconButton
                color="primary"
                aria-label="menu"
                component="label"
                onClick={collapseChange}
              >
                <HiMenu />
              </IconButton>
            </div>
            <div>
              <p className="font-medium text-gray-800">TELA Station</p>
            </div>
            <div className="flex space-x-4">
              {/* <Avatar
                // className="shadow-md"
                // sx={{ width: 30, height: 30, bgcolor: "white", color: "#666666" }}
              >
                {userName}
              </Avatar> */}
              <Chip label={userName} color="primary" variant="outlined" />
              <Avatar
                className="shadow-md cursor-pointer"
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: "white",
                  color: "#666666",
                }}
              >
                <LogoutIcon onClick={() => signOut()} />
              </Avatar>
              {/* <Chip
                icon={<LogoutIcon />}
                label="Log Out"
                variant="outlined"
                color="primary"
                onClick={() => signOut()}
              /> */}
            </div>
          </div>
          {/* <div className="w-full flex flex-col grow overflow-auto bg-hero-pattern bg-transparent bg-repeat-round bg-blur-xl backdrop-blur-3xl"> */}
          <div className="w-full flex flex-col grow overflow-auto bg-white">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
