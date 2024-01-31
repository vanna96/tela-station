import React from "react";

const Left = ({ header, data }: any) => {
  return (
    <div className="w-[100%] mt-2 pl-[25px] h-[150px] flex py-5 px-4">
      <div className="w-[25%] text-[15px] text-gray-500 flex flex-col justify-between h-full">
        <div>
          <span className="">Route Code </span>
        </div>
        <div>
          <span className="">Route Name </span>
        </div>
        <div>
          <span className="">Base Station </span>
        </div>
      </div>
      <div className="w-[70%] text-[15px] flex flex-col justify-between h-full">
        <div>
          <span>{data?.Code || "_"}</span>
        </div>
        <div>
          <span>{data?.Name  || "_"}</span>
        </div>
        <div>
          <span>{data?.U_BaseStation || "_"}</span>
        </div>
      </div>
    </div>
  );
};
export default Left;
