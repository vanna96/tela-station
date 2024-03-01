import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineAccountBook,
  AiOutlineAlipay,
  AiOutlineFileAdd,
  AiOutlineFileDone,
  AiOutlineFileExcel,
  AiOutlineFilePpt,
  AiOutlineFileProtect,
  AiOutlineFileSearch,
} from "react-icons/ai";
import request from "@/utilies/request";
import { useQuery } from "react-query";

const StockControlPage = () => {
  const navigate = useNavigate();
  const goTo = (route: string) => navigate("/stock-control/" + route);

  const getCountQuery = async (endpoint: string) => {
    try {
      const response = await request("GET", endpoint);
      return (response as { data?: number })?.data as number;
    } catch (error) {
      console.error(`Error fetching data for ${endpoint}:`, error);
      throw error;
    }
  };

  const createUseQuery = (queryKey: string, endpoint: string) => {
    return useQuery({
      queryKey: [queryKey],
      queryFn: () => getCountQuery(endpoint),
      staleTime: Infinity,
    });
  };

  const inventoryTransferRequest = createUseQuery(
    "inventory-transfer-request",
    "InventoryTransferRequests/$count"
  );
  const stockTransfer = createUseQuery(
    "stock-transfer",
    "StockTransfers/$count"
  );
  const goodIssue = createUseQuery("good-issue", "InventoryGenEntries/$count");
  const goodReceipt = createUseQuery(
    "good-receipt",
    "InventoryGenExits/$count"
  );
  const pumpTest = createUseQuery("pump-test", "tl_PumpTest/$count");
  const fuelLevel = createUseQuery("fuel-level", "TL_FUEL_LEVEL/$count");
  const items = [
    {
      title: "Inventory Transfer Request",
      route: "inventory-transfer-request",
      icon: <AiOutlineFileAdd />,
    },
    {
      title: "Stock Transfer",
      route: "stock-transfer",
      icon: <AiOutlineFileAdd />,
    },
    { title: "Good Issue", route: "good-issue", icon: <AiOutlineFileAdd /> },
    {
      title: "Good Receipt",
      route: "good-receipt",
      icon: <AiOutlineFileAdd />,
    },
    { title: "Pump Test", route: "pump-test", icon: <AiOutlineFileAdd /> },
    { title: "Fuel Level", route: "fuel-level", icon: <AiOutlineFileAdd /> },
  ];

  return (
    <>
      <MainContainer title="Stock Control">
        {items.map(({ title, route, icon }, index) => {
          const { data, isLoading } = createUseQuery(
            route,
            `TL_${title.replace(/\s/g, "")}/$count`
          );
          return (
            <ItemCard
              key={index}
              title={title}
              icon={icon}
              onClick={() => goTo(route)}
              amount={data || 0}
              isLoading={isLoading}
            />
          );
        })}
      </MainContainer>
    </>
  );
};

export default StockControlPage;
