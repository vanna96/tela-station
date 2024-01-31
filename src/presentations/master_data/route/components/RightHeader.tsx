const Right = ({ header, data }: any) => {

    return (
        <div className="w-[100%] mt-2 pl-[25px] h-[150px] flex py-5 px-4">
        <div className="w-[25%] text-[15px] text-gray-500 flex flex-col justify-between h-full">
          <div>
            <span className="">Destination </span>
          </div>
          <div>
            <span className="">Distance </span>
          </div>
          <div>
            <span className="">Travel Hour </span>
          </div>
        </div>
        <div className="w-[70%] text-[15px] flex flex-col justify-between h-full">
          <div>
            <span>{data?.U_Destination || "_"}</span>
          </div>
          <div>
            <span>{data?.U_Distance || "_"}</span>
          </div>
          <div>
            <span>{data?.U_Duration || "_"}</span>
          </div>
        </div>
      </div>
    );
  };
  export default Right;