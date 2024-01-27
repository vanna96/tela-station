import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import React, { useEffect, useState } from "react";
import { AiOutlineSolution } from "react-icons/ai";
import IncomingPaymentRepository from "@/services/actions/IncomingPaymentRepository";
import SalesOrderRepository from "@/services/actions/SalesOrderRepository";
import { useNavigate } from "react-router-dom";
import DispenserRepository from "@/services/actions/dispenserRepository";
import request from "@/utilies/request";
import { useQuery } from "react-query";

const fetchModuleCount = async (endpoint: string): Promise<number> => {
  const response = (await request("GET", endpoint)) as { data: number }; // Assuming response.data is of type number
  return response.data;
};

const SystemInitializeMasterPage = () => {
  const navigate = useNavigate();

  const { data: count, error } = useQuery(
    "moduleCount",
    async () => {
      const [
        // master data
        pump,
        pumpAttendant,
        expenseDictionary,
        cashAccount,
        driver,
        vehicle,
        stops,
        route,

        // sale targets
        saleTarget,
        saleScenario,

        // sale orders
        fuelOrders,
        lubeOrders,
        lpgOrders,

        // banking
        settleReceipt,
        directAccount,

        // expense
        expenseLog,
        expenseClearance,

        // stock control
        inventoryTransferRequest,
        stockTransfer,
        goodIssue,
        goodReceipt,
        pumpTest,
        fuelLevel,
      ] = await Promise.all([
        // master data
        fetchModuleCount("TL_Dispenser/$count"),
        fetchModuleCount("TL_PUMP_ATTEND/$count"),
        fetchModuleCount("TL_ExpDic/$count"),
        fetchModuleCount("TL_CashAcct/$count"),
        fetchModuleCount("EmployeesInfo/$count"),
        fetchModuleCount("TL_VEHICLE/$count"),
        fetchModuleCount("TL_STOPS/$count"),
        fetchModuleCount("TL_ROUTE/$count"),

        // sale targets
        fetchModuleCount("TL_SALES_SCENARIO/$count"),
        fetchModuleCount("TL_SALES_SCENARIO/$count"),

        // sale orders
        new SalesOrderRepository().getCount({
          params: {
            $filter: `U_tl_salestype eq null and U_tl_arbusi eq 'Oil'`,
          },
        }),
        new SalesOrderRepository().getCount({
          params: {
            $filter: `U_tl_salestype eq null and U_tl_arbusi eq 'Lube'`,
          },
        }),
        new SalesOrderRepository().getCount({
          params: {
            $filter: `U_tl_salestype eq null and U_tl_arbusi eq 'LPG'`,
          },
        }),

        // banking
        new IncomingPaymentRepository().getCount({
          params: { $filter: `DocType eq 'rCustomer'` },
        }),
        new IncomingPaymentRepository().getCount({
          params: { $filter: `DocType eq 'rAccount'` },
        }),

        // expense
        fetchModuleCount("TL_ExpLog/$count"),
        fetchModuleCount("TL_ExpClear/$count"),

        // stock control
        fetchModuleCount("InventoryTransferRequests/$count"),
        fetchModuleCount("StockTransfers/$count"),
        fetchModuleCount("InventoryGenEntries/$count"),
        fetchModuleCount("InventoryGenExits/$count"),
        fetchModuleCount("tl_PumpTest/$count"),
        fetchModuleCount("TL_FUEL_LEVEL/$count"),
      ]);

      return {
        // master data
        pump,
        pumpAttendant,
        expenseDictionary,
        cashAccount,
        driver,
        vehicle,
        stops,
        route,

        // sale targets
        saleTarget,
        saleScenario,

        // sale orders
        fuelOrders,
        lubeOrders,
        lpgOrders,

        // banking
        settleReceipt,
        directAccount,

        // expense
        expenseLog,
        expenseClearance,

        // stock control
        inventoryTransferRequest,
        stockTransfer,
        goodIssue,
        goodReceipt,
        pumpTest,
        fuelLevel,
      };
    },
    {
      refetchOnWindowFocus: false, // Set to true if you want to refetch data when the window regains focus
    }
  );

  if (error) {
    // Handle error if needed
    console.error("Error fetching data:", error);
  }

  const renderCards = (cards: any[]) => {
    return cards.map((card) => (
      <ItemCard
        key={card.title}
        title={card.title}
        icon={<AiOutlineSolution />}
        amount={count?.[card.amountKey as keyof typeof count] || 0}
        onClick={() => navigate(card.route)}
      />
    ));
  };


  const masterDataCards = renderCards([
    { title: "Pump", amountKey: "pump", route: "/master-data/pump" },
    {
      title: "Pump Attendant",
      amountKey: "pumpAttendant",
      route: "/master-data/pump-attendant",
    },
    {
      title: "Expense Dictionary",
      amountKey: "expenseDictionary",
      route: "/master-data/expense-dictionary",
    },
    {
      title: "Cash Account",
      amountKey: "cashAccount",
      route: "/master-data/cash-account",
    },
    { title: "Driver", amountKey: "driver", route: "/master-data/driver" },
    { title: "Vehicle", amountKey: "vehicle", route: "/master-data/vehicle" },
    { title: "Stops", amountKey: "stops", route: "/master-data/stops" },
    { title: "Route", amountKey: "route", route: "/master-data/route" },
  ]);

  const saleTargetCards = renderCards([
    {
      title: "Sale Scenario",
      amountKey: "saleScenario",
      route: "sale-target/sale-scenario",
    },
    {
      title: "Sale Target",
      amountKey: "saleTarget",
      route: "/sale-target/sale-target",
    },
  ]);

  const saleOrderCards = renderCards([
    {
      title: "Fuel Sales",
      amountKey: "fuelOrders",
      route: "/sale-order/fuel-sales",
    },
    {
      title: "Lube Sales",
      amountKey: "lubeOrders",
      route: "/sale-order/lube-sales",
    },
    {
      title: "LPG Sales",
      amountKey: "lpgOrders",
      route: "/sale-order/lpg-sales",
    },
  ]);

  const saleInvoiceCards = renderCards([
    {
      title: "Fuel Sales",
      amountKey: "fuelOrders",
      route: "/sale-invoice/fuel-sales",
    },
    {
      title: "Lube Sales",
      amountKey: "lubeOrders",
      route: "/sale-invoice/lube-sales",
    },
    {
      title: "LPG Sales",
      amountKey: "lpgOrders",
      route: "/sale-invoice/lpg-sales",
    },
  ]);

  const retailSaleCards = renderCards([
    {
      title: "Fuel Cash Sale",
      amountKey: "fuelOrders",
      route: "/retail-sale/fuel-cash-sale",
    },
    {
      title: "Lube Cash Sale",
      amountKey: "lubeOrders",
      route: "/retail-sale/lube-cash-sale",
    },
    {
      title: "LPG Cash Sale",
      amountKey: "lpgOrders",
      route: "/retail-sale/lpg-cash-sale",
    },
  ]);

  const bankingCards = renderCards([
    {
      title: "Settle Receipt",
      amountKey: "settleReceipt",
      route: "/banking/settle-receipt",
    },
    {
      title: "Payment on Account",
      amountKey: "settleReceipt",
      route: "/banking/payment-account",
    },
    {
      title: "Direct to Account",
      amountKey: "directAccount",
      route: "/banking/direct-account",
    },
  ]);

  const expenseLogCards = renderCards([
    { title: "Expense Log", amountKey: "expenseLog", route: "/expense/log" },
    {
      title: "Expense Clearance",
      amountKey: "expenseClearance",
      route: "/expense/clearance",
    },
  ]);

  const stockControlCards = renderCards([
    {
      title: "Inventory Transfer Request",
      amountKey: "inventoryTransferRequest",
      route: "/stock-control/inventory-transfer-request",
    },
    {
      title: "Stock Transfer",
      amountKey: "stockTransfer",
      route: "/stock-control/stock-transfer",
    },
    {
      title: "Good Issue",
      amountKey: "goodIssue",
      route: "/stock-control/good-issue",
    },
    {
      title: "Good Receipt",
      amountKey: "goodReceipt",
      route: "/stock-control/good-receipt",
    },
    {
      title: "Pump Test",
      amountKey: "pumpTest",
      route: "/stock-control/pump-test",
    },
    {
      title: "Fuel Level",
      amountKey: "fuelLevel",
      route: "/stock-control/fuel-level",
    },
  ]);

  const sections = [
    { title: "Master Data", cards: masterDataCards },
    { title: "Sale Target", cards: saleTargetCards },
    { title: "Sale Order", cards: saleOrderCards },
    { title: "Sale Invoice", cards: saleInvoiceCards },
    { title: "Retail Sale", cards: retailSaleCards },
    { title: "Banking", cards: bankingCards },
    { title: "Expense Log", cards: expenseLogCards },
    { title: "Stock Control", cards: stockControlCards },
  ];

  return (
    <div className="px-6">
      {sections.map((section, index) => (
        <div key={index}>
          <h1 className="mb-4 mt-10">{section.title}</h1>
          <div className="grid grid-cols-6 md:grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {section.cards}
          </div>
          <div className="mb-10" />
        </div>
      ))}
    </div>
  );
};

export default SystemInitializeMasterPage;
