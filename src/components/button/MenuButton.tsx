import React, { memo } from "react";
import { Button, ButtonProps } from "@mui/material";

interface MenuButtonProps extends ButtonProps {
    active?: boolean,
    children?: React.ReactNode,
}

const MenuButton = (props: MenuButtonProps) => {

    return <Button
        onClick={props?.onClick}
        sx={{
            borderBottom: props?.active ? 'solid 3px #3b82f6' : 'solid 0px #0ea5e9',
            borderRadius: '0',
        }}>
        <span className={`capitalize text-[14px]  ${props.active ? 'text-blue-500' : 'text-gray-400'}`}>{props?.children}</span>
    </Button>
}

export default memo(MenuButton);