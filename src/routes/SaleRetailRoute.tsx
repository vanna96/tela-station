import { Route, Routes } from "react-router-dom";
import SaleOrderLists from "@/presentations/sale_retail/sale_order_lob";
import SalesOrderForm from "@/presentations/sale_retail/sale_order_lob/form/index";
import SaleOrderDetail from "@/presentations/sale_retail/sale_order_lob/detail";
import SaleRetailPage from "@/presentations/sale_retail";
import List from "@/presentations/sale_retail/sale_order";
import Form from "@/presentations/sale_retail/sale_order/form/index";
import Detail from "@/presentations/sale_retail/sale_order/detail";


export default function SaleRetailRoute() {
  return (
    <Routes>
      <Route index element={<SaleRetailPage />} />

      <Route path="/sale-order">
        <Route index element={<List />} />
        <Route path="create" element={<Form />} />
        <Route path=":id/edit" element={<Form edit={true} />} />
        <Route path=":id" element={<Detail edit={true} />} />
      </Route>
      <Route path="/fuel-sales">
        <Route index element={<SaleOrderLists />} />
        <Route path="create" element={<SalesOrderForm />} />
        <Route path=":id/edit" element={<SalesOrderForm edit={true} />} />
        <Route path=":id" element={<SaleOrderDetail edit={true} />} />
      </Route>
      <Route path="/lube-sales">
        <Route index element={<SaleOrderLists />} />
        <Route path="create" element={<SalesOrderForm />} />
        <Route path=":id/edit" element={<SalesOrderForm edit={true} />} />
        <Route path=":id" element={<SaleOrderDetail edit={true} />} />
      </Route>
      <Route path="/lpg-sales">
        <Route index element={<SaleOrderLists />} />
        <Route path="create" element={<SalesOrderForm />} />
        <Route path=":id/edit" element={<SalesOrderForm edit={true} />} />
        <Route path=":id" element={<SaleOrderDetail edit={true} />} />
      </Route>
    </Routes>
  );
}
