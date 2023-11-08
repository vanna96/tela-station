import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineFileAdd,
  AiOutlineFileExcel,
  AiOutlineFileProtect,
  AiOutlineFileSearch,
} from "react-icons/ai";
import { request } from "http";
import SalesOrderRepository from "@/services/actions/SalesOrderRepository";

const StockControlPage = () => {
  const navigate = useNavigate();
  const [count, setCount]: any = useState();
  const goTo = (route: string) => navigate("/stock-control/" + route);

  const getCount = async () => {
    const order = await new SalesOrderRepository().getCount({});
    setCount({
      ...count,
      order,
    });
  };

  useEffect(() => {
    getCount();
  }, []);

  return (
    <>
      <MainContainer title="Stock Control">
        <ItemCard
          title="Inventory Transfer Request"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("inventory-transfer-request")}
          amount={count?.order || 0}
        />
        <ItemCard
          title="Inventory Transfer "
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("inventory-transfer")}
          amount={count?.order || 0}
        />
        <ItemCard
          title="Good Issue "
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("good-issue")}
          amount={count?.order || 0}
        />
        <ItemCard
          title="Good Receipt "
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("good-receipt")}
          amount={count?.order || 0}
        />
        <ItemCard
          title="Pump Test "
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("good-receipt")}
          amount={count?.order || 0}
        />
        <ItemCard
          title="Fuel Level "
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("fuel-level")}
          amount={count?.order || 0}
        />
      </MainContainer>
    </>
  );
};

export default StockControlPage;
