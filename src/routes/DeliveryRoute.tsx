import { Route, Routes } from "react-router-dom";
import List from "@/presentations/delivery/delivery-note/index";
import DeliveryForm from "@/presentations/delivery/delivery-note/form/index";
import Detail from "@/presentations/delivery/delivery-note/detail/index";
import Page from "@/presentations/sale_order";

export default function DeliveryRoute() {
  return (
    <Routes>
      <Route index element={<Page />} />

      <Route path="/delivery-note">
        <Route index element={<List />} />
        <Route path="create" element={<DeliveryForm />} />
        <Route path=":id/edit" element={<DeliveryForm edit={true} />} />
        <Route path=":id" element={<Detail edit={true} />} />
      </Route>
    </Routes>
  );
}
