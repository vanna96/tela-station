import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { ThemeContext } from "@/contexts";
import { MdEdit } from "react-icons/md";
import { IoCreate } from "react-icons/io5";

interface DocumentHeaderComponentProps {
  data: any;
  menuTabs: JSX.Element | React.ReactNode;
}

const Tabar: React.FC<DocumentHeaderComponentProps> = (
  props: DocumentHeaderComponentProps
) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const handlerGoToCreate = () => {
    if (location.pathname.includes("/edit")) {
      const url = location.pathname.replace(`${id}/edit`, "create");
      window.location.href = url;
    } else if (location.pathname.includes("/")) {
      const url = location.pathname.replace(`${id}`, "create");
      window.location.href = url;
    } else {
      window.location.href = "/"; // Replace with your desired "create" route
    }
  };

  const navigateToEdit = () => navigate(location.pathname + "/edit");

  const pathSegments: string = location.pathname
    .split("/")[2]
    .replace("-", " ");

  const formattedText: string = pathSegments
    .split("-")
    .map((segment: string) => {
      const lowerCaseSegment: string = segment.toLowerCase();
      return lowerCaseSegment === "lpg"
        ? "LPG"
        : `${segment.charAt(0).toUpperCase()}${segment.slice(1).toLowerCase()}`;
    })
    .join(" ");

  return (
    <div
      className={`w-full flex flex-col rounded gap-y-2 justify-between items-center border border-b  sticky top-0 border-y bg-white z-50 px-4  `}
    >
      <div
        className={`w-full border-b flex justify-between z-50 px-0`}
      >
        <div className="flex gap-2 items-center">
          <h1 className="text-md py-2 capitalize">
            {formattedText} - {props?.data?.DocNum}
          </h1>
          {props.data.DocumentStatus === "bost_Close" ||
            (!(location.pathname.includes("edit") || !id) && (
              <div className="">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={navigateToEdit}
                  endIcon={<MdEdit />}
                >
                  Edit
                </Button>
              </div>
            ))}
          {(location.pathname.includes("edit") || id) && (
            <Button
              variant="outlined"
              size="small"
              // sx={{ color: "rgb(59 130 246) !important", marginLeft: "10px" }}
              onClick={handlerGoToCreate}
              endIcon={<IoCreate />}
            >
              Create
            </Button>
          )}
        </div>
      </div>
      <div
        className={`w-full border-t flex gap-2 px-4 text-sm border-t-gray-200 py-0 sticky`}
      >
        {props?.menuTabs}
      </div>
    </div>
  );
};

export default Tabar;
