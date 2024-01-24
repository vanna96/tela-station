import React, { memo } from "react";
import { Button, ButtonProps } from "@mui/material";

interface MenuButtonProps extends ButtonProps {
  active?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

const MenuButton = (props: MenuButtonProps) => {
  return (
    <Button
      className={`w-auto flex-nowrap`}
      onClick={props?.onClick}
      sx={{
        borderBottom: props?.active ? "solid 3px #16a34a" : "solid 0px #16a34a",
        borderRadius: "0",
      }}
    >
      <span
        className={`capitalize text-[14px]  ${
          props.active ? "text-green-500" : "text-gray-400"
        }`}
      >
        {props?.children}
      </span>
    </Button>
  );
};

export default memo(MenuButton);
