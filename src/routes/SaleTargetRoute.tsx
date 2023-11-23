import React from "react";
import { Route, Routes } from "react-router-dom";
import SaleScenarioList from "@/presentations/sale_target/sale_scenario/index";
import SaleScenarioDetail from "@/presentations/sale_target/sale_scenario/detail/index";
import SaleScenarioForm from "@/presentations/sale_target/sale_scenario/form/index";
import SaleTargetPage from "@/presentations/sale_target";

export default function MasterDataRoute() {
  return (
    <Routes>
      <Route index element={<SaleTargetPage />} />
      <Route path="/sale-scenario">
        <Route index element={<SaleScenarioList />} />
        <Route path=":id" element={<SaleScenarioDetail />} />
        <Route path="create" element={<SaleScenarioForm />} />
        <Route path=":id/edit" element={<SaleScenarioForm edit={true} />} />
      </Route>
    </Routes>
  );
}
