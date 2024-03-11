import { Route, Routes } from "react-router-dom";
import SaleOrderLists from "@/presentations/retail_sale/fuel_cash_sale";
import SalesOrderForm from "@/presentations/retail_sale/fuel_cash_sale/form/index";
import SaleOrderDetail from "@/presentations/retail_sale/fuel_cash_sale/detail";
import RetailSalePage from "@/presentations/retail_sale";

import LPGForm from "@/presentations/retail_sale/lpg_cash_sale/form/index";
import LPGDetail from "@/presentations/retail_sale/lpg_cash_sale/detail";

import LubeForm from "@/presentations/retail_sale/lube_cash_sale/form/index";
import LubeDetail from "@/presentations/retail_sale/lube_cash_sale/detail";
import LubeLists from "@/presentations/retail_sale/lube_cash_sale";
export default function RetailSaleRoute() {
  return (
    <Routes>
      <Route index element={<RetailSalePage />} />

      <Route path="/fuel-cash-sale">
        <Route index element={<SaleOrderLists />} />
        <Route path="create" element={<SalesOrderForm />} />
        <Route path=":id/edit" element={<SalesOrderForm edit={true} />} />
        <Route path=":id" element={<SaleOrderDetail edit={true} />} />
      </Route>
      <Route path="/lube-cash-sale">
        <Route index element={<LubeLists />} />
        <Route path="create" element={<LubeForm />} />
        <Route path=":id/edit" element={<LubeForm edit={true} />} />
        <Route path=":id" element={<LubeDetail edit={true} />} />
      </Route>

      <Route path="/lpg-cash-sale">
        <Route index element={<SaleOrderLists />} />
        <Route path="create" element={<LPGForm />} />
        <Route path=":id/edit" element={<LPGForm edit={true} />} />
        <Route path=":id" element={<LPGDetail edit={true} />} />
      </Route>
    </Routes>
  );
}
