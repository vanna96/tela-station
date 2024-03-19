import MainContainer from "@/components/MainContainer";
import ItemCard from "@/components/card/ItemCart";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineFileAdd } from "react-icons/ai";
import request from "@/utilies/request";
import { useQuery } from "react-query";
import { AuthorizationContext, Role } from "@/contexts/useAuthorizationContext";

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
      roles: ['UG001', 'UG004'],
      title: "Inventory Transfer Request",
      route: "inventory-transfer-request",
      icon: <AiOutlineFileAdd />,
    },
    {
      roles: ['UG001', 'UG004'],
      title: "Stock Transfer",
      route: "stock-transfer",
      icon: <AiOutlineFileAdd />,
    },
    { title: "Good Issue", route: "good-issue", icon: <AiOutlineFileAdd />, roles: ['UG001', 'UG004'] },
    {
      title: "Good Receipt",
      route: "good-receipt",
      icon: <AiOutlineFileAdd />,
      roles: ['UG001', 'UG004']
    },
    { title: "Fuel Level", route: "fuel-level", icon: <AiOutlineFileAdd />, roles: ['UG001', 'UG004'], },
  ];


  const { getRoleCode } = useContext(AuthorizationContext);

  return (
    <>
      <MainContainer title="Stock Control">
        {items.map(({ title, route, icon, roles }, index) => {

          if (!roles.includes(getRoleCode as Role)) return null;

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
