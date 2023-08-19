// import React, { Children } from "react";

type FlexHeaderProps = {
  children?: any;
  pClassName?: any;
  childClassName?: any;
};

export const FlexHeader = ({
  children,
  pClassName,
  childClassName,
}: FlexHeaderProps) => {
  return (
    <div
      className={`w-screen gap-3 flex items-center xs:flex-wrap  sm:flex-wrap lg:flex-wrap  xl:flex-wrap 2xl:flex-wrap 1xl:flex-wrap 4xl:flex-wrap  ${pClassName}`}
    >
      {children?.map(children, (ele: any) => (
        <div
          className={` xs:w-full sm:w-[50%] lg:w-[33%] xl:w-[33%] 1xl:w-[25%] 2xl:w-[20%]  4xl:w-[20%] ${childClassName}`}
        >
          {ele}
        </div>
      ))}
    </div>
  );
};
