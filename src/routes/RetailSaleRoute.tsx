import { Route, Routes } from "react-router-dom";
import SaleOrderLists from "@/presentations/retail_sale/sale_order";
import SalesOrderForm from "@/presentations/retail_sale/sale_order/form/index";
import SaleOrderDetail from "@/presentations/retail_sale/sale_order/detail";
import PumpSaleLists from "@/presentations/retail_sale/pump_sale";
import PumpSaleForm from "@/presentations/retail_sale/pump_sale/form";
import PumpSaleDetail from "@/presentations/retail_sale/pump_sale/detail";
import MorphPriceLists from "@/presentations/retail_sale/morph_price";
import MorphPriceForm from '@/presentations/retail_sale/morph_price/form';
import MorphPriceDetail from '@/presentations/retail_sale/morph_price/detail';
import RetailSalePage from "@/presentations/retail_sale";

export default function RetailSaleRoute() {
  return (
    <Routes>
      <Route index element={<RetailSalePage />} />

     
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


      <Route path="/morph-price">
        <Route index element={<MorphPriceLists />} />
        <Route path="create" element={<MorphPriceForm />} />
        <Route path=":id/edit" element={<MorphPriceForm edit={true} />} />
        <Route path=":id" element={<MorphPriceDetail edit={true} />} />
      </Route>

     
      <Route path="/pump-record">
        <Route index element={<PumpSaleLists />} />
        <Route path="create" element={<PumpSaleForm />} />
        <Route path=":id/edit" element={<PumpSaleForm edit={true} />} />
        <Route path=":id" element={<PumpSaleDetail />} />
      </Route>
    </Routes>
  );
}
