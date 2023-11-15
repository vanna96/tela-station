import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineShopping,
  AiOutlineFileAdd,
  AiOutlineFileUnknown,
  AiOutlineSolution,
  AiOutlineSnippets,
  AiOutlineFileExcel,
  AiOutlineFileProtect,
} from "react-icons/ai";

const MasterDataPage = () => {
  const navigate = useNavigate();

  const goTo = (route: string) => navigate("/master-data/" + route);

  //   const getCount = async () => {
  //     const order = await new SalesOrderRepository().getCount({});
  //     setCount({
  //       ...count,
  //       order,
  //     });
  //   };

  //   useEffect(() => {
  //     getCount();
  //   }, []);

  return (
    <>
      <MainContainer title="Master Data">
        {/* <ItemCard title='Item Master Data' onClick={() => goTo('item-master-data')} icon={<AiOutlineFileProtect />} />
            <ItemCard title='Employees' onClick={() => goTo('employee')} icon={<AiOutlineFileProtect />} />
            <ItemCard title='Suppliers' onClick={() => goTo('supplier')} icon={<AiOutlineFileProtect />} />
            <ItemCard title='Customers' icon={<AiOutlineFileUnknown />} />
            <ItemCard title='Warehouses' onClick={() => goTo('warehouse')} icon={<AiOutlineSnippets />} />
            <ItemCard title='Bin Location' onClick={() => goTo('binlocation')} icon={<AiOutlineSolution />} /> */}
        <ItemCard
          title="Dispenser"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("dispenser")}
          amount={
            // count?.order ||
            0
          }
        />

        <ItemCard
          title="Expense Dictionary"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("expense-dictionary")}
          amount={
            // count?.order ||
            0
          }
        />
        <ItemCard
          title="Cash Account"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("cash-account")}
          amount={
            // count?.order ||
            0
          }
        />
      </MainContainer>
    </>
  );
};

export default MasterDataPage;
