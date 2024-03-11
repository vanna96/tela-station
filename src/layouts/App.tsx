import React from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import { useCookies } from "react-cookie";
import { Backdrop, Button, Chip, CircularProgress } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { HiMenu } from "react-icons/hi";
import LogoutIcon from "@mui/icons-material/Logout";

export default function App() {
  const [cookies]: any = useCookies(["sessionId"]);
  const navigate = useNavigate();
  const history = useLocation();

  if (!cookies.sessionId) return <Navigate to={"/login"} />;

  const [collapse, setCollapse] = React.useState(
    localStorage.getItem("menu_collapse") === "true"
  );
  const [loading, setLoading] = React.useState(false);

  let originalPath = history?.pathname;
  let pathSegments = originalPath?.split("/");
  let modifiedUrl = pathSegments?.slice(0, 3).join("/");

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
        onClick={() => { }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div
        className={`h-screen w-full flex gap-0 transition-all duration-300 bg-white`}
      >
        <div className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-600 to-green-700 backdrop-blur-xl">
          <SideBar collapse={collapse} />
        </div>

        <div className="grow flex flex-col overflow-auto relative">
          <div
            className={`sticky z-50 top-0 px-2 pr-4 py-1 w-full shadow flex justify-between items-center bg-white`}
          >
            <div className="flex justify-center items-center">
              <IconButton
                color="primary"
                aria-label="menu"
                component="label"
                onClick={collapseChange}
              >
                <HiMenu />
              </IconButton>
              {originalPath !== modifiedUrl && (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => navigate(modifiedUrl)}
                  className="text-[#168f43]"
                >
                  <path
                    fill="currentColor"
                    d="M17.51 3.87L15.73 2.1L5.84 12l9.9 9.9l1.77-1.77L9.38 12z"
                  />
                </svg>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800">TELA Station</p>
            </div>
            <div className="flex space-x-4">
              <Chip
                label={cookies.user?.UserName}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={
                  <LogoutIcon
                    onClick={() => signOut()}
                    color="primary"
                    sx={{ width: "20px", height: "20px" }}
                  />
                }
                color="primary"
                variant="outlined"
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="w-full flex flex-col grow overflow-auto bg-white">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
