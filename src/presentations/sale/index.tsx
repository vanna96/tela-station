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
import SalesQuotationRepository from "@/services/actions/SalesQuotationRepository";
import SalesOrderRepository from "@/services/actions/SalesOrderRepository";

const SaleMasterPage = () => {
  const navigate = useNavigate();
  const [count, setCount]: any = useState();
  const goTo = (route: string) => navigate("/sale/" + route);

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
          title="Oil Sales"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("oil-sales")}
          amount={count?.order || 0}
        />
        <ItemCard
          title="Lube Sales"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("lube-sales")}
          amount={count?.order || 0}
        />
        <ItemCard
          title="Gas Sales"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("gas-sales")}
          amount={count?.order || 0}
        />

        <ItemCard
          title="Pump Record"
          icon={<AiOutlineFileSearch />}
          onClick={() => goTo("pump-record")}
          amount={count?.order || 0}
        />
         <ItemCard
          title="Morph Price"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("morph-price")}
          amount={count?.order || 0}
        />
        <ItemCard
          title="Dispenser"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("dispenser")}
          amount={count?.order || 0}
        />
      </MainContainer>
    </>
  );
};

export default SaleMasterPage;
