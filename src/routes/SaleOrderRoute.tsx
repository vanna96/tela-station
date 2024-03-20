import { Route, Routes } from "react-router-dom";
import SaleOrderLists from "@/presentations/sale_order/sale_order_lob";
import SalesOrderForm from "@/presentations/sale_order/sale_order_lob/form/index";
import SaleOrderDetail from "@/presentations/sale_order/sale_order_lob/detail/index";
import Page from "@/presentations/sale_order";

export default function SaleOrderRoute() {
  return (
    <Routes>
      <Route index element={<Page />} />

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
