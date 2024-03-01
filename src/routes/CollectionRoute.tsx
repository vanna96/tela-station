import { Route, Routes } from "react-router-dom"
import { QueryCacheProvider } from "@/utilies/provider"
import Collection from "@/presentations/collection"
import IncomingPaymentLists from "@/presentations/collection/incoming_payment";
import Form from "@/presentations/collection/incoming_payment/form";
import Detail from "@/presentations/collection/incoming_payment/detail";
import OutGoingLists from "@/presentations/collection/outgoing_payment";
import OutGoingForm from "@/presentations/collection/outgoing_payment/form";
import OutGoingDetail from "@/presentations/collection/outgoing_payment/detail";
import SettleReceiptLists from "@/presentations/collection/settle_receipt"
import SettleReceiptForm from "@/presentations/collection/settle_receipt/form"
import SettleReceiptDetail from "@/presentations/collection/settle_receipt/detail/index"
import { APIContextProvider } from "@/presentations/collection/settle_receipt/context/APIContext"
import PaymentAccountLists from "@/presentations/collection/payment_account"
import PaymentAccountForm from "@/presentations/collection/payment_account/form"
import PaymentAccountDetail from "@/presentations/collection/payment_account/detail"
import DirectAccountLists from "@/presentations/collection/direct_account"
import DirectAccountForm from "@/presentations/collection/direct_account/form"
import DirectAccountDetail from "@/presentations/collection/direct_account/detail"

export default function CollectionRoute() {
  return (
    <Routes>
      <Route index element={<Collection />} />
      <Route path="/incoming-payments">
        <Route index element={<IncomingPaymentLists />} />
        <Route path="create" element={<Form />} />
        <Route
          path=":id"
          element={
            <QueryCacheProvider>
              <Detail />
            </QueryCacheProvider>
          }
        />
        <Route path=":id/edit" element={<Form />} />
      </Route>
      <Route path="/outgoing-payment">
        <Route index element={<OutGoingLists />} />
        <Route path="create" element={<OutGoingForm />} />
        <Route
          path=":id"
          element={
            <QueryCacheProvider>
              <OutGoingDetail />
            </QueryCacheProvider>
          }
        />
        <Route path=":id/edit" element={<OutGoingForm />} />
      </Route>
      <Route path="/settle-receipt">
        <Route index element={<SettleReceiptLists />} />
        <Route
          path="create"
          element={
            <APIContextProvider>
              <SettleReceiptForm />
            </APIContextProvider>
          }
        />
        <Route
          path=":id"
          element={
            <APIContextProvider>
              <SettleReceiptDetail />
            </APIContextProvider>
          }
        />
        <Route
          path=":id/edit"
          element={
            <APIContextProvider>
              <SettleReceiptForm edit={true} />
            </APIContextProvider>
          }
        />
      </Route>
      <Route path="/payment-account">
        <Route index element={<PaymentAccountLists />} />
        <Route
          path="create"
          element={
            <APIContextProvider>
              <PaymentAccountForm />
            </APIContextProvider>
          }
        />
        <Route
          path=":id"
          element={
            <APIContextProvider>
              <PaymentAccountDetail />
            </APIContextProvider>
          }
        />
        <Route
          path=":id/edit"
          element={
            <APIContextProvider>
              <PaymentAccountForm edit={true} />
            </APIContextProvider>
          }
        />
      </Route>
      <Route path="/direct-account">
        <Route index element={<DirectAccountLists />} />
        <Route
          path="create"
          element={
            <APIContextProvider>
              <DirectAccountForm />
            </APIContextProvider>
          }
        />
        <Route
          path=":id"
          element={
            <APIContextProvider>
              <DirectAccountDetail />
            </APIContextProvider>
          }
        />
        <Route
          path=":id/edit"
          element={
            <APIContextProvider>
              <DirectAccountForm edit={true} />
            </APIContextProvider>
          }
        />
      </Route>
    </Routes>
  )
}
