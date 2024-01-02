import React from "react";
import { Route, Routes } from "react-router-dom";
import SaleScenarioList from "@/presentations/sale_target/sale_scenario/index";
import SaleScenarioDetail from "@/presentations/sale_target/sale_scenario/detail/index";
import SaleScenarioForm from "@/presentations/sale_target/sale_scenario/form/index";
import SaleTargetPage from "@/presentations/sale_target";
import SaleTargetList from "@/presentations/sale_target/sale_target/index";
import SaleTargetDetail from "@/presentations/sale_target/sale_target/detail/index";
import SaleTargetForm from "@/presentations/sale_target/sale_target/form/index";

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
      <Route path="/sale-target">
        <Route index element={<SaleTargetList />} />
        <Route path=":id" element={<SaleTargetDetail />} />
        <Route path="create" element={<SaleTargetForm />} />
        <Route path=":id/edit" element={<SaleTargetForm edit={true} />} />
      </Route>
    </Routes>
  );
}
