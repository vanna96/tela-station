import { Route, Routes } from "react-router-dom";
import SaleOrderLists from "@/presentations/sale_invoice/sale_invoice_lob";
import SalesOrderForm from "@/presentations/sale_invoice/sale_invoice_lob/form/index";
import SaleOrderDetail from "@/presentations/sale_invoice/sale_invoice_lob/detail";
import SaleInvoicePage from "@/presentations/sale_invoice";

export default function SaleInvoiceRoute() {
  return (
    <Routes>
      <Route index element={<SaleInvoicePage />} />

      <Route path="/fuel-invoice">
        <Route index element={<SaleOrderLists />} />
        <Route path="create" element={<SalesOrderForm />} />
        <Route path=":id/edit" element={<SalesOrderForm edit={true} />} />
        <Route path=":id" element={<SaleOrderDetail edit={true} />} />
      </Route>
      <Route path="/lube-invoice">
        <Route index element={<SaleOrderLists />} />
        <Route path="create" element={<SalesOrderForm />} />
        <Route path=":id/edit" element={<SalesOrderForm edit={true} />} />
        <Route path=":id" element={<SaleOrderDetail edit={true} />} />
      </Route>
      <Route path="/lpg-invoice">
        <Route index element={<SaleOrderLists />} />
        <Route path="create" element={<SalesOrderForm />} />
        <Route path=":id/edit" element={<SalesOrderForm edit={true} />} />
        <Route path=":id" element={<SaleOrderDetail edit={true} />} />
      </Route>
    </Routes>
  );
}
