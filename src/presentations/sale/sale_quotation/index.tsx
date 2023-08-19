import { Breadcrumb } from "./components/Breadcrumb";
import { SaleQuotationDatatTable } from "./components/SaleQuotationDatatable";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SaleQuotationLists() {
  const route = useNavigate();
  const childBreadcrum = (
    <>
      {" "}
      /<span className="text-blue-700"> Sales Quotation</span>
    </>
  );
  return (
    <div className="w-full h-full p-4 2xl:py-6 flex flex-col gap-3 relative bg-gray-100">
      <Breadcrumb childBreadcrum={childBreadcrum}>
        <Button
          variant="outlined"
          disableElevation
          size="small"
          onClick={() => route("/sale/sales-quotation/create")}
        >
          <span className="text-xs">Create</span>
        </Button>
      </Breadcrumb>
      <SaleQuotationDatatTable />
    </div>
  );
}
