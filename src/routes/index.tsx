import React from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import ProcumentRoute from "./ProcumentRoute";
import Login from "../presentations/login/page/Login";
import App from "../layouts/App";

import MasterDataRoute from "./MasterDataRoute";
import SaleRoute from "./SaleRoute";
import InventoryRoute from "./InventoryRoute";
import LogisticRoute from "./LogisticRoute";
import { useCookies } from "react-cookie";
import SystemInitializeMasterPage from "@/presentations/systemInitialize/SystemInitialize";
import CollectionRoute from "./CollectionRoute";
import ExpenseRoute from "./ExpenseRoute";
import StockControlRoute from "./StockControlRoute";
import SaleTargetRoute from "./SaleTargetRoute";

const Router = () => {
  return (
    <AnimatePresence>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<App />}>
            <Route
              path="/dashboard/*"
              element={<SystemInitializeMasterPage />}
              errorElement={<span>Error</span>}
            />
            {/* <Route path='/procument/*' element={<ProcumentRoute />} errorElement={<span>Error</span>} /> */}
            {/* <Route path='/master-data/*' element={<MasterDataRoute />} errorElement={<span>Error</span>} /> */}
            <Route
              path="/sale/*"
              element={<SaleRoute />}
              errorElement={<span>Error</span>}
            />
            {/* <Route path='/inventory/*' element={<InventoryRoute />} errorElement={<span>Error</span>} /> */}
            {/* <Route path='/logistic/*' element={<LogisticRoute />} errorElement={<span>Error</span>} /> */}
            <Route
              path="/banking/*"
              element={<CollectionRoute />}
              errorElement={<span>Error</span>}
            />
            <Route
              path="/expense/*"
              element={<ExpenseRoute />}
              errorElement={<span>Error</span>}
            />
            <Route
              path="/stock-control/*"
              element={<StockControlRoute />}
              errorElement={<span>Error</span>}
            />
            <Route
              path="/master-data/*"
              element={<MasterDataRoute />}
              errorElement={<span>Error</span>}
            />
            <Route
              path="/sale-target/*"
              element={<SaleTargetRoute/>}
              errorElement={<span>Error</span>}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AnimatePresence>
  );
};

export default Router;
