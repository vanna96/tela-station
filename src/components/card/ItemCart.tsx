import { ThemeContext } from "@/contexts";
import React from "react";
import { AiOutlineCheckSquare } from "react-icons/ai";

interface ItemCardProps {
  title?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  amount: number;
  isLoading?: boolean;
}

export default function ItemCard({
  title,
  icon,
  onClick,
  amount,
  isLoading = false,
}: ItemCardProps) {
  return (
    <div
      role="button"
      className={`border-2 text-gray-700 hover:text-gray-800 hover:font-medium flex flex-col hover:shadow-xl justify-between item-box  h-[12rem] 2xl:h-[13rem] xl:h-[10.8rem] p-4 rounded-lg bg-gradient-to-b from-white to-white-100 shadow-md`}
      onClick={onClick}
    >
      <div className="grow font-medium">{title}</div>
      <div className="flex justify-between relative">
        <div className="flex items-center text-2xl gap-3 2xl:text-xl xl:text-base">
          <span className="text-green-500">{icon}</span>
          <span className={"text-gray-500"}>
            {isLoading ? "Loading..." : amount}
          </span>
        </div>
      </div>
    </div>
  );
}
