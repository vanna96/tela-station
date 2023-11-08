import { Route, Routes } from "react-router-dom";
import { APIContextProvider } from "@/presentations/expense/context/APIContext";
import SaleOrderDetail from "@/presentations/sale/sale_order/detail";
import StockControlPage from "@/presentations/stock_control";
import InventoryTransferRequestList from "@/presentations/stock_control/inventory_transfer_request";
import InventoryTransferRequestForm from "@/presentations/stock_control/inventory_transfer_request/form/index";
import InventoryTransferList from "@/presentations/stock_control/inventory_transfer";
import InventoryTransferForm from "@/presentations/stock_control/inventory_transfer/form/index";


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
          <Route index element={<InventoryTransferRequestList />} />
          <Route path="create" element={<InventoryTransferForm />} />
          <Route path=":id/edit" element={<InventoryTransferForm edit={true} />} />
          <Route path=":id" element={<SaleOrderDetail edit={true} />} />
        </Route>
        <Route path="/good-receipt">
          <Route index element={<InventoryTransferRequestList />} />
          <Route path="create" element={<InventoryTransferForm />} />
          <Route path=":id/edit" element={<InventoryTransferForm edit={true} />} />
          <Route path=":id" element={<SaleOrderDetail edit={true} />} />
        </Route>

        <Route path="/pump-test">
          <Route index element={<InventoryTransferRequestList />} />
          <Route path="create" element={<InventoryTransferForm />} />
          <Route path=":id/edit" element={<InventoryTransferForm edit={true} />} />
          <Route path=":id" element={<SaleOrderDetail edit={true} />} />
        </Route>
        <Route path="/fuel-level">
          <Route index element={<InventoryTransferRequestList />} />
          <Route path="create" element={<InventoryTransferForm />} />
          <Route path=":id/edit" element={<InventoryTransferForm edit={true} />} />
          <Route path=":id" element={<SaleOrderDetail edit={true} />} />
        </Route>
      </Routes>
    </APIContextProvider>
  );
}
