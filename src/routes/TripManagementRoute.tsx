import { Route, Routes } from "react-router-dom";
import TripManagementPage from "@/presentations/trip_management";

import TransportationRequestList from "@/presentations/trip_management/transportation_request";
import Form from "@/presentations/trip_management/transportation_request/form/index"

import TransportationOrderList from "@/presentations/trip_management/transportation_order";
import TransportationOrderForm from "@/presentations/trip_management/transportation_order/form/TransportationOrderForm";
import TransportationRequestDetail from "@/presentations/trip_management/transportation_request/detail";
import TransportationOrderDashboad from "@/presentations/trip_management/transportation_order/TransportationOrderDashboad";
import TransportationOrderDetail from "@/presentations/trip_management/transportation_order/detail/TransportationOrderDetail";

export default function TripManagementRoute() {
  return (
    <Routes>
      <Route index element={<TripManagementPage />} />

      <Route path="/transportation-request">
        <Route index element={<TransportationRequestList />} />
        <Route path="create" element={<Form />} />
        <Route path=":id/edit" element={<Form edit={true} />} />
        <Route
          path=":id"
          element={<TransportationRequestDetail detail={true} />}
        />
      </Route>
      <Route path="/transportation-order/*">
        <Route index element={<TransportationOrderDashboad />} />
        <Route path={`create`} element={<TransportationOrderForm />} />
        <Route
          path=":id"
          element={<TransportationOrderDetail detail={true} />}
        />
        <Route
          path=":id/edit"
          element={<TransportationOrderForm edit={true} />}
        />
      </Route>
    </Routes>
  );
}
