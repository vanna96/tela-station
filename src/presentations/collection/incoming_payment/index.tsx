import { Breadcrumb } from "./components/Breadcrumb";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DataTable } from "./DataTable";

export default function IncomingPaymentLists() {
  const route = useNavigate();
  const childBreadcrum = (
    <>
      {" "}
      /<span className="text-blue-700"> Incoming Payments</span>
    </>
  );
  return (
    <div className="w-full h-full p-4 2xl:py-6 flex flex-col gap-3 relative bg-gray-100">
      <Breadcrumb childBreadcrum={childBreadcrum}>
        <Button
          variant="outlined"
          disableElevation
          size="small"
          onClick={() => route("/banking/incoming-payments/create")}
        >
          <span className="text-xs">Create</span>
        </Button>
      </Breadcrumb>
      <DataTable />
    </div>
  );
}
