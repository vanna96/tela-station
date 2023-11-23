import { Route, Routes } from "react-router-dom";
import { APIContextProvider } from "@/presentations/expense/context/APIContext";
import SaleOrderDetail from "@/presentations/sale/sale_order/detail";
import StockControlPage from "@/presentations/stock_control";
import InventoryTransferRequestList from "@/presentations/stock_control/inventory_transfer_request";
import InventoryTransferRequestForm from "@/presentations/stock_control/inventory_transfer_request/form/index";
import InventoryTransferList from "@/presentations/stock_control/inventory_transfer";
import InventoryTransferForm from "@/presentations/stock_control/inventory_transfer/form/index";
import GoodIssueList from "@/presentations/stock_control/good_issue";
import GoodIssueForm from "@/presentations/stock_control/good_issue/form/index";
import PumpTestList from "@/presentations/stock_control/pump_test";
import PumpTestForm from "@/presentations/stock_control/pump_test/form/index";
import PumpTestDetail from "@/presentations/stock_control/pump_test/detail/index";
import FuelLevelList from "@/presentations/stock_control/fuel_level";
import FuelLevelForm from "@/presentations/stock_control/fuel_level/form/index";
import FuelLevelDetails from "@/presentations/stock_control/fuel_level/detail/index";


export default function StockControlRoute() {
  return (
    <APIContextProvider>
      <Routes>
        <Route index element={<StockControlPage />} />

        <Route path="/inventory-transfer-request">
          <Route index element={<InventoryTransferRequestList />} />
          <Route path="create" element={<InventoryTransferRequestForm />} />
          <Route path=":id/edit" element={<InventoryTransferRequestForm edit={true} />} />
          <Route path=":id" element={<SaleOrderDetail edit={true} />} />
        </Route>
        <Route path="/inventory-transfer">
          <Route index element={<InventoryTransferList />} />
          <Route path="create" element={<InventoryTransferForm />} />
          <Route path=":id/edit" element={<InventoryTransferForm edit={true} />} />
          <Route path=":id" element={<SaleOrderDetail edit={true} />} />
        </Route>
        <Route path="/good-issue">
          <Route index element={<GoodIssueList />} />
          <Route path="create" element={<GoodIssueForm />} />
          <Route path=":id/edit" element={<GoodIssueForm edit={true} />} />
          <Route path=":id" element={<SaleOrderDetail edit={true} />} />
        </Route>
        <Route path="/good-receipt">
          <Route index element={<GoodIssueList />} />
          <Route path="create" element={<GoodIssueForm />} />
          <Route path=":id/edit" element={<GoodIssueForm edit={true} />} />
          <Route path=":id" element={<SaleOrderDetail edit={true} />} />
        </Route>

        <Route path="/pump-test">
          <Route index element={<PumpTestList />} />
          <Route path="create" element={<PumpTestForm />} />
          <Route path=":id/edit" element={<PumpTestForm edit={true} />} />
          <Route path=":id" element={<PumpTestDetail edit={true} />} />
        </Route>
        <Route path="/fuel-level">
          <Route index element={<FuelLevelList />} />
          <Route path="create" element={<FuelLevelForm />} />
          <Route path=":id/edit" element={<FuelLevelForm edit={true} />} />
          <Route path=":id" element={<FuelLevelDetails edit={true} />} />
        </Route>
      </Routes>
    </APIContextProvider>
  );
}
