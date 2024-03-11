import { useNavigate } from "react-router-dom";

type BreadcrumbProps = {
  children?: JSX.Element;
  childBreadcrum?: JSX.Element;
};

export const Breadcrumb = (props: BreadcrumbProps) => {
  const route = useNavigate();
  return (
    <div className="flex   rounded-lg justify-between items-center sticky z-10 top-0 w-full bg-white pt-1">
      <h3 className="text-base 2xl:text-base xl:text-sm cursor-pointer ">
        <span className="hover:underline" onClick={() => route("/stock-control")}>Stock Control</span> /
        {props.childBreadcrum}
      </h3>
      {props.children}
    </div>
  );
};
