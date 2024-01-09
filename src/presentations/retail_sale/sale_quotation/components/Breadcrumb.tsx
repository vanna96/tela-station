import { useNavigate } from "react-router-dom";

type BreadcrumbProps = {
  children?: JSX.Element;
  childBreadcrum?: JSX.Element;
};

export const Breadcrumb = (props: BreadcrumbProps) => {
  const route = useNavigate();
  return (
    <div className="flex px-8 shadow-sm rounded-lg justify-between items-center sticky z-10 top-0 w-full bg-white py-3">
      <h3 className="text-lg 2xl:text-base xl:text-sm cursor-pointer">
        <span onClick={() => route("/sale")}>Sales</span>
        {props.childBreadcrum}
      </h3>
      {props.children}
    </div>
  );
};
