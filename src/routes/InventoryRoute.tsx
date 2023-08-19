import React from "react";
import { Route, Routes } from "react-router-dom";
import InventoryMasterPage from "@/presentations/inventory";
import Lists from '../presentations/inventory/stock_transfer/page/Listing';
import Form from "@/presentations/inventory/stock_transfer/page/Form";
import Detail from "@/presentations/inventory/stock_transfer/page/Detail";
import StockTransferRequestLists from '../presentations/inventory/stock_transfer_request/page/Listing';
import StockTransferRequestForm from "@/presentations/inventory/stock_transfer_request/page/Form";
import StockTransferRequestDetail from "@/presentations/inventory/stock_transfer_request/page/Detail";
import InternalTransferRequestLists from '../presentations/inventory/internal_transfer_request/page/Listing';
import InternalTransferDetails from '../presentations/inventory/internal_transfer_request/page/Detail'
import InternalTransferForm from '../presentations/inventory/internal_transfer_request/page/Form'
import StockDamageRequestList from "@/presentations/inventory/stock_damage_request/page/Listing";
import StockDamageRequestDetail from "@/presentations/inventory/stock_damage_request/page/Detail";
import StockDamageRequestForm from "../presentations/inventory/stock_damage_request/page/Form"
import GoodIssueList from "@/presentations/inventory/good_issue/page/Listing";
import GoodIssueDetail from "@/presentations/inventory/good_issue/page/Detail";
import GoodIssueForm from "../presentations/inventory/good_issue/page/Form"
import GoodReceiptPOList from "@/presentations/inventory/good_receipt_po/page/Listing";
import GoodReceiptPODetail from "@/presentations/inventory/good_receipt_po/page/Detail";
import GoodReceiptPOForm from "../presentations/inventory/good_receipt_po/page/Form"

export default function InventoryRoute() {
  return (
    <Routes>
      <Route index element={<InventoryMasterPage />} />
      <Route path="/internal-transfer-request">
        <Route index element={<InternalTransferRequestLists />} />
        <Route path=":id" element={<InternalTransferDetails />} />
        <Route path="create" element={<InternalTransferForm />} />
        <Route
          path=":id/edit"
          element={<InternalTransferForm edit={true} />}
        />
      </Route>
      <Route path="/stock-damage-request">
        <Route index element={< StockDamageRequestList />} />
        <Route path=':id' element={<StockDamageRequestDetail />} />
        <Route path='create' element={<StockDamageRequestForm />} />
        <Route path=':id/edit' element={<StockDamageRequestForm edit={true} />} />

      </Route>
      <Route path="/stock-transfer-request">
        <Route index element={<StockTransferRequestLists />} />
        <Route path=':id' element={<StockTransferRequestDetail />} />
        <Route path='create' element={<StockTransferRequestForm />} />
        <Route path=':id/edit' element={<StockTransferRequestForm edit={true} />} />

      </Route>
      <Route path="/stock-transfer">
        <Route index element={<Lists />} />
        <Route path=':id' element={<Detail />} />
        <Route path='create' element={<Form />} />
        <Route path=':id/edit' element={<Form edit={true} />} />

      </Route>

      <Route path="/good-issue">
        <Route index element={<GoodIssueList />} />
        <Route path=':id' element={<GoodIssueDetail />} />
        <Route path='create' element={<GoodIssueForm />} />
        <Route path=':id/edit' element={<GoodIssueForm edit={true} />} />

      </Route>
      <Route path="/good-receipt">
        <Route index element={<GoodReceiptPOList />} />
        <Route path=':id' element={<GoodReceiptPODetail />} />
        <Route path='create' element={<GoodReceiptPOForm />} />
        <Route path=':id/edit' element={<GoodReceiptPOForm edit={true} />} />

      </Route>
    </Routes>
  );
}
