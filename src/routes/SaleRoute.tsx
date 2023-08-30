import { Route, Routes } from "react-router-dom"
import SaleMasterPage from "@/presentations/sale"
import SaleQuotationLists from "@/presentations/sale/sale_quotation"
import SaleQuotationForm from "@/presentations/sale/sale_quotation/quotation_form"
import SaleQuotationDetail from "@/presentations/sale/sale_quotation/quotation_detail"
import SaleOrderLists from "@/presentations/sale/sale_order"
import SalesOrderForm from "@/presentations/sale/sale_order/form/index"
import SaleOrderDetail from "@/presentations/sale/sale_order/detail"
import { QueryCacheProvider } from "@/utilies/provider"
import ReturnRequestLists from "@/presentations/sale/return_request"
import ReturnRequestForm from "@/presentations/sale/return_request/form"
import ReturnRequestDetail from "@/presentations/sale/return_request/detail"
import ReturnLists from "@/presentations/sale/return"
import ReturnForm from "@/presentations/sale/return/form"
import ReturnDetail from "@/presentations/sale/return/detail"
import DeliveryLists from "@/presentations/sale/sale_delivery"
import DeliveryForm from "@/presentations/sale/sale_delivery/form"
import DeliveryDetail from "@/presentations/sale/sale_delivery/detail"
import InvoiceLists from "@/presentations/sale/sale_invoice"
import InvoiceForm from "@/presentations/sale/sale_invoice/form"
import InvoiceDetails from "@/presentations/sale/sale_invoice/detail"


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
      {/* <Route path="/sales-order">
        <Route index element={<SaleOrderLists />} />
        <Route path="create" element={<SalesOrderForm />} />
        <Route
          path=":id"
          element={
            <QueryCacheProvider>
              <SaleOrderDetail />
            </QueryCacheProvider>
          }
        />
        <Route path=":id/edit" element={<SalesOrderForm />} />
      </Route> */}
      <Route path="/sales-order">
        <Route index element={<SaleOrderLists />} />
        <Route path="create" element={<SalesOrderForm />} />
        <Route path=":id/edit" element={<SalesOrderForm edit={true} />} />
        <Route path=":id" element={<SaleOrderDetail edit={true} />} />
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
      <Route path="/delivery">
        <Route index element={<DeliveryLists />} />
        <Route path="create" element={<DeliveryForm />} />
        <Route path=":id/edit" element={<DeliveryForm edit={true} />} />
        <Route path=":id" element={<DeliveryDetail edit={true} />} />
      </Route>
      <Route path="/invoice">
        <Route index element={<InvoiceLists />} />
        <Route path="create" element={<InvoiceForm />} />
        <Route path=":id/edit" element={<ReturnForm edit={true} />} />
        <Route path=":id" element={<InvoiceDetails edit={true} />} />
      </Route>
    </Routes>
  )
}
