import { Route, Routes } from "react-router-dom";
import { QueryCacheProvider } from "@/utilies/provider";
import Collection from "@/presentations/collection";
import IncomingPaymentLists from "@/presentations/collection/incoming_payment";
import Form from "@/presentations/collection/incoming_payment/form";
import Detail from "@/presentations/collection/incoming_payment/detail";

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
    </Routes>
  );
}
