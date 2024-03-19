import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineSolution } from "react-icons/ai";
import IncomingPaymentRepository from "@/services/actions/IncomingPaymentRepository";
import SalesOrderRepository from "@/services/actions/SalesOrderRepository";
import { useNavigate } from "react-router-dom";
import DispenserRepository from "@/services/actions/dispenserRepository";
import request from "@/utilies/request";
import { useQuery } from "react-query";
import { AuthorizationContext, Role } from "@/contexts/useAuthorizationContext";

const fetchModuleCount = async (endpoint: string): Promise<number> => {
  const response = (await request("GET", endpoint)) as { data: number }; // Assuming response.data is of type number
  return response.data;
};

const SystemInitializeMasterPage = () => {
  const navigate = useNavigate();

  const {
    data: count,
    error,
    isLoading,
  } = useQuery(
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
        fetchModuleCount("EmployeesInfo/$count?$filter=U_tl_driver eq 'Y'"),
        fetchModuleCount("TL_VEHICLE/$count"),
        fetchModuleCount("TL_STOPS/$count"),
        fetchModuleCount("TL_ROUTE/$count"),

        // sale targets

        // sale orders
        fetchModuleCount(
          "Orders/$count?$filter=U_tl_salestype eq null and U_tl_arbusi eq 'Oil'"
        ),
        fetchModuleCount(
          "Orders/$count?$filter=U_tl_salestype eq null and U_tl_arbusi eq 'Lube'"
        ),
        fetchModuleCount(
          "Orders/$count?$filter=U_tl_salestype eq null and U_tl_arbusi eq 'LPG'"
        ),

        // banking
        fetchModuleCount(
          "IncomingPayments/$count?$filter=DocType eq 'rCustomer'"
        ),
        fetchModuleCount(
          "IncomingPayments/$count?$filter=DocType eq 'rAccount'"
        ),
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
      refetchOnWindowFocus: false,
      staleTime: 180000,
    }
  );

  if (error) {
    // Handle error if needed
    console.error("Error fetching data:", error);
  }

  const { getRoleCode } = useContext(AuthorizationContext);

  const renderCards = (cards: any[]) => {
    return cards.map((card) => {
      if (!card?.roles?.includes(getRoleCode as Role)) return null;

      return (
        <ItemCard
          key={card.amountKey}
          title={card.title}
          icon={<AiOutlineSolution />}
          amount={count?.[card.amountKey as keyof typeof count] || 0}
          onClick={() => navigate(card.route)}
          isLoading={card.isLoading}
        />
      );
    });
  };

  const masterDataCards = renderCards([
    {
      title: "Pump",
      amountKey: "pump",
      route: "/master-data/pump",
      roles: ["UG001", "UG004"],
    },
    {
      title: "Pump Attendant",
      amountKey: "pumpAttendant",
      route: "/master-data/pump-attendant",
      roles: ["UG001", "UG004"],
    },
    {
      title: "Expense Dictionary",
      amountKey: "expenseDictionary",
      route: "/master-data/expense-dictionary",
      roles: ["UG001", "UG004"],
    },
    {
      title: "Cash Account",
      amountKey: "cashAccount",
      route: "/master-data/cash-account",
      roles: ["UG001", "UG004"],
    },
    {
      title: "Driver",
      amountKey: "driver",
      route: "/master-data/driver",
      roles: ["UG001", "UG002"],
    },
    {
      title: "Vehicle",
      amountKey: "vehicle",
      route: "/master-data/vehicle",
      roles: ["UG001", "UG002"],
    },
    {
      title: "Stops",
      amountKey: "stops",
      route: "/master-data/stops",
      roles: ["UG001", "UG002"],
    },
    {
      title: "Route",
      amountKey: "route",
      route: "/master-data/route",
      roles: ["UG001", "UG002"],
    },
  ]);

  const saleOrderCards = renderCards([
    {
      title: "Fuel Sales",
      amountKey: "fuelOrders",
      route: "/wholesale/sale-order/fuel-sales",
      roles: ["UG001", "UG004"],
    },
    {
      title: "Lube Sales",
      amountKey: "lubeOrders",
      route: "/wholesale/sale-order/lube-sales",
      roles: ["UG001", "UG004"],
    },
    {
      title: "LPG Sales",
      amountKey: "lpgOrders",
      route: "/wholesale/sale-order/lpg-sales",
      roles: ["UG001", "UG004"],
    },
  ]);

  const saleInvoiceCards = renderCards([
    {
      title: "Fuel Invoice",
      amountKey: "fuelInvoice",
      route: "/wholesale/sale-invoice/fuel-invoice",
      roles: ["UG001", "UG004"],
    },
    {
      title: "Lube Invoice",
      amountKey: "lubeInvoice",
      route: "/wholesale/sale-invoice/lube-invoice",
      roles: ["UG001", "UG004"],
    },
    {
      title: "LPG Invoice",
      amountKey: "lpgInvoice",
      route: "/wholesale/sale-invoice/lpg-invoice",
      roles: ["UG001", "UG004"],
    },
  ]);

  const retailSaleCards = renderCards([
    {
      title: "Fuel Cash Sale",
      amountKey: "fuelOrders",
      route: "/retail-sale/fuel-cash-sale",
      roles: ["UG001", "UG004"],
    },
    {
      title: "Lube Cash Sale",
      amountKey: "lubeOrders",
      route: "/retail-sale/lube-cash-sale",
      roles: ["UG001", "UG004"],
    },
    {
      title: "LPG Cash Sale",
      amountKey: "lpgOrders",
      route: "/retail-sale/lpg-cash-sale",
      roles: ["UG001", "UG004"],
    },
  ]);

  const bankingCards = renderCards([
    {
      title: "Settle Receipt",
      amountKey: "settleReceipt",
      route: "/banking/settle-receipt",
      roles: ["UG001", "UG004"],
    },
    {
      title: "Payment on Account",
      amountKey: "settleReceipt",
      route: "/banking/payment-account",
      roles: ["UG001", "UG004"],
    },
    {
      title: "Direct to Account",
      amountKey: "directAccount",
      route: "/banking/direct-account",
      roles: ["UG001", "UG004"],
    },
  ]);

  const expenseLogCards = renderCards([
    { title: "Expense Log", amountKey: "expenseLog", route: "/expense/log" },
    {
      title: "Expense Clearance",
      amountKey: "expenseClearance",
      route: "/expense/clearance",
      roles: ["UG001", "UG004"],
    },
  ]);

  const stockControlCards = renderCards([
    {
      title: "Inventory Transfer Request",
      amountKey: "inventoryTransferRequest",
      route: "/stock-control/inventory-transfer-request",
      roles: ["UG001", "UG003"],
    },
    {
      title: "Stock Transfer",
      amountKey: "stockTransfer",
      route: "/stock-control/stock-transfer",
      roles: ["UG001", "UG003"],
    },
    {
      title: "Good Issue",
      amountKey: "goodIssue",
      route: "/stock-control/good-issue",
      roles: ["UG001", "UG003"],
    },
    {
      title: "Good Receipt",
      amountKey: "goodReceipt",
      route: "/stock-control/good-receipt",
      roles: ["UG001", "UG003"],
    },
    {
      title: "Pump Test",
      amountKey: "pumpTest",
      route: "/stock-control/pump-test",
      roles: ["UG001", "UG003"],
    },
    {
      title: "Fuel Level",
      amountKey: "fuelLevel",
      route: "/stock-control/fuel-level",
      roles: ["UG001", "UG003"],
    },
  ]);

  const sections = [
    {
      title: "Master Data",
      cards: masterDataCards,
      roles: ["UG001", "UG002", "UG004"],
    },
    { title: "Sale Order", cards: saleOrderCards, roles: ["UG001", "UG004"] },
    {
      title: "Sale Invoice",
      cards: saleInvoiceCards,
      roles: ["UG001", "UG004"],
    },
    { title: "Retail Sale", cards: retailSaleCards, roles: ["UG001", "UG004"] },
    { title: "Banking", cards: bankingCards, roles: ["UG001", "UG004"] },
    { title: "Expense Log", cards: expenseLogCards, roles: ["UG001", "UG004"] },
    {
      title: "Stock Control",
      cards: stockControlCards,
      roles: ["UG001", "UG003"],
    },
    { title: "Master Data", cards: masterDataCards, roles: ['UG001', 'UG004'] },
    { title: "Sale Target", cards: saleTargetCards, roles: ['UG001', 'UG004'] },
    { title: "Sale Order", cards: saleOrderCards, roles: ['UG001', 'UG004'] },
    { title: "Sale Invoice", cards: saleInvoiceCards, roles: ['UG001', 'UG004'] },
    { title: "Retail Sale", cards: retailSaleCards, roles: ['UG001', 'UG004'] },
    { title: "Banking", cards: bankingCards, roles: ['UG001', 'UG004'] },
    { title: "Expense Log", cards: expenseLogCards, roles: ['UG001', 'UG004'] },
    { title: "Stock Control", cards: stockControlCards, roles: ['UG001'] },
  ];

  return (
    <div className="px-6">
      {sections.map((section, index) => {
        if (!section.roles?.includes(getRoleCode as Role)) return null;

        return (
          <div key={index}>
            <h1 className="mb-4 mt-10">{section.title}</h1>
            <div className="grid grid-cols-6 md:grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {section.cards}
            </div>
            <div className="mb-10" />
          </div>
        );
      })}
    </div>
  );
};

export default SystemInitializeMasterPage;
