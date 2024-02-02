import { Route, Routes } from "react-router-dom";
import TripManagementPage from "@/presentations/trip_management";

import TransportationRequestList from "@/presentations/trip_management/transportation_request";
import Form from "@/presentations/trip_management/transportation_request/form/index"
export default function TripManagementRoute() {
  return (
    <Routes>
    <Route index element={<TripManagementPage />} />

    <Route path="/transportation-request">
      <Route index element={<TransportationRequestList />} />
      <Route path="create" element={<Form />} />
      {/* <Route path=":id/edit" element={<SalesOrderForm edit={true} />} /> */}
      {/* <Route path=":id" element={<SaleOrderDetail edit={true} />} /> */}
    </Route>
  </Routes>
  );
}
