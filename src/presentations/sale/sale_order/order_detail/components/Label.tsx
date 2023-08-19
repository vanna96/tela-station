type LabelTextProps = {
  readOnly?: boolean;
  label?: string;
  text?: any;
  name?: string;
  pClass?: string;
  className?: string;
  children?: JSX.Element[];
};

const TitleField = (props: LabelTextProps) => {
  return (
    <div className="mb-4 mt-4 pb-1">
      <div className="text-lg text-gray-700 font-base ">{props.label}</div>
    </div>
  );
};

const LabelText = (props: LabelTextProps) => {
  return (
    <div className="flex justify-between my-3 ">
      <div className="px-2 text-gray-500 w-6/12 sm:w-5/12 text-sm ">
        {props.label}{" "}
      </div>
      <div className="w-6/12 sm:w-5/12 text-sm  px-2 border-slate-300  hover:border-slate-400 rounded-2 ">
        {props.text} &nbsp;
      </div>
    </div>
  );
};

const LabelField = (props: LabelTextProps) => {
  return (
    <>
      <div className={`flex 4xl:w-full mb-1  pb-1 ${props?.pClass}`}>
        {props?.label ? (
          <>
            <div className="w-[12rem]  text-gray-900">
              <div
                className={`text-sm text-[#666666] font-medium ${props?.className}`}
              >
                {props.label}
              </div>
            </div>
          </>
        ) : null}
        <div
          className={`grow text-sm font-normal ${
            props?.label ? "4xl:w-[65%]" : "w-full"
          }`}
        >
          {props?.children}
        </div>
      </div>
    </>
  );
};

export { LabelText, LabelField, TitleField };
