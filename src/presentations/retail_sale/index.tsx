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

const RetailSalePage = () => {
  const navigate = useNavigate();
  const [count, setCount]: any = useState();
  const goTo = (route: string) => navigate("/retail-sale/" + route);

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
      <MainContainer title="Retail Sale">
        {/* <ItemCard
          title="Sales Order"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("sales-order")}
          amount={count?.order || 0}
        /> */}
        <ItemCard
          title="Fuel Cash Sale"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("fuel-cash-sale")}
          amount={count?.order || 0}
        />
        <ItemCard
          title="Lube Cash Sale"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("lube-cash-sale")}
          amount={count?.order || 0}
        />
        <ItemCard
          title="LPG Cash Sale"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("lpg-cash-sale")}
          amount={count?.order || 0}
        />

        {/* <ItemCard
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
        /> */}
       
      </MainContainer>
    </>
  );
};

export default RetailSalePage;