import React from "react";
import { Route, Routes } from "react-router-dom";
import EmployeeLists from "@/presentations/master/employee/page/EmployeeList";
import EmployeeForm from "@/presentations/master/employee/page/EmployeeForm";
import MasterDataPage from "@/presentations/master";
import BinlocationLists from "@/presentations/master/binlocation";
import BinlocationDetail from "@/presentations/master/binlocation/page/BinlocationDetail";
import BinlocationForm from "@/presentations/master/binlocation/page/BinlocationForm";

import ItemMasterDataListing from "@/presentations/master/item_master_data/ItemListing";
import ItemMasterDataDetails from "../presentations/master/item_master_data/page/ItemDetails";
import ItemMasterDataForm from "../presentations/master/item_master_data/page/ItemForm";
import WarehoseLists from "@/presentations/master/Warehouse";
import WarehouseDetail from "@/presentations/master/Warehouse/page/WarehouseDetail";
import WarehouseForm from "@/presentations/master/Warehouse/page/WarehouseForm";
import EmployeeDetail from "@/presentations/master/employee/page/EmployeeDetail";
import SuppilerLists from "@/presentations/master/supplierMasterData/page/SupplierList";
import SupplierForm from "@/presentations/master/supplierMasterData/page/SupplierForm";
import SupplierDetails from "@/presentations/master/supplierMasterData/page/SupplierDetails";
import BusinessPartnerForm from "@/presentations/master/supplierMasterData/page/SupplierForm";
import DispenserList from "@/presentations/master_data/dispenser";
import DispenserDetail from "@/presentations/master_data/dispenser/detail";
import DispenserForm from "@/presentations/master_data/dispenser/form";
import ExpenseDictionaryList from "@/presentations/master_data/expense_dictionary";
import ExpenseDictionaryForm from "@/presentations/master_data/expense_dictionary/form";
import ExpenseDictionaryDetail from "@/presentations/master_data/expense_dictionary/detail";

import CashAccountList from "@/presentations/master_data/cash_account/index";
import CashAccountForm from "@/presentations/master_data/cash_account/form/index";
import CashAccountDetail from "@/presentations/master_data/cash_account/detail/index";

import PumpAttendantList from "@/presentations/master_data/pump_attendant/index";
import PumpAttendantForm from "@/presentations/master_data/pump_attendant/form/index";
import PumpAttendantDetail from "@/presentations/master_data/pump_attendant/detail/index";

import DriverList from "@/presentations/master_data/driver/index";
import DriverForm from "@/presentations/master_data/driver/form/index";
import DriverDetail from "@/presentations/master_data/driver/detail/index";

import VehicleList from "@/presentations/master_data/vehicle/index";

import Stopslistpage from "@/presentations/master_data/stops";
import StopsForm from "@/presentations/master_data/stops/form/index";
import StopsDetail from "@/presentations/master_data/stops/detail/index";

import Routelistpage from "@/presentations/master_data/route";
import RouteForm from "@/presentations/master_data/route/form/index";
import RouteDetail from "@/presentations/master_data/route/detail/index";
import VehicleDetail from "@/presentations/master_data/vehicle/detail";
import VehicleForm from "@/presentations/master_data/vehicle/form/VehicleForm";

export default function MasterDataRoute() {
  return (
    <Routes>
      <Route index element={<MasterDataPage />} />

      <Route path="/expense-dictionary">
        <Route index element={<ExpenseDictionaryList />} />
        <Route path=":id" element={<ExpenseDictionaryDetail />} />
        <Route path="create" element={<ExpenseDictionaryForm />} />
        <Route
          path=":id/edit"
          element={<ExpenseDictionaryForm edit={true} />}
        />
      </Route>
      <Route path="/cash-account">
        <Route index element={<CashAccountList />} />
        <Route path=":id" element={<CashAccountDetail />} />
        <Route path="create" element={<CashAccountForm />} />
        <Route path=":id/edit" element={<CashAccountForm edit={true} />} />
      </Route>
      <Route path="/pump">
        <Route index element={<DispenserList />} />
        <Route path=":id" element={<DispenserDetail />} />
        <Route path="create" element={<DispenserForm />} />
        <Route path=":id/edit" element={<DispenserForm edit={true} />} />
      </Route>

      <Route path="/pump-attendant">
        <Route index element={<PumpAttendantList />} />
        <Route path=":id" element={<PumpAttendantDetail />} />
        <Route path="create" element={<PumpAttendantForm />} />
        <Route path=":id/edit" element={<PumpAttendantForm edit={true} />} />
      </Route>

      <Route path="/driver">
        <Route index element={<DriverList />} />
        <Route path=":id" element={<DriverDetail detail={ true} />} />
        <Route path="create" element={<DriverForm />} />
        <Route path=":id/edit" element={<DriverForm edit={true} />} />
      </Route>

      <Route path="/vehicle">
        <Route index element={<VehicleList />} />
        <Route path=":id" element={<VehicleDetail detail={true} />} />
        <Route path="create" element={<VehicleForm />} />
        <Route path=":id/edit" element={<VehicleForm edit={true} />} />
      </Route>

      <Route path="/stops">
        <Route index element={<Stopslistpage />} />
        <Route path=":id" element={<StopsDetail detail={true}/>} />
        <Route path="create" element={<StopsForm />} />
        <Route path=":id/edit" element={<StopsForm edit={true} />} />
      </Route>

      <Route path="/route">
        <Route index element={<Routelistpage />} />
        <Route path=":id" element={<RouteDetail detail={true}/>} />
        <Route path="create" element={<RouteForm />} />
        <Route path=":id/edit" element={<RouteForm edit={true} />} />
      </Route>
      {/* <Route path='/warehouse' >
                <Route index element={<WarehoseLists />} />
                <Route path=':id' element={<WarehouseDetail />} />
                <Route path='create' element={<WarehouseForm />} />
                <Route path=':id/edit' element={<WarehouseForm edit={true} />} />
            </Route>
            <Route path='/binlocation' >
                <Route index element={<BinlocationLists />} />
                <Route path=':id' element={<BinlocationDetail />} />
                <Route path='create' element={<BinlocationForm />} />
                <Route path=':id/edit' element={<BinlocationForm edit={true} />} />
            </Route>
            <Route path='/item-master-data' >
                <Route index element={<ItemMasterDataListing />} />
                <Route path=':id' element={<ItemMasterDataDetails />} />
                <Route path='create' element={<ItemMasterDataForm />} />
                <Route path=':id/edit' element={<ItemMasterDataForm edit={true} />} />
            </Route>
            <Route path='/employee' >
                <Route index element={<EmployeeLists />} />
                <Route path=':id' element={<EmployeeDetail />} />
                <Route path='create' element={<EmployeeForm />} />
                <Route path=':id/edit' element={<EmployeeForm edit={true} />} />
            </Route>
            <Route path='/supplier' >
                <Route index element={<SuppilerLists />} />
                <Route path=':id' element={<SupplierDetails />} />
                <Route path='create' element={<BusinessPartnerForm />} />
                <Route path=':id/edit' element={<SupplierForm edit={true} type={"supplier"} />} />
            </Route> */}
    </Routes>
  );
}
