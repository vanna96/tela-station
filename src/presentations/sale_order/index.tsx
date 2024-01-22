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
// import SalesQuotationRepository from "@/services/actions/SalesQuotationRepository";
import SalesOrderRepository from "@/services/actions/SalesOrderRepository";

const SaleOrderPage = () => {
  const navigate = useNavigate();
  const [count, setCount]: any = useState();
  const goTo = (route: string) => navigate("/sale-order/" + route);

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
      <MainContainer title="Sale Order">
        {/* <ItemCard
          title="Sales Order"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("sales-order")}
          amount={count?.order || 0}
        /> */}
        <ItemCard
          title="Fuel Sales"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("fuel-sales")}
          amount={count?.order || 0}
        />
        <ItemCard
          title="Lube Sales"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("lube-sales")}
          amount={count?.order || 0}
        />
        <ItemCard
          title="LPG Sales"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("lpg-sales")}
          amount={count?.order || 0}
        />

      </MainContainer>
    </>
  );
};

export default SaleOrderPage;
