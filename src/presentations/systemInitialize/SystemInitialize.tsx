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
      <div className="p-4">
        <h1 className="my-4">Ordering System</h1>
        <div className="grid grid-cols-6 space-x-4">
          {/* <ItemCard
            title="Sales Order"
            icon={<AiOutlineSolution />}
            onClick={() => navigate("/sale/sales-order")}
            amount={count?.order || 0}
          /> */}
          <ItemCard
            title="Fuel Sales"
            icon={<AiOutlineSolution />}
            onClick={() => navigate("/sale/fuel-sales")}
            amount={count?.order || 0}
          />
          <ItemCard
            title="Lube Sales"
            icon={<AiOutlineSolution />}
            onClick={() => navigate("/sale/lube-sales")}
            amount={count?.order || 0}
          />
          <ItemCard
            title="LPG Sales"
            icon={<AiOutlineSolution />}
            onClick={() => navigate("/sale/lpg-sales")}
            amount={count?.order || 0}
          />
          <ItemCard
            title="Pump Record"
            icon={<AiOutlineSolution />}
            amount={count?.order || 0}
            onClick={() => navigate("/sale/pump-record")}
          />
          <ItemCard
            title="Morph Price"
            icon={<AiOutlineSolution />}
            amount={count?.order || 0}
            onClick={() => navigate("/sale/morph-price")}
          />
          <ItemCard
            title="Dispenser"
            icon={<AiOutlineSolution />}
            amount={count?.order || 0}
            onClick={() => navigate("/sale/dispenser")}
          />
        </div>
        <h1 className="mb-4 mt-10">Collection</h1>
        <div className="grid grid-cols-6 space-x-4">
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
        <div className="grid grid-cols-6 space-x-4">
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
      </div>
    </>
  );
}
