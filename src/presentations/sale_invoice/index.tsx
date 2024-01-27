import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineFileAdd,
  AiOutlineFileExcel,
  AiOutlineFileProtect,
} from "react-icons/ai";
import SalesOrderRepository from "@/services/actions/SalesOrderRepository";

const SaleInvoicePage = () => {
  const navigate = useNavigate();
  const [count, setCount]: any = useState();
  const goTo = (route: string) => navigate("/sale-invoice/" + route);

  const getCount = async () => {
    const fuel = await new SalesOrderRepository().getCount({
      params: {
        $filter: `U_tl_salestype eq null and U_tl_arbusi eq 'Oil'`,
      },
    });
    const lube = await new SalesOrderRepository().getCount({
      params: {
        $filter: `U_tl_salestype eq null and U_tl_arbusi eq 'Lube'`,
      },
    });

    const lpg = await new SalesOrderRepository().getCount({
      params: {
        $filter: `U_tl_salestype eq null and U_tl_arbusi eq 'LPG'`,
      },
    });
    setCount({
      ...count,
      lube,
      fuel,
      lpg,
    });
  };
  useEffect(() => {
    getCount();
  }, []);

  return (
    <>
      <MainContainer title="Sale Invoice">
        <ItemCard
          title="Fuel Sales"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("fuel-sales")}
          amount={count?.fuel || 0}
        />
        <ItemCard
          title="Lube Sales"
          icon={<AiOutlineFileExcel />}
          onClick={() => goTo("lube-sales")}
          amount={count?.lube || 0}
        />
        <ItemCard
          title="LPG Sales"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("lpg-sales")}
          amount={count?.lpg || 0}
        />
      </MainContainer>
    </>
  );
};

export default SaleInvoicePage;
