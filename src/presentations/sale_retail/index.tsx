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

const SaleRetailPage = () => {
  const navigate = useNavigate();
  const [count, setCount]: any = useState();
  const goTo = (route: string) => navigate("/sale-retail/" + route);

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
      <MainContainer title="Sales">
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
          title="LPG"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("lpg-sales")}
          amount={count?.order || 0}
        />

        <ItemCard
          title="Sale Order"
          icon={<AiOutlineFileSearch />}
          onClick={() => goTo("sale-order")}
          amount={count?.order || 0}
        />
      </MainContainer>
    </>
  );
};

export default SaleRetailPage;
