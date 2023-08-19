import { Breadcrumb } from "./components/Breadcrumb";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SaleOrderDataTable } from "./SaleOrderDataTable";

export default function SaleOrderLists() {
  const route = useNavigate();
  const childBreadcrum = (
    <>
      {" "}
      /<span className="text-blue-700"> Sales Order</span>
    </>
  );
  return (
    <div className="w-full h-full p-4 2xl:py-6 flex flex-col gap-3 relative bg-gray-100">
      <Breadcrumb childBreadcrum={childBreadcrum}>
        <Button
          variant="outlined"
          disableElevation
          size="small"
          onClick={() => route("/sale/sales-order/create")}
        >
          <span className="text-xs">Create</span>
        </Button>
      </Breadcrumb>
      <SaleOrderDataTable />
    </div>
  );
}
