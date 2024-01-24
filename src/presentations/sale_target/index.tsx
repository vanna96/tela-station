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

const SaleTargetPage = () => {
  const navigate = useNavigate();
  const [count, setCount]: any = useState();
  const goTo = (route: string) => navigate("/sale-target/" + route);

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
      <MainContainer title="Sale Target">
        <ItemCard
          title="Sale Scenario "
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("sale-scenario")}
          amount={count?.order || 0}
        />
        <ItemCard
          title="Sale Target "
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("sale-target")}
          amount={count?.order || 0}
        />
      </MainContainer>
    </>
  );
};

export default SaleTargetPage;
