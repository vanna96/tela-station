import React, { useContext, useEffect } from "react";
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
import SaleRoute from "./RetailSaleRoute";
import InventoryRoute from "./InventoryRoute";
import LogisticRoute from "./LogisticRoute";
import { useCookies } from "react-cookie";
import SystemInitializeMasterPage from "@/presentations/systemInitialize/SystemInitialize";
import CollectionRoute from "./CollectionRoute";
import ExpenseRoute from "./ExpenseRoute";
import StockControlRoute from "./StockControlRoute";
import SaleTargetRoute from "./SaleTargetRoute";
import RetailSaleRoute from "./RetailSaleRoute";
import SaleOrderRoute from "./SaleOrderRoute";
import SaleInvoiceRoute from "./SaleInvoiceRoute";
import TripmanagementRoute from "./TripManagementRoute";
import { AuthorizationContext } from "@/contexts/useAuthorizationContext";
import request from "@/utilies/request";

const Router = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["sessionId"]);
  const { onSetAutorization } = useContext(AuthorizationContext);

  useEffect(() => {
    if (!cookies.sessionId) return;

    request('GET', '/UsersService_GetCurrentUser').then((res: any) => {
      if (onSetAutorization) onSetAutorization({ ...res?.data })
    }).catch((e) => {
      console.log(e)
    })



  }, [cookies.sessionId])

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
              path="/retail-sale/*"
              element={<RetailSaleRoute />}
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
              element={<SaleTargetRoute />}
              errorElement={<span>Error</span>}
            />

            <Route
              path="/sale-order/*"
              element={<SaleOrderRoute />}
              errorElement={<span>Error</span>}
            />

            <Route
              path="/sale-invoice/*"
              element={<SaleInvoiceRoute />}
              errorElement={<span>Error</span>}
            />
            <Route
              path="/trip-management/*"
              element={<TripmanagementRoute />}
              errorElement={<span>Error</span>}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AnimatePresence>
  );
};

export default Router;
