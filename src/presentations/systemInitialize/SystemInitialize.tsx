import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import React from "react";
import { AiOutlineSolution } from "react-icons/ai";
import request from "@/utilies/request";
import IncomingPaymentRepository from "@/services/actions/IncomingPaymentRepository";
import SalesOrderRepository from "@/services/actions/SalesOrderRepository";
import { useNavigate } from "react-router-dom";

export default function SystemInitializeMasterPage() {
  const [count, setCount]: any = React.useState();
  const navigate = useNavigate();

  const getCount: any = async () => {
    const logs = await request("GET", "TL_ExpLog/$count").then(
      (res: any) => res.data
    );
    const clearance = await request("GET", "TL_ExpClear/$count").then(
      (res: any) => res.data
    );

    const incomingAR: any = await new IncomingPaymentRepository().getCount({
      params: {
        $filter: `DocType eq 'rCustomer'`,
      },
    });

    const directAccount = await new IncomingPaymentRepository().getCount({
      params: {
        $filter: `DocType eq 'rAccount'`,
      },
    });

    const order = await new SalesOrderRepository().getCount({});

    setCount({
      ...count,
      logs,
      order,
      clearance,
      incomingAR,
      directAccount,
    });
  };

  React.useEffect(() => {
    getCount();
  }, []);

  return (
    <>
      <div className="px-6">
        <h1 className="mb-4 mt-10">Master Data</h1>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <ItemCard
            title="Pump"
            icon={<AiOutlineSolution />}
            amount={count?.order || 0}
            onClick={() => navigate("/master-data/pump")}
          />
          <ItemCard
            title="Pump Attendant"
            icon={<AiOutlineSolution />}
            amount={count?.order || 0}
            onClick={() => navigate("/master-data/pump-attendant")}
          />
          <ItemCard
            title="Cash Account"
            icon={<AiOutlineSolution />}
            onClick={() => navigate("/master-data/cash-account")}
            amount={
              // count?.order ||
              0
            }
          />
          <ItemCard
            title="Expense Dictionary"
            icon={<AiOutlineSolution />}
            onClick={() => navigate("/master-data/expense-dictionary")}
            amount={
              // count?.order ||
              0
            }
          />
        </div>
        <h1 className="mb-4 mt-10">Sale Target</h1>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <ItemCard
            title="Sale Scenario"
            icon={<AiOutlineSolution />}
            amount={count?.logs || 0}
            onClick={() => navigate("sale-target/sale-scenario")}
          />
          <ItemCard
            title="Sale Target "
            icon={<AiOutlineSolution />}
            amount={count?.clearance || 0}
            onClick={() => navigate("/sale-target/sale-target")}
          />
        </div>

        <h1 className="my-4">Retail Sale </h1>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <ItemCard
            title="Fuel Sales"
            icon={<AiOutlineSolution />}
            onClick={() => navigate("/retail-sale/fuel-sales")}
            amount={count?.order || 0}
          />
          <ItemCard
            title="Lube Sales"
            icon={<AiOutlineSolution />}
            onClick={() => navigate("/retail-sale/lube-sales")}
            amount={count?.order || 0}
          />
          <ItemCard
            title="LPG Sales"
            icon={<AiOutlineSolution />}
            onClick={() => navigate("/retail-sale/lpg-sales")}
            amount={count?.order || 0}
          />
          <ItemCard
            title="Pump Record"
            icon={<AiOutlineSolution />}
            amount={count?.order || 0}
            onClick={() => navigate("/retail-sale/pump-record")}
          />
          <ItemCard
            title="Morph Price"
            icon={<AiOutlineSolution />}
            amount={count?.order || 0}
            onClick={() => navigate("/retail-sale/morph-price")}
          />
        </div>

        <h1 className="mb-4 mt-10">Sale Order</h1>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <ItemCard
            title="Fuel Sales"
            icon={<AiOutlineSolution />}
            onClick={() => navigate("/sale-order/fuel-sales")}
            amount={count?.order || 0}
          />
          <ItemCard
            title="Lube Sales"
            icon={<AiOutlineSolution />}
            onClick={() => navigate("/sale-order/lube-sales")}
            amount={count?.order || 0}
          />
          <ItemCard
            title="LPG Sales"
            icon={<AiOutlineSolution />}
            onClick={() => navigate("/sale-order/lpg-sales")}
            amount={count?.order || 0}
          />
        </div>

        <h1 className="mb-4 mt-10">Banking</h1>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <ItemCard
            title="Settle Receipt"
            icon={<AiOutlineSolution />}
            amount={count?.incomingAR || 0}
            onClick={() => navigate("/banking/settle-receipt")}
          />
          <ItemCard
            title="Payment on Account"
            icon={<AiOutlineSolution />}
            amount={count?.incomingAR || 0}
            onClick={() => navigate("/banking/payment-account")}
          />
          <ItemCard
            title="Direct to Account"
            icon={<AiOutlineSolution />}
            amount={count?.directAccount || 0}
            onClick={() => navigate("/banking/direct-account")}
          />
        </div>
        <h1 className="mb-4 mt-10">Expense Log</h1>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <ItemCard
            title="Expense Log"
            icon={<AiOutlineSolution />}
            amount={count?.logs || 0}
            onClick={() => navigate("/expense/log")}
          />
          <ItemCard
            title="Expense Clearance"
            icon={<AiOutlineSolution />}
            amount={count?.clearance || 0}
            onClick={() => navigate("/expense/clearance")}
          />
        </div>
        <h1 className="mb-4 mt-10">Stock Control</h1>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <ItemCard
            title="Inventory Transfer Request"
            icon={<AiOutlineSolution />}
            amount={count?.logs || 0}
            onClick={() =>
              navigate("/stock-control/inventory-transfer-request")
            }
          />
          <ItemCard
            title="Stock Transfer "
            icon={<AiOutlineSolution />}
            amount={count?.logs || 0}
            onClick={() => navigate("/stock-control/stock-transfer")}
          />
          <ItemCard
            title="Good Issue"
            icon={<AiOutlineSolution />}
            amount={count?.logs || 0}
            onClick={() => navigate("/stock-control/good-issue")}
          />
          <ItemCard
            title="Good Receipt"
            icon={<AiOutlineSolution />}
            amount={count?.logs || 0}
            onClick={() => navigate("/stock-control/good-receipt")}
          />
          <ItemCard
            title="Pump Test"
            icon={<AiOutlineSolution />}
            amount={count?.logs || 0}
            onClick={() => navigate("/stock-control/pump-test")}
          />

          <ItemCard
            title="Fuel Level"
            icon={<AiOutlineSolution />}
            amount={count?.logs || 0}
            onClick={() => navigate("/stock-control/fuel-level")}
          />
        </div>
      </div>
    </>
  );
}
