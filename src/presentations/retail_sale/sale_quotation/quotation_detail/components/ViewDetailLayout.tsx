import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { InformationTab } from "./InformationTab";

type ViewDetailLayoutProps = {
  children?: JSX.Element[];
  taps?: {
    toLowerCase(): any;
  }[];
  items?: any;
  onCopyTo?: () => void;
  enableCopyToButton?: boolean;
};

export const ViewDetailLayout = ({
  children,
  taps,
  items,
  onCopyTo,
  enableCopyToButton = false,
}: ViewDetailLayoutProps) => {
  const [toggle, setToggle] = React.useState(false);
  const [tapIndex, setTapIndex] = React.useState(0);

  const location = useLocation();
  const route = useNavigate();

  const onToggle = () => setToggle(!toggle);
  const onTapMenu = (val: any) => setTapIndex(val);
  const goToEditPage = () => route(`${location.pathname}/edit`);

  return (
    <div className={`w-full h-full flex lg:flex-col gap-6 overflow-y-auto`}>
      <InformationTab
        onToggle={onToggle}
        goToEditPage={goToEditPage}
        onCopyTo={onCopyTo}
        toggle={toggle}
        children={children}
        enableCopyToButton={enableCopyToButton}
      />
      <div className="grow flex flex-col gap-3">
        <div className="overflow-y-auto">
          <div
            className={`${
              taps ? "flex items-center text-sm flex-none" : ""
            } whitespace-nowrap overflow-x-auto overflow-hidden gap-3`}
          >
            {taps?.map((e, index) => (
              <div
                key={e.toLowerCase()}
                onClick={() => onTapMenu(index)}
                className={`text-center ${
                  index === tapIndex ? "bg-blue-500 text-white" : ""
                } border hover:bg-blue-500 hover:cursor-pointer transition delay-75 duration-150 ease w-[10rem] lg:text-xs  px-3 py-2 text-sm rounded   hover:text-white`}
              >
                {e.toString()}
              </div>
            ))}
          </div>
        </div>
        <div className="grow bg-white p-4 rounded overflow-auto">
          {items?.[tapIndex] ?? (
            <div className="flex w-full h-full">
              <span className="m-auto text-gray-400">No Content</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
