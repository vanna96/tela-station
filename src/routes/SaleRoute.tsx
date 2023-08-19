import { Route, Routes } from "react-router-dom"
import SaleMasterPage from "@/presentations/sale"
import SaleQuotationLists from "@/presentations/sale/sale_quotation"
import SaleQuotationForm from "@/presentations/sale/sale_quotation/quotation_form"
import SaleQuotationDetail from "@/presentations/sale/sale_quotation/quotation_detail"
import SaleOrderLists from "@/presentations/sale/sale_order"
import SaleOrderForm from "@/presentations/sale/sale_order/order_form"
import SaleOrderDetail from "@/presentations/sale/sale_order/order_detail"
import { QueryCacheProvider } from "@/utilies/provider"
import ReturnRequestLists from "@/presentations/sale/return_request"
import ReturnRequestForm from "@/presentations/sale/return_request/form"
import ReturnRequestDetail from "@/presentations/sale/return_request/detail"
import ReturnLists from "@/presentations/sale/return"
import ReturnForm from "@/presentations/sale/return/form"
import ReturnDetail from "@/presentations/sale/return/detail"

export default function SaleRoute() {
  return (
    <Routes>
      <Route index element={<SaleMasterPage />} />
      <Route path="/sales-quotation">
        <Route index element={<SaleQuotationLists />} />
        <Route path="create" element={<SaleQuotationForm />} />
        <Route path=":id" element={<SaleQuotationDetail />} />
        <Route path=":id/edit" element={<SaleQuotationForm />} />
      </Route>
      <Route path="/sales-order">
        <Route index element={<SaleOrderLists />} />
        <Route path="create" element={<SaleOrderForm />} />
        <Route
          path=":id"
          element={
            <QueryCacheProvider>
              <SaleOrderDetail />
            </QueryCacheProvider>
          }
        />
        <Route path=":id/edit" element={<SaleOrderForm />} />
      </Route>
      <Route path="/return-request">
        <Route index element={<ReturnRequestLists />} />
        <Route path="create" element={<ReturnRequestForm />} />
        <Route path=":id/edit" element={<ReturnRequestForm edit={true} />} />
        <Route path=":id" element={<ReturnRequestDetail edit={true} />} />
      </Route>
      <Route path="/return">
        <Route index element={<ReturnLists />} />
        <Route path="create" element={<ReturnForm />} />
        <Route path=":id/edit" element={<ReturnForm edit={true} />} />
        <Route path=":id" element={<ReturnDetail edit={true} />} />
      </Route>
    </Routes>
  )
}
