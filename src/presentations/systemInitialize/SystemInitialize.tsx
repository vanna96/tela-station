import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import React, { useEffect, useState } from "react";
import { AiOutlineSolution } from "react-icons/ai";
import IncomingPaymentRepository from "@/services/actions/IncomingPaymentRepository";
import SalesOrderRepository from "@/services/actions/SalesOrderRepository";
import { useNavigate } from "react-router-dom";
import DispenserRepository from "@/services/actions/dispenserRepository";
import request from "@/utilies/request";

const SystemInitializeMasterPage = () => {
  const [count, setCount] = useState<any>({});
  const navigate = useNavigate();

  const getCount = async () => {
    try {
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

        //sale targets
        saleTarget,
        saleScenario,

        //sale orders
        fuelOrders,
        lubeOrders,
        lpgOrders,

        //sale invoices
        // fuelInvoices,
        // lubeInvoices,
        // lpgInvoices,

        //sale retail sale
        // fuelCashSale,
        // lubeCashSale,
        // lpgCashSale,

        //banking
        settleReceipt,
        // paymentAccount,
        directAccount,

        //expense
        expenseLog,
        expenseClearance,

        //stock control
        inventoryTransferRequest,
        stockTransfer,
        goodIssue,
        goodReceipt,
        pumpTest,
        fuelLevel,
      ] = await Promise.all([
        // master data
        request("GET", "TL_Dispenser/$count").then(
          (response: any) => response.data
        ),
        request("GET", "TL_PUMP_ATTEND/$count").then(
          (response: any) => response.data
        ),
        request("GET", "TL_ExpDic/$count").then(
          (response: any) => response.data
        ),
        request("GET", "TL_CashAcct/$count").then(
          (response: any) => response.data
        ),
        request("GET", "EmployeesInfo/$count").then(
          (response: any) => response.data
        ),
        request("GET", "TL_VEHICLE/$count").then(
          (response: any) => response.data
        ),
        request("GET", "TL_STOPS/$count").then(
          (response: any) => response.data
        ),
        request("GET", "TL_ROUTE/$count").then(
          (response: any) => response.data
        ),

        //sale targets
        request("GET", "TL_SALES_SCENARIO/$count").then(
          (response: any) => response.data
        ),
        request("GET", "TL_SALES_SCENARIO/$count").then(
          (response: any) => response.data
        ),

        //sale orders

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

        //sale invoce
        //retail sale

        //banking
        // settleReceipt,
        // paymentAccount,
        new IncomingPaymentRepository().getCount({
          params: { $filter: `DocType eq 'rCustomer'` },
        }),
        // directAccount,
        new IncomingPaymentRepository().getCount({
          params: { $filter: `DocType eq 'rAccount'` },
        }),

        //expense
        request("GET", "TL_ExpLog/$count").then((res: any) => res.data),
        request("GET", "TL_ExpClear/$count").then((res: any) => res.data),

        //stock control
        request("GET", "InventoryTransferRequests/$count").then(
          (res: any) => res.data
        ),
        request("GET", "StockTransfers/$count").then((res: any) => res.data),
        request("GET", "InventoryGenEntries/$count").then(
          (res: any) => res.data
        ),
        request("GET", "InventoryGenExits/$count").then((res: any) => res.data),
        request("GET", "tl_PumpTest/$count").then((res: any) => res.data),
        request("GET", "TL_FUEL_LEVEL/$count").then((res: any) => res.data),
      ]);

      setCount({
        ...count,
        // master data
        pump,
        pumpAttendant,
        expenseDictionary,
        cashAccount,
        driver,
        vehicle,
        stops,
        route,

        //sale targets
        saleTarget,
        saleScenario,

        //sale orders
        fuelOrders,
        lubeOrders,
        lpgOrders,

        //sale invoices
        // fuelInvoices,
        // lubeInvoices,
        // lpgInvoices,

        //sale retail sale
        // fuelCashSale,
        // lubeCashSale,
        // lpgCashSale,

        //banking
        settleReceipt,
        // paymentAccount,
        directAccount,

        //expense
        expenseLog,
        expenseClearance,

        //stock control
        inventoryTransferRequest,
        stockTransfer,
        goodIssue,
        goodReceipt,
        pumpTest,
        fuelLevel,
      });
    } catch (error) {
      // Handle errors if needed
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getCount();
  }, []);

  const renderCards = (cards: any[]) => {
    return cards.map((card) => (
      <ItemCard
        key={card.title}
        title={card.title}
        icon={<AiOutlineSolution />}
        amount={count?.[card.amountKey] || 0}
        onClick={() => navigate(card.route)}
      />
    ));
  };

  // console.log(count);

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
        </div>
      ))}
    </div>
  );
};

export default SystemInitializeMasterPage;
